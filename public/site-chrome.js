/* Redesign v2 site chrome, for the standalone pages under public/.
   The Astro pages get the equivalent from Navigation.astro; this keeps the
   hand-written HTML behaving identically.

   Keeps the floating bar, compact menu, and spacer in sync with the
   shared Astro navigation. */
(function () {
  var nav = document.getElementById('topNav');
  if (!nav) return;
  var menu = document.createElement('div');
  menu.id = 'mobileMenu';
  menu.className = 'rd-mobile-menu';
  menu.inert = true;
  menu.setAttribute('aria-hidden', 'true');
  var home = document.createElement('a');
  home.href = '/#top';
  home.textContent = 'Home';
  menu.appendChild(home);
  nav.querySelectorAll('.rd-nav-item, .rd-nav-cta').forEach(function (link) {
    var item = link.cloneNode(true);
    item.removeAttribute('class');
    menu.appendChild(item);
  });
  var button = document.createElement('button');
  button.id = 'menuBtn';
  button.className = 'rd-nav-btn rd-nav-menu';
  button.type = 'button';
  button.setAttribute('aria-controls', menu.id);
  button.innerHTML = '<span class="rd-menu-icon" aria-hidden="true"><span></span><span></span></span>';
  nav.appendChild(button);
  nav.insertAdjacentElement('afterend', menu);
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    menu.inert = !open;
    menu.setAttribute('aria-hidden', String(!open));
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  setMenu(false);
  button.addEventListener('click', function () { setMenu(button.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (event) { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') { setMenu(false); button.focus(); }
  });
  document.addEventListener('click', function (event) {
    if (!menu.contains(event.target) && !button.contains(event.target)) setMenu(false);
  });
  function fitScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 24); }

  function fitNav() {
    nav.classList.remove('is-compact');
    if (nav.scrollWidth > nav.clientWidth + 1) nav.classList.add('is-compact');
    if (getComputedStyle(button).display === 'none') setMenu(false);
    var h = nav.offsetHeight;
    document.documentElement.style.setProperty('--nav-h', h + 'px');
  }

  fitNav();
  fitScroll();
  window.addEventListener('scroll', fitScroll, { passive: true });
  window.addEventListener('resize', fitNav);
  window.addEventListener('load', fitNav);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNav);
})();
