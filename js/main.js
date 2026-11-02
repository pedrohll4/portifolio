// ============================================================
// PedroOS - Main Bootloader & Coordinator
// Coordinates system boot animation, welcome message,
// window initialization and global state setup
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize subsystem managers
  PedroOSDesktop.init();
  PedroOSTaskbar.init();

  // 2. Handle Boot Sequence
  const bootScreen = document.getElementById('boot-screen');
  const bootProgress = document.getElementById('boot-progress-bar');
  const bootStatusText = document.getElementById('boot-status-text');

  if (bootScreen) {
    let progress = 0;
    let bootFinished = false;

    function finishBoot() {
      if (bootFinished) return;
      bootFinished = true;
      if (interval) clearInterval(interval);
      bootScreen.classList.add('is-fade-out');
      PedroOSAudio.playBootChime();

      setTimeout(() => {
        if (bootScreen.parentNode) {
          bootScreen.remove();
        }
        showWelcomeExperience();
      }, 350);
    }

    // Allow user to click to skip boot instantly
    bootScreen.addEventListener('click', finishBoot);

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 15;
      if (progress > 100) progress = 100;

      if (bootProgress) bootProgress.style.width = `${progress}%`;
      if (bootStatusText) {
        if (progress < 40) bootStatusText.textContent = 'Carregando módulos do kernel PedroOS...';
        else if (progress < 75) bootStatusText.textContent = 'Inicializando ambiente gráfico Glassmorphism...';
        else if (progress < 95) bootStatusText.textContent = 'Montando repositórios e projetos no ar...';
        else bootStatusText.textContent = 'PedroOS pronto!';
      }

      if (progress >= 100) {
        finishBoot();
      }
    }, 70);

    // Failsafe timeout: never stay stuck longer than 1.8 seconds
    setTimeout(finishBoot, 1800);
  } else {
    showWelcomeExperience();
  }

  // 3. Welcome Experience (Subtle Welcome Modal / Prompt)
  function showWelcomeExperience() {
    const welcomeModal = document.getElementById('welcome-modal');
    if (!welcomeModal) return;

    // Show modal
    welcomeModal.classList.remove('hidden');

    const exploreBtn = document.getElementById('btn-welcome-explore');
    const projectsBtn = document.getElementById('btn-welcome-projects');
    const closeBtn = document.getElementById('btn-welcome-close');

    function dismissModal() {
      welcomeModal.classList.add('hidden');
    }

    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        PedroOSAudio.playPop();
        dismissModal();
        // Open Sobre Mim as default nice welcome
        PedroOSApps.openAbout();
      });
    }

    if (projectsBtn) {
      projectsBtn.addEventListener('click', () => {
        PedroOSAudio.playPop();
        dismissModal();
        PedroOSApps.openProjects();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        PedroOSAudio.playClick();
        dismissModal();
      });
    }
  }
});
