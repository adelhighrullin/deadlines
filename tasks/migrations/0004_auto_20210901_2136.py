# Generated by Django 3.2.5 on 2021-09-01 18:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0003_alter_customuser_age'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='age',
        ),
        migrations.AddField(
            model_name='customuser',
            name='status',
            field=models.CharField(default='', max_length=200),
        ),
    ]
