# Generated by Django 5.0.3 on 2024-06-03 16:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appTemporal', '0020_remove_extrafields_highscore'),
    ]

    operations = [
        migrations.AddField(
            model_name='extrafields',
            name='about',
            field=models.TextField(default=0),
        ),
        migrations.AddField(
            model_name='extrafields',
            name='highscore',
            field=models.IntegerField(default=0),
        ),
    ]
