// ============================================================
// PedroOS - Applications & Content Renderers
// Renders the UI for each application window in the OS
// ============================================================

const PedroOSApps = (function() {

  // Helper to safely render icons after updating innerHTML
  function refreshIcons(container) {
    if (window.lucide && container) {
      window.lucide.createIcons({ root: container });
    }
  }

  // --- 1. FILE EXPLORER / MEU COMPUTADOR ---
  function openExplorer(initialPath = 'Este Computador') {
    const winId = 'app-explorer';
    const data = PedroOSData;

    let currentPath = initialPath;
    let pathHistory = [initialPath];
    let historyIdx = 0;
    let viewMode = 'grid'; // 'grid' | 'list'

    const container = document.createElement('div');
    container.className = 'explorer-container flex flex-col h-full bg-[#0b0f19]/90 text-slate-200 select-none';

    function renderExplorer() {
      container.innerHTML = `
        <!-- Explorer Toolbar -->
        <div class="explorer-toolbar flex items-center justify-between gap-2 px-3 py-2 border-b border-white/10 bg-slate-900/60 text-xs">
          <div class="flex items-center gap-1.5 shrink-0">
            <button class="nav-btn p-1.5 rounded hover:bg-white/10 ${historyIdx > 0 ? 'text-white' : 'text-slate-500 cursor-not-allowed'}" id="exp-back" title="Voltar">
              <i data-lucide="arrow-left" class="w-4 h-4"></i>
            </button>
            <button class="nav-btn p-1.5 rounded hover:bg-white/10 ${historyIdx < pathHistory.length - 1 ? 'text-white' : 'text-slate-500 cursor-not-allowed'}" id="exp-fwd" title="Avançar">
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
            <button class="nav-btn p-1.5 rounded hover:bg-white/10 text-white" id="exp-up" title="Nível Acima">
              <i data-lucide="arrow-up" class="w-4 h-4"></i>
            </button>
            <button class="nav-btn p-1.5 rounded hover:bg-white/10 text-white" id="exp-refresh" title="Atualizar">
              <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <!-- Breadcrumb address bar -->
          <div class="explorer-address-bar flex-1 flex items-center gap-2 bg-[#060910] border border-white/10 rounded-md px-2.5 py-1 text-slate-300 font-mono text-[11px] truncate">
            <i data-lucide="hard-drive" class="w-3.5 h-3.5 text-brand-cyan shrink-0"></i>
            <span class="text-brand-slateMuted">PedroOS</span>
            <span class="text-slate-500">&gt;</span>
            <span class="text-white font-semibold truncate">${currentPath}</span>
          </div>

          <!-- View mode toggle -->
          <div class="flex items-center gap-1 bg-[#060910] border border-white/10 rounded p-0.5 shrink-0">
            <button class="p-1 rounded ${viewMode === 'grid' ? 'bg-brand-violet text-white' : 'text-slate-400 hover:text-white'}" id="exp-view-grid" title="Exibição em Ícones">
              <i data-lucide="layout-grid" class="w-3.5 h-3.5"></i>
            </button>
            <button class="p-1 rounded ${viewMode === 'list' ? 'bg-brand-violet text-white' : 'text-slate-400 hover:text-white'}" id="exp-view-list" title="Exibição em Lista">
              <i data-lucide="list" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>

        <!-- Main Explorer Body -->
        <div class="flex-1 flex overflow-hidden">
          <!-- Sidebar -->
          <div class="explorer-sidebar w-48 border-r border-white/10 p-2.5 hidden sm:flex flex-col gap-1 bg-[#0a0d16]/70 text-xs overflow-y-auto">
            <div class="text-[10px] uppercase font-mono tracking-wider text-brand-slateMuted px-2 py-1 font-semibold">Acesso Rápido</div>
            
            <button class="sidebar-item flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/10 transition-colors text-left ${currentPath === 'Este Computador' ? 'bg-white/10 text-white font-semibold' : 'text-slate-300'}" data-path="Este Computador">
              <i data-lucide="monitor" class="w-4 h-4 text-brand-cyan"></i>
              <span>Este Computador</span>
            </button>

            <button class="sidebar-item flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/10 transition-colors text-left ${currentPath === 'Documentos' ? 'bg-white/10 text-white font-semibold' : 'text-slate-300'}" data-path="Documentos">
              <i data-lucide="folder" class="w-4 h-4 text-amber-400"></i>
              <span>Documentos</span>
            </button>

            <button class="sidebar-item flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/10 transition-colors text-left ${currentPath === 'Projetos' ? 'bg-white/10 text-white font-semibold' : 'text-slate-300'}" data-action="open-projects">
              <i data-lucide="folder-git" class="w-4 h-4 text-brand-violetGlow"></i>
              <span>Meus Projetos</span>
            </button>

            <button class="sidebar-item flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/10 transition-colors text-left ${currentPath === 'Fotografias' ? 'bg-white/10 text-white font-semibold' : 'text-slate-300'}" data-path="Fotografias">
              <i data-lucide="folder-image" class="w-4 h-4 text-emerald-400"></i>
              <span>Fotografias</span>
            </button>

            <button class="sidebar-item flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/10 transition-colors text-left" data-action="open-resume">
              <i data-lucide="file-text" class="w-4 h-4 text-rose-400"></i>
              <span>Currículo.pdf</span>
            </button>

            <button class="sidebar-item flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/10 transition-colors text-left" data-action="open-skills">
              <i data-lucide="cpu" class="w-4 h-4 text-blue-400"></i>
              <span>Habilidades</span>
            </button>

            <div class="text-[10px] uppercase font-mono tracking-wider text-brand-slateMuted px-2 pt-3 pb-1 font-semibold">Unidades</div>

            <button class="sidebar-item flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/10 transition-colors text-left ${currentPath === 'Disco Local (C:)' ? 'bg-white/10 text-white font-semibold' : 'text-slate-300'}" data-path="Disco Local (C:)">
              <i data-lucide="hard-drive" class="w-4 h-4 text-slate-400"></i>
              <span>Disco Local (C:)</span>
            </button>

            <button class="sidebar-item flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/10 transition-colors text-left ${currentPath === 'Projetos (D:)' ? 'bg-white/10 text-white font-semibold' : 'text-slate-300'}" data-path="Projetos (D:)">
              <i data-lucide="hard-drive" class="w-4 h-4 text-brand-cyan"></i>
              <span>Projetos (D:)</span>
            </button>

            <div class="mt-auto pt-4 border-t border-white/5">
              <button class="sidebar-item w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/10 text-slate-400 text-left" data-action="open-trash">
                <i data-lucide="trash-2" class="w-4 h-4 text-slate-400"></i>
                <span>Lixeira</span>
              </button>
            </div>
          </div>

          <!-- Content View Area -->
          <div class="explorer-view-area flex-1 p-4 overflow-y-auto custom-scrollbar" id="exp-items-container">
            ${renderPathContent(currentPath, viewMode)}
          </div>
        </div>

        <!-- Explorer Status Bar -->
        <div class="explorer-statusbar px-3 py-1 bg-[#090d16] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-brand-slateMuted">
          <div class="flex items-center gap-3">
            <span>Local: ${currentPath}</span>
            <span class="hidden sm:inline">• Status: Sistema Saudável</span>
          </div>
          <div>
            <span>PedroOS File Manager</span>
          </div>
        </div>
      `;

      refreshIcons(container);
      bindExplorerEvents();
    }

    function renderPathContent(path, mode) {
      if (path === 'Este Computador') {
        return `
          <div class="space-y-6">
            <!-- System Overview Card -->
            <div class="glass-card rounded-xl p-4 border border-white/10 bg-white/[0.02]">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center text-brand-cyan">
                  <i data-lucide="laptop" class="w-5 h-5"></i>
                </div>
                <div>
                  <h4 class="font-bold text-sm text-white">${data.system.name} — Estação de Desenvolvimento</h4>
                  <p class="text-xs text-brand-slateText">${data.profile.name} • ${data.profile.role}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-mono">
                <div class="bg-black/30 p-2 rounded border border-white/5">
                  <span class="text-brand-slateMuted block text-[10px]">LOCALIZAÇÃO</span>
                  <span class="text-white">${data.profile.location}</span>
                </div>
                <div class="bg-black/30 p-2 rounded border border-white/5">
                  <span class="text-brand-slateMuted block text-[10px]">DISPONIBILIDADE</span>
                  <span class="text-emerald-400">Presencial / Remoto / Mudança</span>
                </div>
                <div class="bg-black/30 p-2 rounded border border-white/5">
                  <span class="text-brand-slateMuted block text-[10px]">FORMAÇÃO SUPERIOR</span>
                  <span class="text-brand-cyanLight">${data.profile.education.higher.institution}</span>
                </div>
              </div>
            </div>

            <!-- Drives Section -->
            <div>
              <h5 class="text-xs font-mono uppercase tracking-wider text-brand-slateMuted mb-3 flex items-center gap-2">
                <i data-lucide="hard-drive" class="w-3.5 h-3.5"></i>
                <span>Dispositivos e Unidades (2)</span>
              </h5>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <!-- Drive C -->
                <div class="drive-item p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-brand-violet/40 cursor-pointer transition-all flex items-center gap-3.5" data-path="Disco Local (C:)">
                  <div class="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-brand-cyan shrink-0">
                    <i data-lucide="hard-drive" class="w-5 h-5"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between text-xs font-semibold mb-1">
                      <span class="text-white truncate">Disco Local (C:)</span>
                      <span class="text-[10px] font-mono text-brand-slateMuted">256 GB / 512 GB</span>
                    </div>
                    <div class="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                      <div class="bg-brand-cyan h-full rounded-full" style="width: 50%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-brand-slateMuted mt-1 block">PedroOS Sistema & Aplicativos</span>
                  </div>
                </div>

                <!-- Drive D -->
                <div class="drive-item p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-brand-cyan/40 cursor-pointer transition-all flex items-center gap-3.5" data-path="Projetos (D:)">
                  <div class="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-brand-violetGlow shrink-0">
                    <i data-lucide="folder-git" class="w-5 h-5"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between text-xs font-semibold mb-1">
                      <span class="text-white truncate">Projetos & Código (D:)</span>
                      <span class="text-[10px] font-mono text-brand-slateMuted">1.2 TB / 2.0 TB</span>
                    </div>
                    <div class="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                      <div class="bg-brand-violet h-full rounded-full" style="width: 60%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-brand-slateMuted mt-1 block">Repositórios & 6 Projetos Reais</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- User Folders Section -->
            <div>
              <h5 class="text-xs font-mono uppercase tracking-wider text-brand-slateMuted mb-3 flex items-center gap-2">
                <i data-lucide="folder" class="w-3.5 h-3.5"></i>
                <span>Pastas do Desenvolvedor</span>
              </h5>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="folder-item p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/40 cursor-pointer transition-all flex flex-col items-center text-center gap-2 group" data-path="Documentos">
                  <i data-lucide="folder" class="w-8 h-8 text-amber-400 group-hover:scale-105 transition-transform"></i>
                  <span class="text-xs text-slate-200 group-hover:text-white font-medium">Documentos</span>
                </div>

                <div class="folder-item p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] border border-white/10 hover:border-brand-violet/40 cursor-pointer transition-all flex flex-col items-center text-center gap-2 group" data-action="open-projects">
                  <i data-lucide="folder-git" class="w-8 h-8 text-brand-violetGlow group-hover:scale-105 transition-transform"></i>
                  <span class="text-xs text-slate-200 group-hover:text-white font-medium">Meus Projetos</span>
                </div>

                <div class="folder-item p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-400/40 cursor-pointer transition-all flex flex-col items-center text-center gap-2 group" data-path="Fotografias">
                  <i data-lucide="folder-image" class="w-8 h-8 text-emerald-400 group-hover:scale-105 transition-transform"></i>
                  <span class="text-xs text-slate-200 group-hover:text-white font-medium">Fotografias</span>
                </div>

                <div class="folder-item p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] border border-white/10 hover:border-rose-400/40 cursor-pointer transition-all flex flex-col items-center text-center gap-2 group" data-action="open-resume">
                  <i data-lucide="file-text" class="w-8 h-8 text-rose-400 group-hover:scale-105 transition-transform"></i>
                  <span class="text-xs text-slate-200 group-hover:text-white font-medium">Currículo.pdf</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }

      if (path === 'Documentos') {
        const files = data.virtualFileSystem.folders['Documentos'] || [];
        if (mode === 'grid') {
          return `
            <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              ${files.map(f => `
                <div class="file-item p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] border border-white/10 hover:border-brand-cyan/40 cursor-pointer transition-all flex flex-col items-center text-center gap-2 group" data-file-id="${f.id}" data-file-type="${f.type}" data-target-app="${f.targetApp || ''}">
                  <i data-lucide="${f.icon}" class="w-8 h-8 text-brand-cyan group-hover:scale-110 transition-transform"></i>
                  <span class="text-xs text-slate-200 group-hover:text-white break-all leading-tight">${f.name}</span>
                  <span class="text-[10px] font-mono text-brand-slateMuted">${f.size || ''}</span>
                </div>
              `).join('')}
            </div>
          `;
        } else {
          return `
            <div class="space-y-1">
              <div class="flex items-center px-3 py-1.5 text-[11px] font-mono text-brand-slateMuted border-b border-white/10">
                <span class="flex-1">Nome</span>
                <span class="w-24">Data</span>
                <span class="w-20 text-right">Tamanho</span>
              </div>
              ${files.map(f => `
                <div class="file-item flex items-center px-3 py-2 rounded hover:bg-white/10 cursor-pointer transition-colors text-xs" data-file-id="${f.id}" data-file-type="${f.type}" data-target-app="${f.targetApp || ''}">
                  <div class="flex-1 flex items-center gap-2 truncate">
                    <i data-lucide="${f.icon}" class="w-4 h-4 text-brand-cyan"></i>
                    <span class="text-white truncate">${f.name}</span>
                  </div>
                  <span class="w-24 text-[11px] font-mono text-brand-slateMuted">${f.date}</span>
                  <span class="w-20 text-[11px] font-mono text-brand-slateMuted text-right">${f.size || '-'}</span>
                </div>
              `).join('')}
            </div>
          `;
        }
      }

      if (path === 'Fotografias') {
        const photos = data.virtualFileSystem.folders['Fotografias'] || [];
        return `
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            ${photos.map(p => `
              <div class="photo-item p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-brand-cyan cursor-pointer transition-all group" data-photo-src="${p.src}" data-photo-name="${p.name}">
                <div class="aspect-square rounded-lg overflow-hidden mb-2 bg-slate-900 flex items-center justify-center">
                  <img src="${p.src}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                </div>
                <div class="flex items-center justify-between text-xs px-1">
                  <span class="text-white truncate font-medium">${p.name}</span>
                  <span class="text-[10px] font-mono text-brand-slateMuted">${p.size}</span>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }

      if (path === 'Disco Local (C:)') {
        return `
          <div class="space-y-4">
            <p class="text-xs text-brand-slateMuted font-mono">C:\\</p>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="folder-item p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] border border-white/10 cursor-pointer flex flex-col items-center text-center gap-2" data-path="Documentos">
                <i data-lucide="folder" class="w-8 h-8 text-amber-400"></i>
                <span class="text-xs text-white">Usuários/pedro</span>
              </div>
              <div class="folder-item p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] border border-white/10 cursor-pointer flex flex-col items-center text-center gap-2" data-path="Documentos">
                <i data-lucide="folder" class="w-8 h-8 text-brand-cyan"></i>
                <span class="text-xs text-white">Documentos</span>
              </div>
              <div class="file-item p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] border border-white/10 cursor-pointer flex flex-col items-center text-center gap-2" data-file-action="show-kernel-info">
                <i data-lucide="file-cog" class="w-8 h-8 text-brand-violet"></i>
                <span class="text-xs text-white">kernel.sys</span>
              </div>
            </div>
          </div>
        `;
      }

      if (path === 'Projetos (D:)') {
        return `
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <p class="text-xs text-brand-slateMuted font-mono">D:\\Projetos\\ (6 Repositórios no Ar)</p>
              <button class="px-2.5 py-1 text-xs bg-brand-violet hover:bg-brand-violetGlow text-white rounded font-mono" data-action="open-projects">
                Abrir Vitrine Completa
              </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              ${data.projects.map(proj => `
                <div class="project-shortcut p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-brand-cyan cursor-pointer transition-all flex items-center gap-3" data-project-id="${proj.id}">
                  <div class="w-9 h-9 rounded-lg bg-brand-cyan/15 flex items-center justify-center text-brand-cyan shrink-0">
                    <i data-lucide="${proj.icon}" class="w-4 h-4"></i>
                  </div>
                  <div class="truncate">
                    <span class="text-xs font-bold text-white block truncate">${proj.name}</span>
                    <span class="text-[10px] font-mono text-emerald-400">${proj.status}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      return `<div class="p-8 text-center text-slate-500 font-mono text-xs">Pasta vazia ou inexistente.</div>`;
    }

    function navigateTo(newPath) {
      if (newPath === currentPath) return;
      currentPath = newPath;
      if (historyIdx < pathHistory.length - 1) {
        pathHistory = pathHistory.slice(0, historyIdx + 1);
      }
      pathHistory.push(newPath);
      historyIdx = pathHistory.length - 1;
      renderExplorer();
    }

    function bindExplorerEvents() {
      // Back button
      const backBtn = container.querySelector('#exp-back');
      if (backBtn && historyIdx > 0) {
        backBtn.addEventListener('click', () => {
          historyIdx--;
          currentPath = pathHistory[historyIdx];
          renderExplorer();
        });
      }

      // Forward button
      const fwdBtn = container.querySelector('#exp-fwd');
      if (fwdBtn && historyIdx < pathHistory.length - 1) {
        fwdBtn.addEventListener('click', () => {
          historyIdx++;
          currentPath = pathHistory[historyIdx];
          renderExplorer();
        });
      }

      // Up button
      const upBtn = container.querySelector('#exp-up');
      if (upBtn) {
        upBtn.addEventListener('click', () => {
          if (currentPath !== 'Este Computador') {
            navigateTo('Este Computador');
          }
        });
      }

      // Refresh button
      const refBtn = container.querySelector('#exp-refresh');
      if (refBtn) {
        refBtn.addEventListener('click', () => {
          PedroOSAudio.playClick();
          renderExplorer();
        });
      }

      // View mode toggles
      const viewGridBtn = container.querySelector('#exp-view-grid');
      const viewListBtn = container.querySelector('#exp-view-list');
      if (viewGridBtn) {
        viewGridBtn.addEventListener('click', () => {
          viewMode = 'grid';
          renderExplorer();
        });
      }
      if (viewListBtn) {
        viewListBtn.addEventListener('click', () => {
          viewMode = 'list';
          renderExplorer();
        });
      }

      // Sidebar & Item clicks
      container.querySelectorAll('[data-path]').forEach(el => {
        el.addEventListener('click', () => {
          PedroOSAudio.playClick();
          navigateTo(el.dataset.path);
        });
      });

      // Actions
      container.querySelectorAll('[data-action="open-projects"]').forEach(el => {
        el.addEventListener('click', () => openProjects());
      });
      container.querySelectorAll('[data-action="open-resume"]').forEach(el => {
        el.addEventListener('click', () => openResume());
      });
      container.querySelectorAll('[data-action="open-skills"]').forEach(el => {
        el.addEventListener('click', () => openSkills());
      });
      container.querySelectorAll('[data-action="open-trash"]').forEach(el => {
        el.addEventListener('click', () => openTrash());
      });

      // File items
      container.querySelectorAll('.file-item').forEach(el => {
        el.addEventListener('dblclick', () => handleFileClick(el));
        // Single tap for mobile
        el.addEventListener('click', (e) => {
          if (window.innerWidth < 768) {
            handleFileClick(el);
          }
        });
      });

      // Photo items
      container.querySelectorAll('.photo-item').forEach(el => {
        const openPhoto = () => {
          const src = el.dataset.photoSrc;
          const name = el.dataset.photoName;
          openImageViewer(src, name);
        };
        el.addEventListener('dblclick', openPhoto);
        el.addEventListener('click', () => {
          if (window.innerWidth < 768) openPhoto();
        });
      });

      // Project shortcuts
      container.querySelectorAll('.project-shortcut').forEach(el => {
        el.addEventListener('click', () => {
          const pid = el.dataset.projectId;
          openProjectDetails(pid);
        });
      });
    }

    function handleFileClick(el) {
      const fileId = el.dataset.fileId;
      const targetApp = el.dataset.targetApp;
      if (targetApp === 'resume') {
        openResume();
        return;
      }

      const files = PedroOSData.virtualFileSystem.folders['Documentos'] || [];
      const fileObj = files.find(f => f.id === fileId);
      if (fileObj && fileObj.content) {
        openTextReader(fileObj.name, fileObj.content);
      } else if (el.dataset.fileAction === 'show-kernel-info') {
        openTextReader('kernel.sys', 'PedroOS Core Kernel v2.6 LTS\nAuthor: Pedro Henrique Lima Leal\nStatus: Online & Optimized');
      }
    }

    renderExplorer();

    return PedroOSWindowManager.createWindow({
      id: winId,
      title: 'Meu Computador - PedroOS Explorer',
      icon: 'monitor',
      content: container,
      width: 860,
      height: 540
    });
  }

  // --- 2. SOBRE MIM ---
  function openAbout() {
    const winId = 'app-about';
    const profile = PedroOSData.profile;

    const html = `
      <div class="p-6 md:p-8 space-y-6 max-w-4xl mx-auto text-slate-200 select-text">
        <!-- Hero Profile Header -->
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-white/10">
          <div class="relative shrink-0">
            <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-brand-cyan p-1 bg-[#0b0f19] shadow-portrait-glow group">
              <img src="${profile.avatar}" alt="${profile.name}" class="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300">
            </div>
            <div class="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-semibold shadow-md flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Ativo
            </div>
          </div>

          <div class="flex-1 text-center sm:text-left space-y-2">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-violet/15 text-brand-violetGlow text-xs font-mono font-medium border border-brand-violet/30">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
              <span>Desenvolvedor Full Stack & Engenharia de Software</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white">${profile.name}</h2>
            <p class="text-sm font-semibold text-brand-cyanLight">${profile.tagline}</p>
            
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs font-mono text-brand-slateMuted">
              <span class="flex items-center gap-1">
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-emerald-400"></i>
                ${profile.location}
              </span>
              <span>•</span>
              <span class="flex items-center gap-1">
                <i data-lucide="languages" class="w-3.5 h-3.5 text-brand-cyan"></i>
                ${profile.englishLevel}
              </span>
              <span>•</span>
              <span class="text-slate-300">${profile.availability}</span>
            </div>
          </div>
        </div>

        <!-- Bio Body -->
        <div class="space-y-4 text-sm sm:text-base leading-relaxed text-slate-300">
          <p class="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            ${profile.summary}
          </p>
        </div>

        <!-- Academic & Corporate Credentials Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Higher Education -->
          <div class="glass-card rounded-xl p-4 border border-brand-cyan/20">
            <div class="flex items-center gap-2.5 text-xs font-mono text-brand-cyan mb-2">
              <i data-lucide="graduation-cap" class="w-4 h-4"></i>
              <span>Graduação em Engenharia</span>
            </div>
            <h4 class="font-bold text-white text-base">${profile.education.higher.institution}</h4>
            <p class="text-xs text-brand-cyanLight font-medium">${profile.education.higher.degree}</p>
            <span class="text-[11px] font-mono text-brand-slateMuted block mt-1">${profile.education.higher.period}</span>
            <p class="text-xs text-slate-400 mt-2 leading-relaxed">
              ${profile.education.higher.description}
            </p>
          </div>

          <!-- Technical School -->
          <div class="glass-card rounded-xl p-4 border border-brand-violet/20">
            <div class="flex items-center gap-2.5 text-xs font-mono text-brand-violetGlow mb-2">
              <i data-lucide="award" class="w-4 h-4"></i>
              <span>Formação Técnica Federal</span>
            </div>
            <h4 class="font-bold text-white text-base">${profile.education.technical.institution}</h4>
            <p class="text-xs text-brand-violetGlow font-medium">${profile.education.technical.degree}</p>
            <span class="text-[11px] font-mono text-brand-slateMuted block mt-1">${profile.education.technical.period}</span>
            <p class="text-xs text-slate-400 mt-2 leading-relaxed">
              ${profile.education.technical.description}
            </p>
          </div>
        </div>

        <!-- Quick Action Buttons -->
        <div class="flex flex-wrap items-center gap-3 pt-2">
          <button class="btn-open-resume flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-violet hover:bg-brand-violetGlow text-white text-xs font-semibold shadow-glow-violet transition-all">
            <i data-lucide="file-text" class="w-4 h-4"></i>
            <span>Ver Currículo Completo</span>
          </button>
          
          <button class="btn-open-projects flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all">
            <i data-lucide="layers" class="w-4 h-4 text-brand-cyan"></i>
            <span>Explorar 6 Projetos</span>
          </button>

          <a href="${profile.whatsapp}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all ml-auto">
            <i data-lucide="message-circle" class="w-4 h-4"></i>
            <span>Falar no WhatsApp</span>
          </a>
        </div>
      </div>
    `;

    const win = PedroOSWindowManager.createWindow({
      id: winId,
      title: 'Sobre Mim - Pedro Henrique Lima Leal',
      icon: 'user',
      content: html,
      width: 820,
      height: 560
    });

    const el = win.element;
    const resumeBtn = el.querySelector('.btn-open-resume');
    if (resumeBtn) resumeBtn.addEventListener('click', () => openResume());
    const projBtn = el.querySelector('.btn-open-projects');
    if (projBtn) projBtn.addEventListener('click', () => openProjects());

    return win;
  }

  // --- 3. MEUS PROJETOS ---
  function openProjects(filterCategory = 'all') {
    const winId = 'app-projects';
    const projects = PedroOSData.projects;

    const container = document.createElement('div');
    container.className = 'projects-container flex flex-col h-full bg-[#0b0f19]/95 text-slate-200 select-none';

    function renderProjectsView(currentFilter) {
      const filtered = currentFilter === 'all' 
        ? projects 
        : projects.filter(p => p.category === currentFilter);

      container.innerHTML = `
        <!-- Filter Header -->
        <div class="px-5 py-3.5 border-b border-white/10 bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2 text-xs font-mono text-brand-cyan uppercase tracking-wider">
              <i data-lucide="folder-git" class="w-4 h-4"></i>
              <span>Portfólio em Produção (6 Sites no Ar)</span>
            </div>
            <h3 class="text-base font-bold text-white mt-0.5">Aplicações Reais & Portais Corporativos</h3>
          </div>

          <!-- Category filter buttons -->
          <div class="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <button class="filter-btn px-2.5 py-1 rounded-md transition-colors ${currentFilter === 'all' ? 'bg-brand-violet text-white font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'}" data-category="all">
              Todos (6)
            </button>
            <button class="filter-btn px-2.5 py-1 rounded-md transition-colors ${currentFilter === 'corporate' ? 'bg-brand-violet text-white font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'}" data-category="corporate">
              Corporativo
            </button>
            <button class="filter-btn px-2.5 py-1 rounded-md transition-colors ${currentFilter === 'news' ? 'bg-brand-violet text-white font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'}" data-category="news">
              Notícias
            </button>
            <button class="filter-btn px-2.5 py-1 rounded-md transition-colors ${currentFilter === 'real-estate' ? 'bg-brand-violet text-white font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'}" data-category="real-estate">
              Imóveis
            </button>
            <button class="filter-btn px-2.5 py-1 rounded-md transition-colors ${currentFilter === 'ecommerce' ? 'bg-brand-violet text-white font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'}" data-category="ecommerce">
              E-commerce
            </button>
          </div>
        </div>

        <!-- Projects Grid Container -->
        <div class="flex-1 p-5 overflow-y-auto custom-scrollbar">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            ${filtered.map(proj => `
              <div class="glass-card rounded-xl p-5 flex flex-col justify-between group border border-white/10 hover:border-brand-cyan/50 relative overflow-hidden transition-all duration-300" data-project-card="${proj.id}">
                ${proj.isFeatured ? `
                  <div class="absolute -top-10 -right-10 w-24 h-24 bg-brand-cyan/15 rounded-full blur-xl pointer-events-none"></div>
                ` : ''}

                <div>
                  <!-- Card Header -->
                  <div class="flex items-center justify-between mb-3">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold ${proj.isFeatured ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30' : 'bg-white/5 text-slate-300 border border-white/10'}">
                      <span class="w-1.5 h-1.5 rounded-full ${proj.isFeatured ? 'bg-brand-cyan animate-pulse' : 'bg-emerald-400'}"></span>
                      ${proj.badge}
                    </span>
                    <i data-lucide="${proj.icon}" class="w-5 h-5 text-brand-slateMuted group-hover:text-brand-cyan group-hover:scale-110 transition-transform"></i>
                  </div>

                  <!-- Project Title -->
                  <h4 class="text-lg font-bold text-white group-hover:text-brand-cyanLight transition-colors flex items-center gap-2">
                    <span>${proj.name}</span>
                    ${proj.isFeatured ? '<span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Destaque</span>' : ''}
                  </h4>

                  <!-- Description -->
                  <p class="text-xs text-brand-slateText mt-2 leading-relaxed line-clamp-3">
                    ${proj.shortDescription}
                  </p>

                  <!-- Tech Badges -->
                  <div class="flex flex-wrap gap-1.5 mt-3.5">
                    ${proj.technologies.slice(0, 4).map(t => `
                      <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">${t}</span>
                    `).join('')}
                    ${proj.technologies.length > 4 ? `
                      <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-brand-slateMuted">+${proj.technologies.length - 4}</span>
                    ` : ''}
                  </div>
                </div>

                <!-- Card Actions -->
                <div class="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                  <button class="btn-details text-xs font-semibold text-brand-violetGlow hover:text-white flex items-center gap-1 transition-colors" data-id="${proj.id}">
                    <i data-lucide="info" class="w-3.5 h-3.5"></i>
                    <span>Ver Detalhes</span>
                  </button>

                  <a href="${proj.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xs font-semibold text-brand-cyanLight hover:text-white transition-colors" title="Acessar ${proj.displayUrl}">
                    <span>Acessar</span>
                    <i data-lucide="external-link" class="w-3 h-3"></i>
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Footer Bar -->
        <div class="px-5 py-2.5 bg-[#090d16] border-t border-white/10 flex items-center justify-between text-xs font-mono text-brand-slateMuted">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>6/6 Ambientes Online & Verificados</span>
          </div>
          <span>Clique em um projeto para abrir sua ficha completa</span>
        </div>
      `;

      refreshIcons(container);

      // Attach filter clicks
      container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          PedroOSAudio.playClick();
          renderProjectsView(btn.dataset.category);
        });
      });

      // Attach detail clicks
      container.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          openProjectDetails(btn.dataset.id);
        });
      });

      // Click card to open detail
      container.querySelectorAll('[data-project-card]').forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('a')) return;
          openProjectDetails(card.dataset.projectCard);
        });
      });
    }

    renderProjectsView(filterCategory);

    return PedroOSWindowManager.createWindow({
      id: winId,
      title: 'Meus Projetos - Portfólio de Aplicações em Produção',
      icon: 'layers',
      content: container,
      width: 940,
      height: 600
    });
  }

  // --- 4. DETALHES DE UM PROJETO ---
  function openProjectDetails(projectId) {
    const proj = PedroOSData.projects.find(p => p.id === projectId);
    if (!proj) return;

    const winId = `project-detail-${proj.id}`;

    const html = `
      <div class="p-6 md:p-8 space-y-6 max-w-3xl mx-auto text-slate-200 select-text">
        <!-- Header Banner -->
        <div class="rounded-2xl p-6 bg-gradient-to-r ${proj.color} text-white shadow-xl relative overflow-hidden">
          <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          
          <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span class="px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-md text-[11px] font-mono text-white/90 border border-white/20">
                ${proj.badge}
              </span>
              <h2 class="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">${proj.name}</h2>
              <p class="text-xs sm:text-sm font-mono text-white/80 mt-1">${proj.displayUrl}</p>
            </div>

            <a href="${proj.url}" target="_blank" rel="noopener noreferrer" class="px-5 py-3 rounded-xl bg-white text-slate-900 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-lg shrink-0 hover:scale-105 active:scale-95">
              <span>Visitar Site Oficial</span>
              <i data-lucide="external-link" class="w-4 h-4"></i>
            </a>
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-3">
          <h4 class="text-xs font-mono uppercase tracking-wider text-brand-cyan font-bold flex items-center gap-1.5">
            <i data-lucide="file-text" class="w-4 h-4"></i>
            <span>Descrição Completa</span>
          </h4>
          <p class="text-sm sm:text-base text-slate-300 leading-relaxed p-4 rounded-xl bg-white/[0.03] border border-white/10">
            ${proj.fullDescription}
          </p>
        </div>

        <!-- Objective -->
        <div class="space-y-3">
          <h4 class="text-xs font-mono uppercase tracking-wider text-brand-violetGlow font-bold flex items-center gap-1.5">
            <i data-lucide="target" class="w-4 h-4"></i>
            <span>Objetivo da Aplicação</span>
          </h4>
          <p class="text-sm text-slate-300 leading-relaxed p-4 rounded-xl bg-white/[0.03] border border-white/10">
            ${proj.objective}
          </p>
        </div>

        <!-- Pedro's Role & Participation -->
        <div class="space-y-3">
          <h4 class="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
            <i data-lucide="user-check" class="w-4 h-4"></i>
            <span>Minha Participação no Desenvolvimento</span>
          </h4>
          <p class="text-sm text-slate-300 leading-relaxed p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20">
            ${proj.participation}
          </p>
        </div>

        <!-- Tech Stack -->
        <div class="space-y-3">
          <h4 class="text-xs font-mono uppercase tracking-wider text-brand-slateMuted font-bold flex items-center gap-1.5">
            <i data-lucide="cpu" class="w-4 h-4"></i>
            <span>Tecnologias Utilizadas</span>
          </h4>
          <div class="flex flex-wrap gap-2">
            ${proj.technologies.map(t => `
              <span class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white flex items-center gap-1.5">
                <i data-lucide="check" class="w-3.5 h-3.5 text-brand-cyan"></i>
                <span>${t}</span>
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Direct Link Bar -->
        <div class="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
          <span class="text-brand-slateMuted">Status: <strong class="text-emerald-400">${proj.status}</strong></span>
          <a href="${proj.url}" target="_blank" rel="noopener noreferrer" class="text-brand-cyanLight hover:text-white underline">
            Abrir ${proj.displayUrl} &rarr;
          </a>
        </div>
      </div>
    `;

    return PedroOSWindowManager.createWindow({
      id: winId,
      title: `${proj.name} — Detalhes do Projeto`,
      icon: proj.icon,
      content: html,
      width: 780,
      height: 560
    });
  }

  // --- 5. CURRÍCULO (PDF READER STYLE) ---
  function openResume() {
    const winId = 'app-resume';
    const profile = PedroOSData.profile;
    const exp = PedroOSData.experiences;
    const skills = PedroOSData.skills;

    const container = document.createElement('div');
    container.className = 'resume-app-container flex flex-col h-full bg-[#181a20] text-slate-900 select-none';

    container.innerHTML = `
      <!-- PDF Reader Toolbar -->
      <div class="pdf-toolbar flex items-center justify-between px-4 py-2 bg-[#252830] text-slate-200 border-b border-white/10 text-xs font-mono">
        <div class="flex items-center gap-2">
          <i data-lucide="file-text" class="w-4 h-4 text-rose-400"></i>
          <span class="font-bold text-white truncate">Curriculo_Pedro_Henrique_Lima_Leal.pdf</span>
          <span class="text-slate-400 text-[10px] hidden sm:inline">(Página 1 de 1)</span>
        </div>

        <div class="flex items-center gap-2">
          <button class="btn-print-resume flex items-center gap-1.5 px-3 py-1.5 rounded bg-brand-violet hover:bg-brand-violetGlow text-white font-semibold transition-all shadow-sm" title="Imprimir / Salvar como PDF">
            <i data-lucide="printer" class="w-3.5 h-3.5"></i>
            <span>Baixar / Imprimir PDF</span>
          </button>
        </div>
      </div>

      <!-- Printable Document Canvas -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#181a20] flex justify-center custom-scrollbar">
        <div class="printable-resume w-full max-w-3xl bg-white text-slate-800 p-8 sm:p-12 rounded-lg shadow-2xl space-y-6 select-text text-sm">
          
          <!-- Header -->
          <div class="border-b-2 border-slate-900 pb-5">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">${profile.name}</h1>
            <p class="text-base font-semibold text-indigo-700 mt-1">${profile.role}</p>
            
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 font-mono mt-3">
              <span>📍 ${profile.location}</span>
              <span>📞 ${profile.phone}</span>
              <span>✉️ ${profile.email}</span>
              <span>🌐 <a href="${profile.github}" target="_blank" class="text-indigo-600 underline">github.com/pedrohll4</a></span>
              <span>💬 <a href="https://tratormag.com.br" target="_blank" class="text-indigo-600 underline">tratormag.com.br</a></span>
            </div>
          </div>

          <!-- Resumo Profissional -->
          <div>
            <h2 class="text-xs font-mono uppercase tracking-wider font-bold text-indigo-900 mb-2 border-b border-slate-200 pb-1">
              Resumo Profissional
            </h2>
            <p class="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              ${profile.summary}
            </p>
          </div>

          <!-- Experiência Profissional -->
          <div>
            <h2 class="text-xs font-mono uppercase tracking-wider font-bold text-indigo-900 mb-3 border-b border-slate-200 pb-1">
              Experiência Profissional
            </h2>
            <div class="space-y-4">
              ${exp.map(item => `
                <div>
                  <div class="flex justify-between items-baseline">
                    <h3 class="font-bold text-slate-900 text-sm">${item.company}</h3>
                    <span class="text-xs font-mono text-slate-500">${item.period}</span>
                  </div>
                  <p class="text-xs font-medium text-indigo-700">${item.role} — ${item.location}</p>
                  <ul class="list-disc list-inside space-y-1 text-xs text-slate-700 mt-2">
                    ${item.activities.map(act => `<li>${act}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Formação Acadêmica -->
          <div>
            <h2 class="text-xs font-mono uppercase tracking-wider font-bold text-indigo-900 mb-3 border-b border-slate-200 pb-1">
              Formação Acadêmica & Técnica
            </h2>
            <div class="space-y-3">
              <div>
                <div class="flex justify-between items-baseline">
                  <h3 class="font-bold text-slate-900 text-xs sm:text-sm">${profile.education.higher.institution}</h3>
                  <span class="text-xs font-mono text-slate-500">${profile.education.higher.period}</span>
                </div>
                <p class="text-xs text-indigo-700 font-medium">${profile.education.higher.degree}</p>
                <p class="text-[11px] text-slate-600 mt-0.5">${profile.education.higher.description}</p>
              </div>

              <div>
                <div class="flex justify-between items-baseline">
                  <h3 class="font-bold text-slate-900 text-xs sm:text-sm">${profile.education.technical.institution}</h3>
                  <span class="text-xs font-mono text-slate-500">${profile.education.technical.period}</span>
                </div>
                <p class="text-xs text-indigo-700 font-medium">${profile.education.technical.degree}</p>
                <p class="text-[11px] text-slate-600 mt-0.5">${profile.education.technical.description}</p>
              </div>
            </div>
          </div>

          <!-- Competências Técnicas & Idiomas -->
          <div>
            <h2 class="text-xs font-mono uppercase tracking-wider font-bold text-indigo-900 mb-2 border-b border-slate-200 pb-1">
              Competências Técnicas & Idiomas
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <p><strong>Frontend & IA:</strong> React, Next.js, JavaScript, Tailwind CSS, Criação Acelerada com IA, Prototipagem</p>
              <p><strong>Backend & Código:</strong> Python, Java, C, REST APIs, Automações, Integrações</p>
              <p><strong>Infraestrutura:</strong> Git, GitHub, Linux, Bancos de Dados, Hardware & Redes</p>
              <p><strong>Idiomas:</strong> Português (Nativo), Inglês (B2 Intermediário — Certificado)</p>
            </div>
          </div>

        </div>
      </div>
    `;

    refreshIcons(container);

    const printBtn = container.querySelector('.btn-print-resume');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        PedroOSAudio.playClick();
        window.print();
      });
    }

    return PedroOSWindowManager.createWindow({
      id: winId,
      title: 'Currículo.pdf — Pedro Henrique Lima Leal',
      icon: 'file-text',
      content: container,
      width: 860,
      height: 620
    });
  }

  // --- 6. EXPERIÊNCIA PROFISSIONAL ---
  function openExperience() {
    const winId = 'app-experience';
    const experiences = PedroOSData.experiences;
    const education = PedroOSData.profile.education;

    const html = `
      <div class="p-6 md:p-8 space-y-8 max-w-4xl mx-auto text-slate-200 select-text">
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div class="flex items-center gap-2 text-xs font-mono text-brand-cyan uppercase tracking-wider">
              <i data-lucide="git-branch" class="w-4 h-4"></i>
              <span>Trajetória & Carreira</span>
            </div>
            <h2 class="text-2xl font-bold text-white mt-1">Experiência Profissional & Acadêmica</h2>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Atuação Ativa na Tratormag
          </span>
        </div>

        <!-- Timeline container -->
        <div class="relative border-l-2 border-white/10 ml-4 md:ml-6 space-y-8">
          
          <!-- Experience 1: Tratormag -->
          <div class="relative pl-6 md:pl-8 group">
            <span class="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#0b0f19] border-2 border-brand-cyan group-hover:scale-125 transition-all shadow-glow-cyan"></span>
            
            <div class="glass-card rounded-xl p-5 md:p-6 border border-brand-cyan/30">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <span class="text-xs font-mono text-brand-cyan uppercase tracking-wider font-semibold">Experiência Atual</span>
                  <h3 class="text-xl font-bold text-white">${experiences[0].company}</h3>
                  <p class="text-xs sm:text-sm font-semibold text-brand-slateText">${experiences[0].role}</p>
                </div>
                <div class="flex items-center gap-2 self-start sm:self-auto">
                  <a href="${experiences[0].website}" target="_blank" class="px-2.5 py-1 rounded text-xs font-mono bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan/25 flex items-center gap-1">
                    <span>tratormag.com.br</span>
                    <i data-lucide="external-link" class="w-3 h-3"></i>
                  </a>
                  <span class="px-2.5 py-1 rounded text-xs font-mono bg-emerald-500/20 text-emerald-300">
                    Atuação Ativa
                  </span>
                </div>
              </div>

              <ul class="space-y-2 text-xs sm:text-sm text-brand-slateText my-4">
                ${experiences[0].activities.map(act => `
                  <li class="flex items-start gap-2">
                    <i data-lucide="check-circle-2" class="w-4 h-4 text-brand-cyan shrink-0 mt-0.5"></i>
                    <span>${act}</span>
                  </li>
                `).join('')}
              </ul>

              <div class="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                ${experiences[0].skills.map(s => `
                  <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">${s}</span>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Experience 2: Dabliu Marketing -->
          <div class="relative pl-6 md:pl-8 group">
            <span class="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#0b0f19] border-2 border-brand-violet group-hover:scale-125 transition-all"></span>
            
            <div class="glass-card rounded-xl p-5 md:p-6 border border-white/10">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <span class="text-xs font-mono text-brand-violet uppercase tracking-wider font-semibold">Experiência Concluída</span>
                  <h3 class="text-xl font-bold text-white">${experiences[1].company}</h3>
                  <p class="text-xs sm:text-sm font-semibold text-brand-slateText">${experiences[1].role}</p>
                </div>
                <span class="self-start sm:self-auto px-2.5 py-1 rounded text-xs font-mono bg-white/5 text-slate-400 border border-white/10">
                  Concluído
                </span>
              </div>

              <ul class="space-y-2 text-xs sm:text-sm text-brand-slateText my-4">
                ${experiences[1].activities.map(act => `
                  <li class="flex items-start gap-2">
                    <i data-lucide="check-circle-2" class="w-4 h-4 text-brand-violet shrink-0 mt-0.5"></i>
                    <span>${act}</span>
                  </li>
                `).join('')}
              </ul>

              <div class="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                ${experiences[1].skills.map(s => `
                  <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-violet/10 text-brand-violetGlow border border-brand-violet/20">${s}</span>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Academic: Jala University -->
          <div class="relative pl-6 md:pl-8 group">
            <span class="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#0b0f19] border-2 border-emerald-400 group-hover:scale-125 transition-all"></span>
            
            <div class="glass-card rounded-xl p-5 md:p-6 border border-white/10">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <span class="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">Ensino Superior</span>
                  <h3 class="text-xl font-bold text-white">${education.higher.institution}</h3>
                  <p class="text-xs sm:text-sm font-semibold text-brand-slateText">${education.higher.degree}</p>
                </div>
                <span class="self-start sm:self-auto px-2.5 py-1 rounded text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  ${education.higher.period}
                </span>
              </div>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2">
                ${education.higher.description}
              </p>
            </div>
          </div>

          <!-- Academic: IFRO -->
          <div class="relative pl-6 md:pl-8 group">
            <span class="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#0b0f19] border-2 border-slate-500 group-hover:scale-125 transition-all"></span>
            
            <div class="glass-card rounded-xl p-5 md:p-6 border border-white/10">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <span class="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">Formação Técnica</span>
                  <h3 class="text-xl font-bold text-white">${education.technical.institution}</h3>
                  <p class="text-xs sm:text-sm font-semibold text-brand-slateText">${education.technical.degree}</p>
                </div>
                <span class="self-start sm:self-auto px-2.5 py-1 rounded text-xs font-mono bg-white/5 text-slate-300 border border-white/10">
                  ${education.technical.period}
                </span>
              </div>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2">
                ${education.technical.description}
              </p>
            </div>
          </div>

        </div>
      </div>
    `;

    return PedroOSWindowManager.createWindow({
      id: winId,
      title: 'Experiência Profissional & Trajetória',
      icon: 'briefcase',
      content: html,
      width: 820,
      height: 580
    });
  }

  // --- 7. HABILIDADES ---
  function openSkills() {
    const winId = 'app-skills';
    const skills = PedroOSData.skills;

    const html = `
      <div class="p-6 md:p-8 space-y-6 max-w-4xl mx-auto text-slate-200 select-text">
        <div class="pb-4 border-b border-white/10">
          <div class="flex items-center gap-2 text-xs font-mono text-brand-cyan uppercase tracking-wider">
            <i data-lucide="cpu" class="w-4 h-4"></i>
            <span>Competências & Tecnologias</span>
          </div>
          <h2 class="text-2xl font-bold text-white mt-1">Stack Técnica & Ferramentas</h2>
          <p class="text-xs text-brand-slateText mt-1">Organizadas por domínio de aplicação (sem porcentagens artificiais).</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Frontend & IA -->
          <div class="glass-card rounded-xl p-5 border border-brand-violet/30 space-y-3">
            <div class="flex items-center gap-2 text-brand-violetGlow">
              <i data-lucide="sparkles" class="w-5 h-5"></i>
              <h3 class="font-bold text-white text-base">Frontend & Criação com IA</h3>
            </div>
            <p class="text-xs text-brand-slateText">Desenvolvimento ágil de interfaces modernas e performáticas.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              ${skills.frontend.map(s => `
                <div class="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-2.5">
                  <i data-lucide="${s.icon}" class="w-4 h-4 text-brand-violetGlow shrink-0"></i>
                  <div>
                    <span class="text-xs font-semibold text-white block">${s.name}</span>
                    <span class="text-[10px] font-mono text-brand-cyan">${s.level}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Backend & Código -->
          <div class="glass-card rounded-xl p-5 border border-brand-cyan/30 space-y-3">
            <div class="flex items-center gap-2 text-brand-cyan">
              <i data-lucide="server" class="w-5 h-5"></i>
              <h3 class="font-bold text-white text-base">Backend & Código</h3>
            </div>
            <p class="text-xs text-brand-slateText">Arquitetura robusta de APIs, automações e integração de dados.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              ${skills.backend.map(s => `
                <div class="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-2.5">
                  <i data-lucide="${s.icon}" class="w-4 h-4 text-brand-cyan shrink-0"></i>
                  <div>
                    <span class="text-xs font-semibold text-white block">${s.name}</span>
                    <span class="text-[10px] font-mono text-brand-violetGlow">${s.level}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Infra & Ferramentas -->
          <div class="glass-card rounded-xl p-5 border border-emerald-500/30 space-y-3">
            <div class="flex items-center gap-2 text-emerald-400">
              <i data-lucide="database" class="w-5 h-5"></i>
              <h3 class="font-bold text-white text-base">Infraestrutura & Ferramentas</h3>
            </div>
            <p class="text-xs text-brand-slateText">Controle de versão, sistemas operacionais e hardware.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              ${skills.infra.map(s => `
                <div class="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-2.5">
                  <i data-lucide="${s.icon}" class="w-4 h-4 text-emerald-400 shrink-0"></i>
                  <div>
                    <span class="text-xs font-semibold text-white block">${s.name}</span>
                    <span class="text-[10px] font-mono text-emerald-300">${s.level}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- IA & Idiomas -->
          <div class="glass-card rounded-xl p-5 border border-amber-500/30 space-y-4">
            <div>
              <div class="flex items-center gap-2 text-amber-300">
                <i data-lucide="bot" class="w-5 h-5"></i>
                <h3 class="font-bold text-white text-base">Inteligência Artificial & Agentes</h3>
              </div>
              <p class="text-xs text-brand-slateText mt-1">Uso estratégico para desenvolvimento acelerado de software.</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                ${skills.ai.map(s => `
                  <div class="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-2.5">
                    <i data-lucide="${s.icon}" class="w-4 h-4 text-amber-400 shrink-0"></i>
                    <div>
                      <span class="text-xs font-semibold text-white block">${s.name}</span>
                      <span class="text-[10px] font-mono text-amber-300">${s.level}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Idiomas -->
            <div class="pt-3 border-t border-white/10">
              <h4 class="text-xs font-mono uppercase text-brand-slateMuted mb-2 font-semibold">Idiomas para Atuação Global</h4>
              <div class="grid grid-cols-2 gap-2">
                <div class="p-2 rounded bg-white/5 border border-white/10 text-xs">
                  <span class="font-bold text-white block">Português</span>
                  <span class="text-[10px] text-emerald-400 font-mono">Nativo</span>
                </div>
                <div class="p-2 rounded bg-white/5 border border-white/10 text-xs">
                  <span class="font-bold text-white block">Inglês</span>
                  <span class="text-[10px] text-brand-cyan font-mono">B2 Intermediário</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    `;

    return PedroOSWindowManager.createWindow({
      id: winId,
      title: 'Habilidades & Tecnologias — PedroOS',
      icon: 'cpu',
      content: html,
      width: 860,
      height: 580
    });
  }

  // --- 8. CONTATO (MESSAGING APP STYLE) ---
  function openContact() {
    const winId = 'app-contact';
    const profile = PedroOSData.profile;

    const container = document.createElement('div');
    container.className = 'contact-app p-6 md:p-8 space-y-6 max-w-2xl mx-auto text-slate-200 select-text';

    container.innerHTML = `
      <div class="text-center space-y-2 pb-4 border-b border-white/10">
        <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-cyan mx-auto shadow-portrait-glow">
          <img src="${profile.avatar}" alt="${profile.name}" class="w-full h-full object-cover">
        </div>
        <h2 class="text-2xl font-bold text-white">${profile.name}</h2>
        <p class="text-xs sm:text-sm text-brand-cyanLight font-semibold">${profile.role}</p>
        <p class="text-xs text-brand-slateText max-w-md mx-auto">
          Disponível para contratação profissional, novos projetos e oportunidades remotas ou presenciais.
        </p>
      </div>

      <!-- Quick Channels -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- WhatsApp -->
        <a href="${profile.whatsapp}" target="_blank" rel="noopener noreferrer" class="p-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center gap-3.5 group">
          <div class="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
            <i data-lucide="message-circle" class="w-5 h-5"></i>
          </div>
          <div>
            <span class="text-[10px] font-mono text-emerald-400 block font-semibold">WHATSAPP DIRETO</span>
            <span class="text-sm font-bold text-white">${profile.phone}</span>
            <span class="text-[10px] text-brand-slateMuted block">Conversar agora &rarr;</span>
          </div>
        </a>

        <!-- Email -->
        <a href="mailto:${profile.email}" class="p-4 rounded-xl bg-brand-violet/10 hover:bg-brand-violet/20 border border-brand-violet/30 transition-all flex items-center gap-3.5 group">
          <div class="w-10 h-10 rounded-lg bg-brand-violet/20 flex items-center justify-center text-brand-violetGlow group-hover:scale-110 transition-transform shrink-0">
            <i data-lucide="mail" class="w-5 h-5"></i>
          </div>
          <div class="truncate">
            <span class="text-[10px] font-mono text-brand-violetGlow block font-semibold">E-MAIL PROFISSIONAL</span>
            <span class="text-xs sm:text-sm font-bold text-white truncate block" title="${profile.email}">${profile.email}</span>
            <span class="text-[10px] text-brand-slateMuted block">Enviar mensagem &rarr;</span>
          </div>
        </a>

        <!-- GitHub -->
        <a href="${profile.github}" target="_blank" rel="noopener noreferrer" class="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-all flex items-center gap-3.5 group">
          <div class="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-brand-cyan group-hover:scale-110 transition-transform shrink-0">
            <i data-lucide="github" class="w-5 h-5"></i>
          </div>
          <div>
            <span class="text-[10px] font-mono text-brand-cyan block font-semibold">GITHUB OFICIAL</span>
            <span class="text-sm font-bold text-white">github.com/pedrohll4</span>
            <span class="text-[10px] text-brand-slateMuted block">Ver repositórios &rarr;</span>
          </div>
        </a>

        <!-- Location -->
        <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
            <i data-lucide="map-pin" class="w-5 h-5"></i>
          </div>
          <div>
            <span class="text-[10px] font-mono text-emerald-400 block font-semibold">LOCALIZAÇÃO</span>
            <span class="text-sm font-bold text-white">${profile.location}</span>
            <span class="text-[10px] text-brand-cyan block">Remoto ou Relocação</span>
          </div>
        </div>
      </div>

      <!-- Quick Message Sender -->
      <div class="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
        <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-brand-cyan flex items-center gap-1.5">
          <i data-lucide="send" class="w-3.5 h-3.5"></i>
          <span>Enviar Mensagem Rápida</span>
        </h4>
        
        <div>
          <label class="block text-[11px] font-mono text-brand-slateMuted mb-1">Seu Nome / Empresa</label>
          <input type="text" id="contact-sender-name" placeholder="Ex: Lucas / Empresa XYZ" class="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-cyan font-mono">
        </div>

        <div>
          <label class="block text-[11px] font-mono text-brand-slateMuted mb-1">Sua Mensagem</label>
          <textarea id="contact-sender-msg" rows="3" placeholder="Olá Pedro! Vi seu portfólio PedroOS e gostaria de conversar sobre..." class="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-cyan font-mono"></textarea>
        </div>

        <div class="flex gap-2 pt-1">
          <button id="btn-send-whatsapp" class="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5">
            <i data-lucide="message-circle" class="w-4 h-4"></i>
            <span>Enviar pelo WhatsApp</span>
          </button>
          <button id="btn-send-email" class="flex-1 py-2 px-3 rounded-lg bg-brand-violet hover:bg-brand-violetGlow text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5">
            <i data-lucide="mail" class="w-4 h-4"></i>
            <span>Enviar por E-mail</span>
          </button>
        </div>
      </div>
    `;

    refreshIcons(container);

    // Form handlers
    const waBtn = container.querySelector('#btn-send-whatsapp');
    const emBtn = container.querySelector('#btn-send-email');

    if (waBtn) {
      waBtn.addEventListener('click', () => {
        const name = container.querySelector('#contact-sender-name').value.trim() || 'Visitante do Portfólio';
        const msg = container.querySelector('#contact-sender-msg').value.trim() || 'Olá Pedro! Vi seu portfólio PedroOS e gostaria de conversar.';
        const fullMsg = `Olá Pedro! Meu nome é ${name}. ${msg}`;
        const encoded = encodeURIComponent(fullMsg);
        window.open(`https://wa.me/5569992102965?text=${encoded}`, '_blank');
      });
    }

    if (emBtn) {
      emBtn.addEventListener('click', () => {
        const name = container.querySelector('#contact-sender-name').value.trim() || 'Visitante do Portfólio';
        const msg = container.querySelector('#contact-sender-msg').value.trim() || 'Olá Pedro! Vi seu portfólio PedroOS e gostaria de conversar.';
        const subject = encodeURIComponent(`Contato de ${name} — PedroOS`);
        const body = encodeURIComponent(msg);
        window.location.href = `mailto:phlimaleal2019@gmail.com?subject=${subject}&body=${body}`;
      });
    }

    return PedroOSWindowManager.createWindow({
      id: winId,
      title: 'Contato — Mensageiro Direto',
      icon: 'message-circle',
      content: container,
      width: 680,
      height: 580
    });
  }

  // --- 9. LIXEIRA ---
  function openTrash() {
    const winId = 'app-trash';

    const container = document.createElement('div');
    container.className = 'trash-app p-8 text-center flex flex-col items-center justify-center h-full space-y-4 select-none';

    container.innerHTML = `
      <div class="w-20 h-20 rounded-full bg-slate-800/80 border border-white/10 flex items-center justify-center text-slate-400 mx-auto shadow-inner">
        <i data-lucide="trash-2" class="w-10 h-10"></i>
      </div>

      <div class="space-y-2 max-w-md">
        <h3 class="text-xl font-bold text-white">Lixeira Vazia</h3>
        <p class="text-sm text-brand-slateText leading-relaxed">
          "Não há arquivos descartados. Aqui só armazenamos boas ideias e projetos!"
        </p>
      </div>

      <div class="pt-4">
        <button id="btn-restore-ideas" class="px-5 py-2.5 rounded-xl bg-brand-violet hover:bg-brand-violetGlow text-white text-xs font-semibold shadow-glow-violet transition-all flex items-center gap-2">
          <i data-lucide="sparkles" class="w-4 h-4"></i>
          <span>Restaurar Mais Ideias</span>
        </button>
      </div>

      <div id="trash-toast" class="hidden text-xs font-mono text-emerald-400 pt-2 transition-all">
        ✨ 100% de criatividade restaurada no PedroOS!
      </div>
    `;

    refreshIcons(container);

    const btn = container.querySelector('#btn-restore-ideas');
    const toast = container.querySelector('#trash-toast');
    if (btn) {
      btn.addEventListener('click', () => {
        PedroOSAudio.playPop();
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
      });
    }

    return PedroOSWindowManager.createWindow({
      id: winId,
      title: 'Lixeira do Sistema',
      icon: 'trash-2',
      content: container,
      width: 520,
      height: 380,
      allowResize: false
    });
  }

  // --- 10. CONFIGURAÇÕES DO PEDROOS ---
  function openSettings() {
    const winId = 'app-settings';
    const wallpapers = PedroOSData.wallpapers;

    const container = document.createElement('div');
    container.className = 'settings-app p-6 md:p-8 space-y-6 max-w-2xl mx-auto text-slate-200 select-none';

    const currentWp = localStorage.getItem('pedroos_wallpaper') || 'cyber-deep';
    const isDark = document.documentElement.classList.contains('dark') || !document.documentElement.classList.contains('light');

    container.innerHTML = `
      <div class="pb-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2 text-xs font-mono text-brand-cyan uppercase tracking-wider">
            <i data-lucide="settings" class="w-4 h-4"></i>
            <span>Painel de Controle</span>
          </div>
          <h2 class="text-2xl font-bold text-white mt-1">Configurações do PedroOS</h2>
        </div>
        <span class="text-xs font-mono text-brand-slateMuted">v2.6 LTS</span>
      </div>

      <!-- Wallpaper selector -->
      <div class="space-y-3">
        <h4 class="text-xs font-mono uppercase text-brand-cyan font-bold flex items-center gap-1.5">
          <i data-lucide="image" class="w-4 h-4"></i>
          <span>Papel de Parede da Área de Trabalho</span>
        </h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          ${wallpapers.map(wp => `
            <div class="wp-card p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border ${currentWp === wp.id ? 'border-brand-cyan ring-1 ring-brand-cyan' : 'border-white/10'} cursor-pointer transition-all flex flex-col gap-2" data-wp-id="${wp.id}">
              <div class="h-16 rounded-lg overflow-hidden border border-white/10 shadow-sm" style="background: ${wp.style}"></div>
              <span class="text-xs font-medium text-white truncate">${wp.name}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Theme & Sounds -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <!-- Theme toggle -->
        <div class="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-white block">Tema da Interface</span>
            <span class="text-[11px] font-mono text-brand-slateMuted">Modo Escuro / Claro</span>
          </div>
          <button id="settings-theme-toggle" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white flex items-center gap-1.5 transition-colors">
            <i data-lucide="${isDark ? 'moon' : 'sun'}" class="w-4 h-4 text-amber-400"></i>
            <span>${isDark ? 'Escuro' : 'Claro'}</span>
          </button>
        </div>

        <!-- Sound toggle -->
        <div class="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-white block">Efeitos Sonoros</span>
            <span class="text-[11px] font-mono text-brand-slateMuted">Web Audio Synthesizer</span>
          </div>
          <button id="settings-sound-toggle" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white flex items-center gap-1.5 transition-colors">
            <i data-lucide="${PedroOSAudio.isEnabled() ? 'volume-2' : 'volume-x'}" class="w-4 h-4 ${PedroOSAudio.isEnabled() ? 'text-emerald-400' : 'text-slate-400'}"></i>
            <span>${PedroOSAudio.isEnabled() ? 'Ligado' : 'Mudo'}</span>
          </button>
        </div>
      </div>

      <!-- About PedroOS -->
      <div class="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-mono text-brand-slateMuted space-y-1.5">
        <div class="flex justify-between">
          <span>Sistema Operacional:</span>
          <span class="text-white">${PedroOSData.system.name} ${PedroOSData.system.version}</span>
        </div>
        <div class="flex justify-between">
          <span>Build:</span>
          <span class="text-white">${PedroOSData.system.build}</span>
        </div>
        <div class="flex justify-between">
          <span>Desenvolvido por:</span>
          <span class="text-brand-cyan">${PedroOSData.system.developer}</span>
        </div>
      </div>
    `;

    refreshIcons(container);

    // Wallpaper clicks
    container.querySelectorAll('.wp-card').forEach(card => {
      card.addEventListener('click', () => {
        PedroOSAudio.playClick();
        const wpId = card.dataset.wpId;
        if (window.PedroOSDesktop) {
          window.PedroOSDesktop.setWallpaper(wpId);
        }
        openSettings(); // refresh view
      });
    });

    // Theme toggle
    const themeBtn = container.querySelector('#settings-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        PedroOSAudio.playClick();
        if (window.PedroOSDesktop) {
          window.PedroOSDesktop.toggleTheme();
        }
        openSettings();
      });
    }

    // Sound toggle
    const soundBtn = container.querySelector('#settings-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        PedroOSAudio.toggleSound();
        openSettings();
      });
    }

    return PedroOSWindowManager.createWindow({
      id: winId,
      title: 'Configurações do PedroOS',
      icon: 'settings',
      content: container,
      width: 680,
      height: 540
    });
  }

  // --- 11. TEXT READER / NOTEPAD ---
  function openTextReader(fileName, textContent) {
    const winId = `text-reader-${fileName.replace(/[^a-zA-Z0-9]/g, '_')}`;

    const container = document.createElement('div');
    container.className = 'text-reader flex flex-col h-full bg-[#0a0d14] text-slate-200 font-mono text-xs select-text';

    container.innerHTML = `
      <div class="px-4 py-2 border-b border-white/10 bg-[#10141f] flex items-center justify-between text-[11px] text-brand-slateMuted select-none">
        <div class="flex items-center gap-2">
          <i data-lucide="file-text" class="w-3.5 h-3.5 text-brand-cyan"></i>
          <span class="text-white font-medium">${fileName}</span>
        </div>
        <span>UTF-8 • Somente Leitura</span>
      </div>
      <div class="flex-1 p-5 overflow-y-auto whitespace-pre-wrap leading-relaxed custom-scrollbar text-slate-300">
${textContent}
      </div>
    `;

    refreshIcons(container);

    return PedroOSWindowManager.createWindow({
      id: winId,
      title: `Notepad — ${fileName}`,
      icon: 'file-text',
      content: container,
      width: 640,
      height: 440
    });
  }

  // --- 12. IMAGE VIEWER ---
  function openImageViewer(imageSrc, title = 'Visualizador de Imagens') {
    const winId = `image-viewer-${title.replace(/[^a-zA-Z0-9]/g, '_')}`;

    const container = document.createElement('div');
    container.className = 'image-viewer flex flex-col h-full bg-[#080b12] text-slate-200 select-none';

    container.innerHTML = `
      <div class="px-4 py-2 border-b border-white/10 bg-[#0f131d] flex items-center justify-between text-xs">
        <span class="font-medium text-white truncate">${title}</span>
        <a href="${imageSrc}" download class="text-[11px] font-mono text-brand-cyan hover:underline flex items-center gap-1">
          <i data-lucide="download" class="w-3 h-3"></i>
          <span>Baixar Foto</span>
        </a>
      </div>
      <div class="flex-1 p-4 flex items-center justify-center overflow-hidden">
        <img src="${imageSrc}" alt="${title}" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl">
      </div>
    `;

    refreshIcons(container);

    return PedroOSWindowManager.createWindow({
      id: winId,
      title: `Fotos — ${title}`,
      icon: 'image',
      content: container,
      width: 600,
      height: 520
    });
  }

  return {
    openExplorer,
    openAbout,
    openProjects,
    openProjectDetails,
    openResume,
    openExperience,
    openSkills,
    openContact,
    openTrash,
    openSettings,
    openTextReader,
    openImageViewer
  };
})();

window.PedroOSApps = PedroOSApps;
