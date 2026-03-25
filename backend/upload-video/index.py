import json
import os
import base64
import uuid
import hashlib
import boto3

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization, X-File-Type',
    'Access-Control-Max-Age': '86400',
}


def check_auth(event: dict) -> bool:
    token = (event.get('headers') or {}).get('X-Authorization', '')
    expected = hashlib.sha256(f"{os.environ['ADMIN_PASSWORD']}_solnyshko_secret".encode()).hexdigest()
    return token == expected


def handler(event: dict, context) -> dict:
    """Загружает видео (бинарный body или base64) в S3 и возвращает CDN URL"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    if not check_auth(event):
        return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Unauthorized'})}

    headers = event.get('headers') or {}
    content_type = headers.get('X-File-Type', 'video/mp4')

    body_raw = event.get('body', '') or ''
    if event.get('isBase64Encoded'):
        raw = base64.b64decode(body_raw)
    else:
        raw = body_raw.encode('latin-1') if body_raw else b''

    ext_map = {'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm'}
    ext = ext_map.get(content_type, 'mp4')
    key = f'blog/{uuid.uuid4()}.{ext}'

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=raw, ContentType=content_type)
    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

    return {
        'statusCode': 200,
        'headers': {**CORS, 'Content-Type': 'application/json'},
        'body': json.dumps({'url': cdn_url})
    }
