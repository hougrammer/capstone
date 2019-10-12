from app import app, subreddit_embeddings, forms
from flask import render_template, jsonify

@app.route('/')
@app.route('/index')
def index():
	return render_template('index.html')

@app.route('/models')
def models():
	return render_template('models.html', main_title='ML Models')

@app.route('/posts')
def posts():
	return render_template('posts.html', main_title='Posts/Comments')

@app.route('/subreddits', methods=['GET', 'POST'])
def subreddits():
	return render_template(
		'subreddits.html',
		main_title='Subreddits/Users',
		form=forms.SubredditForm())

@app.route('/closest_subreddits')
def closest_subreddits():
	return jsonify(list(subreddit_embeddings.get_closest('askreddit')))