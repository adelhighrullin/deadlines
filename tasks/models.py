from django.db import models
from django.db.models.fields import DateTimeField

# Create your models here.

class Task(models.Model):
  name = models.CharField(max_length=200)
  description = models.TextField(default='')
  pub_date = models.DateTimeField('date published')
  end_date = models.DateTimeField('deadline date')
  done = models.BooleanField(default=False)

  def __str__(self):
    return self.name