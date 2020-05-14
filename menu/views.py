from django.shortcuts import render
from orders.models import Price, Product, Order, Option
# Create your views here.
def home(request):
    return render(request, 'menu/home.html')

def menu(request):

    prod_dict = {}
    for prod in Product.objects.filter():
        order_dict = {"legend":"order"}
        for order in Order.objects.filter(product=prod):
            opt_dict = {"legend":"option"}
            for opt in Option.objects.filter(order=order):
                price_dict = {"legend":"price"}
                for price in Price.objects.filter(option=opt):
                    price_dict[price.size] = price.price
                opt_dict[opt.option_name] = price_dict
            order_dict[order.title] = opt_dict
        prod_dict[prod.product] = order_dict

        context = {
        "products": prod_dict
    }
    return render(request, 'menu/menu.html', context)