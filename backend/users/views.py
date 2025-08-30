# backend/users/views.py
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['GET'])
def profile(request):
    """Профиль и роль пользователя"""
    serializer = UserSerializer(request.user)
    return Response({
        'user': serializer.data,
        'role': request.user.role
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_fcm_token(request):
    token = request.data.get('fcm_token')
    if token:
        request.user.fcm_token = token
        request.user.save()
    return Response({'status': 'ok'})
