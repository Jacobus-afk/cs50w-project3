from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import User

class Product(models.Model):
    product = models.CharField(max_length=32, unique=True)

    def __str__(self):
        return f"{self.product}"


class Topping(models.Model):
    topping = models.CharField(max_length=32, unique=True)
    products = models.ManyToManyField(Product, blank=True, related_name="toppings")
    default_choice = models.BooleanField(default=False);
    def __str__(self):
        return f"{self.topping}"


class Order(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    title = models.CharField(max_length=32)
    selection_limit = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(4)]
    )
    size_choice = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.product} - {self.title}"


class Option(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    selection_count = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(4)]
    )
    option_name = models.CharField(max_length=32, default="Selection(s)")

    def __str__(self):
        return f"{self.order} #{self.selection_count} {self.option_name}"


class Price(models.Model):
    SMALL = "Small"
    LARGE = "Large"
    NORMAL = "Standard"
    SIZE_CHOICES = [(SMALL, "Small"), (LARGE, "Large"), (NORMAL, "Standard")]
    option = models.ForeignKey(Option, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=5, decimal_places=2, default=999.99)
    size = models.CharField(max_length=16, choices=SIZE_CHOICES, default=NORMAL)

    def __str__(self):
        return f"{self.option.order} {self.size} : ${self.price}"

class Cart_Item(models.Model):
    product = models.ForeignKey(Price, on_delete=models.CASCADE)
    toppings = models.ManyToManyField(Topping, blank=True, related_name="cart_items")
    

class Cart(models.Model):
    cart_items = models.ManyToManyField(Cart_Item, blank=True, related_name="carts")
    user = models.ForeignKey(User, on_delete=models.CASCADE, unique=True)
