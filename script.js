// Mobile nav toggle
const toggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav when a link is clicked (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id], header[id]');
const links = document.querySelectorAll('.nav__links a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// Download portfolio as PDF via the browser's print dialog, with a
// meaningful suggested filename (browsers use document.title as the
// default filename when saving a print job as PDF).
const downloadPdfBtn = document.getElementById('downloadPdfBtn');

if (downloadPdfBtn) {
  // NOTE: this is a client-side-only deterrent, not real access control —
  // the password below is visible to anyone who reads this file's source.
  // It's meant to stop casual visitors from downloading, not a determined one.
  const PDF_DOWNLOAD_PASSWORD = '0506870046';

  const slugify = str => str
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  downloadPdfBtn.addEventListener('click', () => {
    const entered = prompt('This portfolio PDF is owner-only. Enter password to download:');
    if (entered === null) return; // cancelled
    if (entered !== PDF_DOWNLOAD_PASSWORD) {
      alert('Incorrect password.');
      return;
    }

    const fullName = document.querySelector('.hero__name')?.textContent.trim() || 'Portfolio';
    const title = document.querySelector('.hero__headline')?.textContent.split('|')[0].trim() || '';
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const originalTitle = document.title;
    document.title = [slugify(fullName), slugify(title), 'Portfolio', today]
      .filter(Boolean)
      .join('-');

    let restored = false;
    const restoreTitle = () => {
      if (restored) return;
      restored = true;
      document.title = originalTitle;
      window.removeEventListener('afterprint', restoreTitle);
    };
    window.addEventListener('afterprint', restoreTitle);
    setTimeout(restoreTitle, 5000); // fallback for browsers that skip 'afterprint'

    window.print();
  });
}
