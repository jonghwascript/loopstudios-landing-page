import { initNavPanel } from './components/nav-panel.js';

// 모바일 메뉴: SCSS의 desktop 분기점(1024px = 64em)과 맞춘다.
initNavPanel(document.querySelector('[data-nav-panel-root]'), {
  desktopQuery: '(min-width: 64em)',
});
