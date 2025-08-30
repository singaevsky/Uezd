# backend/telegram/bot.py
import os
import requests
from django.conf import settings

TELEGRAM_TOKEN = getattr(settings, 'TELEGRAM_BOT_TOKEN', '')
CHAT_ID = getattr(settings, 'TELEGRAM_CHAT_ID', '')

def send_telegram_message(message):
    if not TELEGRAM_TOKEN or not CHAT_ID:
        return

    url = f'https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage'
    payload = {
        'chat_id': CHAT_ID,
        'text': message,
        'parse_mode': 'HTML'
    }
    requests.post(url, data=payload)
# backend/telegram/bot.py
def send_design_to_telegram(user, weight, filling, event, image_path):
    if not TELEGRAM_TOKEN or not CHAT_ID:
        return

    url = f'https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendPhoto'
    caption = f"""
    🎨 <b>Новый эскиз от клиента</b>
    Имя: {user.get_full_name() or user.username}
    Событие: {event}
    Вес: {weight} кг
    Начинка: {filling}
    """
    with open(image_path, 'rb') as photo:
        requests.post(url, data={'chat_id': CHAT_ID, 'caption': caption, 'parse_mode': 'HTML'}, files={'photo': photo})
