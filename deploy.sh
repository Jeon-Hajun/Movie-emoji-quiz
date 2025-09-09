#!/bin/bash

# ===============================================
# 영화 포스터 퀴즈 게임 서버 배포 스크립트
# ===============================================

echo "🎬 영화 포스터 퀴즈 게임 서버 배포를 시작합니다..."

# 1. 프로젝트 디렉토리로 이동
cd "$(dirname "$0")"

echo "📁 프로젝트 디렉토리: $(pwd)"

# 2. 백엔드 의존성 설치
echo "📦 백엔드 의존성 설치 중..."
cd app-server
npm install

# 3. 환경 변수 파일 확인
if [ ! -f ".env" ]; then
    echo "⚠️  .env 파일이 없습니다. env.template을 참고하여 .env 파일을 생성하세요."
    echo "   cp env.template .env"
    echo "   그 후 .env 파일을 편집하여 실제 데이터베이스 정보를 입력하세요."
    exit 1
fi

# 4. 데이터베이스 연결 테스트
echo "🗄️  데이터베이스 연결을 확인하는 중..."

# 5. 프론트엔드 빌드
echo "🏗️  프론트엔드 빌드 중..."
cd ../app
npm install
npm run build

# 6. 빌드된 파일을 백엔드 public 폴더로 복사
echo "📋 빌드된 파일을 서버로 복사 중..."
rm -rf ../app-server/public
cp -r dist ../app-server/public

# 7. 백엔드 서버 시작
echo "🚀 백엔드 서버를 시작합니다..."
cd ../app-server

echo "✅ 배포 완료!"
echo "🌐 서버 주소: http://localhost:3000"
echo "📊 관리자 페이지: http://localhost:3000/admin (있는 경우)"
echo ""
echo "서버를 시작하려면 다음 명령어를 실행하세요:"
echo "cd app-server && npm start"
