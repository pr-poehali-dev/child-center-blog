import json
import os
import hashlib
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    'Access-Control-Max-Age': '86400',
}


def check_admin(event: dict) -> bool:
    password = (event.get('headers') or {}).get('X-Admin-Password', '')
    return password == os.environ.get('ADMIN_PASSWORD', '')


def handler(event: dict, context) -> dict:
    """Управление чек-листами рецептов «Тарелка для всех»: список, проверка подписки, CRUD для админа"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    # GET /plate-checklists?email=... — проверить подписку и вернуть чеклисты
    if method == 'GET' and params.get('email'):
        email = params['email'].strip().lower()
        cur.execute(
            "SELECT id FROM subscribers WHERE email = %s AND is_active = TRUE",
            (email,)
        )
        is_subscribed = cur.fetchone() is not None

        if not is_subscribed:
            cur.close()
            conn.close()
            return {
                'statusCode': 403,
                'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'not_subscribed'})
            }

        cur.execute(
            "SELECT id, title, description, pdf_url, cover_emoji FROM plate_checklists WHERE is_active = TRUE ORDER BY sort_order ASC, created_at ASC"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        checklists = [
            {'id': r[0], 'title': r[1], 'description': r[2] or '', 'pdf_url': r[3], 'cover_emoji': r[4] or '🥗'}
            for r in rows
        ]
        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'checklists': checklists}, ensure_ascii=False)
        }

    # GET /plate-checklists — список для админа
    if method == 'GET':
        if not check_admin(event):
            cur.close()
            conn.close()
            return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Нет доступа'})}
        cur.execute(
            "SELECT id, title, description, pdf_url, cover_emoji, sort_order, is_active, created_at FROM plate_checklists ORDER BY sort_order ASC, created_at ASC"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        checklists = [
            {'id': r[0], 'title': r[1], 'description': r[2] or '', 'pdf_url': r[3],
             'cover_emoji': r[4] or '🥗', 'sort_order': r[5], 'is_active': r[6], 'created_at': str(r[7])}
            for r in rows
        ]
        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'checklists': checklists}, ensure_ascii=False)
        }

    # POST — создать чеклист (только для админа)
    if method == 'POST':
        if not check_admin(event):
            cur.close()
            conn.close()
            return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Нет доступа'})}
        body = json.loads(event.get('body') or '{}')
        title = body.get('title', '').strip()
        description = body.get('description', '').strip()
        pdf_url = body.get('pdf_url', '').strip()
        cover_emoji = body.get('cover_emoji', '🥗').strip()
        sort_order = int(body.get('sort_order', 0))

        if not title or not pdf_url:
            cur.close()
            conn.close()
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Название и ссылка обязательны'})}

        cur.execute(
            "INSERT INTO plate_checklists (title, description, pdf_url, cover_emoji, sort_order) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (title, description, pdf_url, cover_emoji, sort_order)
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True, 'id': new_id})
        }

    # PUT — обновить чеклист (только для админа)
    if method == 'PUT':
        if not check_admin(event):
            cur.close()
            conn.close()
            return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Нет доступа'})}
        body = json.loads(event.get('body') or '{}')
        item_id = int(body.get('id', 0))
        title = body.get('title', '').strip()
        description = body.get('description', '').strip()
        pdf_url = body.get('pdf_url', '').strip()
        cover_emoji = body.get('cover_emoji', '🥗').strip()
        sort_order = int(body.get('sort_order', 0))
        is_active = bool(body.get('is_active', True))

        cur.execute(
            "UPDATE plate_checklists SET title=%s, description=%s, pdf_url=%s, cover_emoji=%s, sort_order=%s, is_active=%s WHERE id=%s",
            (title, description, pdf_url, cover_emoji, sort_order, is_active, item_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    # DELETE — удалить чеклист (только для админа)
    if method == 'DELETE':
        if not check_admin(event):
            cur.close()
            conn.close()
            return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Нет доступа'})}
        body = json.loads(event.get('body') or '{}')
        item_id = int(body.get('id', 0))
        cur.execute("DELETE FROM plate_checklists WHERE id=%s", (item_id,))
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    cur.close()
    conn.close()
    return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}
