from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import UserRegisterForm
from django.contrib.auth import authenticate, login

def register(request):
    if request.method == "POST":
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password1")
            messages.success(request, f"Created account for {username}")
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect('menu-order-placed')
            #return redirect("login")
    else:
        form = UserRegisterForm()
    return render(request, "users/register.html", {"form": form})
