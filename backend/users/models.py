# backend/users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('customer', 'Клиент'),
        ('chef', 'Кондитер'),
        ('admin', 'Администратор'),
    ]
    phone = models.CharField(max_length=20, blank=True)
    bonus_points = models.IntegerField(default=0)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')

    def __str__(self):
        return self.username
