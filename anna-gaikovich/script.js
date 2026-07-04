const nav = document.getElementById('nav');
addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 40);
}, { passive: true });

const works = [...document.querySelectorAll('.work')];

works.forEach(w => {
  const c = document.createElement('figcaption');
  const em = document.createElement('em');
  em.textContent = w.dataset.title;
  const span = document.createElement('span');
  span.textContent = w.dataset.info;
  c.append(em, span);
  w.appendChild(c);
});

const io = new IntersectionObserver(entries => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('seen');
      io.unobserve(e.target);
    }
  }
}, { threshold: 0.12 });
works.forEach(w => io.observe(w));

if (document.body.classList.contains('stage')) {
  const cur = document.createElement('div');
  cur.className = 'cursor-view';
  cur.textContent = 'View';
  document.body.appendChild(cur);
  addEventListener('mousemove', e => {
    cur.style.left = e.clientX + 'px';
    cur.style.top = e.clientY + 'px';
    cur.classList.toggle('on', !!e.target.closest('.work') && !document.getElementById('lb').classList.contains('open'));
  }, { passive: true });
}

document.querySelectorAll('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter.on').classList.remove('on');
    btn.classList.add('on');
    const f = btn.dataset.f;
    works.forEach(w => {
      const show = f === 'all' || w.dataset.s === f;
      w.classList.toggle('hidden', !show);
      if (show) w.classList.add('seen');
    });
  });
});

const lb = document.getElementById('lb');
const lbImg = document.getElementById('lb-img');
const lbTitle = document.getElementById('lb-title');
const lbInfo = document.getElementById('lb-info');
const lbNote = document.getElementById('lb-note');
let current = -1;

function visibleWorks() {
  return works.filter(w => !w.classList.contains('hidden'));
}

function openLB(w) {
  const vis = visibleWorks();
  current = vis.indexOf(w);
  render(vis);
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function render(vis) {
  const w = vis[current];
  lbImg.src = w.querySelector('img').src;
  lbImg.alt = w.querySelector('img').alt;
  lbTitle.textContent = w.dataset.title;
  lbInfo.textContent = w.dataset.info;
  lbNote.textContent = w.dataset.note || '';
}

function step(d) {
  const vis = visibleWorks();
  current = (current + d + vis.length) % vis.length;
  render(vis);
}

function closeLB() {
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

works.forEach(w => w.addEventListener('click', () => openLB(w)));
document.getElementById('lb-x').addEventListener('click', closeLB);
document.getElementById('lb-prev').addEventListener('click', e => { e.stopPropagation(); step(-1); });
document.getElementById('lb-next').addEventListener('click', e => { e.stopPropagation(); step(1); });
lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLB();
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
});
