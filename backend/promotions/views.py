# backend/promotions/views.py
from telegram.bot import send_telegram_message

def send_promo_to_telegram(title, text):
    message = f"🎉 <b>НОВАЯ АКЦИЯ!</b>\n\n<b>{title}</b>\n{text}"
    send_telegram_message(message)
