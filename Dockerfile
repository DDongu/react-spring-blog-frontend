# Step 1: Build the React app
FROM node:18 AS build

WORKDIR /app

# 프로젝트 파일 복사
COPY package.json package-lock.json ./
RUN npm install

# React 앱 빌드
COPY . .
RUN npm run build

# Step 2: Serve the built React app using a web server
FROM nginx:alpine

# 빌드된 파일을 nginx로 복사
COPY --from=build /app/build /usr/share/nginx/html

# Nginx가 사용하는 포트 80을 오픈
EXPOSE 80

# 컨테이너 실행 시 Nginx를 실행하도록 설정
CMD ["nginx", "-g", "daemon off;"]