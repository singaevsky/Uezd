# backend/admin/views.py
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from orders.models import Order
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_stats(request):
    if request.user.role != 'admin':
        return Response({'error': 'Доступ запрещён'}, status=403)

    today = timezone.now().date()
    today_orders = Order.objects.filter(created_at__date=today)

    return Response({
        'today_revenue': float(today_orders.aggregate(Sum('total_price'))['total_price__sum'] or 0),
        'today_orders': today_orders.count(),
        'total_users': User.objects.count(),
        'top_product': 'Торт Чёрный лес'  # Можно улучшить через аналитику
    })
def analytics_data(request):
    if request.user.role != 'admin':
        return Response({'error': 'Доступ запрещён'}, status=403)

    last_7_days = [timezone.now().date() - timedelta(days=i) for i in range(6, -1, -1)]
    revenue = []

    for day in last_7_days:
        total = Order.objects.filter(created_at__date=day).aggregate(Sum('total_price'))['total_price__sum'] or 0
        revenue.append(float(total))

    return Response({
        'dates': [d.strftime('%d.%m') for d in last_7_days],
        'revenue': revenue
    })
