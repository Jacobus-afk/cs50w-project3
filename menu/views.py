import json
from django.utils.crypto import get_random_string
from django.core import serializers
from django.http import JsonResponse
from django.shortcuts import render
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from orders.models import Option, Order, Price, Product, Topping, Cart_Item, Cart
from users.decorators import employee_required

# from django.contrib.auth.models import User
from users.models import User
# import decimal

def home(request):
    
    order_dict = request.session.get("order", {})
    # messages.success(request, f"{order_list}")
    return render(request, "menu/home.html")

def menu(request):
    products = Product.objects.values_list("product", flat=True)
    return render(request, "menu/menu.html", {"products": list(products)})

@login_required
def view_order(request):
    try:
        cart_model = Cart.objects.get(user__id=request.user.id)
        cart_items = cart_model.cart_items.all()
        # for item in cart_model.cart_items.all():
        #     messages.success(request, f"{item.product}, Toppings: {list(item.toppings.all())}")
    except Exception as e:
        messages.error(request, f"{e}")
        return render(request, "menu/error.html")
    return render(request, "menu/order.html", {"cart_items": cart_items})

@login_required
def order_placed(request):
    order_dict = request.session.get("order", {})
    try:
        # current_user = request.user
        user_model = User.objects.get(id=request.user.id)
        cart_model, _ = Cart.objects.get_or_create(user=user_model)
        for uid, order in list(order_dict.items()):
            price_model = Price.objects.get(id=order["size"]["price_id"])
            cart_item_model = Cart_Item.objects.create(product=price_model)
            for topping in order["toppings"]:
                topping_model = Topping.objects.get(id=topping["topping_id"])
                cart_item_model.toppings.add(topping_model)
            cart_item_model.save()

            cart_model.cart_items.add(cart_item_model)

            del request.session["order"][uid]
        request.session.modified = True
        cart_model.save()
    except Exception as e:
        return render(request, "menu/error.html")
    return view_order(request)

@employee_required
def handle_order(request):
    return render(request, "menu/handle_order.html")

#@login_required
def cart(request):
    order_dict = request.session.get("order", {})
    tally = 0.00
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
            option = price_model.option.option_name
            if "Topping" in option or "Selection" in option:
                option = ""
            else:
                option += ", "
            size = price_model.size
            product += " (" + option + size + ")"
            pretty_orderdict[uid] = {
                "product": product,
                "order": order,
                "price": price,
                "toppings": pretty_toppings
                }
        except:
            return render(request, "menu/error.html")
    return render(request, "menu/cart.html", {"orders": pretty_orderdict, "tally": f"{tally:.2f}"})

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
        return JsonResponse({"success": f"{order} added to order_dict"}, status=200)
    return JsonResponse({"error": ""}, status=400)

def take_from_cart(request):
    if request.is_ajax and request.method == "POST":
        dump_item = request.POST["dump_item"]
        order_dict = request.session.get("order", {})
        if dump_item in order_dict:
            del order_dict[dump_item]
            request.session["order"] = order_dict
            return JsonResponse({"success": f"{dump_item} removed from order_dict"}, status=200)
    return JsonResponse({"error": ""}, status=400)

# def place_order(request):
#     if request.is_ajax and request.method == "POST":
#         pass