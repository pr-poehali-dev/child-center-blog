import json
import os
import base64
import uuid
import hashlib
import psycopg2
import boto3


SCHEMA = 't_p99892216_child_center_blog'
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
    'Access-Control-Max-Age': '86400',
}


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
        category = params.get('category')
        if category and category != 'all':
            cat_escaped = escape(category)
            cur.execute(
                f"SELECT id, category, title, content, media, created_at, teacher_photo, teacher_name FROM {SCHEMA}.blog_posts WHERE category = '{cat_escaped}' ORDER BY created_at DESC"
            )
        else:
            cur.execute(
                f"SELECT id, category, title, content, media, created_at, teacher_photo, teacher_name FROM {SCHEMA}.blog_posts ORDER BY created_at DESC"
            )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        posts = [
            {
                'id': r[0],
                'category': r[1],
                'title': r[2],
                'content': r[3],
                'media': r[4],
                'created_at': r[5].isoformat(),
                'teacher_photo': r[6],
                'teacher_name': r[7] or '',
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
            f"INSERT INTO {SCHEMA}.blog_posts (category, title, content, media, teacher_photo, teacher_name) VALUES ('{category}', '{title}', '{content}', '{media_json}', '{teacher_photo_escaped}', '{teacher_name}') RETURNING id, created_at"
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
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
            f"UPDATE {SCHEMA}.blog_posts SET category='{category}', title='{title}', content='{content}', media='{media_json}', teacher_photo='{teacher_photo_escaped}', teacher_name='{teacher_name}' WHERE id={post_id}"
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