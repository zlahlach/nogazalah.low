(function () {
  'use strict';

  var root = document.documentElement;
  var header = document.querySelector('.site-header');

  /* shadow under the header once the page has moved */
  function onScroll() { header.classList.toggle('is-stuck', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- phone menu ---- */
  var toggle = document.querySelector('.menu-toggle');
  var sheet = document.getElementById('sheet');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');
    sheet.hidden = !open;
    root.style.overflow = open ? 'hidden' : '';
    updateBar();
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  sheet.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  window.matchMedia('(min-width: 861px)').addEventListener('change', function (e) {
    if (e.matches) setMenu(false);
  });

  /* ---- practice-areas dropdown ---- */
  var drop = document.querySelector('.nav__drop');
  var dropBtn = drop.querySelector('.nav__drop-btn');

  function setDrop(open) {
    drop.classList.toggle('is-open', open);
    dropBtn.setAttribute('aria-expanded', String(open));
  }
  dropBtn.addEventListener('click', function () { setDrop(!drop.classList.contains('is-open')); });
  drop.addEventListener('click', function (e) {
    if (e.target.closest('.nav__menu a')) { setDrop(false); e.target.blur(); }
  });
  document.addEventListener('click', function (e) { if (!drop.contains(e.target)) setDrop(false); });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (drop.classList.contains('is-open')) { setDrop(false); dropBtn.focus(); }
    if (toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
  });

  /* ---- mark the nav item of the section on screen ---- */
  var spies = Array.prototype.slice.call(document.querySelectorAll('[data-spy]'));
  var targets = spies.map(function (el) {
    var id = el.getAttribute('data-spy');
    return id === 'top' ? document.querySelector('.hero') : document.getElementById(id);
  });
  function spy() {
    var line = window.scrollY + header.offsetHeight + window.innerHeight * 0.3;
    var current = 0;
    var best = -Infinity;
    targets.forEach(function (t, i) {       /* the lowest section that has passed the line */
      if (!t) return;
      var top = t.getBoundingClientRect().top + window.scrollY;
      if (top <= line && top >= best) { best = top; current = i; }
    });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = spies.length - 1;
    spies.forEach(function (el, i) { el.classList.toggle('is-active', i === current); });
  }
  window.addEventListener('scroll', spy, { passive: true });
  window.addEventListener('resize', spy);
  spy();

  /* ---- client quotes ---- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-carousel]'), function (car) {
    var slides = Array.prototype.slice.call(car.querySelectorAll('.slide'));
    var buttons = car.querySelectorAll('.carousel__btn');
    var dotsBox = car.querySelector('.carousel__dots');
    var index = 0;

    if (slides.length < 2) {
      Array.prototype.forEach.call(buttons, function (b) { b.hidden = true; });
      dotsBox.hidden = true;
      return;
    }

    var dots = slides.map(function (_, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', 'המלצה ' + (i + 1) + ' מתוך ' + slides.length);
      d.addEventListener('click', function () { go(i); });
      dotsBox.appendChild(d);
      return d;
    });

    function go(n) {
      index = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        s.classList.toggle('is-active', i === index);
        s.setAttribute('aria-hidden', String(i !== index));
      });
      dots.forEach(function (d, i) { d.setAttribute('aria-selected', String(i === index)); });
    }

    Array.prototype.forEach.call(buttons, function (b) {
      b.addEventListener('click', function () { go(index + Number(b.getAttribute('data-dir'))); });
    });
    car.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(index + 1);      /* RTL: left is forward */
      if (e.key === 'ArrowRight') go(index - 1);
    });

    go(0);
  });

  /* ---- phone action bar: on after the first screen, off once the contact section is in view ---- */
  var bar = document.getElementById('actionbar');
  var contact = document.getElementById('contact');
  function updateBar() {
    if (!bar || !contact) return;
    var menuOpen = toggle.getAttribute('aria-expanded') === 'true';
    var pastFirstScreen = window.scrollY > 320;
    var atContact = contact.getBoundingClientRect().top < window.innerHeight * 0.75;
    var on = pastFirstScreen && !atContact && !menuOpen;
    bar.classList.toggle('is-on', on);
    bar.inert = !on;
  }
  window.addEventListener('scroll', updateBar, { passive: true });
  window.addEventListener('resize', updateBar);
  updateBar();

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
