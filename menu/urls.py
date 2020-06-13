from django.urls import path

from . import views

urlpatterns = [
    path("", views.home, name="menu-home"),
    path("ajax/dropcartitem", views.remove_cart_item_from_db, name="menu-dropcartitem"),
    path("ajax/addtocart", views.add_to_cart, name="menu-addtocart"),
    path("ajax/takefromcart", views.take_from_cart, name="menu-takefromcart"),
    path("ajax/order", views.post_order, name="menu-post-order"),
    path("ajax/option", views.post_option, name="menu-post-option"),
    path("ajax/price", views.post_price, name="menu-post-option"),
    path("ajax/topping", views.post_topping, name="menu-post-topping"),
    path("menu/", views.menu, name="menu-menu"),
    path("view_orders/", views.view_order, name="menu-order"),
    path("place_order/", views.order_placed, name="menu-order-placed"),
    path("handle_order/", views.handle_order, name="menu-handle-order"),
    path("cart/", views.cart, name="menu-cart")
]
