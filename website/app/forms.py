from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired

class SubredditForm(FlaskForm):
    subreddit = StringField('Subreddit', validators=[DataRequired()])
    submit = SubmitField('Get similar')