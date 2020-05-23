from django.contrib import admin

from .models import Product, Option, Price, Order, Topping, ToppingKeeper
# Register your models here.

# class ToppingName(admin.ModelAdmin):
#     model = ToppingKeeper
#     list_display = ['get_product', 'get_topping', ]

#     def get_product(self, obj):
#         return obj.product.product
#     get_product.admin_order_field = 'product'
#     get_product.short_description = 'Product'

#     def get_topping(self, obj):
#         return obj.topping.topping
#     get_topping.admin_order_field = 'topping'
#     get_topping.short_description = 'Topping'
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(Option)
admin.site.register(Price)
admin.site.register(Topping)
admin.site.register(ToppingKeeper)