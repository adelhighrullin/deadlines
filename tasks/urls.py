from django.urls import path

from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
  path('obtain/', jwt_views.TokenObtainPairView.as_view(), name='token_create'),
  path('refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]