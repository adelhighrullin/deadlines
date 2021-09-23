from rest_framework import serializers
from .models import CustomUser, Task

class TaskSerializer(serializers.ModelSerializer):
  class Meta:
    model = Task
    fields = ('id', 'name', 'description', 'done')

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
