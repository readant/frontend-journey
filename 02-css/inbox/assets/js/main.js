document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initBackToTop();
  initTocHighlight();
  initMobileNav();
});

function initNavigation() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const links = sidebar.querySelectorAll('a[href]');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (href === './' && currentPage === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initTocHighlight() {
  const headings = document.querySelectorAll('.content h2[id], .content h3[id]');
  const tocLinks = document.querySelectorAll('.toc a');
  if (!headings.length || !tocLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        tocLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-80px 0px -60% 0px' });

  headings.forEach(h => observer.observe(h));
}

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });
}