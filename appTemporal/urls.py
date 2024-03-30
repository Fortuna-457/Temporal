from django.urls import path, include
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    # Url de la página principal
    path('main/', views.index, name='index'),
    # Url de la página de modos de juego
    path('games/', views.games, name='games'),
    # Url de la página de login
    path('', views.loginView, name='login'),
    # Url de la página de login
    path('register/', views.register, name='register'),
]