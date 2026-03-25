import json
import os
import hashlib
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2  # v2

SCHEMA = 't_p99892216_child_center_blog'
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
    'Access-Control-Max-Age': '86400',
}

TEACHERS = {
    'irina_p_teacher': {'name': 'Ирина Павловна', 'role': 'Учитель начальных классов'},
    'irina_p_manager': {'name': 'Ирина Павловна', 'role': 'Управляющая центром'},
    'irina_v': {'name': 'Ирина Васильевна', 'role': 'Педагог-психолог, воспитатель ясельной группы'},
    'svetlana': {'name': 'Светлана Владимировна', 'role': 'Воспитатель старшей группы, креатив-педагог'},
    'victoria': {'name': 'Виктория Анатольевна', 'role': 'Логопед'},
    'natalia': {'name': 'Наталья Петровна', 'role': 'Учитель продлёнки, учитель английского, педагог-вожатый'},
}


def check_auth(event: dict) -> bool:
    token = (event.get('headers') or {}).get('X-Authorization', '')
    expected = hashlib.sha256(f"{os.environ['ADMIN_PASSWORD']}_solnyshko_secret".encode()).hexdigest()
    return token == expected


def escape(val: str) -> str:
    return str(val).replace("'", "''")


def send_email(subject: str, html: str):
    smtp_password = os.environ['SMTP_PASSWORD']
    from_email = 'ribkadolli@mail.ru'
    to_email = 'ribkadolli@mail.ru'
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = from_email
    msg['To'] = to_email
    msg.attach(MIMEText(html, 'html'))
    with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
        server.login(from_email, smtp_password)
        server.sendmail(from_email, to_email, msg.as_string())


def handler(event: dict, context) -> dict:
    """Управление разделом Спрашивали-Отвечаем: вопросы, ответы, оценки"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    method = event.get('httpMethod', 'GET')

    # GET — список вопросов (публичный, только отвеченные; для админа — все)
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        is_admin = check_auth(event)
        teacher_id = params.get('teacher_id', '')

        where_parts = []
        if not is_admin:
            where_parts.append("answer IS NOT NULL")
        if teacher_id:
            where_parts.append(f"teacher_id = '{escape(teacher_id)}'")

        where = ('WHERE ' + ' AND '.join(where_parts)) if where_parts else ''
        cur.execute(
            f"SELECT id, teacher_id, question, author_name, is_anonymous, answer, answered_at, rating, rating_hidden, created_at "
            f"FROM {SCHEMA}.qa_questions {where} ORDER BY created_at DESC"
        )
        rows = cur.fetchall()
        cur.close(); conn.close()

        questions = []
        for r in rows:
            q = {
                'id': r[0],
                'teacher_id': r[1],
                'teacher': TEACHERS.get(r[1], {}),
                'question': r[2],
                'author_name': r[3] if not r[4] else None,
                'is_anonymous': r[4],
                'answer': r[5],
                'answered_at': r[6].isoformat() if r[6] else None,
                'rating': r[7] if not r[8] else None,
                'rating_hidden': r[8],
                'created_at': r[9].isoformat(),
            }
            if is_admin:
                q['author_name'] = r[3]
                q['rating'] = r[7]
            questions.append(q)

        return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'questions': questions, 'teachers': TEACHERS}, ensure_ascii=False)}

    # POST — задать вопрос (публичный)
    if method == 'POST':
        body = json.loads(event.get('body') or '{}')

        # Оценка ответа — отдельное действие
        if body.get('action') == 'rate':
            q_id = int(body.get('id', 0))
            rating = int(body.get('rating', 0))
            if rating < 1 or rating > 5:
                cur.close(); conn.close()
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Оценка от 1 до 5'})}
            cur.execute(
                f"UPDATE {SCHEMA}.qa_questions SET rating={rating} WHERE id={q_id} AND answer IS NOT NULL AND rating IS NULL"
            )
            conn.commit()
            cur.close(); conn.close()
            return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'},
                    'body': json.dumps({'ok': True})}

        teacher_id = escape(body.get('teacher_id', ''))
        question = escape(body.get('question', '').strip())
        author_name = escape(body.get('author_name', '').strip())
        is_anonymous = bool(body.get('is_anonymous', False))

        if not question or not teacher_id:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Заполните вопрос и выберите педагога'})}

        anon_val = 'true' if is_anonymous else 'false'
        cur.execute(
            f"INSERT INTO {SCHEMA}.qa_questions (teacher_id, question, author_name, is_anonymous) "
            f"VALUES ('{teacher_id}', '{question}', '{author_name}', {anon_val}) RETURNING id, created_at"
        )
        row = cur.fetchone()
        conn.commit()
        cur.close(); conn.close()

        teacher = TEACHERS.get(teacher_id, {})
        author_display = 'Анонимно' if is_anonymous else (author_name or 'Не указан')

        try:
            send_email(
                subject=f'❓ Новый вопрос педагогу — {teacher.get("name", "")}',
                html=f"""
                <div style="font-family:Arial,sans-serif;max-width:500px;background:#fffdf8;border-radius:16px;border:1px solid #ffe0c0;overflow:hidden">
                    <div style="background:linear-gradient(135deg,#fb923c,#f43f5e);padding:24px;text-align:center">
                        <div style="font-size:36px">❓</div>
                        <h2 style="color:white;margin:8px 0 0">Новый вопрос в разделе «Спрашивали — Отвечаем»</h2>
                    </div>
                    <div style="padding:24px">
                        <p><b>Педагог:</b> {teacher.get('name','')} — {teacher.get('role','')}</p>
                        <p><b>Автор:</b> {author_display}</p>
                        <div style="background:#fff7ed;border-radius:12px;padding:16px;margin-top:12px">
                            <b>Вопрос:</b><br>{body.get('question','')}
                        </div>
                        <p style="margin-top:16px;color:#9ca3af;font-size:13px">Ответьте в панели администратора сайта</p>
                    </div>
                </div>
                """
            )
        except Exception:
            pass

        return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True, 'id': row[0]}, ensure_ascii=False)}

    # PUT — ответить на вопрос (только админ)
    if method == 'PUT':
        if not check_auth(event):
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Unauthorized'})}
        body = json.loads(event.get('body') or '{}')

        # Скрыть/показать оценку
        if body.get('action') == 'toggle_rating':
            q_id = int(body.get('id', 0))
            hidden = bool(body.get('hidden', True))
            hidden_val = 'true' if hidden else 'false'
            cur.execute(f"UPDATE {SCHEMA}.qa_questions SET rating_hidden={hidden_val} WHERE id={q_id}")
            conn.commit()
            cur.close(); conn.close()
            return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'},
                    'body': json.dumps({'ok': True})}

        q_id = int(body.get('id', 0))
        answer = escape(body.get('answer', '').strip())
        if not answer:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Введите ответ'})}

        cur.execute(
            f"UPDATE {SCHEMA}.qa_questions SET answer='{answer}', answered_at=NOW() WHERE id={q_id}"
        )
        conn.commit()
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True})}

    # DELETE — удалить вопрос (только админ)
    if method == 'DELETE':
        if not check_auth(event):
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Unauthorized'})}
        body = json.loads(event.get('body') or '{}')
        q_id = int(body.get('id', 0))
        cur.execute(f"DELETE FROM {SCHEMA}.qa_questions WHERE id={q_id}")
        conn.commit()
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True})}

    cur.close(); conn.close()
    return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}