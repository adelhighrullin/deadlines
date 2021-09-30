from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from django.conf import settings

# Create your models here.


class CustomUser(AbstractUser):
  status = models.CharField(max_length=200, default='')
  
class Task(models.Model):
  name = models.CharField(max_length=200)
  description = models.TextField(default='')
  done = models.BooleanField(default=False)

  user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name="tasks")

  def __str__(self):
    return self.name