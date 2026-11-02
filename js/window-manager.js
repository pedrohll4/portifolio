// ============================================================
// PedroOS - Advanced Window Management Engine
// Manages multi-window lifecycle, dragging, resizing, z-indexing,
// cascading, maximizing, minimizing and responsive mobile behavior
// ============================================================

const PedroOSWindowManager = (function() {
  const windows = new Map();
  let highestZIndex = 100;
  let cascadeOffset = 0;
  const CASCADE_STEP = 28;
  const MAX_CASCADE = 180;

  let activeWindowId = null;

  // Listeners
  const listeners = {
    change: []
  };

  function subscribe(callback) {
    listeners.change.push(callback);
  }

  function notifyListeners() {
    listeners.change.forEach(cb => cb(Array.from(windows.values())));
  }

  function isMobile() {
    return window.innerWidth < 768;
  }

  /**
   * Opens or focuses a window
   * @param {Object} options
   * - id: string
   * - title: string
   * - icon: string (lucide icon name)
   * - content: HTMLElement or HTML string
   * - width: number (optional)
   * - height: number (optional)
   * - isUnique: boolean (default true)
   * - allowResize: boolean (default true)
   */
  function createWindow(options) {
    const {
      id,
      title = 'PedroOS Window',
      icon = 'layout',
      content = '',
      width = 820,
      height = 540,
      allowResize = true
    } = options;

    // If window already exists, restore and focus it
    if (windows.has(id)) {
      const existing = windows.get(id);
      if (existing.isMinimized) {
        restoreWindow(id);
      } else {
        focusWindow(id);
      }
      return existing;
    }

    PedroOSAudio.playOpenWindow();

    const desktopEl = document.getElementById('desktop-area');
    const desktopRect = desktopEl ? desktopEl.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight - 56 };

    // Calculate dimensions
    const mobileMode = isMobile();
    const finalWidth = mobileMode ? desktopRect.width : Math.min(width, desktopRect.width - 40);
    const finalHeight = mobileMode ? desktopRect.height : Math.min(height, desktopRect.height - 40);

    // Calculate position
    let posX = 40 + cascadeOffset;
    let posY = 30 + cascadeOffset;

    if (posX + finalWidth > desktopRect.width || posY + finalHeight > desktopRect.height) {
      cascadeOffset = 0;
      posX = 40;
      posY = 30;
    }
    cascadeOffset = (cascadeOffset + CASCADE_STEP) % MAX_CASCADE;

    if (mobileMode) {
      posX = 0;
      posY = 0;
    }

    highestZIndex += 2;

    // Create DOM element
    const winEl = document.createElement('div');
    winEl.className = `pedro-window ${mobileMode ? 'is-mobile-window' : ''}`;
    winEl.id = `window-${id}`;
    winEl.style.zIndex = highestZIndex;
    winEl.style.width = mobileMode ? '100%' : `${finalWidth}px`;
    winEl.style.height = mobileMode ? '100%' : `${finalHeight}px`;
    winEl.style.transform = mobileMode ? 'none' : `translate3d(${posX}px, ${posY}px, 0)`;

    // Inner window markup
    winEl.innerHTML = `
      <div class="window-titlebar flex items-center justify-between select-none">
        <div class="window-title-group flex items-center gap-2.5 truncate">
          <span class="window-icon text-brand-cyan">
            <i data-lucide="${icon}" class="w-4 h-4"></i>
          </span>
          <span class="window-title-text font-medium text-xs sm:text-sm tracking-tight text-white/90 truncate">${title}</span>
        </div>
        <div class="window-controls flex items-center gap-1.5 shrink-0">
          <button class="win-btn win-btn-minimize" title="Minimizar (Ctrl+Alt+M)" data-action="minimize">
            <i data-lucide="minus" class="w-3.5 h-3.5"></i>
          </button>
          ${!mobileMode && allowResize ? `
            <button class="win-btn win-btn-maximize" title="Maximizar / Restaurar" data-action="maximize">
              <i data-lucide="square" class="w-3 h-3"></i>
            </button>
          ` : ''}
          <button class="win-btn win-btn-close" title="Fechar (Alt+F4)" data-action="close">
            <i data-lucide="x" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
      <div class="window-content-wrapper custom-scrollbar">
        ${typeof content === 'string' ? content : ''}
      </div>
      ${!mobileMode && allowResize ? `
        <div class="window-resize-handle" data-action="resize" title="Redimensionar"></div>
      ` : ''}
    `;

    if (typeof content !== 'string' && content instanceof HTMLElement) {
      const wrapper = winEl.querySelector('.window-content-wrapper');
      wrapper.appendChild(content);
    }

    desktopEl.appendChild(winEl);

    if (window.lucide) {
      window.lucide.createIcons({ root: winEl });
    }

    const windowState = {
      id,
      title,
      icon,
      element: winEl,
      posX,
      posY,
      width: finalWidth,
      height: finalHeight,
      isMaximized: mobileMode,
      isMinimized: false,
      prevRect: { posX, posY, width: finalWidth, height: finalHeight },
      allowResize
    };

    windows.set(id, windowState);
    activeWindowId = id;

    // Attach event listeners for dragging, resizing and focus
    attachWindowEvents(windowState);

    focusWindow(id);
    notifyListeners();

    return windowState;
  }

  function attachWindowEvents(win) {
    const el = win.element;
    const titleBar = el.querySelector('.window-titlebar');
    const resizeHandle = el.querySelector('.window-resize-handle');

    // Focus on mousedown / touchstart anywhere in the window
    el.addEventListener('pointerdown', () => {
      focusWindow(win.id);
    });

    // Window controls actions
    titleBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.win-btn');
      if (!btn) return;
      e.stopPropagation();
      const action = btn.dataset.action;

      if (action === 'minimize') {
        minimizeWindow(win.id);
      } else if (action === 'maximize') {
        toggleMaximize(win.id);
      } else if (action === 'close') {
        closeWindow(win.id);
      }
    });

    // Double click on titlebar toggles maximize (desktop only)
    titleBar.addEventListener('dblclick', (e) => {
      if (isMobile() || !win.allowResize) return;
      if (e.target.closest('.win-btn')) return;
      toggleMaximize(win.id);
    });

    // Dragging mechanism
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialWinX = 0;
    let initialWinY = 0;

    titleBar.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.win-btn')) return;
      if (win.isMaximized || isMobile()) return;

      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      initialWinX = win.posX;
      initialWinY = win.posY;

      titleBar.setPointerCapture(e.pointerId);
      el.classList.add('is-dragging');
    });

    titleBar.addEventListener('pointermove', (e) => {
      if (!isDragging) return;

      const desktopEl = document.getElementById('desktop-area');
      const desktopRect = desktopEl ? desktopEl.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight - 56 };

      const deltaX = e.clientX - dragStartX;
      const deltaY = e.clientY - dragStartY;

      let newX = initialWinX + deltaX;
      let newY = initialWinY + deltaY;

      // Restrain within desktop boundaries
      newX = Math.max(-win.width + 100, Math.min(newX, desktopRect.width - 100));
      newY = Math.max(0, Math.min(newY, desktopRect.height - 40));

      win.posX = newX;
      win.posY = newY;
      el.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
    });

    function stopDrag(e) {
      if (isDragging) {
        isDragging = false;
        el.classList.remove('is-dragging');
        try {
          titleBar.releasePointerCapture(e.pointerId);
        } catch (err) {}
      }
    }

    titleBar.addEventListener('pointerup', stopDrag);
    titleBar.addEventListener('pointercancel', stopDrag);

    // Resizing mechanism
    if (resizeHandle) {
      let isResizing = false;
      let resizeStartX = 0;
      let resizeStartY = 0;
      let initialW = 0;
      let initialH = 0;

      resizeHandle.addEventListener('pointerdown', (e) => {
        if (win.isMaximized || isMobile()) return;
        e.stopPropagation();
        isResizing = true;
        resizeStartX = e.clientX;
        resizeStartY = e.clientY;
        initialW = win.width;
        initialH = win.height;

        resizeHandle.setPointerCapture(e.pointerId);
        el.classList.add('is-resizing');
      });

      resizeHandle.addEventListener('pointermove', (e) => {
        if (!isResizing) return;
        const deltaX = e.clientX - resizeStartX;
        const deltaY = e.clientY - resizeStartY;

        const newW = Math.max(340, initialW + deltaX);
        const newH = Math.max(260, initialH + deltaY);

        win.width = newW;
        win.height = newH;
        el.style.width = `${newW}px`;
        el.style.height = `${newH}px`;
      });

      function stopResize(e) {
        if (isResizing) {
          isResizing = false;
          el.classList.remove('is-resizing');
          try {
            resizeHandle.releasePointerCapture(e.pointerId);
          } catch (err) {}
        }
      }

      resizeHandle.addEventListener('pointerup', stopResize);
      resizeHandle.addEventListener('pointercancel', stopResize);
    }
  }

  function focusWindow(id) {
    if (!windows.has(id)) return;
    const win = windows.get(id);

    highestZIndex += 2;
    win.element.style.zIndex = highestZIndex;

    // Manage active visual state
    windows.forEach(w => {
      w.element.classList.remove('is-focused');
    });
    win.element.classList.add('is-focused');
    activeWindowId = id;

    notifyListeners();
  }

  function minimizeWindow(id) {
    if (!windows.has(id)) return;
    const win = windows.get(id);

    PedroOSAudio.playClick();
    win.isMinimized = true;
    win.element.classList.add('is-minimized');
    win.element.classList.remove('is-focused');

    if (activeWindowId === id) {
      // Find another window to focus
      const otherWindows = Array.from(windows.values()).filter(w => !w.isMinimized && w.id !== id);
      if (otherWindows.length > 0) {
        focusWindow(otherWindows[otherWindows.length - 1].id);
      } else {
        activeWindowId = null;
      }
    }

    notifyListeners();
  }

  function restoreWindow(id) {
    if (!windows.has(id)) return;
    const win = windows.get(id);

    PedroOSAudio.playPop();
    win.isMinimized = false;
    win.element.classList.remove('is-minimized');
    focusWindow(id);
    notifyListeners();
  }

  function toggleMaximize(id) {
    if (!windows.has(id)) return;
    const win = windows.get(id);
    if (!win.allowResize) return;

    PedroOSAudio.playClick();

    const desktopEl = document.getElementById('desktop-area');
    const desktopRect = desktopEl ? desktopEl.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight - 56 };

    if (!win.isMaximized) {
      // Save current rect
      win.prevRect = {
        posX: win.posX,
        posY: win.posY,
        width: win.width,
        height: win.height
      };

      win.isMaximized = true;
      win.element.classList.add('is-maximized');
      win.element.style.transform = 'translate3d(0, 0, 0)';
      win.element.style.width = '100%';
      win.element.style.height = '100%';

      const maxBtn = win.element.querySelector('.win-btn-maximize i');
      if (maxBtn) {
        maxBtn.setAttribute('data-lucide', 'copy');
      }
    } else {
      win.isMaximized = false;
      win.element.classList.remove('is-maximized');
      win.posX = win.prevRect.posX;
      win.posY = win.prevRect.posY;
      win.width = win.prevRect.width;
      win.height = win.prevRect.height;

      win.element.style.transform = `translate3d(${win.posX}px, ${win.posY}px, 0)`;
      win.element.style.width = `${win.width}px`;
      win.element.style.height = `${win.height}px`;

      const maxBtn = win.element.querySelector('.win-btn-maximize i');
      if (maxBtn) {
        maxBtn.setAttribute('data-lucide', 'square');
      }
    }

    if (window.lucide) {
      window.lucide.createIcons({ root: win.element });
    }
  }

  function closeWindow(id) {
    if (!windows.has(id)) return;
    const win = windows.get(id);

    PedroOSAudio.playCloseWindow();
    win.element.classList.add('is-closing');

    setTimeout(() => {
      if (win.element.parentNode) {
        win.element.parentNode.removeChild(win.element);
      }
      windows.delete(id);

      if (activeWindowId === id) {
        const remaining = Array.from(windows.values()).filter(w => !w.isMinimized);
        if (remaining.length > 0) {
          focusWindow(remaining[remaining.length - 1].id);
        } else {
          activeWindowId = null;
        }
      }

      notifyListeners();
    }, 180);
  }

  function closeActiveWindow() {
    if (activeWindowId) {
      closeWindow(activeWindowId);
    }
  }

  function minimizeActiveWindow() {
    if (activeWindowId) {
      minimizeWindow(activeWindowId);
    }
  }

  function getActiveWindow() {
    return activeWindowId ? windows.get(activeWindowId) : null;
  }

  function getAllWindows() {
    return Array.from(windows.values());
  }

  // Handle window resizing to adjust maximized or out-of-bounds windows
  window.addEventListener('resize', () => {
    const mobile = isMobile();
    windows.forEach(win => {
      if (mobile) {
        win.element.classList.add('is-mobile-window');
        win.element.style.transform = 'none';
        win.element.style.width = '100%';
        win.element.style.height = '100%';
      } else if (!win.isMaximized) {
        win.element.classList.remove('is-mobile-window');
        win.element.style.transform = `translate3d(${win.posX}px, ${win.posY}px, 0)`;
        win.element.style.width = `${win.width}px`;
        win.element.style.height = `${win.height}px`;
      }
    });
  });

  return {
    createWindow,
    focusWindow,
    minimizeWindow,
    restoreWindow,
    toggleMaximize,
    closeWindow,
    closeActiveWindow,
    minimizeActiveWindow,
    getActiveWindow,
    getAllWindows,
    subscribe
  };
})();

window.PedroOSWindowManager = PedroOSWindowManager;
