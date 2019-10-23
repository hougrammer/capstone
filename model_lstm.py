import pickle
import datetime

import numpy as np
import tensorflow as tf
from tensorflow.keras import Input, Model, Sequential
from tensorflow.keras.preprocessing import sequence
from tensorflow.keras.preprocessing.text import text_to_word_sequence, Tokenizer
from tensorflow.keras.layers import Dense, Embedding, GlobalAveragePooling1D, concatenate, Activation, Dropout, BatchNormalization, Reshape, LSTM
from tensorflow.keras.callbacks import TensorBoard, Callback, ModelCheckpoint, EarlyStopping
from tensorflow.keras.models import load_model

class ModelLstm:
    '''
    Model with an LSTM after the title embedding.
    '''
    _embeddings = {
        50: 'data/glove.6B.50d.txt',
        100: 'data/glove.6B.100d.txt',
        200: 'data/glove.6B.200d.txt',
        300: 'data/glove.6B.300d.txt'
    }
    
    def __init__(self,
                 model_name,
                 word_embedding_dim,
                 existing_model_path='',
                 embedding_maxfeatures=40000,
                 titles_maxlen=20,
                 meta_embedding_dims=64,
                 dropout=0.5):
        self.load_data()
        self.model_name = model_name
        
        self.embedding_maxfeatures = embedding_maxfeatures
        self.titles_maxlen = titles_maxlen
        self.word_embedding_dim = word_embedding_dim
        self.embeddings_path = self._embeddings[word_embedding_dim]
        
        self.meta_embedding_dims = meta_embedding_dims
        self.dropout=dropout
        
        if existing_model_path:
            self.model = load_model(existing_model_path)
        else:
            self.model = self.build_model()
    
    def summary(self):
        return self.model.summary()
    
    def load_data(self):
        '''
        Loads data assuming loaded_data.pickle already exists.
        '''
        try:
            with open('loaded_data.pickle', 'rb') as file:
                payload = pickle.load(file)

            for k in payload.keys():
                exec('self.{} = payload["{}"]'.format(k, k))
        except FileNotFoundError:
            raise FileNotFoundError('loaded_data.pickle not found. Run load_data.ipynb.')
    
    def get_embedding_matrix(self):
        '''
        Returns embedding matrix based off loaded embeddings.
        '''
        embedding_vectors = {}
        weights_matrix = np.zeros((self.embedding_maxfeatures + 1, self.word_embedding_dim))

        with open(self.embeddings_path, 'r') as f:
            for line in f:
                line_split = line.strip().split(" ")
                vec = np.array(line_split[1:], dtype=float)
                word = line_split[0]
                embedding_vectors[word] = vec

        for word, i in self.tokenizer.word_index.items():
            embedding_vector = embedding_vectors.get(word)
            if embedding_vector is not None and i <= self.embedding_maxfeatures:
                weights_matrix[i] = embedding_vector
                
        return weights_matrix
    
    def get_metadata_layers(self, input_layer_name, input_dim):
        '''
        Returns input, embedding, and reshape layers for metadata column.
        '''
        input_ = Input(shape=(1,), name=input_layer_name)
        embedding_ = Embedding(input_dim, self.meta_embedding_dims)(input_)
        reshape_ = Reshape((self.meta_embedding_dims,))(embedding_)
        return (input_, embedding_, reshape_)
    
    def build_model(self):
        title_input = Input(shape=(self.titles_maxlen,), name='title_in')
        title_embedding = Embedding(
            self.embedding_maxfeatures + 1,
            self.word_embedding_dim,
            weights=[self.get_embedding_matrix()])(title_input)
        
        title_lstm = LSTM(256, dropout = 0.3, recurrent_dropout = 0.3)(title_embedding)
        title_pooling = GlobalAveragePooling1D()(title_embedding)
        aux_output = Dense(1, activation='sigmoid', name='aux_out')(title_pooling)

        hour_input, hour_embedding, hour_reshape = self.get_metadata_layers('hour_in', 24)
        weekday_input, weekday_embedding, weekday_reshape = self.get_metadata_layers('weekday_in', 7)
        minute_input, minute_embedding, minute_reshape = self.get_metadata_layers('minute_in', 60)
        date_input, date_embedding, date_reshape = self.get_metadata_layers('date_in', 366)

        merged = concatenate(
            [title_lstm, hour_reshape, weekday_reshape, minute_reshape, date_reshape])

        hidden_1 = Dense(256, activation='relu')(merged)
        hidden_1 = BatchNormalization()(hidden_1)
        hidden_1 = Dropout(.5)(hidden_1)

        main_output = Dense(1, activation='sigmoid', name='main_out')(hidden_1)

        model = Model(
            inputs=[title_input, hour_input, weekday_input, minute_input, date_input],
            outputs=[main_output, aux_output]
        )

        model.compile(loss='binary_crossentropy',
                      optimizer='adam',
                      metrics=['accuracy'],
                      loss_weights=[1, 0.2])

        return model
    
    def train(self, epochs, batch_size=32, early_stop=False):
        log_dir = "logs/scalars/{}_{}".format(self.model_name,
                                              datetime.datetime.now().strftime("%Y%m%d_%H%M%S"))
        model_checkpoint_path = 'models/checkpoints/'+ self.model_name +'.{epoch:02d}-{val_loss:.2f}.hdf5'

        callbacks = [
            TensorBoard(log_dir=log_dir),
            ModelCheckpoint(model_checkpoint_path)
        ]
        if early_stop:
            callbacks.append(EarlyStopping(monitor='val_loss'))
        
        history = self.model.fit(
            x=[self.titles_train, self.hours_train, self.weekdays_train, self.minutes_train, self.dates_train],
            y=[self.is_top_submission_train, self.is_top_submission_train],
            batch_size=batch_size,
            epochs=epochs,
            validation_data=([self.titles_val, self.hours_val, self.weekdays_val, self.minutes_val, self.dates_val],
                             [self.is_top_submission_val, self.is_top_submission_val]),
            callbacks=callbacks
        )