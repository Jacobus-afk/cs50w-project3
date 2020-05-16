from django.urls import path

from . import views

urlpatterns = [
    path("", views.home, name="menu-home"),
    path("ajax/order", views.post_order, name="menu-post-order"),
    path("menu/", views.menu, name="menu-menu"),
]
