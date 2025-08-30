# backend/orders/serializers.py
from rest_framework import serializers
from .models import Order
from cart.serializers import CartItemSerializer

class OrderSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'items', 'total_price', 'status', 'delivery_address',
            'delivery_date', 'delivery_time', 'payment_method',
            'phone', 'comment', 'created_at'
        )

    def get_items(self, obj):
        # Представим, что у заказа есть связь с позициями (можно реализовать отдельно)
        # Пока возвращаем заглушку — в реальности нужно сохранять состав заказа
        return [
            {
                "product": "Торт Чёрный лес",
                "weight": "1 кг",
                "filling": "Шоколадная с арахисом и карамелью",
                "quantity": 1,
                "price": float(obj.total_price)
            }
        ]
