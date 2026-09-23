# 이민재 개인 웹사이트

Apple 제품 페이지 스타일(넓은 여백, 큰 타이포그래피, 스크롤 리빌 애니메이션)을
참고해서 만든 개인 웹사이트 기본 뼈대입니다. 순수 HTML / CSS / JS로만
작성되어 있어서 별도의 빌드 과정 없이 바로 수정하고 배포할 수 있습니다.

## 폴더 구조

```
personal-website/
├── index.html          # 랜딩 페이지 (자기소개 + 프로젝트/블로그 미리보기)
├── portfolio.html       # 포트폴리오 (프로젝트별 상세 섹션)
├── blog.html            # 블로그 (목록 + 상세, data/posts.json 기반)
├── css/
│   └── style.css        # 전체 디자인 시스템 (색상, 타이포, 애니메이션)
├── js/
│   └── main.js           # 네비게이션, 스크롤 애니메이션, 블로그 렌더링
└── data/
    └── posts.json        # 블로그 글 데이터
```

## 로컬에서 확인하기

`blog.html`이 `fetch`로 `data/posts.json`을 불러오기 때문에, 파일을
더블클릭해서 `file://`로 여는 것으로는 정상 동작하지 않을 수 있습니다
(브라우저의 로컬 파일 보안 정책 때문입니다). 아래처럼 로컬 서버를 하나
띄워서 확인하는 것을 추천합니다.

```bash
# Python이 있다면
cd personal-website
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 접속

# Node.js가 있다면
npx serve .
```

VS Code를 쓴다면 "Live Server" 확장을 설치해서 `index.html`에서
"Open with Live Server"를 눌러도 됩니다.

## 블로그 글 추가하는 방법

`data/posts.json`에 아래 형태의 객체를 배열에 추가하면 목록과 상세
페이지에 자동으로 반영됩니다.

```json
{
  "id": "unique-post-id",
  "title": "글 제목",
  "date": "2026-10-01",
  "tags": ["태그1", "태그2"],
  "excerpt": "목록에 보일 한두 줄 요약",
  "content": "<p>본문은 HTML로 작성합니다. &lt;h2&gt;로 소제목, &lt;p&gt;로 문단을 나눌 수 있습니다.</p>"
}
```

- `id`는 URL(`blog.html?post=id`)에 그대로 쓰이므로 영문/숫자/하이픈만 쓰는 걸 추천합니다.
- 글이 많아지면 매번 HTML을 문자열로 쓰는 게 번거로울 수 있습니다. 그때는
  [Astro](https://astro.build)나 [11ty](https://www.11ty.dev/) 같은 정적
  사이트 생성기로 옮겨서 마크다운으로 글을 쓰는 방식을 고려해보세요.
  지금 구조(제목/날짜/태그/본문)를 그대로 옮기면 되기 때문에 전환이
  어렵지 않습니다.

## 포트폴리오 프로젝트 추가하는 방법

`portfolio.html`에서 `.showcase__item` 섹션 하나를 복사해서 내용을
바꾸면 됩니다. 이미지가 준비되면 `.showcase__visual`의 배경 그라데이션
자리에 `<img src="..." alt="...">` 태그를 넣어 교체하세요.

## 배포하기

정적 파일만으로 이루어져 있어서 아래 서비스 어디에든 무료로 배포할 수
있습니다.

- **GitHub Pages**: 이 폴더를 저장소에 올리고 Settings → Pages에서
  브랜치를 지정하면 끝입니다.
- **Vercel / Netlify**: 저장소를 연결하면 push할 때마다 자동 배포됩니다.
  빌드 명령어는 따로 없고, Output/Publish 디렉터리를 저장소 루트로
  지정하면 됩니다.

도메인을 연결하고 싶다면 가비아, Namecheap 같은 곳에서 도메인을 구매한
뒤 위 서비스들의 "Custom Domain" 설정에서 연결하면 됩니다.

## 디자인 커스터마이징

`css/style.css` 최상단 `:root` 블록에 색상, 여백, 애니메이션 속도 등이
변수로 정리되어 있습니다. 예를 들어 강조 색상을 바꾸고 싶으면
`--accent` 값만 바꾸면 버튼, 링크, 태그 색이 모두 함께 바뀝니다.

```css
:root {
  --accent: #0071e3; /* 강조 색상 */
  --bg: #ffffff;      /* 기본 배경 */
  --text: #1d1d1f;    /* 기본 텍스트 색상 */
}
```

## 다음에 해보면 좋을 것들

- 프로젝트 스크린샷/GIF/플레이 가능한 WebGL 빌드를 `.showcase__visual`
  자리에 임베드하기
- 블로그 글이 많아지면 태그별 필터링 기능 추가하기
- Open Graph 메타 태그를 추가해서 링크 공유 시 미리보기가 뜨도록 하기
- Lighthouse로 성능/접근성 점검하기
