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
