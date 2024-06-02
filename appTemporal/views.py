from django.views.decorators.http import require_POST
from datetime import timezone
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, get_user_model, logout
from django.contrib.auth.decorators import login_required
import requests
from appTemporal.models import ExtraFields, Place, Question, Answer, EasyQuestion, NormalQuestion, DifficultQuestion
from django.db.models import Max
import json
from django.http import JsonResponse
import openai
from django.http import HttpResponseNotFound
import random

# Configura tu API key de OpenAI
openai.api_key = "sk-proj-zKkILdlWgX9u28wMElNtT3BlbkFJABlCSDOdREzD3IbU6Cgo"

# Declaramos el máximo de preguntas que se van a devolver al cliente
MAX_LIMIT = 20

# Create your views here.

def error_404(request, exception):
    return render(request, 'layouts/404.html', {}, status=404)


# def custom_404(request, exception):
#     return HttpResponseNotFound('<h1>Page not found</h1>')

def index(request):
    if 'username' in request.COOKIES:
        username = request.COOKIES['username']
        user_model = get_user_model()
        user = user_model.objects.get(username=username)
        login(request, user)
    return render(request, 'layouts/index.html')


@login_required
def trivial(request):
    return render(request, 'layouts/trivial.html')

def privacyPolicyView(request):
    return render(request, 'layouts/privacyPolicy.html')


def contactView(request):
    return render(request, 'layouts/contact.html')


@login_required
def games(request):
    return render(request, 'layouts/games.html')


@login_required
def logoutView(request):
    logout(request)
    return redirect('/')


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
    return render(request, 'maps/map.html')


@login_required
def get_info_place(request):
    if request.method == 'POST':
        try:
            # Leer y decodificar los datos JSON recibidos
            datos_json = json.loads(request.body)
            relation_id = datos_json['relation_id'].upper()

            try:
                # Intentar obtener el objeto Place basado en las coordenadas
                place = Place.objects.get(id=relation_id)
                response_text = place.answer_text
            
            except Place.DoesNotExist:
                url = f'https://nominatim.openstreetmap.org/lookup?osm_ids={relation_id}&format=json'
                response = requests.get(url)
                
                if response.status_code == 200:
                    data = response.json()
                    if data:
                        location = data[0]
                        place_name = location.get('display_name', 'N/A')
                        place_type = location.get('osm_type', 'N/A')
                        
                        request_info = [
                            'Historical events in the:' + place_name,
                            'Give me three questions, with three false answers, and one true answer. The first question should be easy, the second normal, and the third difficult. It has to be about the history of:' + place_name
                        ]
                        
                        try:
                            # Realizar la solicitud a la API de OpenAI
                            response = openai.completions.create(
                                model='gpt-3.5-turbo',
                                prompt = request_info,
                                temperature=0,
                                top_p=1,
                                frequency_penalty=0.5,
                                presence_penalty=0
                            )
                            
                            # Obtener el texto de la respuesta
                            response_text = response['choices'][0]['text']
                            
                            # Crear un nuevo objeto Place con las coordenadas y la respuesta
                            place = Place(id=relation_id, name=place_name, type=place_type, answer_text=response_text, pub_date=timezone.now())
                            place.save()
                            
                            # Obtener las preguntas y respuestas devueltas
                            questions_answers = response['choices'][1]['text']
                            
                            # Crea un nuevo objeto Question con la pregunta creada
                            print(questions_answers)
                            
                            # Devolver el texto de respuesta en formato JSON
                            return JsonResponse({'place': response_text})
                            
                        except Exception as e: # Captura cualquier excepción durante el registro:
                            print(f"Error in function get_info_place (appTemporal/views.py): {e}")

            # Devolver el texto de respuesta en formato JSON
            return JsonResponse({'place': response_text})
        
        except Exception as e: # Captura cualquier excepción durante el registro:
            print(f"Error in function get_info_place (appTemporal/views.py): {e}")

    # Return a default response if there's an error or the request method is not POST
    return JsonResponse({'place': 'No info found about this place.'})


@login_required
@require_POST
def get_questions(request):
    try:

        # Leer y decodificar los datos JSON recibidos
        datos_json = json.loads(request.body)
        difficulty_level = datos_json['difficulty'].lower()
        limit = int(datos_json['limit'])

        try:
            
            if limit and difficulty_level and limit <= MAX_LIMIT:

                questions_answers = []
                
                questions = []
                
                # Hacemos un switch
                if difficulty_level == 'easy':
                    print('easy')
                    max_id = EasyQuestion.objects.aggregate(max_id=Max('id'))['max_id']
                    if max_id < limit:
                        questions = EasyQuestion.objects.all()
                    else:
                        for x in range(limit):
                            # Genera un número entero entre 1 y limit (incluyendo ambos)
                            random_int = random.randint(1, limit)
                            questions.append(Question.objects.filter(id=random_int))
                            
                            
                elif difficulty_level == 'normal':
                    print('normal')
                    max_id = NormalQuestion.objects.aggregate(max_id=Max('id'))['max_id']
                    if max_id < limit:
                        questions = NormalQuestion.objects.all()
                    else:
                        for x in range(limit):
                            # Genera un número entero entre 1 y limit (incluyendo ambos)
                            random_int = random.randint(1, limit)
                            questions.append(NormalQuestion.objects.filter(id=random_int))
                    
                elif difficulty_level == 'difficult':
                    print('difficult')
                    max_id = DifficultQuestion.objects.aggregate(max_id=Max('id'))['max_id']
                    if max_id < limit:
                        questions = DifficultQuestion.objects.all()
                    else:
                        for x in range(limit):
                            # Genera un número entero entre 1 y limit (incluyendo ambos)
                            random_int = random.randint(1, limit)
                            questions.append(Question.objects.filter(id=random_int))
                
                
                # Una vez tenemos las preguntas, sacamos las respuestas
                
                for question in questions:
                    
                    # Get answers as tuples
                    answers = Answer.objects.filter(question_id=question.question_id.id).values_list('text', 'is_correct')

                    correct_answer = None
                    answer_list = []

                    for answer in answers:
                        text, is_correct = answer  # Unpack the tuple
                        if is_correct:
                            correct_answer = text
                        answer_list.append({'text': text})

                    questions_answers.append({
                        'question': question.question_id.text,
                        'answers': answer_list,
                        'correctAnswer': correct_answer
                    })

            return JsonResponse({'questions': questions_answers})
            
        except Exception as e: # Captura cualquier excepción durante el registro:
            print(f"Error in function get_questions (appTemporal/views.py): {e}")

    except Exception as e: # Captura cualquier excepción durante el registro:
        print(f"Error in function get_questions (appTemporal/views.py): {e}")

    # Return a default response if there's an error or the request method is not POST
    return JsonResponse({'questions': 'No questions found'})