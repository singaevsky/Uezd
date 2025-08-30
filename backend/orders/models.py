# backend/orders/models.py
from django.db import models
from django.contrib.auth import get_user_model
from products.models import ProductVariant

User = get_user_model()

class Order(models.Model):
    STATUS_CHOICES = [
        ('new', 'Новый'),
        ('preparing', 'Готовится'),
        ('ready', 'Готов'),
        ('delivered', 'Доставлен'),
        ('cancelled', 'Отменён'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_address = models.TextField(blank=True)
    delivery_date = models.DateField()
    delivery_time = models.TimeField()
    payment_method = models.CharField(max_length=50)
    phone = models.CharField(max_length=20)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Поле для указания источника заказа
    source = models.CharField(
        max_length=20,
        default='website',
        choices=[
            ('website', 'Сайт'),
            ('telegram', 'Telegram'),
        ]
    )

    def __str__(self):
        return f"Заказ #{self.id} от {self.user.username}"
