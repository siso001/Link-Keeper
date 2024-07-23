from __init__ import request, app, db, login_manager, jsonify, login_user, logout_user, current_user, login_required, session


# ログイン状態を管理
@login_manager.user_loader
def load_user(user_id):
    from model import User
    return User.query.get(int(user_id))

# LPページ
@app.route('/', methods=['GET'])
def index():
    return "Hello World" 

# アカウント登録
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'GET':
        return "Sign up Page on Backend" 
    if request.method == 'POST':
        # ユーザー情報を取得する
        from model import User
        data = request.json
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        print(f"name:{name}, email:{email}, password:{password}")
        if not name or not email:
            return jsonify({'error': 'Missing data'}), 400
        new_user = User(username=name, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'アカウント登録に成功しました！'}), 201

# ログイン
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        if current_user.is_authenticated:
            print("loginしています")
            return jsonify({'logged_in': True, 'username': current_user.username})
        else:
            print("loginしていません")
            print(f"現在のユーザー: {current_user}")
            return jsonify({'logged_in': False})
    if request.method == 'POST':
        data = request.json
        email = data.get('email')
        password = data.get('password')
        from model import User
        user = User.query.filter_by(email=email).first()
        if user and user.password == password:
            login_user(user, remember=True)
            session.permanent = True  # セッションを永続化
            session.modified = True   # セッションの変更を保存
            print("ログインしました")
            return jsonify({'message': 'ログインに成功しました！', 'logged_in': True, 'username': user.username}), 200
        else:   
            print("ログインに失敗しました")
            return jsonify({'error': 'Invalid credentials'}), 401

# ログアウト
@app.route('/logout')
def logout():
    logout_user()  
    return "Log out page"

# ログインを確認
@app.route('/check_login', methods=['GET'])
def check_login():
    if current_user.is_authenticated:
        print("loginしています")
        return jsonify({'logged_in': True, 'username': current_user.username})
    else:
        print("loginしていません")
        print(f"現在のユーザー: {current_user}")
        return jsonify({'logged_in': False})

# ユーザーのフォルダを取得
@app.route('/check_folder', methods=['GET'])
def check_folder():
    from model import Folder, User
    user = User.query.filter_by(username=current_user.username).first()
    folders = Folder.query.filter_by(user_id=user.user_id).all()
    folder_list = [{"id": folder.folder_id, "name": folder.folder_name} for folder in folders]     
    if current_user.is_authenticated:
        return jsonify(folder_list)
    else:
        print("loginしていません")
        print(f"現在のユーザー: {current_user}")
        return jsonify({'logged_in': False})
    
# フォルダ内のUrlのデータを取得
@app.route('/get_urls', methods=['post'])
def get_urls():
    from model import Url
    data = request.json
    folder_id = data.get('folder_id')
    urls = Url.query.filter_by(folder_id=folder_id).all()
    url_list = [{"id": url.url_id, "name": url.url_name, "url": url.url, "domain": url.domain} for url in urls]     
    return jsonify(url_list)

# フォルダを追加
@app.route('/add_folder', methods=['POST'])
def add_folder():
    from model import Folder, User
    data = request.json
    foldername = data.get('foldername')
    username = data.get('username')
    user = User.query.filter_by(username=username).first()
    if not username or not foldername:
        return jsonify({'error': 'Missing data'}), 400
    new_folder = Folder(folder_name=foldername, user_id=user.user_id, folder_color_id=1)
    db.session.add(new_folder)
    db.session.commit()
    return jsonify({'message': 'フォルダの追加に成功しました！'}), 201
