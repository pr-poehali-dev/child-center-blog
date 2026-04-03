import json
import os
import smtplib
import hashlib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2


FROM_EMAIL = 'ribkadolli@mail.ru'
SMTP_HOST = 'smtp.mail.ru'
SMTP_PORT = 465
SITE_URL = 'https://blogribkadolli.ru'


def make_token(email: str, sub_id: int) -> str:
    return hashlib.md5(f"{email}{sub_id}ribkadolli_secret".encode()).hexdigest()


def unsubscribe_footer(token: str) -> str:
    url = f"{SITE_URL}/unsubscribe?token={token}"
    return f"""
    <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #ffe8d6; text-align: center;">
        <p style="color: #d1d5db; font-size: 11px; margin: 0;">
            Вы получили это письмо, потому что подписались на блог «Рыбка Долли».<br>
            <a href="{url}" style="color: #fb923c; text-decoration: underline;">Отписаться от рассылки</a>
        </p>
    </div>
    """


def send_email(to_email: str, subject: str, html: str):
    smtp_password = os.environ['SMTP_PASSWORD']
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = FROM_EMAIL
    msg['To'] = to_email
    msg.attach(MIMEText(html, 'html'))
    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
        server.login(FROM_EMAIL, smtp_password)
        server.sendmail(FROM_EMAIL, to_email, msg.as_string())


def welcome_html(name: str, token: str) -> str:
    return f"""
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #fffdf8; border-radius: 16px; overflow: hidden; border: 1px solid #ffe0c0;">
        <div style="background: linear-gradient(135deg, #fb923c, #f43f5e); padding: 28px; text-align: center;">
            <div style="font-size: 40px;">🌟</div>
            <h2 style="color: white; margin: 10px 0 0; font-size: 22px;">Добро пожаловать!</h2>
            <p style="color: rgba(255,255,255,0.9); margin: 6px 0 0; font-size: 15px;">Детский центр «Рыбка Долли»</p>
        </div>
        <div style="padding: 28px;">
            <p style="color: #1f2937; font-size: 16px;">Привет, <strong>{name}</strong>! 👋</p>
            <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
                Вы подписались на наш блог. Теперь вы будете первыми узнавать о новых статьях, советах для родителей и новостях центра.
            </p>
            <div style="margin-top: 24px; background: #fff7ed; border-radius: 12px; padding: 16px; text-align: center; color: #9a3412; font-size: 13px;">
                Спасибо, что вы с нами! С теплом, команда «Рыбка Долли» ☀️
            </div>
            {unsubscribe_footer(token)}
        </div>
    </div>
    """


def handler(event: dict, context) -> dict:
    """Управление подписчиками блога: подписка, отписка, список, рассылка"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    headers = event.get('headers', {})
    admin_password = headers.get('X-Admin-Password', '')
    params = event.get('queryStringParameters') or {}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    try:
        # GET /subscribers?unsubscribe=TOKEN — отписка по ссылке
        if method == 'GET' and params.get('unsubscribe'):
            token = params.get('unsubscribe', '')
            cur.execute("SELECT id, name FROM subscribers WHERE unsubscribe_token = %s", (token,))
            row = cur.fetchone()
            if not row:
                return {
                    'statusCode': 404,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Токен не найден'})
                }
            cur.execute("UPDATE subscribers SET is_active = FALSE WHERE unsubscribe_token = %s", (token,))
            conn.commit()
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'ok': True, 'name': row[1]})
            }

        # POST /subscribers — подписаться
        if method == 'POST' and '/send' not in path:
            body = json.loads(event.get('body') or '{}')
            name = body.get('name', '').strip()
            email = body.get('email', '').strip().lower()

            if not name or not email:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Имя и email обязательны'})
                }

            cur.execute("SELECT id FROM subscribers WHERE email = %s", (email,))
            existing = cur.fetchone()
            if existing:
                return {
                    'statusCode': 409,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Этот email уже подписан'})
                }

            cur.execute(
                "INSERT INTO subscribers (name, email) VALUES (%s, %s) RETURNING id",
                (name, email)
            )
            sub_id = cur.fetchone()[0]
            token = make_token(email, sub_id)
            cur.execute("UPDATE subscribers SET unsubscribe_token = %s WHERE id = %s", (token, sub_id))
            conn.commit()

            send_email(email, '🌟 Вы подписались на блог «Рыбка Долли»', welcome_html(name, token))

            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'ok': True, 'message': 'Вы успешно подписались!'})
            }

        # GET /subscribers — список подписчиков (только для админа)
        if method == 'GET':
            correct_password = os.environ.get('ADMIN_PASSWORD', '')
            if admin_password != correct_password:
                return {
                    'statusCode': 403,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Нет доступа'})
                }

            cur.execute("SELECT id, name, email, created_at, is_active FROM subscribers ORDER BY created_at DESC")
            rows = cur.fetchall()
            subscribers = [
                {'id': r[0], 'name': r[1], 'email': r[2], 'created_at': str(r[3]), 'is_active': r[4]}
                for r in rows
            ]
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'subscribers': subscribers, 'total': len(subscribers)})
            }

        # POST /subscribers/send — отправить рассылку (только для админа)
        if method == 'POST' and '/send' in path:
            correct_password = os.environ.get('ADMIN_PASSWORD', '')
            if admin_password != correct_password:
                return {
                    'statusCode': 403,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Нет доступа'})
                }

            body = json.loads(event.get('body') or '{}')
            subject = body.get('subject', '').strip()
            message = body.get('message', '').strip()

            if not subject or not message:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Тема и текст письма обязательны'})
                }

            cur.execute("SELECT name, email, unsubscribe_token FROM subscribers WHERE is_active = TRUE")
            rows = cur.fetchall()

            sent = 0
            errors = 0
            for (name, email, token) in rows:
                try:
                    html = f"""
                    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #fffdf8; border-radius: 16px; overflow: hidden; border: 1px solid #ffe0c0;">
                        <div style="background: linear-gradient(135deg, #fb923c, #f43f5e); padding: 28px; text-align: center;">
                            <div style="font-size: 40px;">☀️</div>
                            <h2 style="color: white; margin: 10px 0 0; font-size: 22px;">{subject}</h2>
                            <p style="color: rgba(255,255,255,0.9); margin: 6px 0 0; font-size: 15px;">Детский центр «Рыбка Долли»</p>
                        </div>
                        <div style="padding: 28px;">
                            <p style="color: #1f2937; font-size: 16px;">Привет, <strong>{name}</strong>! 👋</p>
                            <div style="color: #4b5563; font-size: 15px; line-height: 1.7; white-space: pre-line;">{message}</div>
                            <div style="margin-top: 24px; background: #fff7ed; border-radius: 12px; padding: 16px; text-align: center; color: #9a3412; font-size: 13px;">
                                С теплом, команда «Рыбка Долли» ☀️
                            </div>
                            {unsubscribe_footer(token or '')}
                        </div>
                    </div>
                    """
                    send_email(email, subject, html)
                    sent += 1
                except Exception:
                    errors += 1

            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'ok': True, 'sent': sent, 'errors': errors})
            }

        return {
            'statusCode': 404,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Not found'})
        }

    finally:
        cur.close()
        conn.close()
