from django import forms
from django.contrib.auth import get_user_model
from appTemporal.models import ExtraFields
from django.db.models import Q  # Importo "Q" para poder hacer condicionales en consultas Django

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
        self.user_instance = kwargs.pop('user', None)
        self.extrafields_instance = kwargs.pop('extrafields', None)
        super(UpdateCombinedForm, self).__init__(*args, **kwargs)

        # Establecer valores iniciales para username y first_name
        if self.user_instance:
            self.fields['username'] = forms.CharField(required=True, label="Username", initial=self.user_instance.username, widget=forms.TextInput(attrs={"class": "form-control"}))
            self.fields['email'] = forms.EmailField(required=True, label="Email", initial=self.user_instance.email, widget=forms.EmailInput(attrs={"class": "form-control"}))
            
            full_name = f"{self.user_instance.first_name} {self.user_instance.last_name}".strip()
            self.fields['fullName'] = forms.CharField(required=True, label="Name", initial=full_name, widget=forms.TextInput(attrs={"class": "form-control"}))

        else:
            self.fields['username'] = forms.CharField(required=True, label="Username", widget=forms.TextInput(attrs={"class": "form-control"}))
            self.fields['fullName'] = forms.CharField(required=True, label="Name", widget=forms.TextInput(attrs={"class": "form-control"}))
            self.fields['email'] = forms.EmailField(required=True, label="Email", widget=forms.EmailInput(attrs={"class": "form-control"}))
        
        if self.extrafields_instance:
            self.fields['about'] = forms.CharField(required=False, label="About me", initial=self.extrafields_instance.about, widget=forms.Textarea(attrs={"class": "form-control about-me"}))
        else:
            self.fields['about'] = forms.CharField(required=False, label="About me", widget=forms.Textarea(attrs={"class": "form-control about-me"}))

    def clean_username(self):
        username = self.cleaned_data["username"]
        if len(username) < 5 or len(username) > 12:
            raise forms.ValidationError("The username must be 6 to 12 characters long.")
        else:
            try:
                users = User.objects.filter(~Q(pk=self.user_instance.pk), username=username).count()
            except Exception as e:
                print(f"Error in function clean_username in UpdateCombinedForm (appTemporal/forms.py): {e}")
                raise forms.ValidationError("An error occurred while validating the username.")
                
            if users > 0:
                raise forms.ValidationError("This username already exists. Try again.")

        return username
    
    def clean_email(self):
        email = self.cleaned_data["email"]
        
        try:
            emails = User.objects.filter(~Q(pk=self.user_instance.pk), email=email).count()
        except Exception as e:
            print(f"Error in function clean_email in UpdateCombinedForm (appTemporal/forms.py): {e}")
            raise forms.ValidationError("An error occurred while validating the email.")
            
        if emails > 0:
            raise forms.ValidationError("This email already exists. Try again.")

        return email
    
    def clean_fullName(self):
        fullName = self.cleaned_data["fullName"]
        if any(char.isdigit() for char in fullName):
            raise forms.ValidationError("The name/surname cannot contain numbers.")
        return fullName

    def save(self, commit=True):
        cleaned_data = self.cleaned_data
        username_value = cleaned_data.get('username')  # Obtener el valor de 'username' del formulario limpio
        email_value = cleaned_data.get('email')  # Obtener el valor de 'email' del formulario limpio
        fullName_value = cleaned_data.get('fullName')  # Obtener el valor de 'fullName' del formulario limpio
        about_value = cleaned_data.get('about')  # Obtener el valor de 'about' del formulario limpio

        if self.user_instance:
            first_name, last_name = fullName_value.split(' ', 1) if ' ' in fullName_value else (fullName_value, '')
            self.user_instance.username = username_value
            self.user_instance.email = email_value
            self.user_instance.first_name = first_name
            self.user_instance.last_name = last_name
            if commit:
                self.user_instance.save()

        if self.extrafields_instance:
            self.extrafields_instance.about = about_value
            if commit:
                self.extrafields_instance.save()
        
        return self.user_instance, self.extrafields_instance
    
    
    