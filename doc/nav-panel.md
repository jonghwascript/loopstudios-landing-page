# NavPanel: 모바일 메뉴 패널 컴포넌트

햄버거 버튼으로 여는 전체 화면 슬라이드 메뉴입니다. 데스크톱 분기점 이상에서는 패널이 아니라 일반 메뉴로 펼쳐집니다.

| 파일 | 역할 |
| --- | --- |
| [src/js/components/nav-panel.js](../src/js/components/nav-panel.js) | 열기·닫기, ARIA, 포커스, `inert`, 분기점 초기화 |
| [src/scss/components/_nav-panel.scss](../src/scss/components/_nav-panel.scss) | 패널 구조, 슬라이드, 숨김, 모션 줄이기, 데스크톱 복원 |
| [src/stories/NavPanel.stories.js](../src/stories/NavPanel.stories.js) | Storybook 스토리 (`Components/NavPanel`) |

## 제공하는 동작

- 햄버거 클릭·Enter·Space로 열기. `aria-expanded="true"`로 바꾸고 포커스를 닫기 버튼으로 옮김
- 닫기 버튼, `Esc`, 메뉴 링크 클릭으로 닫기. 링크 외에는 포커스를 햄버거로 복원
- 연 동안 패널 밖 요소에 `inert`를 걸어 Tab과 스크린 리더가 메뉴 안에만 머묾
- 메뉴를 연 채 데스크톱 분기점을 넘으면 애니메이션 없이 닫힘 상태로 초기화
- `prefers-reduced-motion: reduce`에서 슬라이드 없이 바로 열고 닫음
- 닫힌 패널은 `visibility: hidden`이라 Tab 순서와 접근성 트리에서 빠짐
- 패널이 화면 밖으로 나가도 가로 스크롤이 생기지 않음. 낮은 화면(가로 모드)에서는 패널 안이 세로로 스크롤됨

## 다른 프로젝트에 적용하기

1. 위 JS·SCSS 파일을 같은 경로로 복사합니다. SCSS는 `abstracts`의 `mq()`와 `$breakpoints`의 `desktop` 값을 사용합니다.
2. `style.scss`에서 페이지 스타일보다 앞에 불러옵니다.

   ```scss
   @use 'components/nav-panel';
   @use 'pages/home';
   ```

3. 마크업에 클래스와 `data-*` 속성을 붙입니다. 스타일은 클래스, 동작은 `data-*`로 연결하므로 프로젝트의 BEM 클래스와 함께 써도 됩니다.

   ```html
   <header data-nav-panel-root>
     <img src="./images/logo.svg" alt="Brand" />
     <button type="button" class="c-nav-panel-toggle" data-nav-open
       aria-expanded="false" aria-controls="mainNav">
       <svg aria-hidden="true">…</svg>
       <span class="u-sr-only">Open menu</span>
     </button>
     <nav class="c-nav-panel" id="mainNav" aria-label="Main" data-nav-panel>
       <div class="c-nav-panel__inner">
         <button type="button" class="c-nav-panel__close" data-nav-close aria-label="Close menu">
           <svg aria-hidden="true">…</svg>
         </button>
         <ul>
           <li><a href="/about">About</a></li>
         </ul>
       </div>
     </nav>
   </header>
   ```

4. 스크립트를 모듈로 불러와 초기화합니다. `desktopQuery`는 SCSS의 `desktop` 분기점과 같은 값이어야 합니다. `mq()`가 px을 em으로 바꾸므로 1024px이면 `64em`입니다.

   ```html
   <script type="module" src="./js/main.js"></script>
   ```

   ```js
   import { initNavPanel } from './components/nav-panel.js';
   initNavPanel(document.querySelector('[data-nav-panel-root]'), {
     desktopQuery: '(min-width: 64em)',
   });
   ```

