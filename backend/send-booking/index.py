import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2


def handler(event: dict, context) -> dict:
    """Сохраняет заявку в БД и отправляет письмо на почту детского центра"""

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
    name = body.get('name', '')
    phone = body.get('phone', '')
    child = body.get('child', '')
    cls = body.get('cls', '')

    # Сохраняем в БД
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO bookings (name, phone, child, cls) VALUES (%s, %s, %s, %s)",
        (name, phone, child, cls)
    )
    conn.commit()
    cur.close()
    conn.close()

    smtp_password = os.environ['SMTP_PASSWORD']
    from_email = 'ribkadolli@mail.ru'
    to_email = 'ribkadolli@mail.ru'

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'🌟 Новая заявка на запись — {cls or "не указано"}'
    msg['From'] = from_email
    msg['To'] = to_email

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #fffdf8; border-radius: 16px; overflow: hidden; border: 1px solid #ffe0c0;">
        <div style="background: linear-gradient(135deg, #fb923c, #f43f5e); padding: 24px; text-align: center;">
            <div style="font-size: 36px;">🌟</div>
            <h2 style="color: white; margin: 8px 0 0; font-size: 20px;">Новая заявка на занятие</h2>
            <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 14px;">Детский центр «Солнышко»</p>
        </div>
        <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #ffe8d6; color: #9ca3af; font-size: 13px; width: 40%;">Родитель</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #ffe8d6; color: #1f2937; font-weight: bold;">{name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #ffe8d6; color: #9ca3af; font-size: 13px;">Телефон</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #ffe8d6; color: #1f2937; font-weight: bold;">{phone}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #ffe8d6; color: #9ca3af; font-size: 13px;">Ребёнок</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #ffe8d6; color: #1f2937; font-weight: bold;">{child}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; color: #9ca3af; font-size: 13px;">Занятие</td>
                    <td style="padding: 10px 0; color: #fb923c; font-weight: bold;">{cls or 'Не выбрано'}</td>
                </tr>
            </table>
            <div style="margin-top: 20px; background: #fff7ed; border-radius: 12px; padding: 16px; text-align: center; color: #9a3412; font-size: 13px;">
                Свяжитесь с родителем как можно скорее 📞
            </div>
        </div>
    </div>
    """

    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
        server.login(from_email, smtp_password)
        server.sendmail(from_email, to_email, msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }