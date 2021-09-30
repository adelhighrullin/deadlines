from django.contrib import admin

# Register your models here.

from .models import Task, CustomUser

class TaskAdmin(admin.ModelAdmin):
  list_display = ('name', 'description', 'done', 'user')

class CustomUserAdmin(admin.ModelAdmin):
  model = CustomUser

admin.site.register(Task, TaskAdmin)
admin.site.register(CustomUser, CustomUserAdmin)