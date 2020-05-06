from django.contrib import admin

from .models import Products, Prices, Orders
# Register your models here.

admin.site.register(Products)
admin.site.register(Prices)
admin.site.register(Orders)