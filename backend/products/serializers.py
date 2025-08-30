# backend/products/serializers.py
from rest_framework import serializers
from .models import Product, Filling, ProductVariant

class FillingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filling
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = '__all__'
