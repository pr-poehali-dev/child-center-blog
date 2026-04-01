import os
import json
import psycopg2
import html as html_lib

SCHEMA = 't_p99892216_child_center_blog'
BASE_URL = 'https://blogribkadolli.ru'
PROJECT_ID = '891591f8-ea8a-4dbb-94f9-151d66af9489'
LOGO_URL = f'https://cdn.poehali.dev/projects/{PROJECT_ID}/bucket/badbdcbb-25d9-4f41-a4b9-b704f68d9351.png'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

CATEGORIES = {
    'tips':        {'label': 'Советы от педагога',       'emoji': '🎓'},
    'life':        {'label': 'Наша жизнь на ладони',     'emoji': '🌈'},
    'detail':      {'label': 'Подробно о важном',        'emoji': '📖'},
    'summer':      {'label': 'Лето с нами. Летний клуб', 'emoji': '☀️'},
    'afterschool': {'label': 'Группа продлённого дня',   'emoji': '📚'},
    'english':     {'label': 'Группа английского языка', 'emoji': '🇬🇧'},
    'experiments': {'label': 'Экспериментаторы',         'emoji': '🔬'},
    'chefs':       {'label': 'Шеф-повара',               'emoji': '👨‍🍳'},
    'masters':     {'label': 'Мастера вдохновения',      'emoji': '🎨'},
}


def e(text: str) -> str:
    """HTML-escape строки."""
    return html_lib.escape(str(text or ''), quote=True)


def format_date(iso: str) -> str:
    """Форматирует ISO дату в читаемый русский формат."""
    try:
        from datetime import datetime
        dt = datetime.fromisoformat(iso.replace('Z', '+00:00'))
        months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
        return f'{dt.day} {months[dt.month - 1]} {dt.year}'
    except Exception:
        return iso


def content_to_paragraphs(content: str) -> str:
    """Превращает текст статьи в HTML-параграфы."""
    paragraphs = []
    for line in content.split('\n'):
        line = line.strip()
        if line:
            paragraphs.append(f'<p>{e(line)}</p>')
        else:
            paragraphs.append('<br>')
    return '\n'.join(paragraphs)


def build_schema(post: dict, desc: str, first_img: str) -> str:
    """Строит JSON-LD для BlogPosting."""
    schema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': post['title'],
        'description': desc,
        'url': f"{BASE_URL}/blog/{post['id']}",
        'datePublished': post['created_at'],
        'dateModified': post['created_at'],
        'inLanguage': 'ru-RU',
        'publisher': {
            '@type': 'Organization',
            'name': 'Детский центр «Рыбка Долли»',
            'url': BASE_URL,
            'logo': {'@type': 'ImageObject', 'url': LOGO_URL},
        },
        'isPartOf': {
            '@type': 'Blog',
            'name': 'Блог детского центра «Рыбка Долли»',
            'url': f'{BASE_URL}/blog',
        },
    }
    if post.get('teacher_name'):
        schema['author'] = {
            '@type': 'Person',
            'name': post['teacher_name'],
            'worksFor': {'@type': 'Organization', 'name': 'Детский центр «Рыбка Долли»'},
        }
    else:
        schema['author'] = {
            '@type': 'Organization',
            'name': 'Детский центр «Рыбка Долли»',
        }
    if first_img:
        schema['image'] = {'@type': 'ImageObject', 'url': first_img}
    return json.dumps(schema, ensure_ascii=False, indent=2)


