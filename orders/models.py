from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class Product(models.Model):
    product = models.CharField(max_length=32, unique=True)

    def __str__(self):
        return f"{self.product}"


class Topping(models.Model):
    topping = models.CharField(max_length=32, unique=True)

    def __str__(self):
        return f"{self.topping}"


class ToppingKeeper(models.Model):
    topping = models.ForeignKey(Topping, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.product} allows {self.topping} as topping"


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
    SMALL = "SM"
    LARGE = "LG"
    NORMAL = "NM"
    SIZE_CHOICES = [(SMALL, "Small"), (LARGE, "Large"), (NORMAL, "Normal")]
    option = models.ForeignKey(Option, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=5, decimal_places=2, default=999.99)
    size = models.CharField(max_length=2, choices=SIZE_CHOICES, default=NORMAL)

    def __str__(self):
        return f"{self.option} {self.size} : ${self.price}"
