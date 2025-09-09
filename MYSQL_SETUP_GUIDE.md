# MySQL 설치 및 데이터베이스 생성 가이드

## 1. MySQL 설치 (macOS)

### 방법 1: Homebrew 사용 (추천)
```bash
# Homebrew가 설치되어 있지 않다면 먼저 설치
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# MySQL 설치
brew install mysql

# MySQL 서비스 시작
brew services start mysql

# MySQL 보안 설정 (비밀번호 설정)
mysql_secure_installation
```

### 방법 2: MySQL 공식 웹사이트에서 다운로드
1. https://dev.mysql.com/downloads/mysql/ 접속
2. macOS용 MySQL Community Server 다운로드
3. 설치 파일 실행하여 설치
4. 설치 과정에서 root 비밀번호 설정 (예: 1234)

## 2. MySQL 서비스 확인 및 시작

```bash
# MySQL 서비스 상태 확인
brew services list | grep mysql

# MySQL 서비스 시작 (필요한 경우)
brew services start mysql

# MySQL 서비스 중지 (필요한 경우)
brew services stop mysql
```

## 3. MySQL 접속 테스트

```bash
# MySQL 접속 (비밀번호: 1234)
mysql -u root -p

# 비밀번호 입력 후 접속되면 성공!
```

## 4. 데이터베이스 생성

### 방법 1: SQL 파일 실행 (추천)
```bash
# 프로젝트 폴더로 이동
cd "/Users/rona/workspace/semi project/Project/app-server"

# SQL 파일 실행
mysql -u root -p < database_complete.sql
```

### 방법 2: MySQL 콘솔에서 직접 실행
```bash
# MySQL 접속
mysql -u root -p

# SQL 파일 내용 복사해서 붙여넣기
# (database_complete.sql 파일의 내용을 복사)
```

## 5. 데이터베이스 확인

```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 목록 확인
SHOW DATABASES;

# quiz_app 데이터베이스 사용
USE quiz_app;

# 테이블 목록 확인
SHOW TABLES;

# 퀴즈 데이터 확인
SELECT COUNT(*) FROM quiz;

# 점수 데이터 확인
SELECT COUNT(*) FROM score;

# 샘플 데이터 확인
SELECT * FROM quiz LIMIT 5;
SELECT * FROM score LIMIT 5;
```

## 6. 문제 해결

### MySQL 접속 오류 시
```bash
# MySQL 서비스 재시작
brew services restart mysql

# 또는
sudo /usr/local/mysql/support-files/mysql.server restart
```

### 비밀번호 오류 시
```bash
# 비밀번호 재설정
mysql -u root -p
# 또는
mysql -u root
```

### 포트 충돌 시
```bash
# MySQL 포트 확인
lsof -i :3306

# 다른 프로세스가 사용 중이면 종료
kill -9 [PID]
```

## 7. 백엔드 서버 테스트

```bash
# app-server 폴더로 이동
cd "/Users/rona/workspace/semi project/Project/app-server"

# 의존성 설치
npm install

# 서버 시작
npm run dev

# 또는
node server.js
```

## 8. API 테스트

```bash
# 퀴즈 데이터 조회 테스트
curl http://localhost:1000/quiz/list

# 리더보드 조회 테스트
curl http://localhost:1000/score/leaderboard

# 점수 저장 테스트
curl -X POST http://localhost:1000/score \
  -H "Content-Type: application/json" \
  -d '{"name": "테스트유저", "score": 1000}'
```

## 9. 완료 확인

모든 단계가 완료되면:
- ✅ MySQL 서비스 실행 중
- ✅ quiz_app 데이터베이스 생성됨
- ✅ quiz 테이블에 108개 문제 데이터
- ✅ score 테이블에 샘플 점수 데이터
- ✅ 백엔드 서버가 localhost:1000에서 실행 중
- ✅ API 엔드포인트 정상 작동

## 10. 다음 단계

데이터베이스 설정이 완료되면:
1. 프론트엔드에서 API 연동 수정
2. 목 데이터 대신 실제 데이터베이스 사용
3. 이미지 경로 수정
4. 에러 처리 추가

---

**참고사항:**
- 비밀번호는 `1234`로 설정 (dbPool.js와 일치)
- 포트는 기본 3306 사용
- 문제가 있으면 각 단계별로 확인해보세요

