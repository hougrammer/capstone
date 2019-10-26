import numpy as np
import pickle
from time import time
from scipy.spatial.distance import euclidean, cosine

counts = {}

def load_counts():
    print('Loading post counts...')
    t = time()
    with open('app/data/post_counts.pickle', 'rb') as handle:
        counts.update(pickle.load(handle))
    print('loaded {} post counts in {} s'.format(len(counts), time() - t))

def get_counts(subreddit):
    subreddit = subreddit.lower()
    if subreddit not in counts or sum(counts[subreddit]) == 0:
        print('post counts missing for "{}"'.format(subreddit))
        return []
    return list(counts[subreddit])