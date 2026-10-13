# Figma 디자인 구현 지침 (공통)

Figma MCP로 받은 디자인을 이 저장소의 정적 HTML(+SCSS)로 구현할 때 따르는 공통 규칙입니다. 작업 범위에 맞는 문서를 하나 골라 이 문서와 함께 따릅니다.

| 문서 | 결과물 | 수정하는 곳 |
| --- | --- | --- |
| [figma-html.md](figma-html.md) | 완성된 HTML, 자산, 스타일 인계표 | `src/pages`, `src/images` |
| [figma-html-css.md](figma-html-css.md) | 완성된 HTML과 SCSS | 위 항목 + `src/scss`, 필요 시 `src/js` |

요청 예시:

```text
doc/figma-html.md 지침대로 아래 Figma 프레임을 구현해 줘.
- 모바일: https://www.figma.com/design/<파일키>/<이름>?node-id=1-2
- 데스크톱: https://www.figma.com/design/<파일키>/<이름>?node-id=1-3
- 상태(hover 등): https://www.figma.com/design/<파일키>/<이름>?node-id=1-4
```

작업 전체에는 [AGENTS.md](../AGENTS.md)의 작업·검증·보고 원칙이 함께 적용됩니다. 규칙 문서를 생성하는 이전 프롬프트는 [figma-rules-prompt.md](figma-rules-prompt.md)로 옮겼습니다.

---

## 1. 시작 전 확인

- **Figma MCP 연결**: 도구 호출이 실패하거나 인증이 필요하면 작업을 멈추고 보고합니다. 사용자가 허락하지 않는 한 `preview.jpg`나 추측으로 디자인을 대신하지 않습니다.
- **프레임 확정**: 모바일·데스크톱·상태(hover, active 등) 프레임이 필요합니다. URL에 `node-id`가 없거나 일부만 주어지면 `get_metadata`로 프레임 목록(이름, 크기)을 보여 주고 어느 프레임이 무엇인지 확인받습니다.
- **요구사항**: `README.md`의 "Your users should be able to" 목록을 검증 항목으로 옮깁니다. `style-guide.md`(gitignore 대상)가 있으면 색상·글꼴·분기점 근거로 함께 읽습니다.
- **기존 변경 보존**: `git status`로 `src/pages/index.html` 등에 사용자 변경이 있는지 확인합니다. 덮어써야 하면 먼저 알립니다.

## 2. Figma MCP 호출 순서

1. `get_metadata`: 노드 맵과 프레임 크기(모바일 폭, 데스크톱 폭)를 확인합니다.
2. `get_design_context`: 프레임마다 실행합니다. 응답이 크거나 잘리면 1의 결과에서 하위 노드를 골라 나눠서 가져옵니다.
3. `get_screenshot`: 프레임마다 실행합니다. 구현 후 비교 기준이 됩니다.
4. `get_variable_defs`(제공되는 경우): 색상·간격·서체 변수의 이름과 값을 확인합니다.
5. 1~4를 모두 확보한 뒤에 자산을 처리하고 구현을 시작합니다.

MCP 출력(보통 React + Tailwind)은 **디자인 값과 구조를 읽는 참고 자료**입니다. JSX, Tailwind 클래스, 절대 위치 값을 그대로 옮기지 않습니다.

## 3. 자산

### 사용 우선순위

1. `src/images`에 챌린지가 제공한 자산(`icon-*.svg`, `image-*.jpg` 등)이 있고 Figma와 같은 그림이면 **제공 자산을 사용**합니다. 이미 최적화되어 있습니다(README "The assets are already optimized").
2. 제공 자산이 없으면 MCP가 준 자산 URL에서 내려받아 `src/images`에 저장합니다. localhost URL은 MCP 서버가 켜져 있을 때만 동작하므로 **소스에 localhost 주소를 남기지 않습니다**.
3. 아이콘 패키지를 설치하거나 placeholder 이미지를 만들지 않습니다. 자산을 구할 수 없으면 보고합니다.

### 저장 규칙

