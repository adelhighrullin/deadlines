from django.http import HttpResponse

from .models import Task


def index(request):
  return HttpResponse("Hello")

def detail(request, task_id):
  return HttpResponse("You're looking at task %s." % task_id)