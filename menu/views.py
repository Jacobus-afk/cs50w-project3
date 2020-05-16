import json

from django.core import serializers
from django.http import JsonResponse
from django.shortcuts import render

from orders.models import Option, Order, Price, Product


def home(request):
    return render(request, "menu/home.html")


def menu(request):

    # prod_dict = {}
    # for prod in Product.objects.filter():
    #     order_dict = {"legend":"order"}
    #     for order in Order.objects.filter(product=prod):
    #         opt_dict = {"legend":"option"}
    #         for opt in Option.objects.filter(order=order):
    #             price_dict = {"legend":"price"}
    #             for price in Price.objects.filter(option=opt):
    #                 price_dict[price.size] = price.price
    #             opt_dict[opt.option_name] = price_dict
    #         order_dict[order.title] = opt_dict
    #     prod_dict[prod.product] = order_dict

    #     context = {
    #     "products": prod_dict

    products = Product.objects.values_list("product", flat=True)
    # test = Price.objects.filter(option__order__product__product='Pizza')
    # p = Product.objects.get(product='Pizza')
    # test3 = p.order_set
    # test5 = Order.objects.filter(product=p)
    # test6 = Order.objects.filter(product__product="Pizza")
    # test4 = test3.option_set
    return render(request, "menu/menu.html", {"products": list(products)})


# https://www.pluralsight.com/guides/work-with-ajax-django
def post_order(request):
    if request.is_ajax and request.method == "POST":
        product = request.POST["product"]
        orders = Order.objects.filter(product__product=product)
        # options = Option.objects.filter(order = orders)
        orders_list = list(orders.values())
        return JsonResponse({"orders": orders_list}, status=200)

    # some error occured
    return JsonResponse({"error": ""}, status=400)


def post_option(request):
    if request.is_ajax and request.method == "POST":
        title = request.POST["order_title"]
        options = Option.objects.filter(order__title=title)
        opt_list = list(options.values())
        return JsonResponse({"options": opt_list}, status=200)
    return JsonResponse({"error": ""}, status=400)