- 이름은 kebab-case로 짓습니다. 아이콘은 `icon-<이름>.svg`, 사진·그림은 `image-<이름>.<확장자>` 형식입니다. 같은 그림을 다른 이름(`figma-*` 등)으로 중복 저장하지 않습니다.
- 래스터 이미지는 `file src/images/<파일>`로 픽셀 크기를 확인합니다. 표시 크기의 2배를 넘거나 표시 비율과 다르면(예: 1920×1080 이미지를 정사각형으로 표시) 다시 내보내거나 제공 자산을 씁니다.
- Figma에서 내보낸 SVG의 `style="display: block;"`과 `preserveAspectRatio="none"`은 지웁니다. `none`은 크기를 바꿀 때 그림 비율을 왜곡합니다.
- 경로는 HTML에서 `./images/<파일>`, SCSS에서 `../images/<파일>`을 씁니다. 빌드 시 `src/images`는 `dist/images`로, CSS는 `dist/css`로 출력됩니다(`gulpfile.js`의 `staticTask`, `scssTask`).

## 4. HTML 작성 규칙

수정 대상은 `src/pages/index.html`입니다. 여러 페이지가 공유하는 마크업은 `src/partials/`에 두고 `@@include('../partials/<파일>.html')`로 불러옵니다(`basepath: '@file'`). `src/partials` 폴더는 현재 없으므로 필요할 때 만듭니다.

### 문서

- `<html lang="en">`과 챌린지 이름이 담긴 `<title>`을 둡니다. 예: `Frontend Mentor | NFT preview card component`
- 파비콘과 `./css/style.css` 링크를 유지합니다.
- Google Fonts를 쓰면 `preconnect` 두 줄과 `display=swap` 링크를 `<head>`에 둡니다.
- 로컬 글꼴을 쓰면 파일을 `src/fonts`에 저장하고 [_fonts.scss](../src/scss/base/_fonts.scss)의 `@font-face`를 실제 파일 이름·굵기 범위로 바꿉니다. 현재 파일에는 `src/fonts`에 없는 Work Sans 예시가 등록되어 있으므로, 로컬 글꼴을 쓰지 않으면 예시를 지우거나 그대로 두고 해당 서체를 지정하지 않습니다. CSS 기준 경로는 `../fonts/<파일>`입니다.
- `src/js/main.js`는 현재 비어 있습니다. 상호작용이 없으면 스크립트를 연결하지 않습니다.

### 구조와 의미

- 주요 콘텐츠는 `<main>`에 둡니다. 페이지의 대표 제목은 `<h1>` 하나로 하고, 제목 단계를 건너뛰지 않습니다.
- 텍스트는 Figma 텍스트 레이어 그대로 옮깁니다. 오타로 보이는 문구는 고치지 말고 보고합니다.
- 이동은 `<a href>`, 동작은 `<button type="button">`으로 구분합니다. 목적지를 알 수 없는 링크는 `href="#"`로 두고 보고서에 placeholder로 적습니다.
- 같은 목적지로 가는 링크가 여러 개면(예: 이미지와 제목) 의도를 보고서에 적습니다.

### 이미지와 아이콘

- `<img>`에는 표시 크기(CSS px) 기준의 `width`·`height`를 넣습니다.
- 정보를 전달하는 이미지는 내용을 설명하는 `alt`를 씁니다.
- 바로 옆 텍스트가 같은 의미를 전달하는 아이콘·아바타, 장식 이미지는 `alt=""`로 둡니다.
- hover 오버레이처럼 시각 효과만 담당하는 요소는 `aria-hidden="true"`로 숨깁니다.

### 클래스 이름 ([scss-guide.md](scss-guide.md) §2)

| 접두사 | 용도 |
| --- | --- |
| `c-<블록>__<요소>--<변형>` | 생김새 (BEM) |
| `l-` | 배치·간격. [layout-guide.md](layout-guide.md)의 기존 클래스 사용 |
| `is-` | JavaScript가 바꾸는 상태 |
| `u-` | 유틸리티 (`u-sr-only`, `u-hidden`) |

