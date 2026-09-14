import json
import os
import time
import psycopg2

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_client_ip(event: dict) -> str:
    headers = event.get("headers") or {}
    xff = headers.get("X-Forwarded-For") or headers.get("x-forwarded-for") or ""
    if xff:
        return xff.split(",")[0].strip()
    return (event.get("requestContext") or {}).get("identity", {}).get("sourceIp", "") or ""

def handler(event: dict, context) -> dict:
    """Управление отзывами: GET — публичные, POST — добавить, PATCH — одобрить/удалить (админ)"""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Authorization",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    method = event.get("httpMethod", "GET")

    if method == "GET":
        params = event.get("queryStringParameters") or {}
        admin_token = (event.get("headers") or {}).get("X-Authorization", "")
        is_admin = admin_token == os.environ.get("ADMIN_PASSWORD", "")

        conn = get_conn()
        cur = conn.cursor()
        if is_admin:
            cur.execute("SELECT id, name, child, text, stars, approved, created_at FROM reviews ORDER BY created_at DESC")
        else:
            cur.execute("SELECT id, name, child, text, stars, approved, created_at FROM reviews WHERE approved = TRUE ORDER BY created_at DESC")
        rows = cur.fetchall()
        conn.close()

        reviews = [
            {"id": r[0], "name": r[1], "child": r[2], "text": r[3], "stars": r[4], "approved": r[5], "created_at": r[6].isoformat()}
            for r in rows
        ]
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"reviews": reviews})}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        name = (body.get("name") or "").strip()
        child = (body.get("child") or "").strip()
        text = (body.get("text") or "").strip()
        stars = int(body.get("stars") or 5)

        # Антиспам: поле-ловушка — если заполнено, молча делаем вид что всё ок
        if (body.get("company") or "").strip():
            return {"statusCode": 201, "headers": cors, "body": json.dumps({"id": 0})}

        # Антиспам: форма отправлена слишком быстро после загрузки страницы
        form_loaded_at = body.get("form_loaded_at")
        if isinstance(form_loaded_at, (int, float)) and (time.time() * 1000 - form_loaded_at) < 5000:
            return {"statusCode": 201, "headers": cors, "body": json.dumps({"id": 0})}

        if not name or not text:
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "name and text required"})}
        if not (1 <= stars <= 5):
            stars = 5

        conn = get_conn()
        cur = conn.cursor()

        # Антиспам: не более одного отзыва с одного IP за 24 часа
        client_ip = get_client_ip(event)
        if client_ip:
            cur.execute(
                "SELECT id FROM reviews WHERE ip_address = %s AND created_at > NOW() - INTERVAL '24 hours' LIMIT 1",
                (client_ip,)
            )
            if cur.fetchone():
                conn.close()
                return {"statusCode": 201, "headers": cors, "body": json.dumps({"id": 0})}

        cur.execute(
            "INSERT INTO reviews (name, child, text, stars, ip_address) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (name, child or None, text, stars, client_ip or None)
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return {"statusCode": 201, "headers": cors, "body": json.dumps({"id": new_id})}

    if method == "PATCH":
        admin_token = (event.get("headers") or {}).get("X-Authorization", "")
        if admin_token != os.environ.get("ADMIN_PASSWORD", ""):
            return {"statusCode": 403, "headers": cors, "body": json.dumps({"error": "forbidden"})}

        body = json.loads(event.get("body") or "{}")
        review_id = body.get("id")
        action = body.get("action")

        conn = get_conn()
        cur = conn.cursor()
        if action == "approve":
            cur.execute("UPDATE reviews SET approved = TRUE WHERE id = %s", (review_id,))
        elif action == "reject":
            cur.execute("DELETE FROM reviews WHERE id = %s", (review_id,))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True})}

    return {"statusCode": 405, "headers": cors, "body": json.dumps({"error": "method not allowed"})}