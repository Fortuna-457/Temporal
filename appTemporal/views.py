from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'layouts/index.html')

def games(request):
    return render(request, 'layouts/games.html')