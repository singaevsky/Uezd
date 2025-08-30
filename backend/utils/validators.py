# backend/utils/validators.py
import re

def is_valid_phone(phone):
    pattern = r'^(\+7|7|8)[\s\-]?\(?(\d{3})\)?[\s\-]?(\d{3})[\s\-]?(\d{2})[\s\-]?(\d{2})$'
    return re.match(pattern, phone.strip()) is not None
