# Generated by Django 5.0.3 on 2024-06-03 16:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appTemporal', '0023_remove_extrafields_about'),
    ]

    operations = [
        migrations.AddField(
            model_name='extrafields',
            name='about',
            field=models.TextField(default='This is my bio! I love animals and history'),
        ),
    ]
