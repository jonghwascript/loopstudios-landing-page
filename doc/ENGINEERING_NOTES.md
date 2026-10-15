# Engineering Notes

## 시맨틱 HTML 리뷰 (2026-10-13)

- 대상: [src/pages/index.html](../src/pages/index.html) 작업본(미커밋)
- 기준: [semantic-html-guide.md](semantic-html-guide.md), [figma-guide.md](figma-guide.md) §4
- 범위: 소스 정적 검토. 빌드·브라우저 검증은 하지 않았습니다(하단 검증 상태 참고).
- SCSS에는 아직 `c-hero`, `c-creations` 등 컴포넌트 선택자가 없습니다. 클래스 오타는 현재 화면에 영향이 없지만 스타일 작성 시 맞춰야 합니다.

### 해결됨

| 항목 | 내용 |
| --- | --- |
| 스타일시트 링크 | 템플릿의 `<link rel="stylesheet" href="./css/style.css" />`가 지워졌다가 복구됨 |
| 이미지 경로 | `../images/...`는 빌드 결과 `dist/index.html` 기준으로 `dist` 밖을 가리켜 404였음. `./images/...`로 통일됨 |

### 미해결 — 높음

**1. `<picture>` 분기 조건 반전 (8개 중 7개 남음)**

- 위치: [index.html:86](../src/pages/index.html#L86), 107, 128, 149, 170, 191, 212
- 근거: `media="(max-width: 1024px)"`이면 1024px 이하에서 데스크톱 이미지가 나옵니다. SCSS는 mobile-first이며 데스크톱 분기점은 `min-width` 1024px입니다([_variables.scss](../src/scss/abstracts/_variables.scss)).
- 개선: Fisheye 카드([234](../src/pages/index.html#L234))처럼 `media="(min-width: 64em)"`로 통일합니다(가이드 §9).

**2. 햄버거 버튼 연결 미완성**

- 위치: [index.html:51-54](../src/pages/index.html#L51-L54)
- 해결된 부분: `<div>`에서 `<button type="button">`으로 바뀌었고, `aria-expanded`와 `u-sr-only` 이름이 있습니다.
- 남은 부분:
  - `aria-controls=""`가 비어 있습니다. 메뉴 `<ul>`에 `id`를 주고 그 값을 연결해야 합니다.
  - 버튼에 클래스가 없어 데스크톱 숨김 등 스타일을 지정할 수 없습니다.
  - [main.js](../src/js/main.js)가 비어 있고 HTML에 연결되지 않아, 열기·닫기와 `aria-expanded` 전환, `icon-close.svg` 교체가 동작하지 않습니다.
  - 메뉴 동작을 구현하면 [AGENTS.md](../AGENTS.md) §3 상태표(포커스 복원, 숨긴 메뉴 접근 차단, 분기점 전환)를 검증합니다.

### 미해결 — 중간

**3. 사이트 헤더가 `<main>` 안에 있음**

- 위치: [index.html:29-31](../src/pages/index.html#L29-L31)
- 근거: `<header>`는 `body` 바로 아래에 있을 때만 `banner` 랜드마크가 됩니다(가이드 §3). 현재 banner가 없고, 주 메뉴가 본문 랜드마크에 포함됩니다.
- 개선: `<header>`를 `<main>` 앞으로 옮기고 히어로 배경은 CSS로 처리합니다.

**4. 로고에 접근 가능한 이름 없음**

- 위치: [index.html:32](../src/pages/index.html#L32)
- 근거: 로고가 `alt=""`라서 회사명이 전달되지 않습니다(가이드 §2, §9).
- 개선: `<a href="#"><img src="./images/logo.svg" alt="Loopstudios" width height /></a>`. `href="#"`은 placeholder로 기록합니다.
- 푸터 로고([255](../src/pages/index.html#L255))는 중복이라 `alt=""`도 가능하지만, 링크로 만들면 이름이 필요합니다.

**5. 카드 제목이 공백 없이 읽힘**

- 위치: [index.html:98](../src/pages/index.html#L98) 외 7곳
- 근거: `<span>DEEP</span><span>EARTH</span>` 사이에 공백이 없어 링크 이름과 제목이 "DEEPEARTH"로 계산됩니다.
- 개선: span 사이에 공백을 넣고 줄바꿈은 CSS로 처리합니다.

**6. FROM UP ABOVE VR 카드 이미지 불일치**

- 위치: [index.html:169](../src/pages/index.html#L169), 174
- 근거: `image-grid.jpg`를 쓰고 있습니다. `image-from-above.jpg`가 `src/images/mobile`과 `src/images/desktop`에 모두 있습니다.

**7. `<h1>`의 클래스가 속성으로 작성됨**

- 위치: [index.html:57](../src/pages/index.html#L57)
- 근거: `<h1 c-hero__text>`는 `c-hero__text`라는 속성입니다. `class="c-hero__text"`로 고쳐야 합니다.

**8. 건너뛰기 링크 없음**

- 근거: 헤더 내비게이션이 있으므로 가이드 §2 기준 적용 대상입니다. 대상 `id="main"`은 이미 있습니다.
- 개선: `body` 첫 요소로 `<a class="c-skip-link" href="#main">Skip to main content</a>`를 둡니다.

### 미해결 — 낮음

- **대문자 직접 입력:** `OUR CREATIONS`, `SEE ALL`, 카드 제목. 일부 스크린 리더가 약어처럼 읽을 수 있습니다. 가이드는 모양을 CSS(`text-transform`)로 정하라고 하고, figma-guide §4는 Figma 텍스트를 그대로 옮기라고 합니다. 어느 쪽을 따를지 결정이 필요합니다.
- **`aria-hidden="true"` 중복:** 카드 이미지가 이미 `alt=""`이므로 필요 없습니다.
- **카드 이미지 크기:** 모바일 크기 327×120만 있습니다. 데스크톱 이미지 비율이 다르면 `<source>`에도 `width`/`height`를 지정합니다.
- **카피라이트 요소:** `<span class="c-footer__copyright">`는 `<p><small>…</small></p>`가 적합합니다(가이드 §6).
- **SNS 링크 이름:** `facebook` 등 소문자입니다. 브랜드 표기(`Facebook`)를 권장합니다.
- **클래스명 오타·불일치:**
  - `c-haeder__link`: 헤더와 푸터에서 함께 쓰며, 푸터에서는 역할과도 맞지 않습니다.
  - `c-interactive__dcescription`
  - `c_creations__*`: 언더스코어 접두사가 `c-` 규칙(scss-guide §2)과 다르고, 같은 블록에 `c-creations__link`와 `c_creations__link`가 섞여 있습니다.
- **attribution `<style>` 블록:** figma-guide §4는 SCSS로 옮기라고 합니다.

### 가이드에 맞게 된 부분

- `lang="en"`, 채워진 `<title>`, 하나뿐인 `<main>`
- 두 `<nav>`가 `Main`·`Footer`로 구분되고, 이름에 "navigation"이 없음
- `<h1>` 하나, `h1 → h2 → h3` 순서로 단계를 건너뛰지 않음
- 메뉴·카드·SNS를 `<ul>`로 마크업
- 카드 링크 안에 이미지와 제목을 넣었고, 인터랙티브 요소가 중첩되지 않음
- SNS 아이콘은 `alt=""`, 이름은 `u-sr-only` 텍스트로 제공
- 목적지가 없는 링크는 `href="#"` placeholder로 처리(실제 목적지 미정)

### 검증 상태

| 항목 | 상태 |
| --- | --- |
| 가이드 대조 정적 검토 (HTML, gulpfile, SCSS 분기점, 이미지 파일 목록) | 검증 완료 |
| 빌드 (`npm run build`는 `dist`를 삭제하므로 실행하지 않음) | 미검증 |
| 브라우저 접근성 트리, 키보드, 스크린 리더 | 미검증 |

## 모바일 메뉴 슬라이드 패널 (2026-10-14)

- 대상: [_home.scss](../src/scss/pages/_home.scss)의 `.c-header__navigation`, `.c-navigation__outer`, [index.html](../src/pages/index.html)의 `#mainNav`
- 방식: 소스 대조 + Chromium(Playwright) 측정. SCSS는 scratchpad에 별도로 컴파일했고 `dist`는 사용하지 않았습니다.
- `main.js`가 비어 있어 열림 상태는 `.c-header__navigation`에 `is-open` 클래스를 직접 붙여 확인했습니다.

### 증상과 원인

**1. 패널을 화면 밖으로 옮기면 가로 스크롤이 생김**

- 증상: 닫힌 패널을 `transform: translateX(100%)`로 옮기면 375px 화면에서 303px 가로 스크롤이 생깁니다.
- 원인: `position: fixed` 요소는 화면(viewport)이 기준이며, 화면 밖으로 넘친 fixed 요소도 문서 스크롤 영역에 포함됩니다.
- 효과가 없던 방법:

| 시도 | 결과 |
| --- | --- |
| `visibility: hidden` | 상자가 남아 스크롤 유지 |
| `html`·`body`에 `overflow-x: clip` 또는 `hidden` | 패널 기준이 `body`가 아니라 화면이라 잘리지 않음 |

- 부작용: `transform`만으로 숨기면 닫힌 메뉴 링크에 Tab 포커스가 들어갑니다.

**2. 패딩 위치 때문에 열린 메뉴가 화면을 다 덮지 못함**

- 패딩(위아래 40px, 좌우 24px)이 패널에 있고 검은 배경은 안쪽 `__outer`에만 있어서, 패딩 영역으로 히어로 이미지가 보였습니다.
- 슬라이드가 패딩 안쪽에서 시작되어, 열릴 때 오른쪽 24px 띠가 먼저 나타났습니다.

**3. 가로 모드(568×320)에서 아래 메뉴 항목에 도달할 수 없음**

- `overflow: hidden`이 세로 스크롤까지 막아 Products와 Support에 휠·터치로 이동할 수 없었습니다.

### 채택한 구조

패널(`.c-header__navigation`)은 화면 안에 고정해 두고 넘침을 자릅니다. 안쪽 `.c-navigation__outer`만 이동합니다.

| 요소 | 역할 |
| --- | --- |
| `.c-header__navigation` | `position: fixed; inset: 0`, `overflow-x: hidden; overflow-y: auto`, 닫힘 시 `visibility: hidden`(키보드·스크린 리더 차단) |
| `.c-navigation__outer` | 검은 배경과 패딩 40px/24px, `translateX(100%)` → `.is-open`일 때 `none` |

이 구조에서 확인한 결과(측정 기준일 2026-10-14):

| 화면 | 상태 | 결과 |
| --- | --- | --- |
| 320×568, 568×320, 1023×800 | 닫힘 | 패널로 인한 가로 스크롤 없음, 메뉴 링크 포커스 안 됨, 아래 페이지 클릭 가능 |
| 320×568, 568×320, 1023×800 | 열림 | 패널이 화면 전체를 덮음(x 0–화면 끝), 링크 포커스 가능 |
| 568×320 | 열림 | 휠로 메뉴가 163px 스크롤되어 마지막 항목 도달 가능 |
| 1024×800, 1440×800 | — | 햄버거 버튼 `display: none` |

320×568에서 남는 55px 가로 스크롤은 패널과 무관합니다. 카드 이미지가 375px로 고정된 것이 원인입니다(아래 "관련 없는 발견").

### 미해결

**높음 — 데스크톱에서 메뉴가 화면 밖에 있음**

- 측정: 1024px, 1440px에서 메뉴 링크가 x=1023, x=1439에 있어 보이지 않습니다. 그런데도 Tab 포커스를 받고, 페이지에 151px 가로 스크롤이 생깁니다.
- 원인: `.c-header__navigation`은 데스크톱에서 `position: static`으로 복원됐지만, `.c-navigation__outer`의 `transform: translateX(100%)`는 데스크톱에서도 남아 있습니다.
- 수정: `&__outer`에 데스크톱 복원 규칙을 추가합니다.

```scss
@include mq('desktop') {
  min-block-size: auto;
  padding: 0;               // 데스크톱에서도 여백이 필요하면 이 줄 제외
  background-color: transparent;
  transform: none;
}
```

**중간 — 모션 줄이기 설정 미적용**

- 측정: `prefers-reduced-motion: reduce`에서도 `.c-navigation__outer`의 transition이 `0.3s`입니다. 현재 SCSS에는 `prefers-reduced-motion` 규칙이 없습니다.
- 수정: `.c-navigation__outer`와 `.c-header__navigation`의 `transition`을 `@media (prefers-reduced-motion: reduce)`에서 `none`으로 지정합니다.

**높음 — 메뉴 스크립트 없음**

`main.js`가 비어 있고 HTML에 연결되지 않아 실제로 메뉴를 열 수 없습니다. 구현할 동작은 다음과 같습니다.

- 햄버거 클릭: nav에 `is-open` 추가, `aria-expanded="true"`, 포커스를 닫기 버튼으로 이동
- 닫기 버튼 또는 `Esc`: `is-open` 제거, `aria-expanded="false"`, 포커스를 햄버거로 복원
- 메뉴를 연 채 1024px 이상으로 넓히면 닫힘 상태로 초기화
- `index.html`의 `</body>` 앞에 `<script src="./js/main.js" defer></script>` 연결

구현 후 [AGENTS.md](../AGENTS.md) §3 상태표(포커스 순서·복원, 숨긴 콘텐츠 접근 차단, 분기점 전환)를 다시 검증합니다.

**중간 — 열린 메뉴 뒤의 요소로 포커스가 감 (JS 구현 시 함께 처리)**

- 측정(375px, `is-open`을 직접 붙여 확인): Tab 순서가 `Open menu(가려짐) → Close menu → About … Support → SEE ALL(가려짐) → …`입니다. 메뉴를 지나면 검은 패널 뒤에 가려진 페이지 링크로 포커스가 이동합니다(WCAG 2.4.11 포커스가 가려지지 않음).
- 닫힘 상태는 문제없습니다. `visibility: hidden`으로 메뉴가 접근성 트리와 Tab 순서에서 빠지는 것을 확인했습니다.
- 처리 방향: 메뉴를 열 때 패널 뒤 요소에 `inert`를 걸고, 닫을 때 해제합니다.

| `inert` 대상 | 이유 |
| --- | --- |
| `<main>` | 패널 뒤 페이지 콘텐츠 |
| `<footer>` | 빠뜨리면 메뉴 다음 Tab이 푸터 링크로 감 |
| `.c-header__button` | 헤더 안에 있지만 패널 뒤에 가려짐 |
| `.c-skip-link` | 열린 동안에는 이동 대상이 가려짐 |

- `<header>` 전체에 걸면 안 됩니다. 메뉴(`#mainNav`)가 `<header>` 안에 있어 열린 메뉴까지 비활성이 되고, 자손에서 `inert`를 해제할 수 없습니다.
- 메뉴를 `<header>` 밖으로 옮기는 방법은 주 메뉴가 banner 랜드마크에서 빠지므로 채택하지 않습니다.

JS 구현 후 확인할 항목:

- [ ] 열기: 배경 요소에 `inert` 적용 → 포커스를 닫기 버튼으로 이동
- [ ] 닫기: `inert`를 **먼저** 해제한 뒤 포커스를 햄버거로 복원. 순서가 바뀌면 inert 상태의 버튼에 포커스를 줄 수 없음
- [ ] 열린 상태 Tab 순서가 메뉴 안에서만 순환하고, 가려진 요소로 가지 않음
- [ ] 메뉴를 연 채 1024px 이상으로 넓히면 닫힘으로 초기화되고 `inert`도 모두 해제됨(남으면 데스크톱 페이지 전체가 조작 불가)
- [ ] `Esc`로 닫기 동작
- [ ] 스크린 리더 가상 커서가 메뉴 밖 콘텐츠를 읽지 않음

**낮음 — 메뉴 패널의 로고가 중복으로 읽힘**

- 열린 상태 접근성 트리에 `img "Loopstudios"`가 헤더와 메뉴 패널에서 두 번 나옵니다.
- 메뉴 패널 로고는 헤더 로고를 다시 보여주는 장식이므로 `alt=""`로 바꿉니다.

### 관련 없는 발견 (320px 확인 중)

- **카드 이미지:** `<img>`에 `width="375"`와 `width="327"`이 중복되어 375px로 고정됩니다. 320px에서 가로 스크롤이 생기고 비율도 왜곡됩니다. 중복 속성을 지우고 `.c-card__image { inline-size: 100%; block-size: auto; }`를 추가합니다.
- **히어로 제목:** 최소 글자 크기 `2.5rem`과 좌우 패딩 때문에 320px에서 "EXPERIENCES"가 화면 밖으로 나갑니다.
- **디버그 테두리:** `.c-main { border: 1px solid #000 }`이 375px에서 1px 넘침을 만듭니다.

### 검증 상태

| 항목 | 상태 |
| --- | --- |
| 320×568, 568×320, 1023/1024/1440×800의 닫힘·열림, 스크롤, 포커스, 클릭 대상 (Chromium) | 검증 완료 |
| 모션 줄이기 환경 (Chromium 320px) | 검증 완료 (미적용 확인) |
| Firefox | 미검증 (Playwright Firefox 미설치) |
| 실제 버튼 조작, 터치, 스크린 리더 | 미검증 (스크립트 없음) |

## 접근성 체크리스트 점검 (2026-10-14)

- 기준: [a11y-checklist.md](a11y-checklist.md) (The A11Y Project, WCAG 2.2 A·AA 요약)
- 대상: 커밋 `38cca56` 시점의 [index.html](../src/pages/index.html), [_home.scss](../src/scss/pages/_home.scss) 등 SCSS 전체
- 방식: 소스 대조 + Chromium(Playwright) 측정. SCSS는 scratchpad에 별도로 컴파일했고 `dist`는 사용하지 않았습니다.
- 체크리스트를 모두 지켜도 완전한 접근성을 보장하지는 않습니다.

### 발견 사항

| # | 중요도 | 체크리스트 항목 | 위치 | 근거 | 개선 방향 |
| --- | --- | --- | --- | --- | --- |
| 1 | 높음 | 보이지 않는데 포커스를 받는 요소 제거 / 가로 스크롤 없애기 | `.c-navigation__outer` | 1024·1440px에서 헤더 메뉴 링크 5개가 화면 오른쪽 밖에서 포커스를 받음. 문서 폭 1176/1592px | `__outer`에 데스크톱 복원 규칙(`transform: none` 등) 추가 |
| 2 | 높음 | 텍스트 200% 확대 / 가로 스크롤 없애기 (WCAG 1.4.4, 1.4.10) | `.c-hero__text` | 320px에서 문서 폭 361px, 375px + 루트 글꼴 200%에서 639px. `h1`이 넘침 | `clamp()` 최소값 축소, 좁은 화면 패딩 축소 |
| 3 | 중간 | 모든 애니메이션이 `prefers-reduced-motion`을 따름 | `.c-navigation__outer`, `.c-header__navigation` | 모션 줄이기 환경에서도 패널 transition `0.3s`. 건너뛰기 링크는 통과 | 두 선택자의 `transition`을 모션 줄이기에서 `none`으로 |
| 4 | 중간 | 이미지 위에 겹친 텍스트 확인 | `.c-creations__card-title` | 흰 글자가 밝은 이미지(Night Arcade, The Curiosity, Make It Fisheye) 위에 오버레이 없이 놓임(육안 확인) | 어두운 그라데이션 오버레이(`$bg-gradient`) 추가 |
| 5 | 중간 | `button`·`a` 내용은 고유하고 설명적으로 | `.c-creations__see-all` | 링크 텍스트가 "SEE ALL"뿐 | `SEE ALL<span class="u-sr-only"> creations</span>` |
| 6 | 중간 | 버튼과 링크를 쉽게 누를 수 있게 | `.c-header__button`, Twitter 링크 | 각각 24×16px, 24×20px. 주변 컨트롤이 없어 WCAG 2.5.8 간격 예외로 AA는 통과 가능성 큼(미측정) | 버튼 패딩으로 44×44px 권장 |
| 7 | 낮음 | 포커스 스타일 대비 | `_base.scss` `button:focus-visible` | 보라색 히어로 이미지 위 `3px solid blue`. 보이지만 대비가 낮음(육안 확인) | 이미지 위 버튼은 흰색 outline |
| 8 | 낮음 | 장식 이미지는 빈 `alt` | 메뉴 패널 로고 | 열린 메뉴에서 "Loopstudios" 이미지가 두 번 읽힘 | 패널 로고 `alt=""` |
| 9 | 낮음 | 포커스 순서 / 보이지 않는 포커스 | 열린 메뉴 | 메뉴를 지나면 패널 뒤 가려진 링크로 포커스가 감 | JS 구현 시 `inert` 처리 (위 "모바일 메뉴 슬라이드 패널" 체크리스트) |
| 10 | 낮음 | 쉬운 표현 / 링크 목적지 | HTML 텍스트 | "OUR CREATIONS", "SEE ALL", 카드 제목이 대문자로 입력됨. 모든 링크 목적지가 `href="#"` | 대문자 표기 방침 결정, 목적지 확정 후 교체 |

1·3·8·9번은 위 "모바일 메뉴 슬라이드 패널" 섹션의 미해결 항목과 같은 문제입니다. 메뉴 열기·닫기는 `main.js` 미구현으로 아직 동작하지 않습니다.

### 통과한 항목

| 분류 | 확인 결과 |
| --- | --- |
| 전역 코드 | `lang="en"`, 고유한 `title`, 확대를 막지 않는 viewport. `autofocus`, `title` 툴팁, 양수 `tabindex` 없음 |
| 랜드마크 | banner, main, contentinfo, `navigation "Footer"`. `<footer>`가 `div.c-container` 안에 있어도 contentinfo로 인식됨 |
| 제목 | `h1` 1개, `h1 → h2 → h3` 순서로 건너뛰지 않음 |
| 이미지 | 모든 `img`에 `alt`, 장식 이미지는 `alt=""`, 아이콘 SVG는 `aria-hidden` |
| 목록 | 메뉴, 카드, SNS를 `ul`로 마크업 |
| 컨트롤 | 이동은 `a`, 실행은 `button`. 건너뛰기 링크가 포커스 시 나타나고 `#main`으로 이동. 새 창 링크 없음 |
| 포커스 표시 | 375px에서 Tab으로 이동한 22개 요소 모두 outline 있음. 검은 푸터 위 SNS 링크도 흰 링이 보임 |
| 링크 구분 | attribution 링크에 밑줄 |
| 색 대비 (단색 배경) | attribution 14.73:1, 푸터 텍스트·링크 21:1, 본문 15.91:1, 섹션 제목·SEE ALL 21:1 |
| 가로 넘침 | 375 / 768 / 1023px에서 없음 |
| 닫힌 모바일 메뉴 | 접근성 트리와 Tab 순서에서 빠짐 |

### 해당 없음

표, 폼, 미디어, 비디오, 오디오 분류는 페이지에 해당 요소가 없습니다. 세션 타임아웃, 배경 영상, 사용자 정의 `::selection`도 없습니다.

### 검증 상태

| 항목 | 상태 |
| --- | --- |
| 랜드마크, 제목, Tab 순서, 포커스 outline, 클릭 영역, 가로 넘침(320–1440px), 루트 글꼴 200%, 단색 배경 대비 (Chromium) | 검증 완료 |
| 이미지 위 글자 대비, 포커스 링 대비 | 육안 확인만, 수치 미측정 |
| HTML 유효성 검사 | 미검증 (검사 도구 없음) |
| 브라우저 텍스트 전용 200% 확대 | 미검증 (루트 글꼴 200%로 대체 측정) |
| 고대비 모드(강제 색상), 실제 스크린 리더, 화면 회전, Firefox | 미검증 |

## 진행 현황과 남은 과제 (2026-10-15)

- 기준: 커밋 `24fba7f` 시점의 소스
- 위 세 섹션(10/13–10/14)의 미해결 항목을 이 시점 소스와 다시 대조한 결과입니다. 각 섹션의 "미해결" 표기는 기록 당시 상태이며, 현재 상태는 이 섹션을 기준으로 합니다.
- 측정: Chromium(Playwright). SCSS는 scratchpad에 별도로 컴파일했고 `dist`는 사용하지 않았습니다. 글꼴 200%는 Chrome 기본 글꼴 크기를 32px로 바꿔 측정했습니다(`chrome://settings/fonts`와 같은 조건, `em` 분기점도 함께 바뀜).

### 해결된 항목

| 출처 | 항목 | 해결 커밋 | 확인 결과 |
| --- | --- | --- | --- |
| 시맨틱 리뷰 1–8 | `<picture>` 분기, 햄버거 연결, 헤더 위치, 로고 이름, 카드 제목 공백, From Above 이미지, `<h1>` 클래스, 건너뛰기 링크 | 이전 커밋들 | 소스 대조 |
| 시맨틱 리뷰 낮음 | 중복 `aria-hidden`, SNS 이름 표기, 클래스 오타 3종, attribution `<style>`, 카피라이트 `<p>` | 이전 커밋들 | 소스 대조 |
| 시맨틱 리뷰 낮음 / a11y #10 | 대문자 직접 입력 → 일반 표기 + `text-transform` | `4e88aba` | 접근성 트리에 `heading "Our creations"`, `link "Deep Earth"`로 노출, 화면은 대문자 |
| 메뉴 패널 / a11y #1 | 데스크톱에서 메뉴가 화면 밖 | `24fba7f` | 1440px에서 링크 5개 모두 화면 안 |
| 메뉴 패널 | 메뉴 스크립트 없음 | `2671cb4` | 클릭·`Enter`·`Space`로 열기, 닫기 버튼·`Esc`·링크로 닫기, 콘솔 오류 없음 |
| 메뉴 패널 / a11y #9 | 열린 메뉴 뒤 요소로 포커스 이동 | `2671cb4` | 열면 건너뛰기 링크·햄버거·`.c-container`에 `inert`, Tab이 메뉴 안에서만 순환 |
| 메뉴 패널 / a11y #3 | 모션 줄이기 미적용 | `2671cb4` | 모션 줄이기에서 열기·닫기 즉시 전환, 일반 환경은 0.3초 슬라이드 |
| 메뉴 패널 | 분기점(1024px) 전환 시 슬라이드 재생 | `2671cb4` | 전환 시 애니메이션 없이 닫힘 상태로 초기화, 이후 transition 복구 |
| 메뉴 패널 관련 없는 발견 | 카드 이미지 `width` 중복, 320px 히어로 넘침, 디버그 테두리 | 이전 커밋들 | 320px 가로 넘침 없음 |
| a11y #2 | 글자 200% 확대 시 가로 넘침 | `24fba7f` | 글꼴 200%, 320–2048px에서 가로 넘침 없음 |
| 신규 | 데스크톱 200%에서 히어로 제목이 위로 잘림 | `24fba7f` | 2048px·글꼴 200%에서 히어로가 1434px로 늘어나 제목 전체 표시 |
| 신규 | 200%에서 히어로 제목과 헤더 겹침 | `24fba7f` | 글꼴 200%, 320–2048px에서 겹침 없음. 글꼴 100%에서는 제목 위치 변화 없음 |
| 신규 | 1024–1279px 헤더 가로 넘침 | `24fba7f` | 1024px 문서 폭 1104 → 1024 |

`inert` 체크리스트(위 "모바일 메뉴 슬라이드 패널" 섹션) 6개 중 1–5번은 측정으로 확인했습니다. 6번(스크린 리더 가상 커서)은 미검증입니다.

### 남은 과제

아래 5개는 모두 처리했습니다. 결과는 하단 "남은 과제 처리 결과" 섹션을 참고하세요.

| 순서 | 중요도 | 과제 | 근거 (현재 상태) | 수정 방향 |
| --- | --- | --- | --- | --- |
| 1 | 중간 | 카드 제목 대비 (a11y #4) | 흰 글자가 밝은 이미지(Night Arcade, The Curiosity, Make It Fisheye) 위에 오버레이 없이 놓임. 육안 확인, 대비 수치 미측정 | `.c-creations__link::after`로 아래쪽 어두운 그라데이션(`$bg-gradient`) 추가 |
| 2 | 중간 | "SEE ALL" 링크 이름 (a11y #5) | 링크 이름이 "See all"뿐이라 링크 목록만으로는 목적지를 알 수 없음 | `See all<span class="u-sr-only"> creations</span>` |
| 3 | 중간 | 터치 영역 (a11y #6) | 햄버거 버튼 24×16px, Twitter 링크 24×20px. 주변 컨트롤이 없어 WCAG 2.5.8 간격 예외로 AA 통과 가능성은 큼(미측정) | 패딩으로 44×44px 권장 |
| 4 | 낮음 | 메뉴 패널 로고 중복 읽기 (a11y #8) | 열린 메뉴 접근성 트리에 `img "Loopstudios"`가 헤더와 패널에서 두 번 나옴 | 패널 로고([index.html](../src/pages/index.html)의 `.c-navigation__inner` 안 `<img>`) `alt=""` |
| 5 | 낮음 | 이미지 위 포커스 링 대비 (a11y #7) | `_base.scss`의 `button:focus-visible`이 `3px solid blue`. 보라색 히어로 위 햄버거 버튼에서 대비가 낮음(육안 확인) | 이미지 위 버튼은 흰색 outline |

### 결정이 필요한 것

- **링크 목적지:** 메뉴, 카드, SNS, SEE ALL 링크가 모두 `href="#"` placeholder입니다.

### 참고

- **하이픈:** 200%에서 히어로 제목은 `overflow-wrap: anywhere`로 단어 중간에서 줄이 바뀝니다. `hyphens: auto`를 지정했지만 측정 환경(Chromium headless)에서는 하이픈이 표시되지 않았습니다. Windows Chrome과 Firefox에서는 확인하지 않았습니다.
- **고정 크기:** 히어로 행 최소 높이(650px), 카드 행(태블릿 120px, 데스크톱 450px)은 고정 값입니다. 200% 측정에서 카드 제목 8개가 모두 이미지 안에 있음을 확인했지만, 이보다 큰 확대는 확인하지 않았습니다.

### 검증 상태

| 항목 | 상태 |
| --- | --- |
| 가로 넘침 (글꼴 100%: 320 / 375 / 768 / 1023 / 1024 / 1440 / 2048px, 글꼴 200%: 320–2048px) | 검증 완료 |
| 메뉴 열기·닫기, 포커스 이동·복원, `inert`, `Esc`, 분기점 초기화, 모션 줄이기 | 검증 완료 |
| 스크린 리더 가상 커서와 실제 읽기("Make It" 등) | 미검증 |
| 이미지 위 글자 대비, 포커스 링 대비 수치 | 미검증 (육안 확인만) |
| HTML 유효성 검사 | 미검증 (검사 도구 없음) |
| Firefox, 고대비 모드(강제 색상), 실제 터치 기기 | 미검증 |

## 남은 과제 처리 결과 (2026-10-15)

- 대상: 위 "남은 과제" 1–5번
- 측정: Chromium(Playwright). SCSS는 scratchpad에 별도로 컴파일했고 `dist`는 사용하지 않았습니다. 변경 전 비교 기준은 커밋 `24fba7f` 소스를 같은 방식으로 컴파일한 결과입니다. 글꼴 200%는 CDP `Page.setFontSizes`(기본 글꼴 32px)로 설정했습니다.

### 변경 내용

| # | 과제 | 변경 |
| --- | --- | --- |
| 1 | 카드 제목 대비 | `.c-creations__item::after` 그라데이션 오버레이, 제목 `z-index: 1`. 데스크톱은 `$bg-gradient`, 모바일·태블릿은 더 진한 `0 → 0.75(60%) → 0.8` |
| 2 | "SEE ALL" 링크 이름 | `See all<span class="u-sr-only"> creations</span>` |
| 3 | 터치 영역 | 햄버거 `padding: 14px 10px; margin: -14px -10px`, 닫기 버튼 `padding/margin: ±13px`, SNS 링크 40×44px(`margin: -10px -8px`) |
| 4 | 패널 로고 중복 | 메뉴 패널 로고 `alt=""` |
| 5 | 포커스 링 대비 | 햄버거·닫기 버튼 `:focus-visible`의 outline 색을 흰색으로 |

- 모바일·태블릿 그라데이션을 다르게 한 이유: 카드 높이가 120px라 제목이 그라데이션 중간(불투명도 약 0.6)에 걸립니다. `$bg-gradient` 그대로는 Night Arcade의 가장 밝은 픽셀 대비가 3.45:1(320px)–4.35:1(1023px)로 4.5:1에 못 미쳤습니다.
- SNS 링크를 44px 폭으로 하지 않은 이유: 아이콘 간격이 16px라 44px면 인접 링크의 영역이 겹칩니다. 40px는 서로 맞닿고 겹치지 않는 최대 폭입니다. WCAG 2.5.8(AA, 24×24px)은 충족하고 2.5.5(AAA, 44×44px)는 가로가 4px 부족합니다.
- 닫기 버튼은 체크리스트 항목에 없었지만, 햄버거와 같은 문제(아이콘 18–25px, 검은 배경 위 파란 outline)가 있어 함께 처리했습니다.

### 측정 결과

**카드 제목 뒤 배경과 흰 글자의 대비** (제목 영역에서 가장 밝은 픽셀 기준, 최소값)

| 폭 | 변경 전(오버레이 없음) | 변경 후 |
| --- | --- | --- |
| 320px | 1.02:1 | 5.15:1 |
| 375px | 1.03:1 | 5.19:1 |
| 768px | 1.00:1 | 5.19:1 |
| 1023px | 1.01:1 | 6.27:1 |
| 1024px | 1.00:1 | 7.46:1 |
| 1440px | 1.00:1 | 7.46:1 |

**레이아웃 회귀** (320 / 375 / 768 / 1023 / 1024 / 1440px, 변경 전과 비교)

- 햄버거 아이콘, 로고, SNS 아이콘, 카드 제목, SEE ALL 위치가 변경 전과 같음. 푸터 높이도 같음
- 가로 넘침 없음(글꼴 100%, 글꼴 200% 320–2048px)
- 글꼴 200%에서 카드 제목 8개 모두 카드 안에 있음

**인터랙티브 요소** (375px)

| 요소 | 결과 |
| --- | --- |
| 햄버거 버튼 | 44×44px(768px 이상 52×49px). 버튼 가장자리 클릭으로 열림. 포커스 outline `3px solid #fff` |
| 닫기 버튼 | 44.4×44.4px. 가장자리 클릭으로 닫힘. 열 때 포커스를 받고 outline `3px solid #fff` |
| SNS 링크 4개 | 40×44px, 서로 맞닿고 겹치지 않음. 네 모서리 hit test 모두 해당 링크 |
| SEE ALL | 접근성 트리 `link "See all creations"` |
| 열린 메뉴 | 접근성 트리의 `img "Loopstudios"` 1개(헤더 로고만). Tab 순서 `Close menu → About … Support`, `Esc`로 닫으면 햄버거로 포커스 복원, 콘솔 오류 없음 |

### 검증 상태

| 항목 | 상태 |
| --- | --- |
| 카드 제목 배경 대비(픽셀 측정), 레이아웃 회귀, 가로 넘침(글꼴 100%·200%), 클릭 영역, 포커스 outline, 접근성 이름 (Chromium) | 검증 완료 |
| 카드 제목 대비를 글꼴 200%에서 측정 | 미검증 (제목이 카드 안에 있는지만 확인) |
| Firefox, 실제 터치 기기, 스크린 리더 | 미검증 |
| SCSS 컴파일(`sass.compile`), `node --check src/js/main.js` | 검증 완료 |

## 접근성 재점검: hover 상태와 히어로 대비 (2026-10-15)

- 기준: [a11y-checklist.md](a11y-checklist.md)
- 대상: 커밋 `e4ed473` 이후 작업본(카드·SEE ALL·SNS hover 추가, 히어로 오버레이)
- 측정: Chromium(Playwright). SCSS는 scratchpad에 별도로 컴파일했고 `dist`는 사용하지 않았습니다. 대비는 글자 영역 뒤 배경 픽셀로 계산했습니다.

### 처리한 항목

| 항목 | 원인 | 처리 | 결과 |
| --- | --- | --- | --- |
| 카드 hover·키보드 포커스 시 제목이 흰 오버레이 위 흰 글자 | `&__item` 안의 `&__link:hover`가 존재하지 않는 `.c-creations__item__link`로 컴파일됨 | 규칙을 `.c-creations` 바로 아래로 이동 | hover·키보드 포커스 대비 1.00 → 11.42:1 이상(375 / 768 / 1440px) |
| 카드를 마우스로 클릭한 뒤 흰 오버레이 위 흰 제목 | 오버레이는 `&:focus-within`(클릭 포커스 포함), 글자색은 `:focus-visible`(키보드만)이라 조건이 어긋남 | 오버레이 조건을 `&:has(.c-creations__link:focus-visible)::after`로 변경 | 클릭 후 기본 그라데이션 + 흰 제목으로 복귀. 대비 1.00 → 5.19:1 이상(375 / 768 / 1440px) |
| SEE ALL 키보드 포커스에 hover와 같은 피드백 없음 | 반전 스타일이 `:hover`에만 있고 포커스는 브라우저 기본 outline만 표시 | `&:hover, &:focus-visible`로 묶고, 포커스에 `outline: 2px solid` 검정 + `outline-offset: 3px` | 키보드 포커스에서 흰 글자/검은 배경 21:1, 3px 띄운 검은 링 표시. 클릭 후에는 기본 상태로 복귀(375 / 1440px) |
| 히어로 오버레이 | 데스크톱 흰 메뉴·제목이 밝은 히어로 이미지 위에서 대비 미달 | `.c-hero__picture::after` 검정 40%를 1024px 이상에만 적용, 제목은 `z-index: 1`로 오버레이 위 | 아래 "결정" 참고 |

### 결정: 히어로 오버레이는 데스크톱에만 적용

| 화면 | 시안 | 적용 | 근거 |
| --- | --- | --- | --- |
| 모바일 (<768px) | 채우기 없음 | 없음 | 시안대로. 오버레이 없이도 제목 최저 3.59:1로 통과 |
| 태블릿 (768–1023px) | 채우기 없음 | 없음 | 시안대로. 오버레이 없이도 제목 최저 3.52:1로 통과 |
| 데스크톱 (≥1024px) | 채우기 없음 | 검정 40% | 시안과 다름. 접근성 대비를 위해 적용 |

데스크톱의 오버레이 전후 대비(1024 / 1440 / 2048px):

| 요소 | 기준 | 오버레이 없음(시안) | 오버레이 40% |
| --- | --- | --- | --- |
| 헤더 메뉴 링크(15px) | 4.5:1 | 최저 2.78:1 | 최저 6.71:1 |
| 히어로 제목(72px) | 3:1 | 최저 1.38–2.12:1, 하위 5% 2.61–3.44:1 | 최저 3.76–5.40:1 |

- 검토한 다른 안: 위쪽 240px만 검정 45% 그라데이션을 깔면 메뉴는 7.55:1로 통과하지만 제목은 그대로 미달입니다.

### 남은 과제

이 점검에서 나온 과제는 모두 처리했습니다. 링크 목적지(`href="#"`)는 여전히 결정 대기입니다.

### 통과한 항목

랜드마크·제목 계층, Tab 순서(375 / 1440px, 모든 요소 outline 있음), 건너뛰기 링크 표시와 `#main` 이동, 카드 기본 상태 대비(최저 5.19:1), SNS hover·포커스 선, 모션 줄이기(남은 transition 없음), 가로 넘침(글꼴 100%·200%), 콘솔 오류 없음.

### 검증 상태

| 항목 | 상태 |
| --- | --- |
| 위 측정 전체 (Chromium) | 검증 완료 |
| Firefox, 스크린 리더, 고대비 모드, 실제 터치 기기 | 미검증 |
| HTML 유효성 검사 | 미검증 (검사 도구 없음) |
