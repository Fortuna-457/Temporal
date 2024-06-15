from django.views.decorators.http import require_POST
from datetime import timezone
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, get_user_model, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.password_validation import validate_password, ValidationError
import requests
from appTemporal.models import ExtraFields, Place, Question, Answer, EasyQuestion, NormalQuestion, DifficultQuestion
from django.db.models import Max
import json
from django.http import JsonResponse
import openai
from django.http import HttpResponseNotFound, HttpResponse, HttpResponseRedirect
import random
from appTemporal.forms import UpdateCombinedForm, ContactForm
from django.core.mail import send_mail
from django.conf import settings

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
    return render(request, 'Games/trivial.html')


def privacyPolicyView(request):
    return render(request, 'layouts/privacyPolicy.html')


def contactView(request):
    return render(request, 'layouts/contact.html')


@login_required
def games(request):
    return render(request, 'layouts/games.html')


@login_required
def profileView(request):
    user = get_user_model()
    
    usu = user.objects.get(username=request.user)
    
    extrafields = ExtraFields.objects.filter(user=usu).first()
    
    if request.method == 'POST':
        form = UpdateCombinedForm(request.POST, user=usu, extrafields=extrafields)
        if form.is_valid():
            form.save() # Guardo los datos en la BBDD
            return redirect('profile')
    else:
        form = UpdateCombinedForm(user=usu, extrafields=extrafields)

    return render(request, 'registration/editProfile.html', {"extrafields": extrafields, "user": usu, 'form': form})


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


def register(request):
    if request.method == "GET":
        return render(request, 'registration/register.html')
    else:
        # Recoge los datos enviados por el usuario a través del formulario de registro
        username = request.POST.get('user')
        email = request.POST.get('email')
        password = request.POST.get('pass')
        confirm_password = request.POST.get('confirm-pass')
        accept_privacy = request.POST.get('accept-privacy')
        
        if accept_privacy:
            # Obtiene el modelo de usuario personalizado de Django
            User = get_user_model()

            # Verifica si el username tiene una longitud adecuada
            if len(username) < 5 or len(username) > 12:
                messages.error(request, 'Username must be between 5 and 12 characters long.')
                return redirect('register')
            
            # Verifica si el username ya esta registrado
            if User.objects.filter(username=username).exists():
                messages.error(request, 'This username already exists. Try again.')
                return redirect('register')
            
            # Verifica si el email ya esta registrado
            if User.objects.filter(email=email).exists():
                messages.error(request, 'This email already exists. Try again.')
                return redirect('register')
            
            # Verifica si las contraseñas coinciden
            if confirm_password != password:
                messages.error(request, 'Passwords do not match.')
                return redirect('register')
            
            # Valida la contraseña
            try:
                validate_password(password)
            except ValidationError as e:
                for error in e.messages:
                    messages.error(request, error)
                return redirect('register')
            
            try:
                # Intenta crear el nuevo usuario y su perfil extendido con campos adicionales
                user = User.objects.create_user(username=username, password=password, email=email)
                eUser = ExtraFields(user=user, privacy_policy=True)  # Asumiendo que `accept_privacy` debe ser True
                user.save()
                eUser.save()
                messages.success(request, 'Registration successful! You can now log in.')
            except Exception as e:
                print(f"Error in function register (appTemporal/views.py): {e}")
                messages.error(request, 'An error occurred during registration. Please try again.')
                return redirect('register')

            # Redirecciona a la vista loginView si el registro fue exitoso
            return redirect('login')
        else:
            messages.error(request, 'You need to accept the Privacy policy.')
            return redirect('register')

       
