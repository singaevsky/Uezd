# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from products.views import ProductViewSet, FillingViewSet, ProductVariantViewSet
from orders.views import OrderViewSet
from chef.views import RecipeViewSet, IngredientViewSet
from admin.views import admin_stats

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'fillings', FillingViewSet)
router.register(r'variants', ProductVariantViewSet)
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'recipes', RecipeViewSet)
router.register(r'ingredients', IngredientViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/profile/', profile, name='profile'),
    path('api/admin/stats/', admin_stats, name='admin_stats'),
]
