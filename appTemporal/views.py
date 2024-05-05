from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, get_user_model, logout
from django.contrib.auth.decorators import login_required
from appTemporal.models import ExtraFields
import json
from django.http import JsonResponse
import openai

# Configura tu API key de OpenAI
openai.api_key = 'sk-proj-zKkILdlWgX9u28wMElNtT3BlbkFJABlCSDOdREzD3IbU6Cgo'

# Create your views here.

@login_required
def index(request):
    if 'username' in request.COOKIES:
        username = request.COOKIES['username']
        user_model = get_user_model()
        user = user_model.objects.get(username=username)
        login(request, user)
    return render(request, 'layouts/index.html')


@login_required
def games(request):
    return render(request, 'layouts/games.html')


def loginView(request):
    if request.method == "GET":
        return render(request, 'registration/login.html')
    else:
        
        # Intenta autenticar al usuario con el username y password proporcionados
        user = authenticate(request,
                            username = request.POST.get('user'),
                            password = request.POST.get('pass'))
        if user is not None:
            login(request, user)
            if request.POST.get('remember'):
                response = redirect('index')
                response.set_cookie('username', user.username)
                return response
            else:
                return redirect('index')
        else:
            messages.error(request, 'Incorrect username and/or password.')
            return render(request, "registration/login.html")


def register(request): # Vista registro
    
    if request.method == "GET": # Comprueba si el request es un GET
        return render(request, 'registration/register.html')
    else: # Si el metodo no es GET, lo asumirá como POST
        
        # Recoge los datos enviados por el usuario a través del formulario de registro
        username = request.POST.get('user')
        email = request.POST.get('email')
        password = request.POST.get('pass')
        confirm_password = request.POST.get('confirm-pass')
        accept_privacy = request.POST.get('accept-privacy')
        
        if accept_privacy:
            accept_privacy=0
            
            # Obtiene el modelo de usuario personalizado de Django
            User = get_user_model()
            
            # Verifica si el username ya esta registrado
            if User.objects.filter(username=username).exists():
                messages.error(request, 'This username already exists. Try again.')
                return redirect('register')
            
            # Verifica si el email ya esta registrado
            if User.objects.filter(email=email).exists():
                messages.error(request, 'This email already exists. Try again.')
                return redirect('register')
            
            if confirm_password != password:
                messages.error(request, 'Passwords do not match.')
                return redirect('register')
            
            try:
                # Intenta crear el nuevo usuario y su perfil extendido con campos adicionales
                user = User.objects.create_user(username=username, password=password, email=email)
                eUser = ExtraFields(user=user, privacy_policy=accept_privacy)
                user.save()
                eUser.save()
            except Exception as e: # Captura cualquier excepción durante el registro
                print(f"Error in function register (appTemporal/views.py): {e}")
        
            # Redirecciona a la vista loginView si el registro fue exitoso
            return redirect('login')
        else:
            return redirect('register')
       
@login_required
def mapsView(request):
    if request.method == 'POST':
        
        # Leer y decodificar los datos JSON recibidos
        datos_json = json.loads(request.body)
        
        lugar = datos_json['lugar']
        coordenadas = datos_json['coordenadas']
        
        prompt = 'Hola, ¿cómo estás?'
        
        # Realizar la solicitud a la API de OpenAI
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=1024,
            n=1,
            stop=None,
            temperature=0.5,
        )
        
        # Obtener el texto de respuesta
        response_text = response['choices'][0]['text']
        
        # Devolver solo la parte 'lugar' de los datos
        return JsonResponse({'lugar': response_text})
    else:
        return render(request, 'maps/map.html')