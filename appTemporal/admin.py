from django.contrib import admin
from .models import ExtraFields, Place, Question, Answer

# Register your models here.
@admin.register(ExtraFields)
class ExtraFieldsAdmin(admin.ModelAdmin):
    list_display = ['user', 'privacy_policy']
    
@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'type', 'answer_text', 'pub_date']
    
@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['id', 'place_id', 'difficulty', 'text', 'pub_date']
    
@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['id', 'question_id', 'is_correct', 'text', 'pub_date']