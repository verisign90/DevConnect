# DevConnect (개발자를 위한 프로젝트 매칭 플랫폼)
프로젝트에 적합한 팀원을 매칭해주고 팀원 간 역량 평가를 통해 개인의 강점과 개선점을 점수로 보여주는 시스템입니다.<br>
자신보다 뛰어난 팀원으로부터 배우거나 자신의 부족한 역량을 보완해줄 수 있는 팀원과 협업하는 환경을 제공하고,<br>
상호 평가 시스템을 통해 자신의 강점과 개선점을 파악하게 하여 개발자로의 성장을 돕습니다.

## 개발 기간 및 인원
(4주) 2024.11.21 ~ 2024.12.18 / 본인 1명

## 배포 주소
https://devconnect.today

## 기술 스택
### 프론트엔드
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/tailwind css-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
### 백엔드
<img src="https://img.shields.io/badge/meteor.js-DE4F4F?style=for-the-badge&logo=meteor&logoColor=white"> <img src="https://img.shields.io/badge/mongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white"> <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/MongoDB Atlas-2F8D46?style=for-the-badge&logo=MongoDB&logoColor=white">
### 인프라
<img src="https://img.shields.io/badge/azure-0082FC?style=for-the-badge&logoColor=white"> <img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"> <img src="https://img.shields.io/badge/linux-FCC624?style=for-the-badge&logo=linux&logoColor=black"> 
### 개발도구
<img src="https://img.shields.io/badge/visual studio code-0082FC?style=for-the-badge&logo=visual studio code&logoColor=white"> <img src="https://img.shields.io/badge/NoSQLBooster-72EF36?style=for-the-badge&logo=NoSQLBooster&logoColor=white"> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"> <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"> <img src="https://img.shields.io/badge/prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white"> <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white">

## 맡은 역할
### 기획 및 initdata 설계
- initdata 설계를 통해 비즈니스 로직과 데이터 흐름을 기획 및 구현

### 페이지 제작
* **메인페이지 / 상세조회페이지**
  - 모집분야, 모임형태, 기술스택별로 게시글 필터링
  - 게시글 정렬 및 제목 검색
  - 페이지네이션
  - 프로젝트 참여 신청 기능
  - 댓글
    
* **마이페이지 / 평가페이지 / 신청자 목록 페이지**
    - 프로필 이미지 업로드 및 회원정보 수정
    - 참여자 간 역량점수 상호 평가 기능 및 내 평균 역량점수 조회
    - 참여 신청자 승인 및 거절 기능
      
* **그 외 구현 기능**
    - 팀장페이지 기능 API 제작
    - 프로필 & 프로젝트 목록 페이지 기능 API 제작
    - 알림페이지 기능 API 제작
    - 작성페이지 기능 API 제작
    - 회원가입 및 로그인/로그아웃

### 배포
- MongoDB Atlas를 Meteor 프로젝트와 연결
- Azure의 Linux VM에 프로젝트 배포하고 실제 도메인을 연결하여 웹사이트 구현

## 아키텍처
### 서버 아키텍처 구조
![서버 아키텍처 구조](https://github.com/verisign90/DevConnect/blob/main/%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98.png)

### 디렉토리 구조
```
├── .meteor
├── client
├── imports (클라이언트 측 코드 및 서버와 공유하는 코드 모음)
│   ├── api (DB 컬렉션)
│   ├── lib (공통 유틸리티 함수)
│   └── ui (화면을 구성하는 페이지 및 컴포넌트)
│       ├── MyPage
│       ├── Project
│       ├── User
│       ├── App.jsx
│       ├── Location.jsx
│       ├── Nav.jsx
│       └── NotFound.jsx
├── public
│   ├── icons
│   ├── images
│   └── favicon.ico
├── server (서버 측 코드)
│   ├── mypage
│   ├── project
│   ├── user
│   ├── init.js (initdata 설계)
│   ├── location.js
│   └── main.js (서버 진입점)
├── .gitignore
├── package-lock.json
├── package.json
├── postcss.config.js
├── start.bat (프로젝트 실행 스크립트. MongoDB Atlas 연결 및 meteor 실행)
└── tailwind.config.js
```
