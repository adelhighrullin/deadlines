from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.timezone import now

# Create your models here.

class Task(models.Model):
  name = models.CharField(max_length=200)
  description = models.TextField(default='')
  done = models.BooleanField(default=False)

  def __str__(self):
    return self.name

class CustomUser(AbstractUser):
  # userTasks = models.ForeignKey(Task)
  status = models.CharField(max_length=200, default='')