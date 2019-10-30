from app import app, subreddit_embeddings, post_counts
from flask import render_template, jsonify
import os
from flask import Flask, flash, request, redirect, url_for, send_from_directory, render_template
from flask import send_file
from werkzeug.utils import secure_filename
from app.captions_engine import generate_caption
from PIL import Image

UPLOAD_FOLDER = os.getcwd() + '/app/uploads'
EXAMPLE_FOLDER = os.path.join("static", "imgs")
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['EXAMPLE_FOLDER'] = EXAMPLE_FOLDER
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
@app.route('/index')
def index():
	return render_template('index.html')

@app.route('/images')
def home():
    snow_image = os.path.join(app.config['EXAMPLE_FOLDER'], 'snow.jpg')
    lunch_image = os.path.join(app.config['EXAMPLE_FOLDER'], 'lunchbox.jpg')
    parrot_image = os.path.join(app.config['EXAMPLE_FOLDER'], 'parrot.jpg')
    images_dict = {'snow': snow_image, 'lunchbox': lunch_image, 'parrot': parrot_image}
    return render_template('home.html', images=images_dict)

@app.route('/result', methods=['GET', 'POST'])
def result():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            image_path = UPLOAD_FOLDER + '/' + file.filename
            # if png is submitted, convert to jpg to be able to train in cnn
            if file.filename.rsplit(".", 1)[1].lower() == 'png':
                im = Image.open(image_path)
                im_jpg = im.convert('RGB')
                jpg_name = file.filename.split('.')[0] + '.jpg'
                image_path = UPLOAD_FOLDER + '/' + jpg_name
                im_jpg.save(image_path)
            caption = generate_caption(image_path)
        #image needs to be url, can't load from the absolute path
        img_url = url_for('uploaded_file', filename=filename)
        result = {"image": img_url, "caption": caption}
    return render_template("result.html", results=result)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/example_snow')
def example_snow():
    img_url = os.path.join(app.config['EXAMPLE_FOLDER'], 'snow.jpg')
    caption = {"coco": 'a man is skiing down a snowy hill', "reddit": 'looks like the highway to heaven'}
    result = {"image": img_url, "caption": caption}
    return render_template("example_snow.html", results=result)

@app.route('/example_lunchbox')
def example_lunchbox():
    img_url = os.path.join(app.config['EXAMPLE_FOLDER'], 'lunchbox.jpg')
    caption = {"coco": 'a plate of food with meat and vegetables', "reddit": 'you gonna eat that'}
    result = {"image": img_url, "caption": caption}
    return render_template("example_lunchbox.html", results=result)

@app.route('/example_parrot')
def example_parrot():
    img_url = os.path.join(app.config['EXAMPLE_FOLDER'], 'parrot.jpg')
    caption = {"coco": 'a small bird on a tree branch with a blurry background', "reddit": 'you found a fossil'}
    result = {"image": img_url, "caption": caption}
    return render_template("example_parrot.html", results=result)

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


@app.route('/post_counts/<subreddit>', methods=['GET'])
def get_post_counts(subreddit):
	return jsonify(post_counts.get_counts(subreddit))
