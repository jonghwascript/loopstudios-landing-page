# Figma → HTML + SCSS 구현 지침

Figma 디자인과 **모양·동작이 일치하는 HTML과 SCSS**를 완성합니다.

먼저 [figma-guide.md](figma-guide.md)의 공통 규칙을 읽고 따릅니다. [figma-html.md](figma-html.md)로 만든 HTML이 이미 있으면 그 HTML과 스타일 인계표에서 출발합니다. 이때 구조 변경은 스타일 적용에 꼭 필요한 만큼만 하고 보고합니다.

## 범위

| 구분 | 대상 |
| --- | --- |
| 수정 | `src/pages/`, `src/images/`, `src/scss/`, 상호작용이 필요하면 `src/js/main.js` |
| 수정 금지 | `dist/` |
| 사용 금지 | 인라인 `style`, `<style>` 요소 |

## 절차

### 1. 준비

공통 §1(시작 전 확인), §2(MCP 호출), §3(자산)을 수행합니다.

### 2. 프로젝트 기반 값 교체 (새 챌린지에서 한 번)

이 저장소는 이전 챌린지의 값이 남아 있는 템플릿입니다. 컴포넌트를 쓰기 전에 기반 값을 이번 디자인으로 바꿉니다.

| 파일 | 할 일 |
| --- | --- |
| `src/scss/abstracts/_variables.scss` | `$font-primary`, 색상, 글자 크기 변수를 이번 디자인 값으로 교체합니다. 이전 토큰은 `grep`으로 사용처가 없는지 확인한 뒤 지웁니다. |
| `src/scss/abstracts/_variables.scss`의 `$breakpoints` | `style-guide.md`나 디자인에 근거가 있는 값으로 바꿉니다. 근거가 없으면 사용자에게 확인합니다. |
| `src/scss/abstracts/_mixins.scss` | `mq()`는 `math.div`를 쓰는데 `@use 'sass:math';`가 없으면 `mq()` 호출 시 컴파일이 실패합니다. `mq()`를 쓰기 전에 확인하고 추가합니다. |
| `src/scss/base/_fonts.scss` | 웹 폰트 방식을 하나로 정합니다. Google Fonts `<link>`를 쓰면 쓰지 않는 `@font-face`를 정리합니다. 로컬 폰트를 쓰면 `src/fonts/`에 파일을 둡니다(현재 폴더 없음). |
| `src/scss/base/_base.scss` | `body`의 배경색·글자색·글꼴을 토큰으로 바꿉니다. |

### 3. 디자인 값 → 토큰 대응

| Figma | 이 프로젝트 |
| --- | --- |
| 색상 변수 | `_variables.scss`의 kebab-case SCSS 변수. Figma 변수 이름을 따릅니다(예: `Blue/400` → `$blue-400`). |
| 간격 | 모듈러 스케일과 같으면 CSS 변수를 씁니다: 16px `var(--s0)`, 24px `var(--s1)`, 36px `var(--s2)`, 54px `var(--s3)`. 다르면 `rem` 값에 `// 20px`처럼 주석을 붙입니다. |
| 글꼴(크기, 굵기, 줄 간격) | `@include font-style($size, $weight, $line-height)`. 두 번 이상 쓰는 크기는 `$font-size-*` 변수로 뺍니다. |
| 둥글기, 그림자, 오버레이 색 | 두 번 이상 쓰면 변수로 뺍니다. |

단위는 글자 크기·간격·너비에 `rem`, 테두리·그림자에 `px`을 씁니다(`rem` = px ÷ 16). [scss-guide.md](scss-guide.md) §8의 "프로젝트 초기에 단위를 정해 통일한다"는 원칙에 따라 이 지침에서 정한 기준이며, 간격 토큰(`--s0` 등)이 `rem`이기 때문입니다.

### 4. HTML

HTML이 없으면 [figma-html.md](figma-html.md)의 절차 2~4를 수행합니다.

### 5. SCSS 작성

