from time import time
# Wrapper class for PostScorer. Allows lazy initialization for quick debug reloads.
# TODO: use normal imports when this is ready for prod.
class PostScorer:
    def __init__(self, tokenizer_path, model_path, initialize=False):
        self.model = None
        self.tokenizer = None
        self.tokenizer_path = tokenizer_path
        self.model_path = model_path
        self.sess = None
        self.graph = None
        
        self.initialized = False
        if initialize:
            self.initialize()
    
    def initialize(self):
        print('Initializing PostScorer')
        t = time()

        import tensorflow as tf
        from tensorflow.python.keras.backend import set_session
        self.sess = tf.Session()
        self.graph = tf.get_default_graph()
        set_session(self.sess)

        from tensorflow.keras.models import load_model
        self.model = load_model(self.model_path)

        from tensorflow.keras import Input, Model, Sequential
        from tensorflow.keras.preprocessing.text import text_to_word_sequence, Tokenizer
        from tensorflow.keras.layers import Dense, Embedding, GlobalAveragePooling1D, concatenate, Activation, Dropout, BatchNormalization, Reshape, LSTM
        
        import pickle
        with open(self.tokenizer_path, 'rb') as f:
            self.tokenizer = pickle.load(f)
        
        self.initialized = True
        print('PostScorer initialization took {} s'.format(time() - t))
    
    def score(self, title, hour, minute, weekday, dayofyear):
        '''
        args:
            title: string
            hour: int in range(24)
            minute: int in range(60)
            weekday: int in range(7)
            dayofyear: int in range(365) # sorry no leap years
        returns:
            float
        '''
        if not self.initialized:
            self.initialize()
        from tensorflow.python.keras.backend import set_session
        from tensorflow.keras.preprocessing import sequence
        import numpy as np

        t = time()
        print('Scoring...\ntitle: {}\nhour: {}\nminute: {}\nweekday: {}\ndate: {}'
            .format(title, hour, minute, weekday, dayofyear))
        encoded_title = sequence.pad_sequences(
            self.tokenizer.texts_to_sequences([title]),
            maxlen=20 # model was trained with max title len = 20
        )
        with self.graph.as_default():
            set_session(self.sess)
            score = self.model.predict([
                encoded_title, 
                np.array([hour]),
                np.array([weekday]), 
                np.array([minute]), 
                np.array([dayofyear])
            ])[0][0][0]
        print('Score: {} \nElapsed time: {} s'.format(score, time() - t))
        return score