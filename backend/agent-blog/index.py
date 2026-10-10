import json
import os
import hmac
import re
import psycopg2

SCHEMA = 't_p99892216_child_center_blog'
ADMIN_BASE_URL = 'https://blogribkadolli.ru'
ALLOWED_CATEGORIES = ('tips', 'afterschool', 'life', 'plate')
SLUG_RE = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Api-Key',
    'Access-Control-Max-Age': '86400',
}
JSON_HEADERS = {**CORS, 'Content-Type': 'application/json'}


def resp(status: int, data: dict) -> dict:
    return {'statusCode': status, 'headers': JSON_HEADERS, 'body': json.dumps(data, ensure_ascii=False)}


def get_header(event: dict, name: str) -> str:
    for k, v in (event.get('headers') or {}).items():
        if k.lower() == name.lower():
            return v or ''
    return ''


def is_authorized(event: dict) -> bool:
    expected = os.environ.get('AGENT_BLOG_API_KEY', '')
    given = get_header(event, 'X-Api-Key')
    if not expected or not given:
        return False
    return hmac.compare_digest(given.encode('utf-8'), expected.encode('utf-8'))


def clean_str(value) -> str:
    return value.strip() if isinstance(value, str) else ''


def is_url(value: str) -> bool:
    return value.startswith('http://') or value.startswith('https://')


def build_media_item(raw, field: str):
    """Возвращает (элемент медиа, ошибка)."""
    if not isinstance(raw, dict):
        return None, f'{field}: ожидается объект с полями url, caption, alt'
    url = clean_str(raw.get('url'))
    if not url or not is_url(url):
        return None, f'{field}.url: нужна ссылка, начинающаяся с http:// или https://'
    item = {'type': 'image', 'url': url}
    alt = clean_str(raw.get('alt'))
    caption = clean_str(raw.get('caption'))
    if alt:
        item['alt'] = alt
    if caption:
        item['caption'] = caption
    return item, ''


def list_authors() -> dict:
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        f"SELECT teacher_name, teacher_photo FROM {SCHEMA}.blog_posts "
        f"WHERE teacher_name IS NOT NULL AND teacher_name <> '' ORDER BY created_at DESC"
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()
    authors = {}
    for name, photo in rows:
        name = name.strip()
        if not name:
            continue
        if name not in authors:
            authors[name] = photo or ''
        elif not authors[name] and photo:
            authors[name] = photo
    return {'authors': [{'name': n, 'photo': p} for n, p in authors.items()]}


def create_draft(event: dict) -> dict:
    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return resp(400, {'error': 'Тело запроса должно быть корректным JSON'})
    if not isinstance(body, dict):
        return resp(400, {'error': 'Тело запроса должно быть JSON-объектом'})

    title = clean_str(body.get('title'))
    content = clean_str(body.get('content'))
    category = clean_str(body.get('category'))
    slug = clean_str(body.get('slug'))
    seo_title = clean_str(body.get('seo_title'))
    seo_description = clean_str(body.get('seo_description'))
    author_name = clean_str(body.get('author_name'))
    author_photo = clean_str(body.get('author_photo'))

    if not title:
        return resp(400, {'error': 'Поле title обязательно'})
    if not content:
        return resp(400, {'error': 'Поле content обязательно'})
    if category not in ALLOWED_CATEGORIES:
        return resp(400, {'error': f'Поле category должно быть одним из: {", ".join(ALLOWED_CATEGORIES)}'})
    if not slug:
        return resp(400, {'error': 'Поле slug обязательно'})
    if not SLUG_RE.match(slug):
        return resp(400, {'error': 'slug: только строчная латиница, цифры и дефисы, например "kak-vybrat-shkolu"'})

    limits = {'title': (title, 500), 'slug': (slug, 255), 'seo_title': (seo_title, 255),
              'seo_description': (seo_description, 500), 'author_name': (author_name, 255)}
    for field, (value, limit) in limits.items():
        if len(value) > limit:
            return resp(400, {'error': f'Поле {field} слишком длинное: {len(value)} символов, максимум {limit}'})

    if author_photo and not is_url(author_photo):
        return resp(400, {'error': 'author_photo: нужна ссылка, начинающаяся с http:// или https://'})

    media = []
    cover = body.get('cover')
    if cover:
        item, err = build_media_item(cover, 'cover')
        if err:
            return resp(400, {'error': err})
        media.append(item)

    images = body.get('images') or []
    if not isinstance(images, list):
        return resp(400, {'error': 'Поле images должно быть списком'})
    for i, raw in enumerate(images):
        item, err = build_media_item(raw, f'images[{i}]')
        if err:
            return resp(400, {'error': err})
        media.append(item)

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(f"SELECT 1 FROM {SCHEMA}.blog_posts WHERE slug = %s", (slug,))
    if cur.fetchone():
        cur.close()
        conn.close()
        return resp(409, {'error': 'Такой slug уже занят другой статьёй', 'slug': slug})

    try:
        cur.execute(
            f"INSERT INTO {SCHEMA}.blog_posts "
            f"(category, title, content, media, teacher_photo, teacher_name, slug, seo_title, seo_description, status) "
            f"VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'draft') RETURNING id",
            (category, title, content, json.dumps(media, ensure_ascii=False), author_photo, author_name,
             slug, seo_title, seo_description),
        )
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        cur.close()
        conn.close()
        return resp(409, {'error': 'Такой slug уже занят другой статьёй', 'slug': slug})
    post_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return resp(200, {
        'id': post_id,
        'slug': slug,
        'status': 'draft',
        'admin_url': f'{ADMIN_BASE_URL}/admin?post={post_id}',
    })


def handler(event: dict, context) -> dict:
    """Приём статей от ИИ-агента (POST, всегда черновик) и список авторов (GET). Доступ по заголовку X-Api-Key."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    if not is_authorized(event):
        return resp(401, {'error': 'Unauthorized'})

    method = event.get('httpMethod', 'GET')
    if method == 'POST':
        return create_draft(event)
    if method == 'GET':
        return resp(200, list_authors())
    return resp(405, {'error': 'Method not allowed'})
