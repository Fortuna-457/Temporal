from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'layouts/index.html')

def games(request):
    return render(request, 'layouts/games.html')


def login(request):
    return render(request, 'layouts/login.html')

def register(request):
    return render(request, 'layouts/register.html')