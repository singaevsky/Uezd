# backend/chef/models.py
from django.db import models
from orders.models import Order

class Recipe(models.Model):
    name = models.CharField(max_length=100)  # Название рецепта: "Чёрный лес", "Медовик"
    description = models.TextField(blank=True)
    ingredients = models.JSONField()  # [{"name": "Мука", "amount": "200 г"}, ...]
    instructions = models.TextField()
    prep_time = models.IntegerField(help_text="Время приготовления в минутах")
    image = models.ImageField(upload_to='recipes/', blank=True, null=True)

    def __str__(self):
        return self.name

class Ingredient(models.Model):
    name = models.CharField(max_length=100)
    stock = models.DecimalField(max_digits=8, decimal_places=2)  # Остаток на складе (кг, л)
    unit = models.CharField(max_length=10, default='г')  # г, кг, мл, л

    def __str__(self):
        return f"{self.name} ({self.stock} {self.unit})"
