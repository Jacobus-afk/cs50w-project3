from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

#https://github.com/CoreyMSchafer/code_snippets/tree/master/Django_Blog
class UserRegisterForm(UserCreationForm):
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ["username", "password1", "password2", "email"]