# 익명 게시판 및 키워드 알림 기능 구현

댓글 기능이 있는 익명 게시판과 키워드 알림 기능을 구현한 Node.js 프로젝트입니다.

## 목차

- [프로젝트 소개](#프로젝트-소개)
- [폴더 구조](#폴더-구조)
- [설치 및 실행 방법](#설치-및-실행-방법)
- [API 명세](#api-명세)
- [사용된 기술 스택](#사용된-기술-스택)
- [추가 정보](#추가-정보)
- [문의 사항](#문의-사항)

## 프로젝트 소개

이 프로젝트는 로그인 기능 없이 익명으로 게시글과 댓글을 작성할 수 있는 게시판입니다. **게시글 작성 시 비밀번호 입력은 필수이며**, 비밀번호는 게시글 수정 및 삭제 시 필요합니다. 게시글과 댓글은 이모티콘 및 다양한 스타일이 적용된 **리치 텍스트(Rich Text)**를 지원합니다. 또한, 특정 키워드를 등록한 작성자에게 해당 키워드가 포함된 게시글이나 댓글이 작성되면 알림을 보내는 기능을 구현하였습니다. (알림 보내는 함수 호출만 구현하고 실제 알림 기능은 구현하지 않았습니다.)

## 폴더 구조

```
project-root/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── prisma.ts
│   ├── __mocks__/
│   │   └── prisma.ts
│   ├── routes/
│   │   ├── postRoutes.ts
│   │   └── commentRoutes.ts
│   ├── controllers/
│   │   ├── postController.ts
│   │   └── commentController.ts
│   ├── services/
│   │   ├── postService.ts
│   │   ├── commentService.ts
│   │   └── alertService.ts
│   ├── utils/
│   │   └── CustomError.ts
│   ├── tests/
│   │   ├── post.test.ts
│   │   └── comment.test.ts
│   └── types/
│       └── index.ts
├── .env
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
├── .gitignore
└── README.md
```

### 폴더 및 파일 설명

- **prisma/**: Prisma ORM 설정 및 스키마 정의를 위한 디렉토리입니다.
  - **schema.prisma**: 데이터베이스 스키마를 정의한 파일입니다.
- **src/**: 소스 코드가 위치한 디렉토리입니다.
  - **app.ts**: Express 애플리케이션 설정 및 미들웨어를 적용한 파일입니다.
  - **server.ts**: 서버를 실행하는 엔트리 포인트 파일입니다.
  - **prisma.ts**: Prisma 클라이언트를 생성하고 내보내는 파일입니다.
  - \***\*mocks**/\*\*: 테스트 시 Prisma 클라이언트를 모킹하기 위한 디렉토리입니다.
    - **prisma.ts**: 모킹된 Prisma 클라이언트를 정의한 파일입니다.
  - **routes/**: 라우팅을 담당하는 디렉토리입니다.
    - **postRoutes.ts**: 게시글 관련 라우터를 정의한 파일입니다.
    - **commentRoutes.ts**: 댓글 관련 라우터를 정의한 파일입니다.
  - **controllers/**: 요청을 받고 서비스 레이어를 호출하는 컨트롤러가 위치한 디렉토리입니다.
    - **postController.ts**: 게시글 관련 컨트롤러 파일입니다.
    - **commentController.ts**: 댓글 관련 컨트롤러 파일입니다.
  - **services/**: 비즈니스 로직을 처리하고 데이터베이스와 상호 작용하는 서비스 레이어입니다.
    - **postService.ts**: 게시글 관련 서비스 파일입니다.
    - **commentService.ts**: 댓글 관련 서비스 파일입니다.
    - **alertService.ts**: 키워드 알림 기능을 처리하는 서비스 파일입니다.
  - **utils/**: 유틸리티 클래스나 함수가 위치한 디렉토리입니다.
    - **CustomError.ts**: 커스텀 에러 클래스를 정의한 파일입니다.
  - **tests/**: 테스트 코드를 모아놓은 디렉토리입니다.
    - **post.test.ts**: 게시글 관련 테스트 코드입니다.
    - **comment.test.ts**: 댓글 관련 테스트 코드입니다.
  - **types/**: 타입 선언을 모아놓은 디렉토리입니다.
    - **index.ts**: 프로젝트 전반에서 사용되는 타입들을 정의한 파일입니다.
- **.env**: 환경 변수 파일로 데이터베이스 연결 정보를 저장합니다.
- **package.json**: 프로젝트의 의존성 패키지 목록과 스크립트가 정의되어 있습니다.
- **tsconfig.json**: TypeScript 컴파일러 설정 파일입니다.
- **.eslintrc.js**: ESLint 설정 파일입니다.
- **.prettierrc**: Prettier 설정 파일입니다.
- **.gitignore**: Git에서 추적하지 않을 파일과 디렉토리를 지정합니다.
- **README.md**: 프로젝트에 대한 설명과 안내를 담은 파일입니다.

## 설치 및 실행 방법

### 사전 준비

- Node.js (v14 이상)
- MySQL 또는 MariaDB 데이터베이스

### 1. 저장소 클론

```bash
git clone [REPOSITORY_URL]
cd project-root
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 데이터베이스 설정

- MySQL 또는 MariaDB를 설치하고 데이터베이스를 생성합니다.
- 프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가합니다.

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
```

- `USER`, `PASSWORD`, `HOST`, `PORT`, `DATABASE_NAME` 부분을 본인의 환경에 맞게 수정합니다.

### 4. Prisma 설정 및 마이그레이션

```bash
npx prisma migrate dev --name init
```

### 5. 서버 실행

개발 모드로 실행하려면 다음 명령어를 사용합니다.

```bash
npm run dev
```

빌드 후 실행하려면 다음 명령어를 사용합니다.

```bash
npm run build
npm start
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

### 6. 테스트 실행

테스트를 실행하려면 다음 명령어를 사용합니다.

```bash
npm test
```

테스트 커버리지를 확인하려면 다음과 같이 실행합니다.

```bash
npm test -- --coverage
```

## API 명세

### 게시글

#### 게시글 목록 조회

- **URL**: `GET /posts`
- **쿼리 파라미터**:
  - `page`: 페이지 번호 (기본값: 1)
  - `size`: 페이지 당 항목 수 (기본값: 10)
  - `search`: 제목 검색어
  - `author`: 작성자 이름
- **응답 예시**:

```json
[
  {
    "id": 1,
    "title": "첫 번째 게시글",
    "content": "<p>내용입니다.</p>",
    "authorName": "작성자",
    "createdAt": "2023-10-01T12:00:00.000Z",
    "updatedAt": "2023-10-01T12:00:00.000Z"
  }
]
```

#### 게시글 작성

- **URL**: `POST /posts`
- **요청 본문**:

```json
{
  "title": "제목", // 필수
  "content": "<p>내용</p>", // 필수
  "authorName": "작성자", // 필수
  "password": "비밀번호" // **필수**
}
```

- **응답 예시**:

```json
{
  "id": 1,
  "title": "제목",
  "content": "<p>내용</p>",
  "authorName": "작성자",
  "createdAt": "2023-10-01T12:00:00.000Z",
  "updatedAt": "2023-10-01T12:00:00.000Z"
}
```

- **응답 예시**:

```json
{
  "message": "비밀번호는 필수 입력 사항입니다."
}
```

#### 게시글 수정

- **URL**: `PUT /posts/:id`
- **요청 본문**:

```json
{
  "title": "수정된 제목",
  "content": "<p>수정된 내용</p>",
  "password": "비밀번호"
}
```

- **응답 예시**:

```json
{
  "id": 1,
  "title": "수정된 제목",
  "content": "<p>수정된 내용</p>",
  "authorName": "작성자",
  "createdAt": "2023-10-01T12:00:00.000Z",
  "updatedAt": "2023-10-02T15:00:00.000Z"
}
```

#### 게시글 삭제

- **URL**: `DELETE /posts/:id`
- **요청 본문**:

```json
{
  "password": "비밀번호"
}
```

- **응답 예시**:

```json
{
  "message": "삭제되었습니다."
}
```

### 댓글

#### 댓글 목록 조회

- **URL**: `GET /comments/:postId`
- **쿼리 파라미터**:
  - `page`: 페이지 번호 (기본값: 1)
  - `size`: 페이지 당 항목 수 (기본값: 10)
- **응답 예시**:

```json
[
  {
    "id": 1,
    "content": "<p>첫 번째 댓글</p>",
    "authorName": "댓글 작성자",
    "createdAt": "2023-10-01T13:00:00.000Z",
    "replies": [
      {
        "id": 2,
        "content": "<p>대댓글</p>",
        "authorName": "대댓글 작성자",
        "createdAt": "2023-10-01T14:00:00.000Z"
      }
    ]
  }
]
```

#### 댓글 작성

- **URL**: `POST /comments/:postId`
- **요청 본문**:

```json
{
  "content": "<p>댓글 내용</p>",
  "authorName": "작성자",
  "parentId": null // 대댓글인 경우 부모 댓글의 ID
}
```

- **응답 예시**:

```json
{
  "id": 1,
  "content": "<p>댓글 내용</p>",
  "authorName": "작성자",
  "createdAt": "2023-10-01T13:00:00.000Z",
  "postId": 1,
  "parentId": null
}
```

#### 댓글 수정

- **URL**: `PUT /comments/:commentId`
- **요청 본문**:

```json
{
  "content": "<p>수정된 댓글 내용</p>"
}
```

- **응답 예시**:

```json
{
  "id": 1,
  "content": "<p>수정된 댓글 내용</p>",
  "authorName": "작성자",
  "createdAt": "2023-10-01T13:00:00.000Z",
  "postId": 1,
  "parentId": null
}
```

#### 댓글 삭제

- **URL**: `DELETE /comments/:commentId`
- **요청 본문**:

```json
{
  "password": "비밀번호" // 비밀번호 검증이 필요한 경우
}
```

- **응답 예시**:

```json
{
  "message": "삭제되었습니다."
}
```

## 사용된 기술 스택

- **Node.js**: 서버 사이드 런타임
- **TypeScript**: 자바스크립트의 슈퍼셋인 프로그래밍 언어
- **Express**: 웹 프레임워크
- **Prisma ORM**: 데이터베이스 ORM
- **MySQL**: 관계형 데이터베이스
- **Jest**: 테스트 프레임워크
- **Supertest**: HTTP 테스트 라이브러리
- **sanitize-html**: HTML 정제 라이브러리
- **ESLint**: 코드 린팅 도구
- **Prettier**: 코드 포매터
- **cors**: Cross-Origin Resource Sharing을 위한 미들웨어
- **body-parser**: 요청 본문 파싱을 위한 미들웨어

## 추가 정보

- **비밀번호 필수 입력**: 게시글 작성 시 비밀번호 입력은 필수입니다. 비밀번호는 게시글 수정 및 삭제 시 사용됩니다.
- **리치 텍스트 지원**: 게시글과 댓글의 `content` 필드는 리치 텍스트(Rich Text)를 지원하며, HTML 형식으로 저장됩니다. 이를 통해 이모티콘이나 다양한 스타일이 적용된 글자를 저장할 수 있습니다.
- **XSS 방지**: XSS 공격을 방지하기 위해 입력된 HTML은 서버에서 `sanitize-html` 라이브러리를 사용하여 정제됩니다.
- **테스트**: 실제 데이터베이스에 연결하지 않고도 테스트할 수 있도록 Prisma Client를 모킹하여 Jest를 사용한 테스트 코드를 작성하였습니다.
- **코드 품질 유지**: ESLint와 Prettier를 사용하여 코드 스타일과 품질을 유지하고 있습니다.
- **키워드 알림 기능**: 실제 알림을 보내는 대신 콘솔에 로그를 출력합니다.
- **키워드 등록/삭제 기능**: 구현되지 않았으며, 데이터베이스에 미리 데이터를 삽입하여 테스트할 수 있습니다.
- **에러 처리**: 기본적인 `try-catch` 문을 사용하여 에러를 처리합니다.

### 에러 처리 예시

컨트롤러에서 서비스 레이어에서 던진 예외를 받아 적절한 HTTP 상태 코드와 메시지로 클라이언트에 전달합니다.

```typescript
// 예시: src/controllers/postController.ts

import { Request, Response } from 'express';
import { createPostService } from '../services/postService';
import { HttpError } from '../errors/HttpError';

export const createPost = async (req: Request, res: Response) => {
  try {
    const post = await createPostService(req.body);
    res.json(post);
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error('Error in createPost:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  }
};
```

### 설정 파일

- **TypeScript 설정 (`tsconfig.json`)**: TypeScript 컴파일러 설정 파일로, 컴파일 옵션이 정의되어 있습니다.
- **ESLint 설정 (`.eslintrc.js`)**: ESLint 설정 파일로, 코드 린팅 규칙이 정의되어 있습니다.
- **Prettier 설정 (`.prettierrc`)**: Prettier 설정 파일로, 코드 포매팅 규칙이 정의되어 있습니다.
- **Git 무시 파일 (`.gitignore`)**: Git에서 추적하지 않을 파일과 디렉토리를 지정합니다.

### 테스트 실행 방법

테스트를 실행하려면 다음 명령어를 사용합니다.

```bash
npm test
```

## 문의 사항

프로젝트 관련 문의 사항이나 개선 사항이 있으시면 이슈 트래커나 이메일(s.moo.d89@gmail.com)로 연락해주세요.

---

**주의사항**: 이 프로젝트는 교육 목적으로 작성되었으며, 실제 운영 환경에서 사용하려면 보안 및 성능 측면에서 추가적인 검토와 수정이 필요합니다.
