from django.contrib import admin

from .models import Product, Option, Price, Order, Topping

class ToppingInline(admin.StackedInline):
    model = Topping.products.through
    extra = 1

class ProductAdmin(admin.ModelAdmin):
    inlines = [ToppingInline]

class ToppingAdmin(admin.ModelAdmin):
    filter_horizontal = ["products"]

admin.site.register(Product, ProductAdmin)
admin.site.register(Order)
admin.site.register(Option)
admin.site.register(Price)
admin.site.register(Topping, ToppingAdmin)