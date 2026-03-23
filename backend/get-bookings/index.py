import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Возвращает список всех заявок или обновляет статус заявки"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    if event.get('httpMethod') == 'POST':
        body = json.loads(event.get('body') or '{}')
        booking_id = body.get('id')
        status = body.get('status')
        cur.execute(
            "UPDATE bookings SET status = %s WHERE id = %s",
            (status, booking_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'ok': True})
        }

    cur.execute(
        "SELECT id, name, phone, child, cls, status, created_at FROM bookings ORDER BY created_at DESC"
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    bookings = [
        {
            'id': r[0],
            'name': r[1],
            'phone': r[2],
            'child': r[3],
            'cls': r[4],
            'status': r[5],
            'created_at': r[6].isoformat(),
        }
        for r in rows
    ]

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'bookings': bookings}, ensure_ascii=False)
    }
