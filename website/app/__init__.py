from flask import Flask

app = Flask(__name__)

# Obviously this site is not that secure. If you found this and can exploit it, go ahead.
app.config['SECRET_KEY'] = 'secret'

from app import routes
from app import subreddit_embeddings

subreddit_embeddings.load_embeddings()