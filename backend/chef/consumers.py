# backend/chef/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.auth import login
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import AnonymousUser

class OrderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Извлечение JWT из query-параметра
        token = self.scope["url_route"]["kwargs"].get("token")
        if not token:
            await self.close()
            return

        try:
            validated_token = JWTAuthentication().get_validated_token(token)
            user = JWTAuthentication().get_user(validated_token)
        except Exception:
            user = AnonymousUser()

        self.scope["user"] = user

        if not user.is_authenticated or user.role not in ['chef', 'admin']:
            await self.close()
            return

        await self.channel_layer.group_add("orders", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("orders", self.channel_name)

    async def send_order_update(self, event):
        await self.send(text_data=json.dumps({
            "type": event["event"],
            "data": event["data"]
        }))
