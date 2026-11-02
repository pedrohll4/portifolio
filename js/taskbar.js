// ============================================================
// PedroOS - Taskbar, Start Menu, System Tray & Quick Search
// Controls taskbar state, running apps indicators, clock/calendar,
// system tray and the comprehensive Start Menu
// ============================================================

const PedroOSTaskbar = (function() {
  let isStartMenuOpen = false;
  let isCalendarOpen = false;
  let isQuickSearchOpen = false;

  function init() {
    initClock();
    initStartMenu();
    initRunningAppsSync();
    initQuickSearch();
    initSystemTray();
  }

  // --- CLOCK & CALENDAR ---
  function initClock() {
    const clockEl = document.getElementById('taskbar-clock-time');
    const dateEl = document.getElementById('taskbar-clock-date');
    const clockTrigger = document.getElementById('taskbar-clock-container');
    const calendarPopup = document.getElementById('taskbar-calendar-popup');

    function updateTime() {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

      if (clockEl) clockEl.textContent = timeStr;
      if (dateEl) dateEl.textContent = dateStr;
    }

    updateTime();
    setInterval(updateTime, 1000);

    if (clockTrigger && calendarPopup) {
      clockTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCalendar();
      });

      renderCalendar();
    }
  }

  function toggleCalendar() {
    const popup = document.getElementById('taskbar-calendar-popup');
    if (!popup) return;
    isCalendarOpen = !isCalendarOpen;
    if (isCalendarOpen) {
      closeStartMenu();
      closeQuickSearch();
      popup.classList.remove('hidden');
      PedroOSAudio.playClick();
    } else {
      popup.classList.add('hidden');
    }
  }

  function closeCalendar() {
    const popup = document.getElementById('taskbar-calendar-popup');
    if (popup) popup.classList.add('hidden');
    isCalendarOpen = false;
  }

  function renderCalendar() {
    const calBody = document.getElementById('calendar-days-grid');
    const calMonthHeader = document.getElementById('calendar-month-name');
    if (!calBody || !calMonthHeader) return;

    const now = new Date();
    const currentMonth = now.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    calMonthHeader.textContent = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const today = now.getDate();

    let daysHtml = '';
    for (let i = 0; i < firstDayIndex; i++) {
      daysHtml += '<div class="text-slate-600 p-1.5 text-center text-xs"></div>';
    }
    for (let day = 1; day <= totalDays; day++) {
      const isToday = day === today;
      daysHtml += `
        <div class="p-1.5 text-center text-xs font-mono rounded-lg transition-colors ${isToday ? 'bg-brand-cyan text-slate-900 font-bold shadow-glow-cyan' : 'text-slate-200 hover:bg-white/10'}">
          ${day}
        </div>
      `;
    }
    calBody.innerHTML = daysHtml;
  }

  // --- START MENU ---
  function initStartMenu() {
    const startBtn = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    if (!startBtn || !startMenu) return;

    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleStartMenu();
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#start-menu') && !e.target.closest('#start-button')) {
        closeStartMenu();
      }
      if (!e.target.closest('#taskbar-calendar-popup') && !e.target.closest('#taskbar-clock-container')) {
        closeCalendar();
      }
    });

    // Populate user profile info in start menu
    const profile = PedroOSData.profile;
    const nameEl = startMenu.querySelector('#start-user-name');
    const roleEl = startMenu.querySelector('#start-user-role');
    const avatarEl = startMenu.querySelector('#start-user-avatar');

    if (nameEl) nameEl.textContent = profile.name;
    if (roleEl) roleEl.textContent = profile.role;
    if (avatarEl) avatarEl.src = profile.avatar;

    // Start menu item clicks
    startMenu.querySelectorAll('[data-start-action]').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.dataset.startAction;
        closeStartMenu();
        PedroOSAudio.playPop();

        if (action === 'explorer') PedroOSApps.openExplorer();
        else if (action === 'about') PedroOSApps.openAbout();
        else if (action === 'projects') PedroOSApps.openProjects();
        else if (action === 'resume') PedroOSApps.openResume();
        else if (action === 'skills') PedroOSApps.openSkills();
        else if (action === 'experience') PedroOSApps.openExperience();
        else if (action === 'terminal') PedroOSTerminal.openTerminal();
        else if (action === 'contact') PedroOSApps.openContact();
        else if (action === 'settings') PedroOSApps.openSettings();
        else if (action === 'trash') PedroOSApps.openTrash();
        else if (action === 'github') window.open('https://github.com/pedrohll4', '_blank');
        else if (action === 'whatsapp') window.open('https://wa.me/5569992102965', '_blank');
        else if (action === 'shutdown') showShutdownScreen();
      });
    });

    // Start menu recent projects
    const recentProjectsContainer = startMenu.querySelector('#start-recent-projects');
    if (recentProjectsContainer) {
      recentProjectsContainer.innerHTML = PedroOSData.projects.slice(0, 4).map(proj => `
        <div class="start-proj-item flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors" data-project-id="${proj.id}">
          <div class="w-8 h-8 rounded-lg bg-brand-cyan/15 flex items-center justify-center text-brand-cyan shrink-0">
            <i data-lucide="${proj.icon}" class="w-4 h-4"></i>
          </div>
          <div class="truncate">
            <span class="text-xs font-semibold text-white block truncate">${proj.name}</span>
            <span class="text-[10px] font-mono text-brand-slateMuted truncate">${proj.displayUrl}</span>
          </div>
        </div>
      `).join('');

      if (window.lucide) {
        window.lucide.createIcons({ root: recentProjectsContainer });
      }

      recentProjectsContainer.querySelectorAll('.start-proj-item').forEach(item => {
        item.addEventListener('click', () => {
          closeStartMenu();
          PedroOSApps.openProjectDetails(item.dataset.projectId);
        });
      });
    }
  }

  function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    const startBtn = document.getElementById('start-button');
    if (!startMenu) return;

    isStartMenuOpen = !isStartMenuOpen;
    if (isStartMenuOpen) {
      closeCalendar();
      closeQuickSearch();
      startMenu.classList.remove('hidden');
      startBtn.classList.add('bg-white/15');
      PedroOSAudio.playClick();
    } else {
      startMenu.classList.add('hidden');
      startBtn.classList.remove('bg-white/15');
    }
  }

  function closeStartMenu() {
    const startMenu = document.getElementById('start-menu');
    const startBtn = document.getElementById('start-button');
    if (startMenu) startMenu.classList.add('hidden');
    if (startBtn) startBtn.classList.remove('bg-white/15');
    isStartMenuOpen = false;
  }

  // --- RUNNING APPS SYNC ---
  function initRunningAppsSync() {
    const container = document.getElementById('taskbar-running-apps');
    if (!container) return;

    PedroOSWindowManager.subscribe((windows) => {
      container.innerHTML = windows.map(win => `
        <button class="taskbar-app-tab px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${win.isFocused && !win.isMinimized ? 'bg-white/15 text-white border-b-2 border-brand-cyan' : 'hover:bg-white/10 text-slate-300'}" data-win-id="${win.id}" title="${win.title}">
          <i data-lucide="${win.icon}" class="w-4 h-4 text-brand-cyan shrink-0"></i>
          <span class="text-xs font-medium max-w-[100px] truncate hidden md:inline">${win.title}</span>
          <span class="w-1.5 h-1.5 rounded-full ${win.isMinimized ? 'bg-amber-400' : 'bg-brand-cyan'} shrink-0"></span>
        </button>
      `).join('');

      if (window.lucide) {
        window.lucide.createIcons({ root: container });
      }

      container.querySelectorAll('.taskbar-app-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const winId = tab.dataset.winId;
          const win = windows.find(w => w.id === winId);
          if (!win) return;

          if (win.isMinimized) {
            PedroOSWindowManager.restoreWindow(winId);
          } else if (win.isFocused) {
            PedroOSWindowManager.minimizeWindow(winId);
          } else {
            PedroOSWindowManager.focusWindow(winId);
          }
        });
      });
    });
  }

  // --- SYSTEM TRAY ---
  function initSystemTray() {
    // Theme toggle button
    const themeBtn = document.getElementById('taskbar-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        PedroOSAudio.playClick();
        PedroOSDesktop.toggleTheme();
      });
    }

    // Sound toggle button
    const soundBtn = document.getElementById('taskbar-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const enabled = PedroOSAudio.toggleSound();
        const icon = soundBtn.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', enabled ? 'volume-2' : 'volume-x');
          if (window.lucide) window.lucide.createIcons({ root: soundBtn });
        }
      });
    }

    // Pinned apps click handlers
    document.querySelectorAll('[data-pinned-app]').forEach(btn => {
      btn.addEventListener('click', () => {
        const app = btn.dataset.pinnedApp;
        PedroOSAudio.playPop();

        if (app === 'explorer') PedroOSApps.openExplorer();
        else if (app === 'projects') PedroOSApps.openProjects();
        else if (app === 'terminal') PedroOSTerminal.openTerminal();
        else if (app === 'resume') PedroOSApps.openResume();
        else if (app === 'contact') PedroOSApps.openContact();
        else if (app === 'github') window.open('https://github.com/pedrohll4', '_blank');
      });
    });
  }

  // --- QUICK SEARCH (Ctrl + K) ---
  function initQuickSearch() {
    const modal = document.getElementById('quick-search-modal');
    const input = document.getElementById('quick-search-input');
    const resultsContainer = document.getElementById('quick-search-results');
    const searchTrigger = document.getElementById('taskbar-search-trigger');

    if (!modal || !input || !resultsContainer) return;

    if (searchTrigger) {
      searchTrigger.addEventListener('click', () => {
        toggleQuickSearch();
      });
    }

    // Close on clicking backdrop
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeQuickSearch();
      }
    });

    const searchableItems = [
      { title: 'Meu Computador', desc: 'Explorador de Arquivos & Estrutura de Pastas', type: 'app', icon: 'monitor', action: () => PedroOSApps.openExplorer() },
      { title: 'Sobre Mim', desc: 'Apresentação profissional de Pedro Henrique', type: 'app', icon: 'user', action: () => PedroOSApps.openAbout() },
      { title: 'Meus Projetos', desc: 'Vitrine completa com 6 sites no ar', type: 'app', icon: 'layers', action: () => PedroOSApps.openProjects() },
      { title: 'Currículo.pdf', desc: 'Visualizar e baixar currículo completo', type: 'app', icon: 'file-text', action: () => PedroOSApps.openResume() },
      { title: 'Habilidades', desc: 'React, Next.js, Python, Java, IA, Git, etc.', type: 'app', icon: 'cpu', action: () => PedroOSApps.openSkills() },
      { title: 'Experiência Profissional', desc: 'Tratormag, Dabliu Marketing, Jala University, IFRO', type: 'app', icon: 'briefcase', action: () => PedroOSApps.openExperience() },
      { title: 'Terminal', desc: 'Shell interativo estilo Linux (neofetch, help)', type: 'app', icon: 'terminal', action: () => PedroOSTerminal.openTerminal() },
      { title: 'Contato & Mensagem', desc: 'WhatsApp, E-mail e canais diretos', type: 'app', icon: 'message-circle', action: () => PedroOSApps.openContact() },
      { title: 'Configurações', desc: 'Wallpapers, tema e preferências do PedroOS', type: 'app', icon: 'settings', action: () => PedroOSApps.openSettings() },
      // 6 Projects
      { title: 'Tratormag', desc: 'Portal corporativo e catálogo de máquinas pesadas', type: 'project', icon: 'tractor', action: () => PedroOSApps.openProjectDetails('tratormag') },
      { title: 'Hora do Rush Notícias', desc: 'Portal regional de notícias de alto tráfego', type: 'project', icon: 'newspaper', action: () => PedroOSApps.openProjectDetails('hora-do-rush') },
      { title: 'Yuri Almeida Imóveis', desc: 'Plataforma imobiliária com catálogo e busca', type: 'project', icon: 'home', action: () => PedroOSApps.openProjectDetails('yuri-almeida') },
      { title: 'Las Chicas Fitness', desc: 'E-commerce e vitrine de moda fitness', type: 'project', icon: 'shopping-bag', action: () => PedroOSApps.openProjectDetails('las-chicas') },
      { title: 'El Shadday Ariquemes', desc: 'Portal institucional e comunitário com agenda', type: 'project', icon: 'users', action: () => PedroOSApps.openProjectDetails('el-shadday') },
      { title: 'Araujo Instrutor Autônomo', desc: 'Landing page de alta conversão para WhatsApp', type: 'project', icon: 'car', action: () => PedroOSApps.openProjectDetails('araujo-instrutor') },
      // Direct Links
      { title: 'WhatsApp Direto', desc: '(69) 99210-2965 - Iniciar conversa', type: 'link', icon: 'message-circle', action: () => window.open('https://wa.me/5569992102965', '_blank') },
      { title: 'GitHub Oficial', desc: 'github.com/pedrohll4', type: 'link', icon: 'github', action: () => window.open('https://github.com/pedrohll4', '_blank') }
    ];

    function renderResults(query = '') {
      const q = query.toLowerCase().trim();
      const filtered = q
        ? searchableItems.filter(item => item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q))
        : searchableItems.slice(0, 7);

      if (filtered.length === 0) {
        resultsContainer.innerHTML = `
          <div class="p-8 text-center text-slate-500 font-mono text-xs">
            Nenhum resultado encontrado para "${query}".
          </div>
        `;
        return;
      }

      resultsContainer.innerHTML = filtered.map((item, idx) => `
        <div class="search-result-item p-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors flex items-center justify-between ${idx === 0 ? 'bg-white/5' : ''}" data-idx="${idx}">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-brand-cyan/15 flex items-center justify-center text-brand-cyan shrink-0">
              <i data-lucide="${item.icon}" class="w-4 h-4"></i>
            </div>
            <div>
              <span class="text-xs font-bold text-white block">${item.title}</span>
              <span class="text-[11px] text-brand-slateMuted block">${item.desc}</span>
            </div>
          </div>
          <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10 uppercase">
            ${item.type}
          </span>
        </div>
      `).join('');

      if (window.lucide) {
        window.lucide.createIcons({ root: resultsContainer });
      }

      resultsContainer.querySelectorAll('.search-result-item').forEach((el, i) => {
        el.addEventListener('click', () => {
          closeQuickSearch();
          filtered[i].action();
        });
      });
    }

    input.addEventListener('input', (e) => {
      renderResults(e.target.value);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const first = resultsContainer.querySelector('.search-result-item');
        if (first) first.click();
      }
    });

    renderResults('');
  }

  function toggleQuickSearch() {
    const modal = document.getElementById('quick-search-modal');
    const input = document.getElementById('quick-search-input');
    if (!modal) return;

    isQuickSearchOpen = !isQuickSearchOpen;
    if (isQuickSearchOpen) {
      closeStartMenu();
      closeCalendar();
      modal.classList.remove('hidden');
      if (input) {
        input.value = '';
        input.focus();
      }
      PedroOSAudio.playClick();
    } else {
      modal.classList.add('hidden');
    }
  }

  function closeQuickSearch() {
    const modal = document.getElementById('quick-search-modal');
    if (modal) modal.classList.add('hidden');
    isQuickSearchOpen = false;
  }

  // --- SHUTDOWN SIMULATION SCREEN ---
  function showShutdownScreen() {
    const screen = document.getElementById('shutdown-screen');
    if (!screen) return;

    screen.classList.remove('hidden');
    screen.style.display = 'flex';
    PedroOSAudio.playCloseWindow();

    const restartBtn = screen.querySelector('#btn-power-on');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        PedroOSAudio.playBootChime();
        screen.classList.add('hidden');
        screen.style.display = 'none';
      }, { once: true });
    }
  }

  return {
    init,
    toggleStartMenu,
    closeStartMenu,
    toggleQuickSearch,
    closeQuickSearch,
    toggleCalendar,
    closeCalendar,
    showShutdownScreen
  };
})();

window.PedroOSTaskbar = PedroOSTaskbar;
