# Generated by Django 5.0.3 on 2024-06-02 18:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appTemporal', '0017_alter_question_place_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='difficulty',
        ),
        migrations.CreateModel(
            name='DifficultQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question_id', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='appTemporal.question')),
            ],
        ),
        migrations.CreateModel(
            name='EasyQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question_id', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='appTemporal.question')),
            ],
        ),
        migrations.CreateModel(
            name='NormalQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question_id', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='appTemporal.question')),
            ],
        ),
    ]
