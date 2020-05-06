from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
# Create your models here.
class Products(models.Model):
    product = models.CharField(max_length=32)

    def __str__(self):
        return f"Product: {self.product}"

class Prices(models.Model):
    SMALL = "SM"
    LARGE = "LG"
    NORMAL = "NM"
    SIZE_CHOICES = [
        (SMALL, "Small"),
        (LARGE, "Large"),
        (NORMAL, "Normal")
    ]

    price = models.DecimalField(max_digits=5, decimal_places=2)
    size = models.CharField(max_length=2, choices=SIZE_CHOICES, default=NORMAL)

    def __str__(self):
        return f"{self.size} : ${self.price}"

class Orders(models.Model):

    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    price = models.ForeignKey(Prices, on_delete=models.CASCADE)
    title = models.CharField(max_length=32)
    topping_code = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(4)])