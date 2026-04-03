import json
import os
import base64
import uuid
import hashlib
import psycopg2
import boto3
import urllib.request
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SCHEMA = 't_p99892216_child_center_blog'
BASE_URL = 'https://blogribkadolli.ru'
YANDEX_USER_ID = '1462613238'
YANDEX_HOST_ID = 'http:blogribkadolli.ru:80'
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
    'Access-Control-Max-Age': '86400',
}


CATEGORY_LABELS = {
    'tips': 'Советы от педагога',
    'life': 'Наша жизнь на ладони',
    'detail': 'Подробно о важном',
    'summer': 'Лето с нами',
    'afterschool': 'Группа продлённого дня',
    'english': 'Группа английского языка',
    'experiments': 'Экспериментаторы',
    'chefs': 'Шеф-повара',
    'masters': 'Мастера вдохновения',
}


def notify_subscribers(post_id: int, title: str, content: str, category: str, teacher_name: str):
    """Отправляет письма всем подписчикам о новом посте"""
    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    if not smtp_password:
        return
    from_email = 'ribkadolli@mail.ru'
    cat_label = CATEGORY_LABELS.get(category, category)
    preview = content[:200].replace("'", "") + ('...' if len(content) > 200 else '')
    post_url = f'{BASE_URL}/blog/{post_id}'

    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute("SELECT name, email FROM subscribers WHERE is_active = TRUE")
        rows = cur.fetchall()
        cur.close()
        conn.close()
    except Exception:
        return

    for (name, email) in rows:
        try:
            html = f"""
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #fffdf8; border-radius: 16px; overflow: hidden; border: 1px solid #ffe0c0;">
                <div style="background: linear-gradient(135deg, #fb923c, #f43f5e); padding: 28px; text-align: center;">
                    <div style="font-size: 40px;">📖</div>
                    <h2 style="color: white; margin: 10px 0 0; font-size: 20px;">Новая статья в блоге!</h2>
                    <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 13px;">Детский центр «Рыбка Долли»</p>
                </div>
                <div style="padding: 28px;">
                    <p style="color: #1f2937; font-size: 15px; margin: 0 0 12px;">Привет, <strong>{name}</strong>! 👋</p>
                    <div style="background: #fff7ed; border-left: 4px solid #fb923c; border-radius: 0 12px 12px 0; padding: 12px 16px; margin-bottom: 16px;">
                        <div style="color: #9a3412; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">{cat_label}</div>
                    </div>
                    <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 10px; line-height: 1.3;">{title}</h3>
                    {"<p style='color: #6b7280; font-size: 13px; margin: 0 0 16px; line-height: 1.6;'>Автор: " + teacher_name + "</p>" if teacher_name else ""}
                    <p style="color: #4b5563; font-size: 14px; line-height: 1.7; margin: 0 0 20px;">{preview}</p>
                    <a href="{post_url}" style="display: inline-block; background: linear-gradient(135deg, #fb923c, #f43f5e); color: white; font-weight: bold; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-size: 14px;">Читать статью →</a>
                    <div style="margin-top: 24px; color: #9ca3af; font-size: 12px; text-align: center;">
                        С теплом, команда «Рыбка Долли» ☀️
                    </div>
                </div>
            </div>
            """
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f'📖 Новая статья: {title}'
            msg['From'] = from_email
            msg['To'] = email
            msg.attach(MIMEText(html, 'html'))
            with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
                server.login(from_email, smtp_password)
                server.sendmail(from_email, email, msg.as_string())
        except Exception:
            pass


def ping_yandex(post_id: int):
    token = os.environ.get('YANDEX_WEBMASTER_TOKEN', '')
    if not token:
        return
    url = f'https://api.webmaster.yandex.net/v4/user/{YANDEX_USER_ID}/hosts/{YANDEX_HOST_ID}/reindex/tasks'
    data = json.dumps({'data': [{'url': f'{BASE_URL}/blog/{post_id}'}]}).encode('utf-8')
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('Authorization', f'OAuth {token}')
    req.add_header('Content-Type', 'application/json')
    try:
        urllib.request.urlopen(req, timeout=5)
    except Exception:
        pass


def check_auth(event: dict) -> bool:
    token = (event.get('headers') or {}).get('X-Authorization', '')
    expected = hashlib.sha256(f"{os.environ['ADMIN_PASSWORD']}_solnyshko_secret".encode()).hexdigest()
    return token == expected


def get_s3():
    return boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )


def upload_media(s3, data_url: str) -> str:
    """Загружает base64 media в S3 и возвращает CDN URL"""
    if data_url.startswith('http'):
        return data_url
    header, b64data = data_url.split(',', 1)
    content_type = header.split(';')[0].split(':')[1]
    ext = content_type.split('/')[-1]
    if ext == 'jpeg':
        ext = 'jpg'
    key = f'blog/{uuid.uuid4()}.{ext}'
    raw = base64.b64decode(b64data)
    s3.put_object(Bucket='files', Key=key, Body=raw, ContentType=content_type)
    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
    return cdn_url


def escape(val: str) -> str:
    return val.replace("'", "''")


