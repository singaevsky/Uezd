# backend/telegram/client_bot.py
import telebot
from telebot import types
from django.conf import settings
from django.utils import timezone
from datetime import datetime
import re

from users.models import User
from products.models import Product, Filling
from orders.models import Order
from .models import DesignRequest  # Импортируем новую модель
from ..utils.validators import is_valid_phone

# Импорт для уведомлений
from ..bot import send_telegram_message

bot = telebot.TeleBot(settings.TELEGRAM_CLIENT_BOT_TOKEN)

# Глобальное состояние пользователей
user_state = {}


# Старт
@bot.message_handler(commands=['start'])
def send_welcome(message):
    user, created = User.objects.get_or_create(
        username=str(message.chat.id),
        defaults={'first_name': message.from_user.first_name, 'role': 'customer'}
    )
    user.telegram_id = message.chat.id
    user.save()

    welcome = f"""
    Привет, {user.first_name}! 🎂

    Добро пожаловать к Уездному Кондитеру — авторские торты на заказ.

    Вот что я могу:
    /catalog — Каталог тортов
    /myorders — Мои заказы
    /promo — Акции
    /order — Оформить заказ
    /design — Загрузить эскиз
    /help — Помощь
    """
    bot.reply_to(message, welcome)


# Каталог
@bot.message_handler(commands=['catalog'])
def send_catalog(message):
    products = Product.objects.filter(is_active=True)[:10]
    if not products:
        bot.reply_to(message, "Каталог временно пуст.")
        return

    for p in products:
        text = f"<b>{p.name}</b>\n{p.description}\nЦена от {p.base_price} ₽"
        try:
            bot.send_photo(message.chat.id, p.image.url, caption=text, parse_mode='HTML')
        except Exception as e:
            print(f"Ошибка отправки фото: {e}")
            bot.send_message(message.chat.id, text, parse_mode='HTML')


# Мои заказы
@bot.message_handler(commands=['myorders'])
def send_orders(message):
    try:
        user = User.objects.get(telegram_id=message.chat.id)
        orders = Order.objects.filter(user=user).order_by('-created_at')
        if not orders:
            bot.reply_to(message, "У вас пока нет заказов.")
            return
        for order in orders:
            status_text = {
                'new': '🆕 Новый',
                'preparing': '🧁 Готовится',
                'ready': '✅ Готов',
                'delivered': '🚚 Доставлен',
                'cancelled': '❌ Отменён'
            }.get(order.status, order.status)
            text = f"""
            <b>Заказ №{order.id}</b>
            Статус: {status_text}
            Дата доставки: {order.delivery_date}
            Сумма: {order.total_price} ₽
            """
            bot.send_message(message.chat.id, text, parse_mode='HTML')
    except User.DoesNotExist:
        bot.reply_to(message, "Вы не зарегистрированы. Напишите /start")


# Акции
@bot.message_handler(commands=['promo'])
def send_promo(message):
    promo = """
    🎉 <b>Акция месяца!</b>

    Скидка 15% на торты к Новому году!
    Действует до 31 декабря.

    Промокод: <code>CAKE15</code>
    """
    bot.send_message(message.chat.id, promo, parse_mode='HTML')


# Помощь
@bot.message_handler(commands=['help'])
def send_help(message):
    help_text = """
    Доступные команды:
    /start — Начало
    /catalog — Каталог
    /myorders — Мои заказы
    /promo — Акции
    /order — Оформить заказ
    /design — Загрузить эскиз
    /cancel — Отменить текущее действие
    /help — Помощь
    """
    bot.reply_to(message, help_text)


# Отмена
@bot.message_handler(commands=['cancel'])
def cancel_action(message):
    if message.chat.id in user_state:
        del user_state[message.chat.id]
        bot.reply_to(message, "❌ Действие отменено.")
    else:
        bot.reply_to(message, "Нет активного действия для отмены.")


# Загрузка эскиза
@bot.message_handler(commands=['design'])
def request_design(message):
    bot.reply_to(message, "📸 Пожалуйста, отправьте фото вашего эскиза торта.")


# Обработка фото
@bot.message_handler(content_types=['photo'])
def handle_photo(message):
    file_id = message.photo[-1].file_id
    file_info = bot.get_file(file_id)
    downloaded_file = bot.download_file(file_info.file_path)

    filename = f"design_{message.chat.id}_{message.message_id}.jpg"
    filepath = f"media/designs/{filename}"

    with open(filepath, 'wb') as new_file:
        new_file.write(downloaded_file)

    try:
        user = User.objects.get(telegram_id=message.chat.id)
        DesignRequest.objects.create(
            user=user,
            image=filepath,
            comment="Загружен через Telegram"
        )
        bot.reply_to(message, "✅ Спасибо! Ваш эскиз отправлен менеджеру.")
    except User.DoesNotExist:
        bot.reply_to(message, "❌ Сначала зарегистрируйтесь: /start")


