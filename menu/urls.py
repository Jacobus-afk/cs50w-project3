from django.urls import path

from . import views

urlpatterns = [
    path("", views.home, name="menu-home"),
    path("menu/", views.menu, name="menu-menu")
]
