// ============================================================
// PedroOS - Desktop Environment & Canvas Management
// Desktop icons, marquee selection box, context menu,
// wallpaper engine, keyboard shortcuts and global interactions
// ============================================================

const PedroOSDesktop = (function() {
  const desktopIcons = [
    { id: 'icon-pc', name: 'Meu Computador', icon: 'monitor', action: () => PedroOSApps.openExplorer(), color: 'text-brand-cyan' },
    { id: 'icon-about', name: 'Sobre Mim', icon: 'user', action: () => PedroOSApps.openAbout(), color: 'text-brand-violetGlow' },
    { id: 'icon-projects', name: 'Meus Projetos', icon: 'folder-git', badge: '6 Sites', action: () => PedroOSApps.openProjects(), color: 'text-brand-cyan' },
    { id: 'icon-resume', name: 'Currículo.pdf', icon: 'file-text', action: () => PedroOSApps.openResume(), color: 'text-rose-400' },
    { id: 'icon-skills', name: 'Habilidades', icon: 'cpu', action: () => PedroOSApps.openSkills(), color: 'text-amber-400' },
    { id: 'icon-exp', name: 'Experiência', icon: 'briefcase', action: () => PedroOSApps.openExperience(), color: 'text-emerald-400' },
    { id: 'icon-term', name: 'Terminal', icon: 'terminal', action: () => PedroOSTerminal.openTerminal(), color: 'text-brand-cyanLight' },
    { id: 'icon-contact', name: 'Contato', icon: 'message-circle', action: () => PedroOSApps.openContact(), color: 'text-emerald-300' },
    { id: 'icon-github', name: 'GitHub', icon: 'github', action: () => window.open('https://github.com/pedrohll4', '_blank'), color: 'text-slate-300' },
    { id: 'icon-settings', name: 'Configurações', icon: 'settings', action: () => PedroOSApps.openSettings(), color: 'text-slate-400' },
    { id: 'icon-trash', name: 'Lixeira', icon: 'trash-2', action: () => PedroOSApps.openTrash(), color: 'text-slate-500' }
  ];

  function init() {
    renderDesktopIcons();
    initWallpaper();
    initTheme();
    initContextMenu();
    initSelectionMarquee();
    initKeyboardShortcuts();
  }

  function renderDesktopIcons() {
    const container = document.getElementById('desktop-icons-container');
    if (!container) return;

    container.innerHTML = desktopIcons.map(item => `
      <div class="desktop-icon-item" id="${item.id}" tabindex="0" title="${item.name}">
        <div class="icon-wrapper relative">
          <i data-lucide="${item.icon}" class="w-6 h-6 sm:w-7 sm:h-7 ${item.color}"></i>
          ${item.badge ? `
            <span class="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-brand-cyan text-[#0b0f19] shadow">
              ${item.badge}
            </span>
          ` : ''}
        </div>
        <span class="icon-label">
          ${item.name}
        </span>
      </div>
    `).join('');

    if (window.lucide) {
      window.lucide.createIcons({ root: container });
    }

    // Attach click and double click handlers
    container.querySelectorAll('.desktop-icon-item').forEach((el, idx) => {
      const item = desktopIcons[idx];

      // Single click selects
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        selectIcon(el);

        // On mobile/tablet screens (< 768px), single tap immediately launches
        if (window.innerWidth < 768) {
          PedroOSAudio.playPop();
          item.action();
        }
      });

      // Double click launches on desktop
      el.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        PedroOSAudio.playPop();
        item.action();
      });

      // Enter key opens selected icon
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          PedroOSAudio.playPop();
          item.action();
        }
      });
    });

    // Deselect icons when clicking desktop background
    const desktopArea = document.getElementById('desktop-area');
    if (desktopArea) {
      desktopArea.addEventListener('click', (e) => {
        if (!e.target.closest('.desktop-icon-item') && !e.target.closest('.pedro-window')) {
          deselectAllIcons();
        }
      });
    }
  }

  function selectIcon(el) {
    deselectAllIcons();
    el.classList.add('is-selected');
    el.focus();
  }

  function deselectAllIcons() {
    document.querySelectorAll('.desktop-icon-item').forEach(i => {
      i.classList.remove('is-selected');
    });
  }

  // --- WALLPAPER ENGINE ---
  function initWallpaper() {
    const saved = localStorage.getItem('pedroos_wallpaper') || 'cyber-deep';
    setWallpaper(saved);
  }

  function setWallpaper(wpId) {
    const wpObj = PedroOSData.wallpapers.find(w => w.id === wpId) || PedroOSData.wallpapers[0];
    localStorage.setItem('pedroos_wallpaper', wpObj.id);

    const wallpaperEl = document.getElementById('desktop-wallpaper');
    if (wallpaperEl) {
      wallpaperEl.style.background = wpObj.style;
    }
  }

  // --- THEME ENGINE ---
  function initTheme() {
    const savedTheme = localStorage.getItem('pedroos_theme') || 'dark';
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }

  function toggleTheme() {
    const isLight = document.documentElement.classList.contains('light');
    if (isLight) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('pedroos_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('pedroos_theme', 'light');
    }
    updateThemeIcons();
    return !isLight;
  }

  function updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark') || !document.documentElement.classList.contains('light');
    document.querySelectorAll('.theme-toggle-icon').forEach(icon => {
      icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    });
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // --- DESKTOP CONTEXT MENU (Right Click) ---
  function initContextMenu() {
    const menuEl = document.getElementById('desktop-context-menu');
    const desktopArea = document.getElementById('desktop-area');
    if (!menuEl || !desktopArea) return;

    desktopArea.addEventListener('contextmenu', (e) => {
      // If clicking inside a window or input, let normal browser context menu work
      if (e.target.closest('.pedro-window') || e.target.closest('input') || e.target.closest('textarea')) {
        return;
      }

      e.preventDefault();
      PedroOSAudio.playClick();

      const menuW = 210;
      const menuH = 240;
      let posX = e.clientX;
      let posY = e.clientY;

      if (posX + menuW > window.innerWidth) posX = window.innerWidth - menuW - 10;
      if (posY + menuH > window.innerHeight) posY = window.innerHeight - menuH - 10;

      menuEl.style.left = `${posX}px`;
      menuEl.style.top = `${posY}px`;
      menuEl.classList.remove('hidden');
    });

    // Hide context menu on any global click or escape
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#desktop-context-menu')) {
        hideContextMenu();
      }
    });

    // Context menu actions
    menuEl.querySelectorAll('[data-context-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.contextAction;
        hideContextMenu();
        PedroOSAudio.playClick();

        if (action === 'new-terminal') {
          PedroOSTerminal.openTerminal();
        } else if (action === 'change-wallpaper' || action === 'settings') {
          PedroOSApps.openSettings();
        } else if (action === 'toggle-theme') {
          toggleTheme();
        } else if (action === 'about') {
          PedroOSApps.openAbout();
        } else if (action === 'projects') {
          PedroOSApps.openProjects();
        } else if (action === 'refresh') {
          // Play subtle refresh pulse
          const desk = document.getElementById('desktop-area');
          if (desk) {
            desk.style.opacity = '0.9';
            setTimeout(() => { desk.style.opacity = '1'; }, 100);
          }
        }
      });
    });
  }

  function hideContextMenu() {
    const menuEl = document.getElementById('desktop-context-menu');
    if (menuEl) menuEl.classList.add('hidden');
  }

  // --- DESKTOP MARQUEE SELECTION BOX ---
  function initSelectionMarquee() {
    const desktopArea = document.getElementById('desktop-area');
    const marquee = document.getElementById('selection-marquee');
    if (!desktopArea || !marquee) return;

    let isSelecting = false;
    let startX = 0;
    let startY = 0;

    desktopArea.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.pedro-window') || e.target.closest('.desktop-icon-item') || e.target.closest('#taskbar') || e.button !== 0) {
        return;
      }

      isSelecting = true;
      startX = e.clientX;
      startY = e.clientY;

      marquee.style.left = `${startX}px`;
      marquee.style.top = `${startY}px`;
      marquee.style.width = '0px';
      marquee.style.height = '0px';
      marquee.classList.remove('hidden');

      desktopArea.setPointerCapture(e.pointerId);
    });

    desktopArea.addEventListener('pointermove', (e) => {
      if (!isSelecting) return;

      const currentX = e.clientX;
      const currentY = e.clientY;

      const x = Math.min(startX, currentX);
      const y = Math.min(startY, currentY);
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);

      marquee.style.left = `${x}px`;
      marquee.style.top = `${y}px`;
      marquee.style.width = `${width}px`;
      marquee.style.height = `${height}px`;

      // Check collision with icons
      const marqueeRect = marquee.getBoundingClientRect();
      document.querySelectorAll('.desktop-icon-item').forEach(iconEl => {
        const iconRect = iconEl.getBoundingClientRect();
        const intersects = !(
          marqueeRect.right < iconRect.left ||
          marqueeRect.left > iconRect.right ||
          marqueeRect.bottom < iconRect.top ||
          marqueeRect.top > iconRect.bottom
        );
        if (intersects) {
          iconEl.classList.add('is-selected');
        } else {
          iconEl.classList.remove('is-selected');
        }
      });
    });

    function endSelection(e) {
      if (isSelecting) {
        isSelecting = false;
        marquee.classList.add('hidden');
        try {
          desktopArea.releasePointerCapture(e.pointerId);
        } catch (err) {}
      }
    }

    desktopArea.addEventListener('pointerup', endSelection);
    desktopArea.addEventListener('pointercancel', endSelection);
  }

  // --- KEYBOARD SHORTCUTS ---
  function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.isContentEditable
      );

      // ESC: Close menus, popups, and quick search
      if (e.key === 'Escape') {
        hideContextMenu();
        if (window.PedroOSTaskbar) {
          window.PedroOSTaskbar.closeStartMenu();
          window.PedroOSTaskbar.closeQuickSearch();
          window.PedroOSTaskbar.closeCalendar();
        }
        const welcomeModal = document.getElementById('welcome-modal');
        if (welcomeModal) welcomeModal.classList.add('hidden');
        return;
      }

      // If user is typing in a form or terminal input, do not trigger OS navigation shortcuts
      if (isInput) return;

      // Ctrl + K: Quick Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (window.PedroOSTaskbar) {
          window.PedroOSTaskbar.toggleQuickSearch();
        }
      }

      // Ctrl + Alt + T: Open Terminal
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        PedroOSTerminal.openTerminal();
      }

      // Ctrl + Alt + M: Minimize active window
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        PedroOSWindowManager.minimizeActiveWindow();
      }

      // Alt + F4: Close active window
      if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        PedroOSWindowManager.closeActiveWindow();
      }
    });
  }

  return {
    init,
    setWallpaper,
    toggleTheme,
    hideContextMenu
  };
})();

window.PedroOSDesktop = PedroOSDesktop;
