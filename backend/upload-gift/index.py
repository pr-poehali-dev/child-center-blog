import json
import os
import urllib.request
import boto3


YANDEX_PUBLIC_KEY = 'https://disk.yandex.ru/i/YecxapWQLAgtfg'
GIFT_S3_KEY = 'gifts/easter-recipes.docx'


def get_s3():
    return boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )


def handler(event: dict, context) -> dict:
    """Загружает пасхальный сборник рецептов с Яндекс.Диска в S3 хранилище"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password'}, 'body': ''}

    headers = event.get('headers', {})
    admin_password = headers.get('X-Admin-Password', '')
    correct_password = os.environ.get('ADMIN_PASSWORD', '')
    if admin_password != correct_password:
        return {'statusCode': 403, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Нет доступа'})}

    api_url = f"https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key={urllib.parse.quote(YANDEX_PUBLIC_KEY)}"

    import urllib.parse
    req = urllib.request.Request(api_url)
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())
    download_url = data['href']

    with urllib.request.urlopen(download_url) as resp:
        file_data = resp.read()

    s3 = get_s3()
    s3.put_object(
        Bucket='files',
        Key=GIFT_S3_KEY,
        Body=file_data,
        ContentType='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ContentDisposition='attachment; filename="easter-recipes.docx"'
    )

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{GIFT_S3_KEY}"

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True, 'url': cdn_url})
    }
