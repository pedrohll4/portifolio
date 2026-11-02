// ============================================================
// PedroOS - Interactive Linux-Style Terminal
// Simulated shell with command history, auto-completion, neofetch,
// shortcuts and interactive CLI commands
// ============================================================

const PedroOSTerminal = (function() {

  function openTerminal() {
    const winId = 'app-terminal';

    // If already open, focus it
    const existing = PedroOSWindowManager.getAllWindows().find(w => w.id === winId);
    if (existing) {
      if (existing.isMinimized) {
        PedroOSWindowManager.restoreWindow(winId);
      } else {
        PedroOSWindowManager.focusWindow(winId);
      }
      return existing;
    }

    const container = document.createElement('div');
    container.className = 'terminal-wrapper flex flex-col h-full bg-[#080c14] text-slate-100 font-mono text-xs select-text overflow-hidden';

    container.innerHTML = `
      <!-- Terminal Output Screen -->
      <div class="terminal-body flex-1 p-4 overflow-y-auto space-y-2 leading-relaxed custom-scrollbar text-xs" id="term-output">
        <div class="text-slate-400 text-[11px] pb-2 border-b border-white/10">
          <p class="text-brand-cyan font-bold">PedroOS Interactive Shell v2.6 (x86_64-pedro-linux-gnu)</p>
          <p class="text-brand-slateMuted">Digite <span class="text-brand-violetGlow font-bold">help</span> para listar os comandos ou <span class="text-brand-violetGlow font-bold">neofetch</span> para ver o resumo do sistema.</p>
        </div>
      </div>

      <!-- Terminal Input Line -->
      <div class="terminal-input-bar px-4 py-2.5 bg-[#05080e] border-t border-white/10 flex items-center gap-2 text-xs">
        <span class="text-emerald-400 font-bold shrink-0">pedro@pedroos</span>
        <span class="text-slate-500 shrink-0">:</span>
        <span class="text-brand-cyan font-bold shrink-0">~</span>
        <span class="text-brand-violetGlow font-bold shrink-0">$</span>
        <input type="text" id="term-input" class="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs p-0 focus:ring-0" autocomplete="off" spellcheck="false" autofocus>
      </div>
    `;

    const win = PedroOSWindowManager.createWindow({
      id: winId,
      title: 'Terminal — pedro@pedroos:~ (zsh)',
      icon: 'terminal',
      content: container,
      width: 780,
      height: 480
    });

    const outputEl = container.querySelector('#term-output');
    const inputEl = container.querySelector('#term-input');

    // Terminal command history
    const commandHistory = [];
    let historyIndex = -1;

    const availableCommands = [
      'help', 'whoami', 'about', 'projects', 'skills', 'experience',
      'contact', 'github', 'resume', 'clear', 'date', 'neofetch',
      'matrix', 'sudo', 'theme', 'echo', 'history', 'exit'
    ];

    function print(html, isCommand = false) {
      const line = document.createElement('div');
      if (isCommand) {
        line.className = 'flex items-center gap-2 text-slate-300 font-semibold pt-1';
        line.innerHTML = `<span class="text-emerald-400">pedro@pedroos</span><span class="text-slate-500">:</span><span class="text-brand-cyan">~</span><span class="text-brand-violetGlow">$</span> <span>${html}</span>`;
      } else {
        line.className = 'text-slate-300 pl-2 leading-relaxed';
        line.innerHTML = html;
      }
      outputEl.appendChild(line);
      outputEl.scrollTop = outputEl.scrollHeight;
    }

    // Auto-focus input when terminal window is clicked
    container.addEventListener('click', () => {
      inputEl.focus();
    });

    // Handle command execution
    function executeCommand(rawCmd) {
      const trimmed = rawCmd.trim();
      if (!trimmed) return;

      print(trimmed, true);
      commandHistory.push(trimmed);
      historyIndex = commandHistory.length;

      const parts = trimmed.split(' ');
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      switch (cmd) {
        case 'help':
          print(`
            <div class="space-y-1 text-slate-300">
              <p class="text-brand-cyan font-bold">Comandos disponíveis no PedroOS:</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[11px] pt-1">
                <div><span class="text-brand-violetGlow font-bold">whoami</span> — Identificação e papel do desenvolvedor</div>
                <div><span class="text-brand-violetGlow font-bold">about</span> — Apresentação profissional completa</div>
                <div><span class="text-brand-violetGlow font-bold">projects</span> — Lista os 6 projetos no ar com links</div>
                <div><span class="text-brand-violetGlow font-bold">skills</span> — Lista as competências e tecnologias</div>
                <div><span class="text-brand-violetGlow font-bold">experience</span> — Trajetória e vivência profissional</div>
                <div><span class="text-brand-violetGlow font-bold">contact</span> — Meios de contato direto (WhatsApp, E-mail)</div>
                <div><span class="text-brand-violetGlow font-bold">github</span> — Abre o perfil oficial no GitHub</div>
                <div><span class="text-brand-violetGlow font-bold">resume</span> — Abre a janela do currículo formatado</div>
                <div><span class="text-brand-violetGlow font-bold">neofetch</span> — Informações estilizadas do PedroOS</div>
                <div><span class="text-brand-violetGlow font-bold">date</span> — Exibe data e hora local do sistema</div>
                <div><span class="text-brand-violetGlow font-bold">theme [dark|light]</span> — Alterna o tema visual</div>
                <div><span class="text-brand-violetGlow font-bold">matrix</span> — Efeito visual Matrix</div>
                <div><span class="text-brand-violetGlow font-bold">clear</span> — Limpa o histórico de exibição</div>
              </div>
            </div>
          `);
          break;

        case 'whoami':
          print(`
            <div class="text-brand-cyan font-semibold">
              Pedro Henrique Lima Leal
              <span class="text-slate-400 block text-xs">Engenheiro de Software & Desenvolvedor Full Stack • Jala University & IFRO</span>
            </div>
          `);
          break;

        case 'about':
          print(`
            <div class="space-y-2 text-slate-300">
              <p class="text-white font-bold">${PedroOSData.profile.name} — ${PedroOSData.profile.role}</p>
              <p>${PedroOSData.profile.summary}</p>
              <p class="text-brand-cyanLight text-[11px]">Localização: ${PedroOSData.profile.location} | Disponibilidade: ${PedroOSData.profile.availability}</p>
            </div>
          `);
          break;

        case 'projects':
          const projList = PedroOSData.projects.map((p, idx) => `
            <div class="py-1">
              <span class="text-brand-cyan font-bold">${idx + 1}. ${p.name}</span> <span class="text-emerald-400">(${p.badge})</span>
              <p class="text-slate-400 text-[11px]">${p.shortDescription}</p>
              <a href="${p.url}" target="_blank" class="text-brand-violetGlow underline text-[11px]">${p.url}</a>
            </div>
          `).join('');
          print(`
            <div class="space-y-1">
              <p class="text-white font-bold">6 Projetos Reais no Ar:</p>
              ${projList}
              <p class="text-slate-500 text-[10px] pt-1">Dica: digite <span class="text-white">projects open</span> para abrir a vitrine de janelas.</p>
            </div>
          `);
          if (args[0] === 'open') {
            PedroOSApps.openProjects();
          }
          break;

        case 'skills':
          print(`
            <div class="space-y-2">
              <p class="text-white font-bold">Matriz de Habilidades & Tecnologias:</p>
              <div class="text-[11px] space-y-1">
                <p><span class="text-brand-violetGlow font-bold">Frontend:</span> HTML5, CSS3, JavaScript (ES6+), React, Next.js, Tailwind CSS</p>
                <p><span class="text-brand-cyan font-bold">Backend:</span> Python, Java, Linguagem C, REST APIs, Automações, Integrações</p>
                <p><span class="text-emerald-400 font-bold">Infra & Ferramentas:</span> Git, GitHub, Linux, Bancos de Dados, Redes, Hardware</p>
                <p><span class="text-amber-400 font-bold">Inteligência Artificial:</span> Engenharia de Prompts, Criação Acelerada com IA, Agentes</p>
                <p><span class="text-indigo-400 font-bold">Idiomas:</span> Português (Nativo), Inglês (B2 Intermediário)</p>
              </div>
            </div>
          `);
          break;

        case 'experience':
          print(`
            <div class="space-y-2">
              <p class="text-white font-bold">Trajetória Profissional:</p>
              <div class="text-[11px] space-y-2">
                <div class="border-l-2 border-brand-cyan pl-2">
                  <p class="text-brand-cyan font-bold">Tratormag — Atuação Ativa</p>
                  <p class="text-slate-400">Desenvolvimento de Sistemas, Portais Web (tratormag.com.br) & Infraestrutura de TI</p>
                </div>
                <div class="border-l-2 border-brand-violet pl-2">
                  <p class="text-brand-violetGlow font-bold">Dabliu Marketing</p>
                  <p class="text-slate-400">VideoMaker & Manutenção de Equipamentos de TI</p>
                </div>
                <div class="border-l-2 border-emerald-400 pl-2">
                  <p class="text-emerald-400 font-bold">Jala University (2024 - Em Andamento)</p>
                  <p class="text-slate-400">Bacharelado em Engenharia de Software</p>
                </div>
                <div class="border-l-2 border-slate-500 pl-2">
                  <p class="text-slate-300 font-bold">IFRO (2021 - 2023)</p>
                  <p class="text-slate-400">Técnico em Manutenção e Suporte em Informática</p>
                </div>
              </div>
            </div>
          `);
          break;

        case 'contact':
          print(`
            <div class="space-y-1 text-[11px]">
              <p class="text-white font-bold">Canais de Contato Direto:</p>
              <p>📱 WhatsApp: <a href="https://wa.me/5569992102965" target="_blank" class="text-emerald-400 underline">(69) 99210-2965</a></p>
              <p>✉️ E-mail: <a href="mailto:phlimaleal2019@gmail.com" class="text-brand-violetGlow underline">phlimaleal2019@gmail.com</a></p>
              <p>🌐 GitHub: <a href="https://github.com/pedrohll4" target="_blank" class="text-brand-cyan underline">github.com/pedrohll4</a></p>
              <p>📍 Localização: Ariquemes - RO (Disponível para remoto e presencial)</p>
            </div>
          `);
          break;

        case 'github':
          print(`<p class="text-brand-cyan">Abrindo GitHub @pedrohll4 em uma nova aba...</p>`);
          window.open('https://github.com/pedrohll4', '_blank');
          break;

        case 'resume':
          print(`<p class="text-brand-violetGlow">Abrindo visualizador do Currículo.pdf...</p>`);
          PedroOSApps.openResume();
          break;

        case 'clear':
          outputEl.innerHTML = '';
          break;

        case 'date':
          print(`<p class="text-slate-300">${new Date().toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'medium' })}</p>`);
          break;

        case 'neofetch':
          print(`
            <div class="flex flex-col sm:flex-row gap-4 py-2 font-mono text-[11px]">
              <pre class="text-brand-cyan font-bold leading-none select-none">
  ______         _            ____   _____ 
 |  _ \\ ___   __| |_ __ ___  / __ \\ / ____|
 | |_) / _ \\ / _\` | '__/ _ \\| |  | | (___  
 |  __/  __/| (_| | | | (_) | |  | |\\___ \\ 
 |_|   \\___| \\__,_|_|  \\___/ \\____/ ____) |
              </pre>
              <div class="space-y-0.5 text-slate-300">
                <p><span class="text-brand-cyan font-bold">OS:</span> ${PedroOSData.system.name} ${PedroOSData.system.version}</p>
                <p><span class="text-brand-cyan font-bold">Kernel:</span> ${PedroOSData.system.kernel}</p>
                <p><span class="text-brand-cyan font-bold">Author:</span> ${PedroOSData.system.developer}</p>
                <p><span class="text-brand-cyan font-bold">Role:</span> ${PedroOSData.profile.role}</p>
                <p><span class="text-brand-cyan font-bold">Education:</span> Jala University (Eng. Software) & IFRO</p>
                <p><span class="text-brand-cyan font-bold">Production:</span> 6 Live Projects (tratormag.com.br, etc.)</p>
                <p><span class="text-brand-cyan font-bold">Languages:</span> Português (Nativo), English (B2)</p>
                <p><span class="text-brand-cyan font-bold">Shell:</span> PedroOS zsh 5.9</p>
                <p class="pt-1 flex gap-1">
                  <span class="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                  <span class="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                  <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                  <span class="w-3 h-3 rounded-full bg-cyan-500 inline-block"></span>
                  <span class="w-3 h-3 rounded-full bg-violet-500 inline-block"></span>
                </p>
              </div>
            </div>
          `);
          break;

        case 'theme':
          if (args[0] === 'dark') {
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
            localStorage.setItem('pedroos_theme', 'dark');
            print('<p class="text-emerald-400">Tema escuro ativado com sucesso.</p>');
          } else if (args[0] === 'light') {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            localStorage.setItem('pedroos_theme', 'light');
            print('<p class="text-emerald-400">Tema claro ativado com sucesso.</p>');
          } else {
            print('<p class="text-amber-400">Uso: theme dark | theme light</p>');
          }
          break;

        case 'matrix':
          print(`
            <div class="text-emerald-400 font-mono text-[10px] leading-none space-y-0.5">
              <p>01010000 01100101 01100100 01110010 01101111 01001111 01010011</p>
              <p>10110100 11001010 00101101 10101011 01010101 11010101 01010101</p>
              <p>01000101 01101110 01100111 01100101 01101110 01101000 01100101</p>
              <p class="text-emerald-300 font-bold">Acorde, visitante... O PedroOS está pronto para transformar sua ideia em código.</p>
            </div>
          `);
          break;

        case 'sudo':
          print('<p class="text-rose-400">Acesso root: Você já possui privilégios de convidado especial no PedroOS!</p>');
          break;

        case 'echo':
          print(`<p class="text-white">${args.join(' ')}</p>`);
          break;

        case 'history':
          print(`
            <div class="text-slate-400 text-[11px]">
              ${commandHistory.map((c, i) => `<div>${i + 1}  ${c}</div>`).join('')}
            </div>
          `);
          break;

        case 'exit':
          PedroOSWindowManager.closeWindow(winId);
          break;

        default:
          print(`<p class="text-rose-400">Comando não reconhecido: "${cmd}". Digite <span class="text-white font-bold">help</span> para ver a lista de comandos.</p>`);
          break;
      }
    }

    // Input events
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = inputEl.value;
        inputEl.value = '';
        executeCommand(val);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          inputEl.value = commandHistory[historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          inputEl.value = commandHistory[historyIndex] || '';
        } else {
          historyIndex = commandHistory.length;
          inputEl.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const current = inputEl.value.trim().toLowerCase();
        if (!current) return;
        const match = availableCommands.find(c => c.startsWith(current));
        if (match) {
          inputEl.value = match;
        }
      }
    });

    // Auto-run neofetch on first open for high visual impact
    setTimeout(() => {
      executeCommand('neofetch');
    }, 150);

    return win;
  }

  return {
    openTerminal
  };
})();

window.PedroOSTerminal = PedroOSTerminal;
