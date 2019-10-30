import pickle
import tensorflow as tf
from PIL import Image
import numpy as np
from app.tokenizerwrap import TokenizerWrap

from tensorflow.python.keras.layers import Input, Dense, GRU, Embedding, Dropout
from tensorflow.python.keras.preprocessing.text import Tokenizer
from tensorflow.python.keras import backend as K
from tensorflow.python.keras.backend import set_session
from tensorflow.python.keras.initializers import glorot_uniform

# Just disables the warning, doesn't enable AVX/FMA
#Your CPU supports instructions that this TensorFlow binary was not compiled to use: AVX2 FMA
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

with open ("./preloaded_files/captions_train_flat_reddit.pkl", "rb") as f:
    captions_train_flat_reddit = pickle.load(f)

with open ("./preloaded_files/captions_train_flat_coco.pkl", "rb") as f:
    captions_train_flat_coco = pickle.load(f)

num_words = 10000
tokenizer_reddit = TokenizerWrap(texts=captions_train_flat_reddit, num_words=num_words)

tokenizer_coco = TokenizerWrap(texts=captions_train_flat_coco, num_words=num_words)

## to suppress warning
tf.logging.set_verbosity(tf.logging.ERROR)

#tf_config = some_custom_config
#sess = tf.Session(config=tf_config)
sess = tf.Session()
graph = tf.get_default_graph()
set_session(sess)

## loading pre-trained image processing model VGG16 model
model_transferred = tf.keras.models.load_model("preloaded_files/model_transferred.h5", compile=False, custom_objects={'GlorotUniform': glorot_uniform()})
model_transferred._make_predict_function()

## loading pre-defined rnn model (2GRU layers, embedding size=512, etc)
decoder_model_reddit = tf.keras.models.load_model("preloaded_files/decoder_model_reddit.h5", compile=False, custom_objects={'GlorotUniform': glorot_uniform()})
decoder_model_reddit._make_predict_function()

decoder_model_coco = tf.keras.models.load_model("preloaded_files/decoder_model_coco.h5", compile=False, custom_objects={'GlorotUniform': glorot_uniform()})
decoder_model_coco._make_predict_function()
#graph = tf.get_default_graph()
## To remove the error, added model._make_predict_function()
## https://github.com/keras-team/keras/issues/6462

token_start_reddit = 1
token_end_reddit = 2

token_start_coco = 2
token_end_coco = 3

def generate_caption(image_path, max_tokens=30):

    global sess
    global graph
    with graph.as_default():
        set_session(sess)

        # Load and resize the image.
        img = Image.open(image_path)

        # Resize image if desired.
        img = img.resize(size=(224, 224), resample=Image.LANCZOS)

        # Convert image to numpy array and scale the pixel between 0 and 1.
        img = np.array(img)
        img = img / 255.0

        # Convert 2-dim gray-scale array to 3-dim RGB array.
        if (len(img.shape) == 2):
            img = np.repeat(img[:, :, np.newaxis], 3, axis=2)

        image_batch = np.expand_dims(img, axis=0)

        # Process the image
        transfer_values = model_transferred.predict(image_batch)

        # Pre-allocate the 2-dim array used as input to the decoder.
        shape = (1, max_tokens)
        decoder_input_data = np.zeros(shape=shape, dtype=np.int)

        # The first input-token is the special start-token for 'ssss '.
        token_int = token_start_reddit

        # Initialize an empty output-text and token count to zero.
        count_tokens_reddit = 0
        output_text_reddit = ''

        while token_int != token_end_reddit and count_tokens_reddit < max_tokens:

            decoder_input_data[0, count_tokens_reddit] = token_int          # assign the first word 'ssss ' in the preallocated position

            x_data = {'transfer_values_input': transfer_values, 'decoder_input': decoder_input_data}

            # Input this data to the decoder and get the predicted output.
            decoder_output_reddit = decoder_model_reddit.predict(x_data)

            # convert to onehot (actually not one hot exactly), take the index of the largest value by np.argmax, then convert to text by tokenizer
            token_onehot = decoder_output_reddit[0, count_tokens_reddit, :]
            token_int = np.argmax(token_onehot)                       # update from token 2 ('ssss ') to a new token
            sampled_word = tokenizer_reddit.token_to_word(token_int)

            # Append the word to the output-text.
            output_text_reddit += " " + sampled_word

            # Increment the token-counter.
            count_tokens_reddit += 1

        # The first input-token is the special start-token for 'ssss '.
        token_int = token_start_coco

        # Initialize an empty output-text and token count to zero.
        count_tokens_coco = 0
        output_text_coco = ''

        while token_int != token_end_coco and count_tokens_coco < max_tokens:

            decoder_input_data[0, count_tokens_coco] = token_int          # assign the first word 'ssss ' in the preallocated position

            x_data = {'transfer_values_input': transfer_values, 'decoder_input': decoder_input_data}

            # Input this data to the decoder and get the predicted output.
            decoder_output_coco = decoder_model_coco.predict(x_data)

            # convert to onehot (actually not one hot exactly), take the index of the largest value by np.argmax, then convert to text by tokenizer
            token_onehot = decoder_output_coco[0, count_tokens_coco, :]
            token_int = np.argmax(token_onehot)                       # update from token 2 ('ssss ') to a new token
            sampled_word = tokenizer_coco.token_to_word(token_int)

            # Append the word to the output-text.
            output_text_coco += " " + sampled_word

            # Increment the token-counter.
            count_tokens_coco += 1

        # Plot the image.
        #plt.imshow(img)
        #plt.show()

        # strip the end word ' eeee' from the caption
        caption_coco = ' '.join(output_text_coco.split()[:-1])
        caption_reddit = ' '.join(output_text_reddit.split()[:-1])
        captions = {"coco": caption_coco, "reddit": caption_reddit}
        # Print the predicted caption.
        #print("Comment by CRNN:")
        #print("--> ", caption)
        #print()
        return captions
