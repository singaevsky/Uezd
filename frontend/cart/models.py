# backend/cart/models.py
from django.db import models
from django.contrib.auth import get_user_model
from products.models import ProductVariant

User = get_user_model()

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'variant')
