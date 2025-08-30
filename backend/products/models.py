# backend/products/models.py
from django.db import models
from django.db import models
from django.contrib.auth import get_user_model

class Filling(models.Model):
    name = models.CharField(max_length=100)
    price_multiplier = models.DecimalField(max_digits=3, decimal_places=2, default=1.0)

    def __str__(self):
        return self.name

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('cake', 'Торт'),
        ('bento', 'Бенто'),
        ('dessert', 'Десерт'),
    ]
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/')
    is_seasonal = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    weight_kg = models.DecimalField(max_digits=3, decimal_places=2)  # 1.0, 2.0
    filling = models.ForeignKey(Filling, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('product', 'weight_kg', 'filling')

    def __str__(self):
        return f"{self.product.name} ({self.weight_kg} кг, {self.filling.name})"


User = get_user_model()

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('cake', 'Торт'),
        ('bento', 'Бенто'),
        ('dessert', 'Десерт'),
    ]
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/')
    is_seasonal = models.BooleanField(default=False)
    price_updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    # products/models.py
description = models.TextField(blank=True, null=True)
