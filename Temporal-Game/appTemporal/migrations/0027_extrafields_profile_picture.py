# Generated by Django 5.0.3 on 2024-06-07 07:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appTemporal', '0026_difficultquestion_max_points_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='extrafields',
            name='profile_picture',
            field=models.URLField(default='img/profilePictures/def.jpg'),
        ),
    ]
