# backend/cart/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CartItem
from .serializers import CartItemSerializer
from products.models import ProductVariant

class CartViewSet(viewsets.ViewSet):
    def list(self, request):
        items = CartItem.objects.filter(user=request.user)
        serializer = CartItemSerializer(items, many=True)
        return Response(serializer.data)

    def create(self, request):
        variant_id = request.data.get('variant_id')
        quantity = int(request.data.get('quantity', 1))
        try:
            variant = ProductVariant.objects.get(id=variant_id)
            cart_item, created = CartItem.objects.get_or_create(
                user=request.user,
                variant=variant,
                defaults={'quantity': quantity}
            )
            if not created:
                cart_item.quantity += quantity
                cart_item.save()
            return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)
        except ProductVariant.DoesNotExist:
            return Response({'error': 'Товар не найден'}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        try:
            item = CartItem.objects.get(user=request.user, id=pk)
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
