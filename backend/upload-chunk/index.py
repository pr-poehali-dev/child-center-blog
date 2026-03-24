import json
import os
import base64
import uuid
import hashlib
import boto3

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
    'Access-Control-Max-Age': '86400',
}

BUCKET = 'files'


def get_s3():
    return boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )


def check_auth(event: dict) -> bool:
    token = (event.get('headers') or {}).get('X-Authorization', '')
    expected = hashlib.sha256(f"{os.environ['ADMIN_PASSWORD']}_solnyshko_secret".encode()).hexdigest()
    return token == expected


def handler(event: dict, context) -> dict:
    """
    Multipart upload видео чанками.
    action=init   → создаёт multipart upload, возвращает upload_id + key
    action=part   → загружает один чанк, возвращает etag
    action=finish → завершает multipart upload, возвращает cdn_url
    action=abort  → отменяет multipart upload
    """

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    if not check_auth(event):
        return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Unauthorized'})}

    body = json.loads(event.get('body') or '{}')
    action = body.get('action')
    s3 = get_s3()

    if action == 'init':
        content_type = body.get('content_type', 'video/mp4')
        ext_map = {
            'video/mp4': 'mp4', 'video/quicktime': 'mov',
            'video/webm': 'webm', 'video/x-msvideo': 'avi',
        }
        ext = ext_map.get(content_type, 'mp4')
        key = f'blog/{uuid.uuid4()}.{ext}'
        resp = s3.create_multipart_upload(Bucket=BUCKET, Key=key, ContentType=content_type)
        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'upload_id': resp['UploadId'], 'key': key})
        }

    if action == 'part':
        key = body['key']
        upload_id = body['upload_id']
        part_number = int(body['part_number'])
        data = base64.b64decode(body['data'])
        resp = s3.upload_part(
            Bucket=BUCKET, Key=key, UploadId=upload_id,
            PartNumber=part_number, Body=data
        )
        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'etag': resp['ETag']})
        }

    if action == 'finish':
        key = body['key']
        upload_id = body['upload_id']
        parts = body['parts']
        s3.complete_multipart_upload(
            Bucket=BUCKET, Key=key, UploadId=upload_id,
            MultipartUpload={'Parts': [{'PartNumber': p['part_number'], 'ETag': p['etag']} for p in parts]}
        )
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'url': cdn_url})
        }

    if action == 'abort':
        s3.abort_multipart_upload(Bucket=BUCKET, Key=body['key'], UploadId=body['upload_id'])
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Unknown action'})}
