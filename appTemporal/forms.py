from django import forms
from django.contrib.auth import get_user_model
from appTemporal.models import ExtraFields
from django.db.models import Q # Importo "Q" para poder hacer condicionales en consultas DJango

User = get_user_model()

class UpdateUserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email']

class UpdateExtraFieldsForm(forms.ModelForm):
    class Meta:
        model = ExtraFields
        fields = ['about']

class UpdateCombinedForm(forms.Form):
    def __init__(self, *args, **kwargs):
        user_instance = kwargs.pop('user', None)
        extrafields_instance = kwargs.pop('extrafields', None)
        super(UpdateCombinedForm, self).__init__(*args, **kwargs)

        # Establecer valores iniciales para username y first_name
        if user_instance:
            self.fields['username'] = forms.CharField(required=True, label="Username", initial=user_instance.username, widget=forms.TextInput(attrs={"class": "form-control"}))
            self.fields['email'] = forms.EmailField(required=True, label="Email", initial=user_instance.email, widget=forms.EmailInput(attrs={"class": "form-control"}))
            self.fields['fullName'] = forms.CharField(required=True, label="Name", widget=forms.TextInput(attrs={"class": "form-control"}))
            
            full_name = ""
            if hasattr(user_instance, 'first_name'):
                full_name += user_instance.first_name
            if hasattr(user_instance, 'last_name'):
                full_name += " " + user_instance.last_name

            self.fields['fullName'].initial = full_name.strip()

        else:
            self.fields['username'] = forms.CharField(required=True, label="Username", widget=forms.TextInput(attrs={"class": "form-control"}))
            self.fields['fullName'] = forms.CharField(required=True, label="Name", widget=forms.TextInput(attrs={"class": "form-control"}))
            self.fields['email'] = forms.EmailField(required=True, label="Email", widget=forms.EmailInput(attrs={"class": "form-control"}))
        
        if extrafields_instance:
            self.fields['about'] = forms.CharField(required=False, label="About me", initial=extrafields_instance.about, widget=forms.Textarea(attrs={"class": "form-control about-me"}))
        else:
            self.fields['about'] = forms.CharField(required=False, label="About me", widget=forms.Textarea(attrs={"class": "form-control about-me"}))

    def clean_username(self):
        username = self.cleaned_data["username"]
        users = User.objects.filter(username=username).count()
        print(users)
        return username

    def save(self):
        cleaned_data = self.cleaned_data
        about_value = cleaned_data.get('about')  # Obtener el valor de 'about' del formulario limpio
        
        print(about_value)