5. 겉모양은 사용자 정의 속성과 프로젝트 스타일로 정합니다.

   | 속성 | 기본값 | 적용 위치 |
   | --- | --- | --- |
   | `--nav-panel-bg` | `#000` | `.c-nav-panel__inner` 배경 |
   | `--nav-panel-padding` | `40px 24px` | `.c-nav-panel__inner` 여백 |
   | `--nav-panel-duration` | `0.3s` | 슬라이드와 닫힘 후 숨김 지연 |

## API

`initNavPanel(root, options)` → `{ open(), close({ restoreFocus }), destroy() }` 또는 `null`

- `root`: `[data-nav-open]`과 `[data-nav-panel]`을 품은 요소. 필요한 요소가 없으면 `null`을 반환하고 아무것도 하지 않습니다.
- `options.desktopQuery`: 기본값 `'(min-width: 64em)'`.
- `destroy()`: 메뉴를 닫고 `document`·`matchMedia` 리스너를 해제합니다. 같은 요소를 다시 그리는 경우(Storybook 등)에 사용합니다.

## 주의할 점

- **배경과 여백은 `__inner`에 둡니다.** 고정된 틀(`.c-nav-panel`)에 두면 여백으로 뒤 페이지가 비치고, 열릴 때 가장자리 띠가 먼저 나타납니다. 그래서 사용자 정의 속성도 `__inner`에 적용됩니다.
- **패널 자체를 `transform`으로 옮기지 않습니다.** `position: fixed` 요소가 화면 밖으로 나가면 문서 스크롤 영역에 포함되어 가로 스크롤이 생깁니다. `html`·`body`의 `overflow`로도 잘리지 않습니다.
- **`inert` 대상은 자동으로 계산합니다.** 패널에서 `body`까지 올라가며 각 단계에서 패널을 품지 않은 형제 요소에 겁니다. 원래 `inert`였던 요소는 닫을 때 건드리지 않습니다.
- **메뉴를 header 밖으로 옮기지 않습니다.** 주 메뉴가 banner 랜드마크에서 빠집니다. header 전체에 `inert`를 거는 방식도 쓸 수 없습니다(메뉴까지 비활성이 됨).
- **ES 모듈이라 HTTP로 열어야 합니다.** `file://`로 연 HTML에서는 모듈 스크립트가 차단됩니다. 개발 서버, GitHub Pages, Storybook에서는 문제없습니다.
- **형태는 전체 화면 슬라이드 패널 하나입니다.** 드롭다운이나 일부만 덮는 서랍(drawer)이 필요하면 그때 옵션을 추가합니다.

## 검증 기록

Loopstudios 페이지를 이 컴포넌트로 옮기면서 이전 구현(커밋 `8e82d7d`)과 비교했습니다. 측정은 2026-10-15, Chromium(Playwright)으로 했습니다.

| 항목 | 결과 |
| --- | --- |
| 패널·`__inner` 계산된 스타일 (320×568, 568×320, 375×800, 1023×800, 1024×800, 1440×800) | 이전과 같음. 데스크톱 `__inner`의 `min-height`만 `100%` → `auto`(크기·위치 변화 없음) |
| 가로 넘침(닫힘·열림), Tab 순서, 포커스 이동·복원, `Esc`, Enter·Space, 링크 클릭 | 이전과 같음 |
| 가로 모드(568×320) 패널 세로 스크롤 | 이전과 같음 (483px 내용, 320px 화면) |
| 열린 상태 `inert` 대상 | 이전 대상 + 헤더 로고. 로고는 패널 뒤에 가려지는 요소라 의도한 변화 |
| 분기점(1023 → 1024px) 전환 | 닫힘으로 초기화, `inert` 모두 해제, 애니메이션 없음 |
| 모션 줄이기 | transition 0s, 열자마자 `transform: none` |
| 글꼴 200% (320 / 1023 / 1024 / 1440px) | 가로 넘침 없음 |
| Storybook 빌드와 스토리(375 / 1280px): 열기·닫기, `inert`, Controls(배경색), 데스크톱 버튼 숨김, Docs 페이지 | 동작, 콘솔 오류 없음 |
| Firefox, 스크린 리더, 실제 터치 기기 | 미검증 |
