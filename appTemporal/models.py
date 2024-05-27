from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Place(models.Model):
    id = models.CharField(max_length=200, primary_key=True)
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=60)
    answer_text = models.TextField()
    pub_date = models.DateField()
    
class ExtraFields(models.Model):
    
    ACCEPTORNOT = [
        (0, "Yes, I do accept the privacy policy."),
        (1, "No, I do not accept the privacy policy.")
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    privacy_policy = models.IntegerField(choices=ACCEPTORNOT, default = 1)