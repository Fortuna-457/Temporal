"""
URL configuration for Temporal project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from appTemporal import views
from django.contrib.auth import views as auth_views
from appTemporal.views import error_404
from django.conf.urls import handler404

handler404 = error_404

# Configuración de las URLs para el proyecto Temporal.
urlpatterns = [
    # URL para acceder al panel de administración de Django.
    path('admin/', admin.site.urls),
    
    # URL para incluir las URLs definidas en el archivo "appTemporal.urls".
    path('', include("appTemporal.urls")),
    # Urls Reset Password
    path('reset_password/', auth_views.PasswordResetView.as_view(template_name="registration/reset_password.html"), 
        name="reset_password"),
    path('reset_password_sent/', auth_views.PasswordResetDoneView.as_view(template_name="registration/reset_password_sent.html"), 
        name="password_reset_done"),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name="registration/password_reset_confirm.html"),
        name="password_reset_confirm"),
    path('reset_password_complete/', auth_views.PasswordResetCompleteView.as_view(template_name="registration/reset_password_complete.html"),
        name="password_reset_complete"),
]