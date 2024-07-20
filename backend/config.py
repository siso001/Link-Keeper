import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'SECKEY'  # 環境変数から取得するか、安全な方法で生成することを推奨
    SEND_FILE_MAX_AGE_DEFAULT = 31536000
    SESSION_TYPE = 'filesystem'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_KEY_PREFIX = 'session:'
    SESSION_COOKIE_SECURE = os.environ.get('FLASK_ENV') == 'production'  # 本番環境でのみTrue
    SESSION_COOKIE_SAMESITE = 'Lax'  # 'Lax'に変更
    
    # CORSの設定
    CORS_SUPPORTS_CREDENTIALS = True
    CORS_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000']  # Reactアプリのオリジンを指定