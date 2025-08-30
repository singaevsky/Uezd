# backend/chef/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Recipe, Ingredient
from .serializers import RecipeSerializer, IngredientSerializer

class RecipeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

class IngredientViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [IsAuthenticated]