@login_required
def mapsView(request):
    return render(request, 'Games/map.html')


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
                        place_name = location.get('display_name', 'N/A').split(", ")[0]
                        place_location = location.get('display_name', 'N/A')
                        place_type = location.get('osm_type', 'N/A')
                        
                        request_info = [
                            'Historical events in the: ' + place_name + '. In ' + place_location + '. In one paragraph.',
                            'Give me three questions, with three false answers, and one true answer. The first question should be easy, the second normal, and the third difficult. It has to be about the history of: ' + place_name + '. In ' + place_location + '. Show the correct answer between this symbol: -->. The difficulty between (). The questions between -.'
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
                    max_id = EasyQuestion.objects.aggregate(max_id=Max('id'))['max_id']
                    if max_id < limit:
                        questions = EasyQuestion.objects.all()
                    else:
                        ids = random.sample(range(1, max_id + 1), limit)
                        questions = EasyQuestion.objects.filter(id__in=ids)
                            
                elif difficulty_level == 'normal':
                    max_id = NormalQuestion.objects.aggregate(max_id=Max('id'))['max_id']
                    if max_id < limit:
                        questions = NormalQuestion.objects.all()
                    else:
                        ids = random.sample(range(1, max_id + 1), limit)
                        questions = NormalQuestion.objects.filter(id__in=ids)
                    
                elif difficulty_level == 'difficult':
                    max_id = DifficultQuestion.objects.aggregate(max_id=Max('id'))['max_id']
                    if max_id < limit:
                        questions = DifficultQuestion.objects.all()
                    else:
                        ids = random.sample(range(1, max_id + 1), limit)
                        questions = DifficultQuestion.objects.filter(id__in=ids)
                
                
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
                
                extrafields = ExtraFields.objects.filter(user=request.user.pk).first()

            return JsonResponse({
                'questions': questions_answers,
                'max_points': questions[0].max_points,
                'medium_points': questions[0].medium_points,
                'min_points': questions[0].min_points,
                'user_highscore': extrafields.highscore
            })
            
        except Exception as e: # Captura cualquier excepción durante el registro:
            print(f"Error in function get_questions (appTemporal/views.py): {e}")

    except Exception as e: # Captura cualquier excepción durante el registro:
        print(f"Error in function get_questions (appTemporal/views.py): {e}")

    # Return a default response if there's an error or the request method is not POST
    return JsonResponse({'questions': 'No questions found'})


@login_required
@require_POST
def set_highscore(request):
    try:

        # Leer y decodificar los datos JSON recibidos
        datos_json = json.loads(request.body)
        user_highscore = datos_json['highscore']
        
        extrafields = ExtraFields.objects.filter(user=request.user.pk).first()
        
        extrafields.highscore = user_highscore
        
        extrafields.save()
        
    except Exception as e: # Captura cualquier excepción durante el registro:
        print(f"Error in function set_highscore (appTemporal/views.py): {e}")
        
    return HttpResponse(status=200)


@login_required
@require_POST
def get_ranking(request):
    try:
        users = ExtraFields.objects.order_by('-highscore')[:5]
        
        ranking = []
        
        if users:
            for user in users:
                ranking.append({
                    'username': user.user.username,
                    'highscore': user.highscore,
                    'profile_picture': user.profile_picture
                })
        else:
            return JsonResponse({'message': 'No hay usuarios en el ranking'}, status=204)

    except Exception as e: # Captura cualquier excepción durante el registro:
        print(f"Error in function get_ranking (appTemporal/views.py): {e}")
        
    return JsonResponse({'ranking': ranking, 'active_user': request.user.username})


def talk_to_us(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            message = form.cleaned_data['message']
            try:
                send_mail(
                    f'Message from {name}',
                    message,
                    email,
                    [settings.EMAIL_HOST_USER],  # Replace with your email address
                )
                messages.success(request, 'Message sent successfully.')
            except Exception as e:
                print(f"Error in function talk_to_us (appTemporal/views.py): {e}")
        else:
            messages.error(request, 'The message could not be sent.')

        return HttpResponseRedirect('./#talk-to-us')
    else:
        form = ContactForm()
    return render(request, 'layouts/contact.html')


@login_required
@require_POST
def set_profile_picture(request):
    try:

        # Leer y decodificar los datos JSON recibidos
        datos_json = json.loads(request.body)
        img_src = datos_json['img_src']
        
        extrafields = ExtraFields.objects.filter(user=request.user.pk).first()
        
        extrafields.profile_picture = img_src
        
        extrafields.save()
        
    except Exception as e: # Captura cualquier excepción durante el registro:
        print(f"Error in function set_profile_picture (appTemporal/views.py): {e}")
        
    return HttpResponse(status=200)


@login_required
@require_POST
def get_profile_picture(request):
    try:

        extrafields = ExtraFields.objects.filter(user=request.user.pk).first()
        
        img_src = extrafields.profile_picture

    except Exception as e: # Captura cualquier excepción durante el registro:
        print(f"Error in function get_profile_picture (appTemporal/views.py): {e}")
        
    return JsonResponse({'profile_picture': img_src})