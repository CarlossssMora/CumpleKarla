/* =============================================
   SCRIPT DE TARJETA DE CUMPLEAÑOS
   - Confeti animado en canvas
   - Nombre editable con limpieza al primer clic
   ============================================= */

// Lanzar confeti al cargar la página (bienvenida)
window.addEventListener('load', () => {
  setTimeout(() => launchConfetti(), 700);
});


// ── CONFETI ───────────────────────────────────
const canvas  = document.getElementById('confetti-canvas');
const ctx     = canvas.getContext('2d');
let particles = [];
let animId    = null;

// Colores pastel del tema
const COLORS = [
  '#ffb8d8', // pink-mid
  '#c9a8e8', // lavender-mid
  '#9edece', // mint-mid
  '#fde8d8', // peach
  '#fff5cc', // yellow-soft
  '#f28db5', // pink-accent
  '#ffe4f0', // pink-light
];

const SHAPES = ['circle', 'rect', 'star'];

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);


// Clase partícula
class Particle {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x     = Math.random() * canvas.width;
    this.y     = initial ? Math.random() * -canvas.height * 0.5 : -20;
    this.size  = Math.random() * 8 + 4;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    this.vx    = (Math.random() - 0.5) * 2.5;
    this.vy    = Math.random() * 3 + 1.5;
    this.vr    = (Math.random() - 0.5) * 0.12;
    this.rot   = Math.random() * Math.PI * 2;
    this.alpha = 1;
    this.life  = 1;
    this.decay = Math.random() * 0.005 + 0.003;
    this.wobble     = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.08 + 0.03;
  }

  update() {
    this.wobble += this.wobbleSpeed;
    this.x  += this.vx + Math.sin(this.wobble) * 0.8;
    this.y  += this.vy;
    this.rot += this.vr;
    this.life  -= this.decay;
    this.alpha  = Math.max(0, this.life);
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.fillStyle = this.color;

    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();

    } else if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);

    } else if (this.shape === 'star') {
      drawStar(ctx, 0, 0, 5, this.size / 2, this.size / 4);
      ctx.fill();
    }

    ctx.restore();
  }

  isDead() {
    return this.life <= 0 || this.y > canvas.height + 20;
  }
}

function drawStar(ctx, cx, cy, spikes, outerR, innerR) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(
      cx + Math.cos(rot) * outerR,
      cy + Math.sin(rot) * outerR
    );
    rot += step;
    ctx.lineTo(
      cx + Math.cos(rot) * innerR,
      cy + Math.sin(rot) * innerR
    );
    rot += step;
  }
  ctx.lineTo(cx, cy - outerR);
  ctx.closePath();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Eliminar partículas muertas
  particles = particles.filter(p => !p.isDead());

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  if (particles.length > 0) {
    animId = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animId = null;
  }
}

function launchConfetti() {
  // Cancelar animación previa
  if (animId) {
    cancelAnimationFrame(animId);
    animId = null;
  }

  // Crear 150 partículas
  const count = 150;
  particles = Array.from({ length: count }, () => new Particle());

  animateConfetti();

  // Efecto visual en el botón
  const btn = document.getElementById('celebrate-btn');
  btn.textContent = '🎊 ¡Yay!';
  btn.style.transform = 'scale(0.95)';
  setTimeout(() => {
    btn.textContent = 'Da click aquí. 👀';
    btn.style.transform = '';
  }, 600);
}