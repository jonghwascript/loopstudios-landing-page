// 모바일 메뉴 패널 (햄버거 → 전체 화면 슬라이드 패널)
// - 마크업 계약: root 안에 [data-nav-open] 버튼, [data-nav-panel] 패널, 패널 안 [data-nav-close] 버튼
// - 열면 패널 밖 요소를 inert로 막아 포커스와 스크린 리더가 메뉴 안에만 머물게 한다.
// - 데스크톱 분기점을 넘으면 애니메이션 없이 닫힘 상태로 되돌린다.
// - 스타일은 scss/components/_nav-panel.scss (.c-nav-panel, .c-nav-panel__inner)
// 사용법과 주의점: doc/nav-panel.md

const OPEN_CLASS = 'is-open';
const RESIZING_CLASS = 'is-resizing';

// 패널에서 body까지 올라가며, 각 단계에서 패널을 품지 않은 형제 요소를 모은다.
// 건너뛰기 링크, main, footer, 헤더 안의 햄버거 버튼 등이 구조와 상관없이 포함된다.
function collectBackground(panel) {
  const elements = [];
  for (let node = panel; node && node !== document.body; node = node.parentElement) {
    const parent = node.parentElement;
    if (!parent) break;
    for (const sibling of parent.children) {
      if (sibling !== node && !['SCRIPT', 'STYLE', 'TEMPLATE'].includes(sibling.tagName)) {
        elements.push(sibling);
      }
    }
  }
  return elements;
}

/**
 * @param {HTMLElement} root [data-nav-open]과 [data-nav-panel]을 품은 요소 (보통 header)
 * @param {object} [options]
 * @param {string} [options.desktopQuery] 패널이 펼쳐진 메뉴가 되는 미디어 쿼리. SCSS의 desktop 분기점과 같아야 한다.
 * @returns {{ open: () => void, close: (options?: { restoreFocus?: boolean }) => void, destroy: () => void } | null}
 */
export function initNavPanel(root, { desktopQuery = '(min-width: 64em)' } = {}) {
  const panel = root?.querySelector('[data-nav-panel]');
  const openButton = root?.querySelector('[data-nav-open]');
  const closeButton = panel?.querySelector('[data-nav-close]');
  if (!panel || !openButton || !closeButton) return null;

  const desktop = window.matchMedia(desktopQuery);
  // 이번에 inert를 건 요소만 기억해, 원래 inert였던 요소는 닫을 때 건드리지 않는다.
  let inerted = [];

  function setBackgroundInert(isInert) {
    if (isInert) {
      inerted = collectBackground(panel).filter((element) => !element.inert);
      inerted.forEach((element) => (element.inert = true));
    } else {
      inerted.forEach((element) => (element.inert = false));
      inerted = [];
    }
  }

  function open() {
    if (panel.classList.contains(OPEN_CLASS)) return;

    panel.classList.add(OPEN_CLASS);
    openButton.setAttribute('aria-expanded', 'true');
    setBackgroundInert(true);
    // 닫기 버튼은 아직 화면 밖(translateX(100%))에 있다.
    // 기본 focus()는 패널을 스크롤해 슬라이드를 상쇄하므로 스크롤을 막는다.
    closeButton.focus({ preventScroll: true });
  }

  function close({ restoreFocus = true } = {}) {
    if (!panel.classList.contains(OPEN_CLASS)) return;

    // inert 상태의 버튼에는 포커스를 줄 수 없으므로 먼저 해제한다.
    setBackgroundInert(false);
    panel.classList.remove(OPEN_CLASS);
    openButton.setAttribute('aria-expanded', 'false');
    if (restoreFocus) openButton.focus();
  }

  const onOpenClick = () => open();
  const onCloseClick = () => close();
  const onKeydown = (event) => {
    if (event.key === 'Escape') close();
  };
  // 메뉴 링크로 이동하면 메뉴를 닫는다. 포커스는 이동한 위치에 맡긴다.
  const onPanelClick = (event) => {
    if (event.target.closest('a')) close({ restoreFocus: false });
  };
  const onBreakpointChange = () => {
    panel.classList.add(RESIZING_CLASS);
    close({ restoreFocus: false });

    // 전환 없는 상태로 한 번 그린 뒤 transition을 되살린다.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => panel.classList.remove(RESIZING_CLASS));
    });
  };

  openButton.addEventListener('click', onOpenClick);
  closeButton.addEventListener('click', onCloseClick);
  document.addEventListener('keydown', onKeydown);
  panel.addEventListener('click', onPanelClick);
  desktop.addEventListener('change', onBreakpointChange);

  function destroy() {
    close({ restoreFocus: false });
    openButton.removeEventListener('click', onOpenClick);
    closeButton.removeEventListener('click', onCloseClick);
    document.removeEventListener('keydown', onKeydown);
    panel.removeEventListener('click', onPanelClick);
    desktop.removeEventListener('change', onBreakpointChange);
  }

  return { open, close, destroy };
}
