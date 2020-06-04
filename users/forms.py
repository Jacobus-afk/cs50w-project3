from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
# from .models import CustomUser
#https://learndjango.com/tutorials/django-custom-user-model
#https://github.com/CoreyMSchafer/code_snippets/tree/master/Django_Blog
class UserRegisterForm(UserCreationForm):
    email = forms.EmailField()

    class Meta:
        model = User
        # model = CustomUser
        fields = ["username", "password1", "password2", "email"]