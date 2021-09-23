import re
from django.http import HttpResponse

from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import TaskSerializer, CustomUserSerializer
from .models import CustomUser, Task

class TaskView(viewsets.ModelViewSet):
  serializer_class = TaskSerializer
  queryset = Task.objects.all()

class CustomUserView(viewsets.ModelViewSet):
  serializer_class = CustomUserSerializer
  queryset = CustomUser.objects.all()

class CustomUserCreate(APIView):
  permission_classes = (permissions.AllowAny,)
  authentication_classes = ()

  def post(self, request, format='json'):
    serializer = CustomUserSerializer(data=request.data)
    if serializer.is_valid():
      user = serializer.save()
      if user:
        json = serializer.data
        return Response(json, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)