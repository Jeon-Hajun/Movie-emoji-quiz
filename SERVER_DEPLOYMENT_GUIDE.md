# 🚀 서버 배포 가이드

영화 포스터 퀴즈 게임을 서버에 배포하는 방법을 안내합니다.

## 📋 사전 준비사항

### 1. 서버 환경
- **OS**: Ubuntu 18.04+ 또는 CentOS 7+
- **Node.js**: 18.0+ 버전
- **MySQL**: 8.0+ 버전
- **메모리**: 최소 2GB RAM
- **디스크**: 최소 5GB 여유 공간

### 2. 필수 소프트웨어 설치

#### Node.js 설치
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

#### MySQL 설치
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# CentOS/RHEL
sudo yum install mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

## 🔧 배포 단계

### 1️⃣ 프로젝트 업로드
```bash
# 서버에 프로젝트 파일 업로드 (scp, git clone 등 사용)
scp -r ./Project username@server-ip:/home/username/
# 또는
git clone https://github.com/your-repo/movie-quiz-game.git
```

### 2️⃣ 데이터베이스 설정
```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 생성 및 데이터 삽입
mysql -u root -p < database_complete.sql

# 사용자 권한 설정 (필요시)
CREATE USER 'quiz_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON quiz_app.* TO 'quiz_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3️⃣ 환경 변수 설정
```bash
cd Project/app-server

# 환경 변수 파일 생성
cp env.template .env

# .env 파일 편집
nano .env
```

**.env 파일 예시:**
```env
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=quiz_user
DB_PASSWORD=your_secure_password
DB_NAME=quiz_app
FRONTEND_URL=http://your-domain.com
```

### 4️⃣ 자동 배포 실행
```bash
cd Project
./deploy.sh
```

### 5️⃣ 수동 배포 (필요시)
```bash
# 백엔드 의존성 설치
cd app-server
npm install

# 프론트엔드 빌드
cd ../app
npm install
npm run build

# 빌드 파일 복사
cp -r dist ../app-server/public

# 서버 시작
cd ../app-server
npm start
```

## 🌐 프로덕션 설정

### 1. PM2로 서버 관리 (권장)
```bash
# PM2 설치
npm install -g pm2

# 서버 시작
cd app-server
pm2 start server.js --name "movie-quiz-game"

# 자동 시작 설정
pm2 startup
pm2 save
```

### 2. Nginx 리버스 프록시 설정
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 정적 파일 캐싱
    location /poster/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. 방화벽 설정
```bash
# Ubuntu UFW
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable

# CentOS firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## 🔒 보안 설정

### 1. MySQL 보안 강화
```bash
# MySQL 보안 설정
sudo mysql_secure_installation

# 원격 접속 비활성화 (필요시)
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# bind-address = 127.0.0.1 확인
```

### 2. Node.js 보안
```bash
# 비 root 사용자로 실행
sudo useradd -m -s /bin/bash quiz-app
sudo chown -R quiz-app:quiz-app /home/quiz-app/Project
```

## 📊 모니터링

### 1. 로그 확인
```bash
# PM2 로그
pm2 logs movie-quiz-game

# MySQL 로그
sudo tail -f /var/log/mysql/error.log

# 시스템 로그
sudo journalctl -f -u mysql
```

### 2. 상태 확인
```bash
# 서버 상태
pm2 status

# 포트 확인
netstat -tlnp | grep :3000

# 프로세스 확인
ps aux | grep node
```

## 🛠️ 문제 해결

### 자주 발생하는 문제들

#### 1. 포트 충돌
```bash
# 포트 사용 중인 프로세스 확인
sudo lsof -i :3000
# 프로세스 종료
sudo kill -9 <PID>
```

#### 2. MySQL 연결 실패
```bash
# MySQL 서비스 상태 확인
sudo systemctl status mysql
# MySQL 재시작
sudo systemctl restart mysql
```

#### 3. 권한 문제
```bash
# 파일 권한 확인
ls -la
# 권한 수정
chmod 755 server.js
chown -R quiz-app:quiz-app ./
```

## 📝 배포 체크리스트

- [ ] Node.js 18+ 설치 확인
- [ ] MySQL 8+ 설치 및 실행 확인
- [ ] 프로젝트 파일 업로드 완료
- [ ] 데이터베이스 생성 및 데이터 삽입
- [ ] .env 파일 생성 및 설정
- [ ] 의존성 설치 (npm install)
- [ ] 프론트엔드 빌드 (npm run build)
- [ ] 서버 시작 테스트
- [ ] 방화벽 포트 개방
- [ ] PM2 또는 서비스 등록
- [ ] Nginx 설정 (선택사항)
- [ ] SSL 인증서 설정 (선택사항)

## 🚀 빠른 시작

```bash
# 1. 프로젝트 디렉토리로 이동
cd Project

# 2. 환경 변수 설정
cd app-server
cp env.template .env
nano .env  # 실제 값으로 수정

# 3. 데이터베이스 설정
mysql -u root -p < ../database_complete.sql

# 4. 자동 배포 실행
cd ..
./deploy.sh

# 5. 서버 시작
cd app-server
npm start
```

---

**배포 완료 후 브라우저에서 `http://your-server-ip:3000` 접속하여 확인하세요!** 🎉
