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
    
class NormalQuestion(models.Model):
    question_id = models.OneToOneField(Question, on_delete=models.CASCADE)
    
class DifficultQuestion(models.Model):
    question_id = models.OneToOneField(Question, on_delete=models.CASCADE)
    
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
    about = models.TextField(default='This is my bio! I love animals and history')