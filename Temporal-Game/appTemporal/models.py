from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Place(models.Model):
    id = models.CharField(max_length=200, primary_key=True)
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=60)
    answer_text = models.TextField()
    pub_date = models.DateField()

class Question(models.Model):
    place_id = models.ForeignKey(Place, on_delete=models.CASCADE)
    text = models.TextField()
    pub_date = models.DateField()
    
class EasyQuestion(models.Model):
    question_id = models.OneToOneField(Question, on_delete=models.CASCADE)
    max_points = models.SmallIntegerField(default=10)
    medium_points = models.SmallIntegerField(default=5)
    min_points = models.SmallIntegerField(default=1)
    
class NormalQuestion(models.Model):
    question_id = models.OneToOneField(Question, on_delete=models.CASCADE)
    max_points = models.SmallIntegerField(default=20)
    medium_points = models.SmallIntegerField(default=15)
    min_points = models.SmallIntegerField(default=10)
    
class DifficultQuestion(models.Model):
    question_id = models.OneToOneField(Question, on_delete=models.CASCADE)
    max_points = models.SmallIntegerField(default=30)
    medium_points = models.SmallIntegerField(default=25)
    min_points = models.SmallIntegerField(default=20)
    
class Answer(models.Model):
    question_id = models.ForeignKey(Question, on_delete=models.CASCADE)
    is_correct = models.BooleanField()
    text = models.TextField()
    pub_date = models.DateField()

class ExtraFields(models.Model):
    
    ACCEPT_OR_NOT = [
        (0, "Yes, I do accept the privacy policy."),
        (1, "No, I do not accept the privacy policy.")
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    privacy_policy = models.BooleanField(choices=ACCEPT_OR_NOT, default=1)
    highscore = models.IntegerField(default=0)
    about = models.TextField(default='This is my bio! I love animals and history', max_length=60)
    profile_picture = models.URLField(default='http://127.0.0.1:8000/static/img/profilePictures/def.jpg')