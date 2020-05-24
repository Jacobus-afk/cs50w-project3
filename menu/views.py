import json

from django.core import serializers
from django.http import JsonResponse
from django.shortcuts import render

from orders.models import Option, Order, Price, Product, Topping#, ToppingKeeper


def home(request):
    return render(request, "menu/home.html")

def menu(request):
    products = Product.objects.values_list("product", flat=True)
    return render(request, "menu/menu.html", {"products": list(products)})

# https://www.pluralsight.com/guides/work-with-ajax-django
def post_order(request):
    if request.is_ajax and request.method == "POST":
        product = request.POST["product"]
        orders = Order.objects.filter(product__product=product)
        orders_list = list(orders.values())
        return JsonResponse({"orders": orders_list}, status=200)
    return JsonResponse({"error": ""}, status=400)

def post_option(request):
    if request.is_ajax and request.method == "POST":
        order_id = request.POST["order_id"]
        options = Option.objects.filter(order__id=order_id)
        opt_list = list(options.values())
        return JsonResponse({"options": opt_list}, status=200)
    return JsonResponse({"error": ""}, status=400)

def post_price(request):
    if request.is_ajax and request.method == "POST":
        order_id = request.POST["order_id"]
        sel_cnt = request.POST["sel_cnt"]
        prices = Price.objects.filter(option__order__id=order_id, option__selection_count=sel_cnt)
        price_list = list(prices.values())
        return JsonResponse({"prices": price_list}, status=200)
    return JsonResponse({"error": ""}, status=400)
    
def post_topping(request):
    if request.is_ajax and request.method == "POST":
        order_id = request.POST["order_id"]
        o = Order.objects.get(id=order_id)
        toppings = Topping.objects.filter(products=o.product)
        topping_list = list(toppings.values())
        return JsonResponse({"toppings": topping_list}, status=200)
    return JsonResponse({"error": ""}, status=400)
    #     toppings = ToppingKeeper.objects.filter(product__product=o.product.product)
    #     topping_list = list(toppings.values_list('topping__topping', flat=True))
    #     # test = ToppingKeeper(limit_choices_to={'product__product': 'Pizza'})
    #     return JsonResponse({"toppings": topping_list}, status=200)
    # return JsonResponse({"error": ""}, status=400)
