# backend/orders/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Order
from .serializers import OrderSerializer
from telegram.bot import send_telegram_message
from telegram.client_bot import notify_user_about_status_change


def broadcast_order_update(order_data):
    """
    Отправляет обновление заказа всем в группе 'orders' через WebSocket
    """
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "orders",
        {
            "type": "send_order_update",
            "event": "order_updated",
            "data": order_data
        }
    )


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['chef', 'admin']:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def update_status(self, request, pk=None):
        try:
            order = Order.objects.get(id=pk)
            new_status = request.data.get('status')

            allowed_statuses = ['new', 'preparing', 'ready', 'delivered', 'cancelled']
            if new_status not in allowed_statuses:
                return Response({'error': 'Недопустимый статус'}, status=status.HTTP_400_BAD_REQUEST)

            # Только кондитер или админ могут менять статус (кроме отмены клиентом)
            if request.user.role not in ['chef', 'admin'] and new_status != 'cancelled':
                return Response({'error': 'Доступ запрещён'}, status=status.HTTP_403_FORBIDDEN)

            order.status = new_status
            order.save()

            # Сериализуем обновлённый заказ
            serializer = OrderSerializer(order)

            # Рассылаем обновление через WebSocket
            broadcast_order_update(serializer.data)

            return Response(serializer.data)

        except Order.DoesNotExist:
            return Response({'error': 'Заказ не найден'}, status=status.HTTP_404_NOT_FOUND)
# В конце успешного обновления статуса
    if order.user.telegram_id:
        notify_user_about_status_change(order.user.telegram_id, order.id, order.status)

# После сохранения заказа
message = f"""
📦 <b>Новый заказ №{order.id}</b>
Дата: {order.delivery_date}
Время: {order.delivery_time}
Адрес: {order.delivery_address}
Телефон: {order.phone}
Сумма: {order.total_price} ₽

Товары:
"""
for item in order.items.all():
    message += f"• {item.product.name} — {item.quantity} шт.\n"

send_telegram_message(message)

# После сохранения заказа
from telegram.client_bot import notify_user_about_status_change

if order.user.telegram_id:
    notify_user_about_status_change(order.user.telegram_id, order.id, order.status)
