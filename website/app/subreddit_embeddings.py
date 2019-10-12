import numpy as np
import pickle
from time import time
from scipy.spatial.distance import euclidean, cosine

embeddings = {}
cache = {}

def load_embeddings():
    print('Loading subreddit embeddings...')
    t = time()
    with open('app/data/subreddit_embeddings.pickle', 'rb') as handle:
        embeddings.update(pickle.load(handle))
    print('loaded {} embeddings in {} s'.format(len(embeddings), time() - t))

def get_closest(subreddit, similarity='euclidean', n=10):
    subreddit = subreddit.lower()
    if subreddit not in embeddings:
        print('{} not in embeddings'.format(subreddit))
        return []

    print('Getting {} closest subreddits to {}...'.format(n, subreddit))
    t = time()
    if (subreddit, similarity) not in cache or len(cache[subreddit, similarity]) < n:
      print('Cache miss...')
      fn = cosine if similarity == 'cosine' else euclidean
      cache[subreddit,similarity] = sorted(
          embeddings.keys(),
          key=lambda x: fn(embeddings[subreddit], embeddings[x]))[:n]
    print('done in {} s'.format(time() - t))
    return cache[subreddit, similarity][:n]