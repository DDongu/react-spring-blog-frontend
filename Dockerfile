# 1. Node.js 이미지 사용 (React 앱 실행용)
FROM node:18

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. package.json 및 package-lock.json 복사 후 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 4. 소스 코드 복사
COPY . .

# 5. React 앱 실행
CMD ["npm", "start"]
