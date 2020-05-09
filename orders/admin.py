from django.contrib import admin

from .models import Product, Option, Price, Order
# Register your models here.

admin.site.register(Product)
admin.site.register(Order)
admin.site.register(Option)
admin.site.register(Price)