/* Hash-addressable homepage panels; ordinary document flow is the no-script fallback. */
(() => {
  if (!document.body.matches('.page-home')) return;
  const main = document.querySelector('#home-content');
  const pane = document.querySelector('.home-scroll');
  const sections = [...main.children].filter(node => node.matches('section'));
  const navigation = [...document.querySelectorAll('.section-navigation a')];
  const label = document.querySelector('.current-section-label');
  let selected;
  const sectionFor = hash => {
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return null; }
    const target = document.getElementById(id || 'top');
    return target && sections.find(section => section === target || section.contains(target));
  };
  function select(section, focus = false) {
    selected = section;
    sections.forEach(item => { item.hidden = item !== section; });
    navigation.forEach(link => {
      const current = link.hash === '#' + section.id;
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
      if (current) label.textContent = link.children[1].textContent;
    });
    pane.scrollTop = 0;
    pane.scrollLeft = 0;
    if (focus) {
      const heading = section.querySelector('h1,h2') || section;
      heading.setAttribute('tabindex', '-1');
      heading.focus({preventScroll:true});
      if (window.matchMedia('(max-width:600px)').matches) {
        document.querySelector('.home-toolbar').scrollIntoView({behavior:'instant',block:'start'});
      }
    }
  }
  document.body.classList.add('panels-ready');
  select(sectionFor(location.hash) || sections[0]);
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
    const section = sectionFor(url.hash);
    if (!section) return;
    event.preventDefault();
    if (location.hash !== url.hash) history.pushState(null, '', url.hash);
    select(section, true);
  });
  window.addEventListener('hashchange', () => select(sectionFor(location.hash) || sections[0], true));
  window.addEventListener('popstate', () => {
    const section = sectionFor(location.hash) || sections[0];
    if (section !== selected) select(section, true);
  });
})();
/* Small progressive enhancements; booking and content work without this file. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const header = document.querySelector('.header');
  const heroImage = document.querySelector('.hero-image');
  const active = new Map();
  let revealObserver;
  let heroVisible = true;
  let frame = 0;

  function finishEntrance(element) {
    const animation = active.get(element);
    if (animation) animation.cancel();
    active.delete(element);
    element.classList.remove('motion-entrance');
  }
  function enter(element, delay = 0) {
    if (reduced.matches || typeof element.animate !== 'function' || document.hidden) return;
    element.classList.add('motion-entrance');
    const interactive = element.matches('a,button') || element.querySelector('a,button,input,iframe');
    const animation = element.animate([
      {opacity: 0, translate: interactive ? '0 0' : '0 18px'},
      {opacity: 1, translate: '0 0'}
    ], {duration: 760, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards'});
    active.set(element, animation);
    animation.onfinish = () => finishEntrance(element);
    const botanical = element.matches('.botanical') ? element : element.querySelector('.botanical');
    if (botanical) {
      botanical.classList.add('is-drawing');
      botanical.addEventListener('animationend', () => botanical.classList.remove('is-drawing'), {once:true});
    }
  }

  // Animate bounded blocks, never entire sections or the third-party booking frame.
  const heroTargets = document.querySelectorAll('.hero-overline > *, .hero-main > *, .hero-footnote > *, .hero-sideword, .page-service .hero-grid > div:first-child > *, .page-booking .hero .container > *, .service-hero .service-grid > div > *, .hero-image-wrap, .floral-mark, .service-hero img');
  const targets = [...document.querySelectorAll('.intro-grid > div, .section-heading, .service-card, .approach-photo, .approach-copy > .eyebrow, .approach-copy > h2, .approach-copy > p, .step, .list-heading, .service-item, .booking-card, .quote blockquote, .quote p, .contact-copy, .booking-contact > .contact-row, .footer-row > div')];
  if (!reduced.matches) {
    heroTargets.forEach((element,index) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) enter(element, Math.min(index,5)*80);
      else targets.push(element);
    });
    if ('IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(entries => {
        entries.filter(entry => entry.isIntersecting).forEach((entry,index) => {
          revealObserver.unobserve(entry.target);
          enter(entry.target, Math.min(index,3)*65);
        });
      }, {threshold:0, rootMargin:'0px 0px 30px 0px'});
      targets.forEach(element => revealObserver.observe(element));
    }
  }

  function updateScroll() {
    frame = 0;
    const y = window.scrollY;
    const length = document.documentElement.scrollHeight-window.innerHeight;
    if (header) {
      header.classList.toggle('is-scrolled', y > 24);
      header.style.setProperty('--page-progress', length > 0 ? Math.min(1,y/length).toFixed(4) : '0');
    }
    if (heroImage && heroVisible && !reduced.matches && pointer.matches && window.innerWidth > 800) {
      heroImage.style.setProperty('--image-drift', `${Math.min(12,y*.025).toFixed(2)}px`);
    } else if (heroImage) heroImage.style.removeProperty('--image-drift');
  }
  function scheduleScroll() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(updateScroll);
  }
  window.addEventListener('scroll',scheduleScroll,{passive:true});
  window.addEventListener('resize',scheduleScroll,{passive:true});
  if (heroImage && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {heroVisible=entries[0].isIntersecting;scheduleScroll();}).observe(heroImage);
  }
  updateScroll();

  // Keyboard navigation always exposes the focused content immediately.
  document.addEventListener('focusin',event => {
    active.forEach((animation,element) => {
      if (element.contains(event.target)) finishEntrance(element);
    });
  });
  reduced.addEventListener('change',() => {
    if (reduced.matches) {
      revealObserver?.disconnect();
      [...active.keys()].forEach(finishEntrance);
      document.querySelectorAll('.is-drawing').forEach(element => element.classList.remove('is-drawing'));
    }
    scheduleScroll();
  });
  document.addEventListener('visibilitychange',() => {
    if (document.hidden) {
      [...active.keys()].forEach(finishEntrance);
      cancelAnimationFrame(frame);frame=0;
    } else scheduleScroll();
  });

  const mobileMenu=document.querySelector('.mobile-menu');
  mobileMenu?.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',()=>{mobileMenu.open=false;});
  });
})();

