# Usa la imagen base de Python
FROM python:3.12.2

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo de requisitos al contenedor
COPY requirements.txt .

# Copia el contenido del directorio 'Temporal' al contenedor en /app
COPY . .

# Instala las dependencias del proyecto
RUN pip install -r requirements.txt

# Exponer el puerto 8000 para acceder a la aplicación Django
EXPOSE 8000

# Comando para ejecutar la aplicación Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]