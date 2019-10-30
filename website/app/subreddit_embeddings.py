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

def get_closest(subreddit, distance='euclidean', n=10):
    subreddit = subreddit.lower()
    if subreddit not in embeddings:
        print('{} not in embeddings'.format(subreddit))
        return []

    print('Getting {} closest subreddits to "{}"...'.format(n, subreddit))
    t = time()
    if (subreddit, distance) not in cache or len(cache[subreddit, distance]) < n+1:
        print('Cache miss...')
        fn = cosine if distance == 'cosine' else euclidean
        subreddits = sorted(
            embeddings.keys(),
            key=lambda x: fn(embeddings[subreddit], embeddings[x]))[:n+1]
        cache[subreddit, distance] = list(zip(
            subreddits,
            [fn(embeddings[subreddit], embeddings[s]) for s in subreddits]
        ))
        print('done in {} s'.format(time() - t))

    # Return n+1 subreddits because sorted[0] is the original subreddit
    return cache[subreddit, distance][:n+1]