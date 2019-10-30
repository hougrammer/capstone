from flask import Flask

app = Flask(__name__)

# Obviously this site is not that secure. If you found this and can exploit it, go ahead.
app.config['SECRET_KEY'] = 'secret'

from app import routes
from app import subreddit_embeddings
from app import post_counts

subreddit_embeddings.load_embeddings()
post_counts.load_counts()