def build_html(post: dict) -> str:
    """Генерирует полный HTML-документ с текстом статьи для поисковых роботов."""
    title_escaped = e(post['title'])
    content_text = post.get('content', '')
    desc = content_text.replace('\n', ' ').strip()[:160]
    desc_escaped = e(desc)

    cat_key = post.get('category', '')
    cat_info = CATEGORIES.get(cat_key, {'label': cat_key, 'emoji': ''})
    cat_label = e(cat_info['label'])
    cat_emoji = cat_info['emoji']

    date_str = format_date(post.get('created_at', ''))

    media = post.get('media') or []
    if isinstance(media, str):
        try:
            media = json.loads(media)
        except Exception:
            media = []

    first_img = next((m['url'] for m in media if m.get('type') == 'image'), '')
    og_image = first_img or LOGO_URL

    teacher_name = e(post.get('teacher_name') or '')
    teacher_photo = e(post.get('teacher_photo') or '')

    content_html = content_to_paragraphs(content_text)

    # Картинки статьи
    images_html = ''
    for m in media:
        if m.get('type') == 'image' and m.get('url'):
            images_html += f'<img src="{e(m["url"])}" alt="{title_escaped}" loading="lazy" style="max-width:100%;border-radius:12px;margin:8px 0;">\n'

    schema_json = build_schema(post, desc, first_img)
    post_url = f"{BASE_URL}/blog/{post['id']}"
    page_title = f"{post['title']} | Блог детского центра «Рыбка Долли»"
    page_title_escaped = e(page_title)

    teacher_block = ''
    if teacher_name:
        photo_tag = f'<img src="{teacher_photo}" alt="{teacher_name}" width="48" height="48" style="border-radius:50%;object-fit:cover;">' if teacher_photo else ''
        teacher_block = f'''
<div style="margin-top:32px;padding:16px;border:1px solid #fde68a;border-radius:12px;background:#fffbeb;display:flex;align-items:center;gap:12px;">
  {photo_tag}
  <div>
    <div style="font-weight:700;color:#92400e;">{teacher_name}</div>
    <div style="font-size:13px;color:#a16207;">Педагог детского центра «Рыбка Долли»</div>
  </div>
</div>'''

    return f'''<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{page_title_escaped}</title>
  <meta name="description" content="{desc_escaped}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{e(post_url)}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="{title_escaped}">
  <meta property="og:description" content="{desc_escaped}">
  <meta property="og:url" content="{e(post_url)}">
  <meta property="og:image" content="{e(og_image)}">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:site_name" content="Детский центр «Рыбка Долли»">
  <meta name="author" content="Детский центр «Рыбка Долли»">
  <script type="application/ld+json">{schema_json}</script>
  <style>
    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 720px;
      margin: 0 auto;
      padding: 24px 16px 48px;
      color: #374151;
      background: #fffdf8;
      line-height: 1.7;
    }}
    h1 {{ font-size: 26px; font-weight: 800; color: #1f2937; margin: 16px 0; }}
    p {{ margin: 8px 0; }}
    a {{ color: #f97316; text-decoration: none; }}
    a:hover {{ text-decoration: underline; }}
    .meta {{ font-size: 13px; color: #9ca3af; margin-bottom: 20px; }}
    .cat-badge {{
      display: inline-block;
      padding: 4px 12px;
      border-radius: 999px;
      background: #fef3c7;
      color: #92400e;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 12px;
    }}
  </style>
</head>
<body>
  <p><a href="{e(BASE_URL)}/blog">← Вернуться в блог</a></p>

  <span class="cat-badge">{cat_emoji} {cat_label}</span>

  <h1>{title_escaped}</h1>

  <div class="meta">
    <time datetime="{e(post.get('created_at', ''))}">{date_str}</time>
    {f' · <strong>{teacher_name}</strong>' if teacher_name else ''}
  </div>

  {images_html}

  <article>
    {content_html}
  </article>

  {teacher_block}

  <p style="margin-top:40px;">
    <a href="{e(BASE_URL)}/blog">← Все статьи блога</a> &nbsp;|&nbsp;
    <a href="{e(BASE_URL)}">На главную</a>
  </p>
</body>
</html>'''


def handler(event: dict, context) -> dict:
    """Prerender: возвращает HTML статьи с текстом в коде.
    GET /?id=123  — HTML конкретной статьи
    """
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    params = event.get('queryStringParameters') or {}
    post_id = params.get('id')

    if not post_id:
        return {
            'statusCode': 400,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'id is required'}),
        }

    try:
        post_id_int = int(post_id)
    except ValueError:
        return {
            'statusCode': 400,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'id must be integer'}),
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        f"SELECT id, category, title, content, media, created_at, teacher_photo, teacher_name, sticker "
        f"FROM {SCHEMA}.blog_posts WHERE id = {post_id_int}"
    )
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return {
            'statusCode': 404,
            'headers': {**CORS, 'Content-Type': 'text/html; charset=utf-8'},
            'body': '<html><body><h1>Статья не найдена</h1><a href="https://blogribkadolli.ru/blog">← В блог</a></body></html>',
        }

    media_raw = row[4]
    if isinstance(media_raw, str):
        try:
            media_raw = json.loads(media_raw)
        except Exception:
            media_raw = []

    post = {
        'id': row[0],
        'category': row[1],
        'title': row[2],
        'content': row[3],
        'media': media_raw,
        'created_at': row[5].isoformat(),
        'teacher_photo': row[6] or '',
        'teacher_name': row[7] or '',
        'sticker': row[8] or '',
    }

    html_body = build_html(post)

    return {
        'statusCode': 200,
        'headers': {
            **CORS,
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
            'X-Robots-Tag': 'index, follow',
        },
        'body': html_body,
    }
