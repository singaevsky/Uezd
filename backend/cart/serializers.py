# backend/cart/serializers.py
from rest_framework import serializers
from .models import CartItem
from products.serializers import ProductVariantSerializer

class CartItemSerializer(serializers.ModelSerializer):
    variant = ProductVariantSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = '__all__'

    def get_total_price(self, obj):
        return float(obj.variant.price) * obj.quantity
