from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from .models import Order, Option, Product, Price, Cart, Cart_Item
from django.contrib.auth.models import User

@receiver(post_save, sender=Order)
def create_options(sender, instance, created, **kwargs):
    if created:
        for t in range(instance.selection_limit + 1):
            Option.objects.get_or_create(order=instance, selection_count=t)


@receiver(post_save, sender=Option)
def create_prices(sender, instance, created, **kwargs):
    if created:
        if instance.order.size_choice:
            Price.objects.get_or_create(option=instance, size="Large")
            Price.objects.get_or_create(option=instance, size="Small")
        else:
            Price.objects.get_or_create(option=instance)

@receiver(post_save, sender=User)
def create_cart(sender, instance, created, **kwargs):
    if created:
        Cart.objects.get_or_create(user=instance)

@receiver(pre_delete, sender=Cart)
def remove_cart_item(sender, instance, using, **kwargs):
    for cart_item in instance.cart_items.all():
        Cart_Item.objects.filter(id=cart_item.id).delete()