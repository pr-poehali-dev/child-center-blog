import os
import psycopg2

SCHEMA = 't_p99892216_child_center_blog'
BASE_URL = 'https://blogribkadolli.ru'

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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def handler(event: dict, context) -> dict:
    """Генерирует sitemap.xml динамически из БД — включает все статьи блога."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

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
