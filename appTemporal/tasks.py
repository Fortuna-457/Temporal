from celery import shared_task
import openai

# Configura tu API key de OpenAI
openai.api_key = 'sk-proj-zKkILdlWgX9u28wMElNtT3BlbkFJABlCSDOdREzD3IbU6Cgo'

@shared_task
def realizar_solicitud_openai():
    # Define las consultas
    consultas = [
        {
            "prompt": "Dime hola en francés.",
            "max_tokens": 50
        },
        {
            "prompt": "¿Llovió ayer en Lisboa?",
            "max_tokens": 50
        }
    ]

    # Realiza la solicitud con ambas consultas
    respuestas = openai.Completion.create(completions=consultas)

    # Obtiene las respuestas
    respuesta_1 = respuestas['choices'][0]['text'].strip()

    return respuesta_1