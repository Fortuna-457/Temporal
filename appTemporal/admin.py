from django.contrib import admin
from .models import ExtraFields, Place

# Register your models here.
@admin.register(ExtraFields)
class ExtraFieldsAdmin(admin.ModelAdmin):
    list_display = ['user', 'privacy_policy']
    
# @admin.register(Place)
# class PlaceAdmin(admin.ModelAdmin):
#     list_display = ['coordinates', 'answer_text', 'pub_date']