// 모바일 메뉴 열기·닫기
// - 열면 패널 뒤 요소를 inert로 막아 포커스와 스크린 리더가 메뉴 안에만 머물게 한다.
// - 데스크톱 분기점(64em = 1024px)을 넘으면 애니메이션 없이 닫힘 상태로 되돌린다.
const nav = document.querySelector('.c-header__navigation');
const openButton = document.querySelector('[data-nav-open]');
const closeButton = document.querySelector('[data-nav-close]');
const background = [
  document.querySelector('.c-skip-link'),
  openButton,
  document.querySelector('.c-container'),
];
const desktop = window.matchMedia('(min-width: 64em)');

function setBackgroundInert(isInert) {
  background.forEach((element) => {
    if (element) element.inert = isInert;
  });
}

function openMenu() {
  nav.classList.add('is-open');
  openButton.setAttribute('aria-expanded', 'true');
  setBackgroundInert(true);
  // 닫기 버튼은 아직 화면 밖(translateX(100%))에 있다.
  // 기본 focus()는 패널을 스크롤해 슬라이드를 상쇄하므로 스크롤을 막는다.
  closeButton.focus({ preventScroll: true });
}

function closeMenu({ restoreFocus = true } = {}) {
  if (!nav.classList.contains('is-open')) return;

  // inert 상태의 버튼에는 포커스를 줄 수 없으므로 먼저 해제한다.
  setBackgroundInert(false);
  nav.classList.remove('is-open');
  openButton.setAttribute('aria-expanded', 'false');
  if (restoreFocus) openButton.focus();
}

if (nav && openButton && closeButton) {
  openButton.addEventListener('click', openMenu);
  closeButton.addEventListener('click', () => closeMenu());

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  // 메뉴 링크로 이동하면 메뉴를 닫는다. 포커스는 이동한 위치에 맡긴다.
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu({ restoreFocus: false });
  });

  desktop.addEventListener('change', () => {
    nav.classList.add('is-resizing');
    closeMenu({ restoreFocus: false });

    // 전환 없는 상태로 한 번 그린 뒤 transition을 되살린다.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => nav.classList.remove('is-resizing'));
    });
  });
}
