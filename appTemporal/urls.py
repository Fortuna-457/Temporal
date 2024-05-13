from django.urls import path, include
from django.contrib import admin
from . import views

urlpatterns = [
    # Url de la página principal
    path('', views.index, name='index'),
    # Url de la página de modos de juego
    path('games/', views.games, name='games'),
    # Url de la página de login
    path('login/', views.loginView, name='login'),
    # Url de la página de logout
    path('logout/', views.logoutView, name='logout'),
    # Url de la página de registro
    path('register/', views.register, name='register'),
    # Url de la página de mapas
    path('maps/', views.mapsView, name='maps'),
]