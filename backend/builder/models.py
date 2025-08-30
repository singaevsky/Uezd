# backend/builder/models.py
from django.db import models
from django.contrib.auth import get_user_model
from products.models import Filling

User = get_user_model()

class DesignRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.CharField(max_length=100, blank=True)
    weight = models.DecimalField(max_digits=3, decimal_places=2)
    filling = models.ForeignKey(Filling, on_delete=models.SET_NULL, null=True)
    comment = models.TextField(blank=True)
    image = models.ImageField(upload_to='designs/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Дизайн от {self.user.username} — {self.event}"
