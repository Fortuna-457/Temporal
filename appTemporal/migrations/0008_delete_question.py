# Generated by Django 5.0.3 on 2024-05-05 10:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('appTemporal', '0007_delete_location'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Question',
        ),
    ]