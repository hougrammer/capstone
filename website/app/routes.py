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
		main_title='Subreddits/Users')

@app.route('/closest_subreddits/<subreddit>', methods=['GET'])
def closest_subreddits(subreddit):
	response = [
		{'subreddit': x[0], 'distance': x[1]} for x in subreddit_embeddings.get_closest(subreddit)
	]
	return jsonify(response)