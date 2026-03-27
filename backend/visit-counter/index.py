import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Счётчик посещений сайта. GET — вернуть число, POST — увеличить и вернуть."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    method = event.get('httpMethod', 'GET')

    if method == 'POST':
        cur.execute("UPDATE visit_counter SET total_visits = total_visits + 1 WHERE id = 1 RETURNING total_visits")
        total = cur.fetchone()[0]
        conn.commit()
    else:
        cur.execute("SELECT total_visits FROM visit_counter WHERE id = 1")
        total = cur.fetchone()[0]

    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'total': total})
    }