- 클래스 이름은 역할 기준으로 짓습니다. Figma 레이어 이름(`Frame 1268`, `Group 5`)을 그대로 쓰지 않습니다.
- ID는 `aria-labelledby`, `label`, JavaScript 연결에만 씁니다.
- 인라인 `style`과 `<style>` 요소는 쓰지 않습니다. 템플릿의 attribution `<style>` 블록도 구현할 때 컴포넌트 SCSS(예: `src/scss/components/_attribution.scss`의 `.c-attribution`)로 옮기고 블록을 지웁니다. 옮긴 뒤 `.attribution` 클래스와 SCSS 선택자가 일치하는지 확인합니다.

## 5. Auto Layout → `l-` 클래스 대응

Auto Layout은 Figma에서 자식 요소를 방향·간격·정렬 규칙으로 배치하는 기능이며, CSS Flexbox에 대응합니다. Auto Layout에 담긴 의도를 따르되 그대로 복사하지 않습니다.

- **따른다**: 방향, gap·padding 값, 정렬, Hug(내용에 맞춤)·Fill(부모 채움) 구분
- **프레임 구조를 그대로 옮기지 않는다**: Auto Layout 프레임마다 `div`를 만들지 않습니다. HTML은 콘텐츠 의미 기준으로 묶고, 각 묶음에 Auto Layout 값을 적용합니다.
- **Fixed 크기는 최대 크기로 바꾼다**: 예를 들어 `width: 350px` 대신 `max-inline-size` 또는 `min(100%, …)`을 씁니다.
- **모바일·데스크톱 프레임은 HTML 하나로 만든다**: 두 프레임의 차이는 미디어 쿼리로 표현합니다.
- **직접 flex를 작성하기 전에 아래 `l-` 클래스를 먼저 찾는다**.
- Figma 프레임 폭이 아닌 화면에서의 동작(줄바꿈, 축소)은 디자인에 정의되어 있지 않습니다. 구현할 때 정하고 보고서에 적습니다.

표의 값은 루트 글꼴 16px 기준입니다(1rem = 16px).

| Figma | 이 프로젝트 | 주의 |
| --- | --- | --- |
| 세로 방향 + gap | `l-stack` — 기본 1.5rem(24px), `data-space="small"` 0.75rem(12px), `"normal"` 1rem(16px), `"large"` 3rem(48px) | 맞는 프리셋이 없으면 SCSS에서 `--space` 지정. 모바일·태블릿·데스크톱별로 gap이 다르면 `data-space`를 쓰지 않고 컴포넌트 SCSS의 미디어 쿼리에서 `--space`를 지정(`data-space`의 명시도가 더 높아 미디어 쿼리 값을 덮어씀) |
| 가로 방향, 줄바꿈 또는 양 끝 정렬 | `l-cluster` — 기본 1rem, `data-gap="small"` 0.5rem, `"normal"` 1rem, `"large"` 1.5rem, `data-justify="start"`·`"between"` | 기본 가로·세로 정렬이 `center`이므로 왼쪽 정렬은 `data-justify="start"` 지정. 공간이 부족하면 줄바꿈됨. 모바일·태블릿·데스크톱별로 gap이 다르면 `data-gap`을 쓰지 않고 컴포넌트 SCSS의 미디어 쿼리에서 `--space`를 지정(`data-gap`의 명시도가 더 높아 미디어 쿼리 값을 덮어씀). 화면 크기별로 정렬이 다를 때도 같은 이유로 `data-justify`를 쓰지 않고 미디어 쿼리에서 `justify-content`를 지정 |
| 아이콘 + 텍스트 (가로) | `l-with-icon` + 아이콘에 `l-icon icon` | 아이콘 크기 `0.75em`(지원 시 `1cap`), 간격 `--icon-space`(기본 0.5em) |
| 사이드바 + 본문 | `l-with-sidebar` — 간격 `--gutter`(기본 1.5rem) | 두 직계 자식 구조. 첫 자식 기준 너비 20rem, 좁아지면 위아래로 배치 |
| 가로 스크롤 목록 | `l-reel` — `--item-width`(기본 25ch), 간격 `--space`(기본 1rem) | 항목이 줄어들지 않고 가로 스크롤됨 |
| 화면 높이 전체 + 가운데 콘텐츠 | `l-cover` + 가운데 직계 자식에 `.center`(또는 직계 `h1`) | `min-block-size: 100vh`, 패딩 `--space`(기본 1.5rem) |
| 최대 너비 + 가운데 정렬 | `l-center` — `--measure`(기본 60ch), `--gutter-inline`, 텍스트 가운데 정렬 `data-align-text`, 자식 고유 너비로 가운데 모음 `data-intrinsic` | `box-sizing: content-box` |
| 고정 비율 이미지 | `l-frame` — `--n`/`--d`(기본 16/9) | 직계 `img`는 `object-fit: cover`로 잘릴 수 있음 |
| 겹쳐서 중앙 배치(오버레이 아이콘 등) | `l-imposter` | 부모에 `position: relative` 필요 |
| 폭에 따라 가로↔세로 전환 | `l-switcher` — `--threshold`(기본 30rem) | 자식 5개 이상이면 항상 세로 |
| 카드 목록(열 수 자동) | `l-grid` — `--minimum`(기본 20ch) | 간격은 1rem 고정이며 변수가 없음. 다른 간격은 컴포넌트 SCSS에서 `gap` 지정 |
| 패딩·배경·둥글기·그림자 | `c-` 컴포넌트 SCSS 또는 `l-box` | `l-box`는 `--padding`, `--color-light`, `--color-dark`, `--border-color`, `--border-thin`, `--border-radius`를 컴포넌트 SCSS에서 재정의해 사용. 그림자는 제공하지 않음 |
| 구분선 | `c-` 컴포넌트 SCSS의 `border` | `l-stack-divided`는 색(`#e2e8f0`)과 간격이 고정됨 |
| 절대 위치 | 위 패턴으로 대체. 불가능할 때만 `position` 사용 후 보고 | |

