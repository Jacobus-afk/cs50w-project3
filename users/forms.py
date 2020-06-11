from django import forms
# from django.contrib.auth.models import User
from users.models import User
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

    def save(self, commit=True):
        user = super().save(commit=False)
        user.is_customer = True
        if commit:
            user.save()
        return user