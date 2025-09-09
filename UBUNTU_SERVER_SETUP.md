# 🐧 Ubuntu 서버 설치 및 실행 가이드

## 📋 필수 요구사항
- Ubuntu 18.04 이상
- Node.js 16 이상
- MySQL 8.0 이상
- Git

## 🚀 1단계: 필수 소프트웨어 설치

### Node.js 설치
```bash
# NodeSource repository 추가
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Node.js 설치
sudo apt-get install -y nodejs

# 설치 확인
node --version
npm --version
```

### MySQL 설치
```bash
# MySQL 설치
sudo apt update
sudo apt install mysql-server

# MySQL 보안 설정
sudo mysql_secure_installation

# MySQL 시작 및 자동 시작 설정
sudo systemctl start mysql
sudo systemctl enable mysql

# MySQL 접속 테스트
sudo mysql -u root -p
```

### Git 설치
```bash
sudo apt install git
```

## 🔽 2단계: 프로젝트 다운로드

```bash
# 홈 디렉토리로 이동
cd ~

# GitHub에서 프로젝트 클론
git clone https://github.com/YOUR_USERNAME/movie-quiz-game.git

# 프로젝트 디렉토리로 이동
cd movie-quiz-game
```

## ⚙️ 3단계: 데이터베이스 설정

```bash
# MySQL 접속
sudo mysql -u root -p

# 데이터베이스 생성 (MySQL 콘솔에서)
CREATE DATABASE quiz_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 사용자 생성 및 권한 부여 (선택사항)
CREATE USER 'quiz_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON quiz_app.* TO 'quiz_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 데이터베이스 스키마 및 데이터 가져오기
mysql -u root -p quiz_app < database_complete.sql
```

## 🔧 4단계: 환경 변수 설정

```bash
# 백엔드 디렉토리로 이동
cd app-server

# 환경 변수 파일 생성
cp env.template .env

# 환경 변수 편집
nano .env
```

`.env` 파일 내용 예시:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=quiz_app
PORT=3000
FRONTEND_URL=http://your-server-ip:3000
```

## 🚀 5단계: 자동 배포 실행

```bash
# 프로젝트 루트로 이동
cd ..

# 배포 스크립트 실행
./deploy.sh
```

## 🌐 6단계: 서버 시작

```bash
# 백엔드 디렉토리로 이동
cd app-server

# 서버 시작 (개발 모드)
npm start

# 또는 PM2로 프로덕션 실행
sudo npm install -g pm2
pm2 start server.js --name "movie-quiz-game"
pm2 startup
pm2 save
```

## 🔥 방화벽 설정 (필요시)

```bash
# UFW 방화벽 활성화
sudo ufw enable

# 포트 3000 열기
sudo ufw allow 3000

# SSH 포트 열기 (중요!)
sudo ufw allow ssh

# 상태 확인
sudo ufw status
```

## 🌍 7단계: 접속 확인

브라우저에서 다음 주소로 접속:
```
http://your-server-ip:3000
```

## 🔧 문제 해결

### 포트 충돌 시
```bash
# 사용 중인 포트 확인
sudo netstat -tulpn | grep :3000

# 프로세스 종료
sudo kill -9 PID_NUMBER
```

### MySQL 연결 오류 시
```bash
# MySQL 상태 확인
sudo systemctl status mysql

# MySQL 재시작
sudo systemctl restart mysql

# MySQL 로그 확인
sudo tail -f /var/log/mysql/error.log
```

### 권한 오류 시
```bash
# 프로젝트 디렉토리 권한 설정
sudo chown -R $USER:$USER ~/movie-quiz-game
chmod +x ~/movie-quiz-game/deploy.sh
```

## 📊 서버 모니터링

### PM2 명령어
```bash
# 프로세스 상태 확인
pm2 status

# 로그 확인
pm2 logs movie-quiz-game

# 프로세스 재시작
pm2 restart movie-quiz-game

# 프로세스 중지
pm2 stop movie-quiz-game

# 프로세스 삭제
pm2 delete movie-quiz-game
```

## 🎯 성능 최적화 (선택사항)

### Nginx 리버스 프록시 설정
```bash
# Nginx 설치
sudo apt install nginx

# 설정 파일 생성
sudo nano /etc/nginx/sites-available/movie-quiz-game
```

Nginx 설정 내용:
```nginx
server {
    listen 80;
    server_name your-domain.com your-server-ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 사이트 활성화
sudo ln -s /etc/nginx/sites-available/movie-quiz-game /etc/nginx/sites-enabled/

# Nginx 테스트 및 재시작
sudo nginx -t
sudo systemctl restart nginx
```

## ✅ 완료!

이제 Ubuntu 서버에서 영화 포스터 퀴즈 게임이 실행됩니다! 🎉

문제가 발생하면 로그를 확인하고 위의 문제 해결 섹션을 참고하세요.
