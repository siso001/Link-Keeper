from flask import Flask 
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from config import Config
from flask_login import UserMixin
from flask import render_template, request, redirect, url_for, flash, jsonify, session
from flask_login import login_user, login_required, logout_user, current_user
from urllib.parse import urlparse
from sqlalchemy import null
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from flask_cors import CORS
from flask_session import Session


app = Flask(__name__)
app.config.from_object(Config)

CORS(app, origins=["http://127.0.0.1:3000"], supports_credentials=True)

# @app.after_request
# def after_request(response):
#     response.headers.add('Access-Control-Allow-Origin', '*') # よくわからなかったので全てを許可するようにした
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#     response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
#     return response


db = SQLAlchemy(app)

migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.init_app(app)
Session(app)

# ログイン後のリダイレクト先を設定する場合
login_manager.login_view = 'login'  # ログインページのエンドポイントを指定する

# モデルのインポート
from model import User, Folder, Url
# ルートのインポート
import routes

# SQLiteエンジンの作成時に外部キー制約を有効にする
def enable_foreign_keys():
    if 'sqlite' in db.engine.url.drivername:
        with db.engine.connect() as con:
            con.execute('PRAGMA foreign_keys=ON')

# アプリケーションコンテキスト内でデータベースを作成
with app.app_context():
    db.create_all()