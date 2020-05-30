import json
from django.utils.crypto import get_random_string
from django.core import serializers
from django.http import JsonResponse
from django.shortcuts import render
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from orders.models import Option, Order, Price, Product, Topping#, ToppingKeeper
import decimal

def home(request):
    
    order_dict = request.session.get("order", [])
    # messages.success(request, f"{order_list}")
    return render(request, "menu/home.html")

def menu(request):
    products = Product.objects.values_list("product", flat=True)
    return render(request, "menu/menu.html", {"products": list(products)})

#@login_required
def cart(request):
    order_dict = request.session.get("order", {})
    tally = 0.0
    pretty_orderdict = {}
    for uid, order in order_dict.items():
        try:
            pretty_toppings = [d.get("topping","") for d in order["toppings"]]
            
            price_id = int(order["size"]["price_id"])
            price_model = Price.objects.get(id=price_id)
            price = price_model.price
            tally += float(price)
            order = price_model.option.order.title
            product = price_model.option.order.product.product
            pretty_orderdict[uid] = {
                "product": product,
                "order": order,
                "price": price,
                "toppings": pretty_toppings
                }
        except:
            return render(request, "menu/error.html")
    return render(request, "menu/cart.html", {"orders": pretty_orderdict, "tally": str(round(tally, 2))})

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

def add_to_cart(request):
    if request.is_ajax and request.method == "POST":
        size = request.POST["size"]
        toppings = request.POST["toppings"]
        order_dict = request.session.get("order", {})

        order = {
            "size": json.loads(size),
            "toppings": json.loads(toppings)
            }
        while 1:
            uid = get_random_string(8).lower()
            if not uid in order_dict.keys():
                break
        order_dict[uid] = order
        #order_list.append(order)
        request.session["order"] = order_dict
        return JsonResponse({"success": order_dict}, status=200)
    return JsonResponse({"error": ""}, status=400)