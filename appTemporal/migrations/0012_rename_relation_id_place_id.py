# Generated by Django 5.0.3 on 2024-05-25 09:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('appTemporal', '0011_place'),
    ]

    operations = [
        migrations.RenameField(
            model_name='place',
            old_name='relation_id',
            new_name='id',
        ),
    ]