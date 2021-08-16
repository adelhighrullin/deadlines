from django.http import HttpResponse

from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TaskSerializer
from .models import Task

class TaskView(viewsets.ModelViewSet):
  serializer_class = TaskSerializer
  queryset = Task.objects.all()
  
def index(request):
  return HttpResponse("Hello")

def detail(request, task_id):
  return HttpResponse("You're looking at task %s." % task_id)