def handler(event: dict, context) -> dict:
    """Управление постами блога: GET — список, POST — создать, DELETE — удалить"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    method = event.get('httpMethod', 'GET')

    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        post_id = params.get('id')
        category = params.get('category')

        if post_id:
            cur.execute(
                f"SELECT id, category, title, content, media, created_at, teacher_photo, teacher_name, sticker FROM {SCHEMA}.blog_posts WHERE id = {int(post_id)}"
            )
            row = cur.fetchone()
            cur.close()
            conn.close()
            if not row:
                return {'statusCode': 404, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': 'Not found'})}
            post = {
                'id': row[0], 'category': row[1], 'title': row[2], 'content': row[3],
                'media': row[4], 'created_at': row[5].isoformat(),
                'teacher_photo': row[6], 'teacher_name': row[7] or '',
                'sticker': row[8] or '',
            }
            return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'post': post}, ensure_ascii=False)}

        if category and category != 'all':
            cat_escaped = escape(category)
            cur.execute(
                f"SELECT id, category, title, content, media, created_at, teacher_photo, teacher_name, sticker FROM {SCHEMA}.blog_posts WHERE category = '{cat_escaped}' ORDER BY created_at DESC"
            )
        else:
            cur.execute(
                f"SELECT id, category, title, content, media, created_at, teacher_photo, teacher_name, sticker FROM {SCHEMA}.blog_posts ORDER BY created_at DESC"
            )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        posts = [
            {
                'id': r[0], 'category': r[1], 'title': r[2], 'content': r[3],
                'media': r[4], 'created_at': r[5].isoformat(),
                'teacher_photo': r[6], 'teacher_name': r[7] or '',
                'sticker': r[8] or '',
            }
            for r in rows
        ]
        return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'posts': posts}, ensure_ascii=False)}

    if method == 'POST':
        if not check_auth(event):
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Unauthorized'})}
        body = json.loads(event.get('body') or '{}')
        category = escape(body.get('category', ''))
        title = escape(body.get('title', ''))
        content = escape(body.get('content', ''))
        media_list = body.get('media', [])
        teacher_photo_data = body.get('teacher_photo', '')
        teacher_name = escape(body.get('teacher_name', ''))
        sticker = escape(body.get('sticker', ''))

        s3 = get_s3()
        uploaded = []
        for item in media_list:
            url = item.get('url', '')
            mtype = item.get('type', 'image')
            if url.startswith('data:'):
                url = upload_media(s3, url)
            uploaded.append({'type': mtype, 'url': url})

        teacher_photo_url = ''
        if teacher_photo_data.startswith('data:'):
            teacher_photo_url = upload_media(s3, teacher_photo_data)
        elif teacher_photo_data.startswith('http'):
            teacher_photo_url = teacher_photo_data

        media_json = escape(json.dumps(uploaded, ensure_ascii=False))
        teacher_photo_escaped = escape(teacher_photo_url)

        cur.execute(
            f"INSERT INTO {SCHEMA}.blog_posts (category, title, content, media, teacher_photo, teacher_name, sticker) VALUES ('{category}', '{title}', '{content}', '{media_json}', '{teacher_photo_escaped}', '{teacher_name}', '{sticker}') RETURNING id, created_at"
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        ping_yandex(row[0])
        notify_subscribers(row[0], body.get('title', ''), body.get('content', ''), body.get('category', ''), body.get('teacher_name', ''))
        return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'ok': True, 'id': row[0], 'created_at': row[1].isoformat()})}

    if method == 'PUT':
        if not check_auth(event):
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Unauthorized'})}
        body = json.loads(event.get('body') or '{}')
        post_id = int(body.get('id', 0))
        category = escape(body.get('category', ''))
        title = escape(body.get('title', ''))
        content = escape(body.get('content', ''))
        media_list = body.get('media', [])
        teacher_photo_data = body.get('teacher_photo', '')
        teacher_name = escape(body.get('teacher_name', ''))
        sticker = escape(body.get('sticker', ''))

        s3 = get_s3()
        uploaded = []
        for item in media_list:
            url = item.get('url', '')
            mtype = item.get('type', 'image')
            if url.startswith('data:'):
                url = upload_media(s3, url)
            uploaded.append({'type': mtype, 'url': url})

        teacher_photo_url = ''
        if teacher_photo_data.startswith('data:'):
            teacher_photo_url = upload_media(s3, teacher_photo_data)
        elif teacher_photo_data.startswith('http'):
            teacher_photo_url = teacher_photo_data

        media_json = escape(json.dumps(uploaded, ensure_ascii=False))
        teacher_photo_escaped = escape(teacher_photo_url)

        cur.execute(
            f"UPDATE {SCHEMA}.blog_posts SET category='{category}', title='{title}', content='{content}', media='{media_json}', teacher_photo='{teacher_photo_escaped}', teacher_name='{teacher_name}', sticker='{sticker}' WHERE id={post_id}"
        )
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'ok': True})}

    if method == 'DELETE':
        if not check_auth(event):
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Unauthorized'})}
        body = json.loads(event.get('body') or '{}')
        post_id = int(body.get('id', 0))
        cur.execute(f"DELETE FROM {SCHEMA}.blog_posts WHERE id = {post_id}")
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'ok': True})}

    cur.close()
    conn.close()
    return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}