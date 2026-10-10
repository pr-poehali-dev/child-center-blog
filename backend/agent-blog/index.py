import json
import os
import hmac
import re
import hashlib
import urllib.request
import urllib.error
import psycopg2

SCHEMA = 't_p99892216_child_center_blog'
ADMIN_BASE_URL = 'https://blogribkadolli.ru'
PUBLIC_BASE_URL = 'https://blogribkadolli.ru'
BLOG_API_URL = 'https://functions.poehali.dev/d84b54ca-2906-4a84-be8b-264f6d13e325'
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


def public_url(post_id: int, slug) -> str:
    return f'{PUBLIC_BASE_URL}/blog/{slug or post_id}'


def media_to_cover_images(media) -> tuple:
    if isinstance(media, str):
        try:
            media = json.loads(media)
        except Exception:
            media = []
    items = []
    for m in media or []:
        if isinstance(m, dict) and m.get('type') == 'image' and m.get('url'):
            items.append({'url': m['url'], 'caption': m.get('caption') or '', 'alt': m.get('alt') or ''})
    cover = items[0] if items else None
    return cover, items[1:]


def get_article(post_id: int) -> dict:
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        f"SELECT id, title, content, category, slug, seo_title, seo_description, teacher_name, teacher_photo, media, status "
        f"FROM {SCHEMA}.blog_posts WHERE id = {int(post_id)}"
    )
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row:
        return resp(404, {'error': 'Статья не найдена'})
    cover, images = media_to_cover_images(row[9])
    return resp(200, {
        'id': row[0],
        'title': row[1],
        'content': row[2],
        'category': row[3],
        'slug': row[4] or '',
        'seo_title': row[5] or '',
        'seo_description': row[6] or '',
        'author_name': row[7] or '',
        'author_photo': row[8] or '',
        'cover': cover,
        'images': images,
        'status': row[10],
        'public_url': public_url(row[0], row[4]),
    })


def get_statuses(ids_raw: str) -> dict:
    ids = []
    for part in ids_raw.split(','):
        part = part.strip()
        if not part:
            continue
        if not part.isdigit():
            return resp(400, {'error': 'ids: нужен список чисел через запятую, например 73,74'})
        ids.append(int(part))
    if not ids:
        return resp(400, {'error': 'ids: список пуст'})
    if len(ids) > 100:
        return resp(400, {'error': 'ids: не больше 100 значений за раз'})
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(f"SELECT id, status, slug FROM {SCHEMA}.blog_posts WHERE id IN ({','.join(str(i) for i in ids)})")
    rows = {r[0]: r for r in cur.fetchall()}
    cur.close()
    conn.close()
    items = [
        {'id': i, 'status': rows[i][1], 'public_url': public_url(i, rows[i][2])}
        for i in ids if i in rows
    ]
    return resp(200, {'items': items})


def publish_article(body: dict) -> dict:
    raw_id = body.get('id')
    if isinstance(raw_id, bool) or not isinstance(raw_id, (int, str)) or not str(raw_id).isdigit():
        return resp(400, {'error': 'Поле id обязательно и должно быть числом'})
    post_id = int(raw_id)

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        f"SELECT id, category, title, content, media, teacher_photo, teacher_name, sticker, checklist_url, cta_text, cta_url, "
        f"recipe_time, recipe_servings, recipe_calories, recipe_proteins, recipe_fats, recipe_carbs, recipe_ingredients, recipe_steps, "
        f"slug, seo_title, seo_description, status FROM {SCHEMA}.blog_posts WHERE id = {post_id}"
    )
    r = cur.fetchone()
    cur.close()
    conn.close()
    if not r:
        return resp(404, {'error': 'Статья не найдена'})
    url = public_url(r[0], r[19])
    if r[22] == 'published':
        return resp(200, {'ok': True, 'public_url': url})

    payload = {
        'id': r[0], 'category': r[1], 'title': r[2], 'content': r[3], 'media': r[4] or [],
        'teacher_photo': r[5] or '', 'teacher_name': r[6] or '', 'sticker': r[7] or '',
        'checklist_url': r[8] or '', 'cta_text': r[9] or '', 'cta_url': r[10] or '',
        'recipe_time': r[11] or '', 'recipe_servings': r[12] or '', 'recipe_calories': r[13] or '',
        'recipe_proteins': r[14] or '', 'recipe_fats': r[15] or '', 'recipe_carbs': r[16] or '',
        'recipe_ingredients': r[17] or '', 'recipe_steps': r[18] or '',
        'slug': r[19] or '', 'seo_title': r[20] or '', 'seo_description': r[21] or '',
        'status': 'published',
    }
    admin_token = hashlib.sha256(f"{os.environ['ADMIN_PASSWORD']}_solnyshko_secret".encode()).hexdigest()
    req = urllib.request.Request(
        BLOG_API_URL,
        data=json.dumps(payload, ensure_ascii=False).encode('utf-8'),
        method='PUT',
        headers={'Content-Type': 'application/json', 'X-Authorization': admin_token},
    )
    try:
        urllib.request.urlopen(req, timeout=4)
    except urllib.error.HTTPError as e:
        if e.code == 409:
            return resp(409, {'error': 'Такой slug уже занят другой статьёй'})
        return resp(502, {'error': 'Не удалось опубликовать статью'})
    except Exception:
        pass

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(f"SELECT status FROM {SCHEMA}.blog_posts WHERE id = {post_id}")
    row = cur.fetchone()
    cur.close()
    conn.close()
    if row and row[0] == 'published':
        return resp(200, {'ok': True, 'public_url': url})
    return resp(502, {'error': 'Не удалось опубликовать статью'})


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
    """Мост для ИИ-агента: POST — черновик или action=publish, GET — авторы, ?id= статья, ?ids= статусы. Доступ по X-Api-Key."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    if not is_authorized(event):
        return resp(401, {'error': 'Unauthorized'})

    method = event.get('httpMethod', 'GET')
    if method == 'POST':
        try:
            body = json.loads(event.get('body') or '{}')
        except json.JSONDecodeError:
            return resp(400, {'error': 'Тело запроса должно быть корректным JSON'})
        if isinstance(body, dict) and body.get('action') == 'publish':
            return publish_article(body)
        return create_draft(event)
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        if params.get('ids'):
            return get_statuses(params['ids'])
        if params.get('id'):
            if not str(params['id']).isdigit():
                return resp(400, {'error': 'id должен быть числом'})
            return get_article(int(params['id']))
        return resp(200, list_authors())
    return resp(405, {'error': 'Method not allowed'})