## 6. 검증 공통 사항

### 미리보기 만들기

`npm run build`와 `npm run dev`는 모두 `cleanTask`로 `dist`를 삭제하므로 실행하지 않습니다([AGENTS.md](../AGENTS.md)). 아래 두 방법 중 하나를 씁니다.

**방법 A (기본, `dist`를 건드리지 않음)**: 작업용 임시 폴더에 `dist`와 같은 구조를 만듭니다.

```bash
P=<임시 폴더>
mkdir -p "$P/css" "$P/images"
cp src/pages/index.html "$P/"
cp -r src/images/. "$P/images/"
cp -r src/js src/fonts "$P/"
node -e "require('fs').writeFileSync(process.argv[1], require('sass').compile('src/scss/style.scss').css)" "$P/css/style.css"
```

빌드의 `staticTask`처럼 `src/images`, `src/js`, `src/fonts`를 함께 복사합니다. 이 방법은 `@@include`를 처리하지 않습니다. include를 쓰면 방법 B를 씁니다.

**방법 B**: 삭제 단계가 없는 개별 작업을 실행합니다. `dist` 파일을 덮어씁니다.

```bash
npx gulp html
npx gulp scss
npx gulp static
```

`dist`는 gitignore 대상이라 Git으로 변경을 확인할 수 없습니다. 실행 전에 `dist`에만 있는 수정이 없는지 사용자에게 확인합니다.

### 브라우저

- `@playwright/test`의 Chromium으로 캡처·측정합니다. Firefox 브라우저가 설치되어 있지 않으면 미검증으로 기록합니다.
- 이미지 로드 실패(`naturalWidth === 0`)와 콘솔의 404 오류가 없는지 확인합니다.
- 가로 넘침이 없는지 확인합니다(`document.documentElement.scrollWidth`가 viewport 폭 이하).
- 탭 순서와 각 링크·버튼의 접근 가능한 이름을 확인합니다.
- HTML 유효성 검사 도구는 저장소에 없습니다. 사용자 허락 없이 외부 검사 서비스에 소스를 올리지 않으며, 실행하지 못하면 미검증으로 기록합니다.

### 보고

[AGENTS.md](../AGENTS.md) "결과 보고" 형식을 따릅니다. Figma와 일치하지 않는 부분, placeholder, 의도적으로 남긴 차이를 구분해서 적습니다.