# Начать заказ
@bot.message_handler(commands=['order'])
def start_order(message):
    user_state[message.chat.id] = {'step': 'event'}

    markup = types.ReplyKeyboardMarkup(one_time_keyboard=True, resize_keyboard=True)
    markup.add('День рождения', 'Свадьба')
    markup.add('8 Марта', 'Корпоратив')

    bot.send_message(message.chat.id, "🎯 Для какого события торт?", reply_markup=markup)


# Обработка шагов
@bot.message_handler(func=lambda message: message.chat.id in user_state)
def handle_order_flow(message):
    chat_id = message.chat.id
    state = user_state[chat_id]
    step = state['step']

    if step == 'event':
        state['event'] = message.text
        state['step'] = 'weight'

        markup = types.ReplyKeyboardMarkup(one_time_keyboard=True, resize_keyboard=True)
        markup.add('1 кг', '2 кг')
        bot.send_message(chat_id, "⚖️ Выберите вес торта:", reply_markup=markup)

    elif step == 'weight':
        try:
            state['weight'] = float(message.text.replace(' кг', ''))
            state['step'] = 'filling'

            fillings = Filling.objects.all().order_by('name')
            if not fillings:
                bot.send_message(chat_id, "Начинки временно недоступны.")
                return

            markup = types.ReplyKeyboardMarkup(one_time_keyboard=True, resize_keyboard=True)
            for filling in fillings:
                markup.add(filling.name)
            bot.send_message(chat_id, "🧁 Выберите начинку:", reply_markup=markup)
        except Exception as e:
            bot.send_message(chat_id, "Неверный вес. Попробуйте снова.")

    elif step == 'filling':
        filling_name = message.text
        try:
            filling = Filling.objects.get(name=filling_name)
            state['filling_id'] = filling.id
            state['step'] = 'date'
            bot.send_message(chat_id, "📅 Введите дату доставки (ГГГГ-ММ-ДД):")
        except Filling.DoesNotExist:
            bot.send_message(chat_id, "Пожалуйста, выберите начинку из списка.")

    elif step == 'date':
        try:
            delivery_date = datetime.strptime(message.text, '%Y-%m-%d').date()
            if delivery_date < timezone.now().date():
                bot.send_message(chat_id, "Дата не может быть в прошлом.")
                return
            state['date'] = delivery_date
            state['step'] = 'phone'
            bot.send_message(chat_id, "📞 Введите ваш телефон:")
        except ValueError:
            bot.send_message(chat_id, "Неверный формат. Используйте ГГГГ-ММ-ДД")

    elif step == 'phone':
        phone = message.text.strip()
        if not is_valid_phone(phone):
            bot.send_message(chat_id, "❌ Неверный формат телефона. Пример: +7 999 123-45-67")
            return

        state['phone'] = phone
        confirm_order(chat_id)
        del user_state[chat_id]


def notify_user_about_status_change(telegram_id, order_id, status):
    status_text = {
        'new': '🆕 Новый',
        'preparing': '🧁 Готовится',
        'ready': '✅ Готов',
        'delivered': '🚚 Доставлен',
        'cancelled': '❌ Отменён'
    }.get(status, status)

    try:
        bot.send_message(
            telegram_id,
            f"🔄 Статус заказа №{order_id} изменён:\n"
            f"<b>{status_text}</b>\n\n"
            f"Проверьте детали в /myorders",
            parse_mode='HTML'
        )
    except Exception as e:
        print(f"Не удалось отправить уведомление: {e}")


def confirm_order(chat_id):
    state = user_state.get(chat_id)
    if not state:
        return

    try:
        user = User.objects.get(telegram_id=chat_id)
        filling = Filling.objects.get(id=state['filling_id'])

        price = calculate_price(state['weight'], filling.price_multiplier)

        # ✅ Создание заказа — внутри try, с указанием источника
        order = Order.objects.create(
            user=user,
            status='new',
            total_price=price,
            delivery_date=state['date'],
            delivery_time='12:00',
            payment_method='cash',
            phone=state['phone'],
            comment=f"Торт на {state['event']}, начинка: {filling.name}",
            source='telegram'  # Указываем источник
        )

        bot.send_message(
            chat_id,
            f"✅ Заказ №{order.id} оформлен!\n"
            f"Сумма: {price} ₽\n"
            f"Доставка: {state['date']} в 12:00\n"
            f"Оплата: наличными при получении\n\n"
            f"Менеджер свяжется с вами для уточнения деталей."
        )

        # Уведомление в группу
        send_telegram_message(f"📦 Новый заказ из Telegram: №{order.id} на {state['event']}")

    except User.DoesNotExist:
        bot.send_message(chat_id, "Ошибка: пользователь не найден.")
    except Filling.DoesNotExist:
        bot.send_message(chat_id, "Ошибка: начинка не найдена.")
    except Exception as e:
        bot.send_message(chat_id, f"Ошибка при оформлении заказа: {str(e)}")


def calculate_price(weight, multiplier):
    base_price = 1800
    return int(base_price * weight * multiplier)


def start_bot():
    print("✅ Telegram-бот для клиентов запущен...")
    bot.polling(none_stop=True)
