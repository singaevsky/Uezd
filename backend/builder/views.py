# backend/builder/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_design_request(request):
    weight = request.data.get('weight')
    filling = request.data.get('filling')
    event = request.data.get('event')
    design_image = request.FILES.get('design_image')

    # Сохраняем изображение
    if design_image:
        path = default_storage.save(f'designs/{design_image.name}', ContentFile(design_image.read()))

    # Здесь можно создать модель DesignRequest
    # DesignRequest.objects.create(user=request.user, image=path, ...)

    # Отправляем в Telegram
    send_design_to_telegram(request.user, weight, filling, event, path)

    return Response({'status': 'success', 'message': 'Заявка отправлена'})
