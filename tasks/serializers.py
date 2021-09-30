from rest_framework import serializers
from django.contrib.auth import settings
from .models import CustomUser, Task

class CustomUserSerializer(serializers.ModelSerializer):
  email = serializers.EmailField(required=True)
  username = serializers.CharField(required=True)
  password = serializers.CharField(min_length=8, write_only=True, required=True)

  class Meta:
    model = CustomUser
    fields = ('id', 'email', 'username', 'password')

  def create(self, validated_data):
    password = validated_data.pop('password', None)
    instance = self.Meta.model(**validated_data)
    if password is not None:
      instance.set_password(password)
    instance.save()
    return instance

class TaskSerializer(serializers.ModelSerializer):
  # name = serializers.CharField(required=True)
  # description = serializers.CharField(required=False)
  # done = serializers.BooleanField(default=False)
  # user = CustomUserSerializer

  class Meta:
    model = Task
    fields = ('id', 'name', 'description', 'done', 'user')

  # def perform_create(self, serializer):
  #   serializer.save(user=self.request.user)
  
  # def create(self, validated_data):
  #   instance = self.Meta.model(**validated_data)
  #   instance.save()
  #   return instance
