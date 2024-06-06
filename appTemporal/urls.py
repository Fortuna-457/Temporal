from django.urls import path
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
    # Url del método que devuelve info sobre los lugares
    path('get-info-place/', views.get_info_place, name='get-info-place'),
    # Url del método que las preguntas y respuestas del trivial
    path('get-questions/', views.get_questions, name='get-questions'),
    # Url del método que actualiza la highscore del usuario
    path('set-highscore/', views.set_highscore, name='set-highscore'),
    # Url de la página de contacto
    path('contact/', views.contactView, name='contact'),
    # Url de la página de privacy policy
    path('privacyPolicy/', views.privacyPolicyView, name='privacyPolicy'),
    # Url de la página del triviall
    path('trivial/', views.trivial, name='trivial'),
    # Url de la página del edit profile
    path('profile/', views.profileView, name='profile'),
]