# Wrapper class for PostScorer. Allows lazy initialization for quick debug reloads.
class PostScorer:
    def __init__(self, tokenizer_path, model_path, initialize=False):
        self.model = None
        self.tokenizer = None
        self.tokenizer_path = tokenizer_path
        self.model_path = model_path
        
        self.intialized = False
        if initialize:
            self.initialize()
    
    def initialize(self):
        print('Initializing PostScorer')
        from time import time
        t = time()

        import numpy as np
        import tensorflow as tf
        from tensorflow.keras import Input, Model, Sequential
        from tensorflow.keras.preprocessing import sequence
        from tensorflow.keras.preprocessing.text import text_to_word_sequence, Tokenizer
        from tensorflow.keras.layers import Dense, Embedding, GlobalAveragePooling1D, concatenate, Activation, Dropout, BatchNormalization, Reshape, LSTM
        from tensorflow.keras.models import load_model
        self.model = load_model(self.model_path)
        
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

        t = time()
        encoded_title = sequence.pad_sequences(
            self.tokenizer.texts_to_sequences([text]),
            maxlen=20 # model was trained with max title len = 20
        )
        score = model.predict(
            encoded_title, 
            np.array([hour]), 
            np.array([minute]), 
            np.array([weekday]), 
            np.array([dayofyear])
        )
        print('Scoring took {} s'.format(time() - t))
        return score