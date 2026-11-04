import { initNavPanel } from '../js/components/nav-panel.js';

// 스토리를 다시 그릴 때 이전 인스턴스의 document·matchMedia 리스너를 정리한다.
let current = null;

const hamburgerIcon = `
  <svg width="24" height="16" viewBox="0 0 24 16" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <g fill="currentColor" fill-rule="evenodd"><path d="M0 0h24v2H0zM0 7h24v2H0zM0 14h24v2H0z" /></g>
  </svg>`;

const closeIcon = `
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.778.808l1.414 1.414L11.414 10l7.778 7.778-1.414 1.414L10 11.414l-7.778 7.778-1.414-1.414L8.586 10 .808 2.222 2.222.808 10 8.586 17.778.808z" fill="currentColor" fill-rule="evenodd" />
  </svg>`;

function render({ links, open, background, padding, duration, desktopQuery }) {
  current?.destroy();

  const wrapper = document.createElement('div');
  wrapper.className = 'sb-nav-panel-demo';
  wrapper.innerHTML = `
    <a class="c-skip-link" href="#sb-main">Skip to main content</a>
    <header class="l-cluster" data-nav-panel-root
      style="justify-content: space-between; align-items: center; padding: 24px; background: #333; color: #fff;">
      <strong>Logo</strong>
      <button type="button" class="c-nav-panel-toggle" data-nav-open
        aria-expanded="false" aria-controls="sbNav" style="color: inherit;">
        ${hamburgerIcon}
        <span class="u-sr-only">Open menu</span>
      </button>
      <nav class="c-nav-panel" id="sbNav" aria-label="Main" data-nav-panel
        style="--nav-panel-bg: ${background}; --nav-panel-padding: ${padding}; --nav-panel-duration: ${duration};">
        <div class="c-nav-panel__inner l-stack">
          <button type="button" class="c-nav-panel__close" data-nav-close
            aria-label="Close menu" style="align-self: flex-end; color: #fff;">
            ${closeIcon}
          </button>
          <ul class="l-cluster" style="margin: 0; padding: 0; list-style: none;">
            ${links
              .map((label) => `<li><a href="#" style="color: #fff;">${label}</a></li>`)
              .join('')}
          </ul>
        </div>
      </nav>
    </header>
    <main id="sb-main" style="padding: 24px;">
      <p>패널 뒤 페이지 콘텐츠. 메뉴가 열리면 inert가 되어 Tab으로 이동할 수 없다.</p>
      <a href="#">Page link</a>
    </main>`;

  current = initNavPanel(wrapper.querySelector('[data-nav-panel-root]'), { desktopQuery });
  // open은 문서에 붙은 뒤 호출해야 inert 대상(형제 요소)을 계산할 수 있다.
  if (open) requestAnimationFrame(() => current?.open());

  return wrapper;
}

export default {
  title: 'Components/NavPanel',
  tags: ['autodocs'],
  render,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '햄버거 버튼으로 여는 전체 화면 메뉴 패널. 데스크톱 분기점 이상에서는 일반 메뉴로 펼쳐진다. ' +
          '동작은 `js/components/nav-panel.js`, 구조는 `scss/components/_nav-panel.scss`. 사용법은 `doc/nav-panel.md`.',
      },
      // 패널이 position: fixed라 Docs 페이지에서는 스토리마다 iframe으로 분리한다.
      story: { inline: false, iframeHeight: 420 },
    },
  },
  argTypes: {
    links: { control: 'object', description: '메뉴 링크 텍스트' },
    open: { control: 'boolean', description: '처음부터 연 상태로 그리기' },
    background: { control: 'color', description: '--nav-panel-bg' },
    padding: { control: 'text', description: '--nav-panel-padding' },
    duration: { control: 'text', description: '--nav-panel-duration' },
    desktopQuery: {
      control: 'text',
      description: 'initNavPanel의 desktopQuery. SCSS desktop 분기점과 같아야 한다.',
    },
  },
  args: {
    links: ['About', 'Careers', 'Events', 'Products', 'Support'],
    open: false,
    background: '#000',
    padding: '40px 24px',
    duration: '0.3s',
    desktopQuery: '(min-width: 64em)',
  },
};

export const Closed = {};

export const Open = {
  args: { open: true },
};
