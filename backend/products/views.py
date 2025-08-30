# backend/products/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product, Filling, ProductVariant
from .serializers import ProductSerializer, FillingSerializer, ProductVariantSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Product.objects.all()
        return Product.objects.filter(is_active=True)

class FillingViewSet(viewsets.ModelViewSet):
    queryset = Filling.objects.all()
    serializer_class = FillingSerializer
    permission_classes = [IsAuthenticated]

class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAuthenticated]
