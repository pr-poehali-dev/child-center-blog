import json
import os
import hashlib


def handler(event: dict, context) -> dict:
    """Проверяет пароль администратора и возвращает токен сессии"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    password = body.get('password', '')

    admin_password = os.environ['ADMIN_PASSWORD']

    if password != admin_password:
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'ok': False, 'error': 'Неверный пароль'})
        }

    token = hashlib.sha256(f"{admin_password}_solnyshko_secret".encode()).hexdigest()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True, 'token': token})
    }
