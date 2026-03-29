import os
import psycopg2
import urllib.request
import json

SCHEMA = 't_p99892216_child_center_blog'
BASE_URL = 'https://blogribkadolli.ru'
YANDEX_USER_ID = '1462613238'
YANDEX_HOST_ID = 'http:blogribkadolli.ru:80'

STATIC_URLS = [
    (BASE_URL + '/',                          'weekly',  '1.0'),
    (BASE_URL + '/blog',                      'daily',   '0.9'),
    (BASE_URL + '/blog?category=tips',        'weekly',  '0.8'),
    (BASE_URL + '/blog?category=life',        'weekly',  '0.8'),
    (BASE_URL + '/blog?category=detail',      'weekly',  '0.8'),
    (BASE_URL + '/blog?category=summer',      'weekly',  '0.7'),
    (BASE_URL + '/blog?category=afterschool', 'weekly',  '0.7'),
    (BASE_URL + '/blog?category=english',     'weekly',  '0.7'),
    (BASE_URL + '/blog/qa',                   'monthly', '0.6'),
]

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def ping_yandex(post_id: int):
    """Отправляет URL новой статьи в Яндекс.Вебмастер на индексацию."""
    token = os.environ.get('YANDEX_WEBMASTER_TOKEN', '')
    if not token:
        return
    url = f'https://api.webmaster.yandex.net/v4/user/{YANDEX_USER_ID}/hosts/{YANDEX_HOST_ID}/reindex/tasks'
    data = json.dumps({'data': [{'url': f'{BASE_URL}/blog/{post_id}'}]}).encode('utf-8')
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('Authorization', f'OAuth {token}')
    req.add_header('Content-Type', 'application/json')
    try:
        urllib.request.urlopen(req, timeout=5)
    except Exception:
        pass


def handler(event: dict, context) -> dict:
    """Генерирует sitemap.xml из БД. POST ?action=ping&id=N — отправляет статью на индексацию в Яндекс."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}

    if method == 'POST' and params.get('action') == 'ping':
        post_id = params.get('id')
        if post_id:
            ping_yandex(int(post_id))
        return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'ok': True})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(f"SELECT id FROM {SCHEMA}.blog_posts ORDER BY id")
    post_ids = [row[0] for row in cur.fetchall()]
    cur.close()
    conn.close()

    urls = []
    for loc, freq, priority in STATIC_URLS:
        urls.append(f'  <url><loc>{loc}</loc><changefreq>{freq}</changefreq><priority>{priority}</priority></url>')

    for pid in post_ids:
        urls.append(f'  <url><loc>{BASE_URL}/blog/{pid}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>')

    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    xml += '\n'.join(urls)
    xml += '\n</urlset>'

    return {
        'statusCode': 200,
        'headers': {**CORS, 'Content-Type': 'application/xml; charset=utf-8'},
        'body': xml,
    }