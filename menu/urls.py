from django.urls import path

from . import views

urlpatterns = [
    path("", views.home, name="menu-home"),
    path("ajax/order", views.post_order, name="menu-post-order"),
    path("ajax/option", views.post_option, name="menu-post-option"),
    path("ajax/price", views.post_price, name="menu-post-option"),
    path("ajax/topping", views.post_topping, name="menu-post-topping"),
    path("menu/", views.menu, name="menu-menu"),
]
