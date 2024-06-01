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
    
    DIFFICULTY = [
        (0, "Easy"),
        (1, "Normal"),
        (2, "Difficult")
    ]
    
    place_id = models.ForeignKey(Place, on_delete=models.CASCADE)
    difficulty = models.IntegerField(choices=DIFFICULTY, default=1)
    text = models.TextField()
    pub_date = models.DateField()
    
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
