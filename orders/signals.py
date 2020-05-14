from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order, Option, Product, Price

@receiver(post_save, sender=Order)
def create_options(sender, instance, created, **kwargs):
    if created:
        for t in range (instance.selection_limit+1):
            Option.objects.get_or_create(order=instance, selection_count=t)

@receiver(post_save, sender=Option)
def create_prices(sender, instance, created, **kwargs):
    if created:
        if instance.order.size_choice:
            Price.objects.get_or_create(option=instance, size="LG")
            Price.objects.get_or_create(option=instance, size="SM")
        else:
            Price.objects.get_or_create(option=instance)