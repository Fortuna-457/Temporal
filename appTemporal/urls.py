from django.urls import path, include
from django.contrib import admin
from . import views

urlpatterns = [
    # Url de la página principal
    path('', views.index, name='index'),
    # Url de la página de modos de juego
    path('games/', views.games, name='games'),
     # Url del modo creative
    # path('maps/', views.creativeMap, name='creativeMap'),
    # Url de la página de login
    path('login/', views.loginView, name='login'),
    # Url de la página de registro
    path('register/', views.register, name='register'),
    # # Url de la página de política de privacidad
    # path('register/', views.register, name='register'),
    # Url de la página de mapas
    path('maps/', views.mapsView, name='maps'),
]