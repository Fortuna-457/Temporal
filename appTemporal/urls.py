from django.urls import path, include
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    # Url de la página de login.
    path('', views.loginView, name='loginView'),
    # Url para cerrar sesión
    path('salir/', views.logout_view, name='logout'),
    # Url de la página principal
    path('main/', views.index, name='main'),
    # Url de la página de registro
    path('singup/', views.registerView , name='singup'),
]