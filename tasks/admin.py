from django.contrib import admin

# Register your models here.

from .models import Task

class TaskAdmin(admin.ModelAdmin):
  list_display = ('name', 'end_date', 'done')

admin.site.register(Task, TaskAdmin)