- **파일 위치**: 재사용할 블록(카드, 버튼 등)은 `src/scss/components/_<블록>.scss`, 페이지 배치는 `src/scss/pages/_home.scss`에 둡니다. 새 파셜은 `src/scss/style.scss`의 해당 구역에 `@use`로 추가합니다.
- **파셜 첫 줄**: `@use '../abstracts' as *;`
- **작성 규칙**: [scss-guide.md](scss-guide.md)를 따릅니다.
  - 중첩은 3단계까지, 클래스 선택자만 사용
  - 정해진 선언 순서
  - 미디어 쿼리는 규칙 안에 `@include mq(...)`로 작성
  - 모바일 프레임을 기본 스타일로 하고, `mq('tablet')`·`mq('desktop')`으로 확장(모바일 우선)
- **`l-` 간격 조정**: 프리셋과 다른 간격은 같은 요소의 `c-` 클래스에서 `--space`, `--gutter` 등을 지정합니다.
  - 컴포넌트 파셜은 `style.scss`에서 `layout` 뒤에 불러오므로 같은 명시도에서 이깁니다.
  - `data-space` 같은 속성 선택자는 명시도가 더 높습니다. 그래서 같은 요소에 프리셋과 사용자 지정 값을 함께 쓰지 않습니다.
- **크기**: 고정 너비 대신 `max-inline-size`나 `min(100%, …)`처럼 줄어들 수 있는 값을 씁니다. 이미지 비율은 `aspect-ratio` 또는 `l-frame`으로 지킵니다.

### 6. 상호작용과 상태

- 링크·버튼마다 기본, hover, focus-visible 상태를 목록으로 만들고, Figma 상태 프레임과 대조해 각각 스타일을 작성합니다.
- `focus-visible`에는 hover와 같은 피드백에 눈에 보이는 outline을 더합니다. 브라우저 기본 포커스가 있다고 해서 요구된 hover를 생략하지 않습니다.
- `transition`·`animation`은 `@media (prefers-reduced-motion: reduce)`에서 끕니다.
- JavaScript가 필요하면 `src/js/main.js`에 작성하고, 상태는 `is-` 클래스와 ARIA 속성으로 표현합니다. jQuery는 `src/js/lib/jquery-4.0.0.js`가 있으며, 쓸 때만 `<script>`로 연결합니다.

### 7. 검증

1. SCSS 컴파일: `node -e "require('sass').compile('src/scss/style.scss')"`
2. 미리보기: 공통 §6의 방법을 따릅니다.
3. 시각 비교(Chromium):
   - 모바일·데스크톱 프레임 폭에서 캡처해 `get_screenshot` 결과와 나란히 비교합니다.
   - 주요 요소의 computed style(글자 크기, 굵기, 색, gap, padding, 크기)을 Figma 값과 표로 대조합니다.
4. 반응형:
   - 320px, 각 분기점 직전·직후(예: 1023px과 1024px), 가로 모드에서 가로 넘침과 겹침이 없는지 확인합니다.
   - 텍스트 200% 확대에서도 확인합니다.
5. 상태: 모든 인터랙티브 요소의 hover와 키보드 focus-visible을 캡처합니다. 탭 순서도 확인합니다.
6. Firefox: 실행할 수 있으면 같은 폭에서 확인하고, 아니면 미검증으로 기록합니다.

## 완료 기준

- [ ] [figma-html.md](figma-html.md)의 완료 기준을 만족한다(단, SCSS·JS 수정 금지 항목은 제외)
- [ ] 이전 챌린지 토큰을 교체·정리했고, 디자인 값은 변수 또는 모듈러 스케일로 표현했다
- [ ] Figma에서 옮긴 고정 너비·절대 위치가 없거나, 남긴 이유를 보고했다
- [ ] 모바일·데스크톱 캡처가 Figma 스크린샷과 일치하고, 차이는 보고서에 적었다
- [ ] 분기점 직전·직후, 320px, 200% 확대에서 넘침·겹침이 없다
- [ ] 모든 인터랙티브 요소에 hover·focus-visible 상태가 있고, reduced motion을 처리했다
- [ ] SCSS 컴파일이 통과하고, 실행한 검사와 미검증 항목을 구분해 보고했다
