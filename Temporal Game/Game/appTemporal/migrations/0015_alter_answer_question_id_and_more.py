# Generated by Django 5.0.3 on 2024-05-31 12:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appTemporal', '0014_question_difficulty'),
    ]

    operations = [
        migrations.AlterField(
            model_name='answer',
            name='question_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='appTemporal.question'),
        ),
        migrations.AlterField(
            model_name='extrafields',
            name='privacy_policy',
            field=models.BooleanField(choices=[(0, 'Yes, I do accept the privacy policy.'), (1, 'No, I do not accept the privacy policy.')], default=False),
        ),
    ]
