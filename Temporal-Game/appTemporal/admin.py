from django.contrib import admin
from .models import ExtraFields, Place, Question, Answer, EasyQuestion, NormalQuestion, DifficultQuestion

# Register your models here.
@admin.register(ExtraFields)
class ExtraFieldsAdmin(admin.ModelAdmin):
    list_display = ['user', 'privacy_policy', 'highscore', 'about', 'profile_picture']
    
@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'type', 'answer_text', 'pub_date']
    
@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['id', 'place_id', 'text', 'pub_date']
    
@admin.register(EasyQuestion)
class EasyQuestionAdmin(admin.ModelAdmin):
    list_display = ['id', 'question_id', 'max_points', 'medium_points', 'min_points']
    
@admin.register(NormalQuestion)
class NormalQuestionAdmin(admin.ModelAdmin):
    list_display = ['id', 'question_id', 'max_points', 'medium_points', 'min_points']
    
@admin.register(DifficultQuestion)
class DifficultQuestionAdmin(admin.ModelAdmin):
    list_display = ['id', 'question_id', 'max_points', 'medium_points', 'min_points']
    
@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['id', 'question_id', 'is_correct', 'text', 'pub_date']