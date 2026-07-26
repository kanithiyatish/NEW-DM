/* ============================================================
   DRIVEMATE — shared interactions
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Year ---------- */
  document.querySelectorAll('.js-year').forEach(el => el.textContent = new Date().getFullYear());

  /* ---------- Mobile nav ---------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks){
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      navLinks.style.display = navLinks.classList.contains('mobile-open') ? 'flex' : '';
      if (navLinks.classList.contains('mobile-open')){
        navLinks.style.position='absolute'; navLinks.style.top='78px'; navLinks.style.left='0';
        navLinks.style.right='0'; navLinks.style.flexDirection='column'; navLinks.style.background='#14171B';
        navLinks.style.padding='1.5rem 2rem'; navLinks.style.borderBottom='1px solid rgba(231,233,236,.09)';
        navLinks.style.gap='1.2rem';
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  if ('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.15, rootMargin:'0px 0px -40px 0px'});
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Header shadow on scroll ---------- */
  const header = document.querySelector('.site-header');
  if (header){
    window.addEventListener('scroll', () => {
      header.style.borderBottomColor = window.scrollY > 12 ? 'rgba(193,121,63,0.35)' : 'rgba(231,233,236,0.09)';
    });
  }

  /* ---------- Card spotlight (mouse-follow glow on service cards) ---------- */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- Marquee duplication for seamless loop ---------- */
  document.querySelectorAll('.marquee-track').forEach(track => {
    track.innerHTML += track.innerHTML;
  });

  /* ---------- Tabs (login/signup) ---------- */
  document.querySelectorAll('.tab-switch').forEach(tabset => {
    const buttons = tabset.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.target;
        document.querySelectorAll('.auth-panel').forEach(p => p.style.display = 'none');
        const panel = document.getElementById(target);
        if (panel) panel.style.display = 'block';
      });
    });
  });

  /* ---------- Qty steppers (cart) ---------- */
  document.querySelectorAll('.qty-stepper').forEach(stepper => {
    const valueEl = stepper.querySelector('.qty-val');
    const minus = stepper.querySelector('.qty-minus');
    const plus = stepper.querySelector('.qty-plus');
    if (!valueEl) return;
    minus?.addEventListener('click', () => {
      let v = parseInt(valueEl.textContent, 10);
      if (v > 1) valueEl.textContent = --v;
      window.recalcCart && window.recalcCart();
    });
    plus?.addEventListener('click', () => {
      let v = parseInt(valueEl.textContent, 10);
      valueEl.textContent = ++v;
      window.recalcCart && window.recalcCart();
    });
  });

  /* ---------- Slot chip selection ---------- */
  document.querySelectorAll('.slot-chip-row').forEach(row => {
    row.querySelectorAll('.slot-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        row.querySelectorAll('.slot-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });
  });

  /* ============================================================
     CUSTOM CURSOR + MECHANICAL TOOL PARTICLE TRAIL
     Tiny wrenches / bolts / gears / screwdrivers stream from the
     cursor as it moves and tumble away, fading out.
     ============================================================ */
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (!isTouch){
    const dot = document.createElement('div'); dot.id = 'cursor-dot';
    const ring = document.createElement('div'); ring.id = 'cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);

    let mx = window.innerWidth/2, my = window.innerHeight/2;
    let rx = mx, ry = my;
    let lastSpawn = 0;

    const TOOL_SVGS = [
      // wrench
      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14.7 6.3a4 4 0 0 0-5.5 4.9L3 17.4V21h3.6l6.2-6.2a4 4 0 0 0 4.9-5.5l-2.8 2.8-2-2z"/></svg>`,
      // bolt/nut
      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 3 7v10l9 5 9-5V7z"/><circle cx="12" cy="12" r="3"/></svg>`,
      // gear
      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z"/></svg>`,
      // screwdriver
      `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20l6-6"/><path d="M14 4l6 6-3 3-6-6z"/><path d="M9.5 14.5 12 12"/></svg>`
    ];

    function spawnTool(x, y){
      const el = document.createElement('div');
      el.className = 'tool-particle';
      el.innerHTML = TOOL_SVGS[Math.floor(Math.random()*TOOL_SVGS.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist = 24 + Math.random()*46;
      const rotStart = Math.random()*360;
      const rotEnd = rotStart + (Math.random() > .5 ? 1 : -1) * (120 + Math.random()*240);
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 10;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.transform = `translate(-50%,-50%) rotate(${rotStart}deg)`;
      document.body.appendChild(el);

      const duration = 650 + Math.random()*450;
      const anim = el.animate([
        { transform:`translate(-50%,-50%) translate(0px,0px) rotate(${rotStart}deg) scale(.5)`, opacity:0 },
        { transform:`translate(-50%,-50%) translate(${dx*0.3}px,${dy*0.3}px) rotate(${rotStart + (rotEnd-rotStart)*0.4}deg) scale(1)`, opacity:1, offset:.25 },
        { transform:`translate(-50%,-50%) translate(${dx}px,${dy + 30}px) rotate(${rotEnd}deg) scale(.6)`, opacity:0 }
      ], { duration, easing:'cubic-bezier(.22,1,.36,1)' });
      anim.onfinish = () => el.remove();
    }

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      const now = performance.now();
      if (now - lastSpawn > 26){ // dense stream, throttled for perf
        lastSpawn = now;
        spawnTool(mx + (Math.random()*10-5), my + (Math.random()*10-5));
      }
      const hoverTarget = e.target.closest('a, button, .service-card, input, select, .slot-chip, .icon-btn');
      ring.classList.toggle('hover', !!hoverTarget);
    });

    function raf(){
      rx += (mx-rx) * 0.18;
      ry += (my-ry) * 0.18;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(raf);
    }
    raf();

    // small burst on click, like tools scattering
    window.addEventListener('mousedown', (e) => {
      for (let i=0;i<6;i++) spawnTool(e.clientX, e.clientY);
    });
  }

});

/* ============================================================
   Vehicle type toggle (2-Wheeler / 4-Wheeler) — hero + brands
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.vehicle-toggle').forEach(toggle => {
    const buttons = toggle.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const type = btn.dataset.type; // "two" or "four"
        document.querySelectorAll('[data-vehicle-panel]').forEach(panel => {
          panel.classList.toggle('active', panel.dataset.vehiclePanel === type);
        });
        document.querySelectorAll('[data-vehicle-group]').forEach(group => {
          group.querySelectorAll('[data-vtype]').forEach(el => {
            el.style.display = (el.dataset.vtype === type) ? '' : 'none';
          });
        });
      });
    });
  });

  /* ---------- Catalog category tabs (services.html) ---------- */
  const tabs = document.querySelectorAll('.category-tabs button');
  const cards = document.querySelectorAll('.catalog-card');
  if (tabs.length && cards.length){
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.cat;
        cards.forEach(card => {
          card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
        });
      });
    });
  }
});
