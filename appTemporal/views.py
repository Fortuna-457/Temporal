from django.urls import reverse
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, get_user_model, logout
from django.http import HttpResponse
from django.contrib.auth.decorators import user_passes_test, login_required

# Create your views here.
def index(request):
    return render(request, 'layouts/index.html')

@login_required
def games(request):
    return render(request, 'layouts/games.html')


def login(request):
    return render(request, 'layouts/login.html')

def register(request):
    return render(request, 'layouts/register.html')