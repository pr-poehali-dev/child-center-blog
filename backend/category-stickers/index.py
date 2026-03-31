import json
import os
import hashlib
import psycopg2

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


def escape(val: str) -> str:
    return val.replace("'", "''")


def handler(event: dict, context) -> dict:
    """Управление стикерами для категорий блога: GET — получить все, PUT — сохранить стикер для категории, DELETE — удалить стикер"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    if method == 'GET':
        cur.execute(f"SELECT category_id, sticker_text FROM {SCHEMA}.category_stickers WHERE sticker_text != ''")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        stickers = {row[0]: row[1] for row in rows}
        return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'stickers': stickers}, ensure_ascii=False)}

    if method == 'PUT':
        if not check_auth(event):
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Unauthorized'})}
        body = json.loads(event.get('body') or '{}')
        category_id = escape(body.get('category_id', ''))
        sticker_text = escape(body.get('sticker_text', ''))
        if not category_id:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'category_id required'})}
        cur.execute(
            f"INSERT INTO {SCHEMA}.category_stickers (category_id, sticker_text, updated_at) VALUES ('{category_id}', '{sticker_text}', NOW()) "
            f"ON CONFLICT (category_id) DO UPDATE SET sticker_text = '{sticker_text}', updated_at = NOW()"
        )
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'ok': True}, ensure_ascii=False)}

    if method == 'DELETE':
        if not check_auth(event):
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Unauthorized'})}
        body = json.loads(event.get('body') or '{}')
        category_id = escape(body.get('category_id', ''))
        cur.execute(f"UPDATE {SCHEMA}.category_stickers SET sticker_text = '', updated_at = NOW() WHERE category_id = '{category_id}'")
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'ok': True})}

    cur.close()
    conn.close()
    return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}
