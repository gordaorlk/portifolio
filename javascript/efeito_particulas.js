// --- Gerador Dinâmico de Partículas ---
// Autor: Hubert
// Descrição: Canvas interativo que renderiza partículas que reagem ao mouse.

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];
const numberOfParticles = 80;

const mouse = {
  x: null,
  y: null,
  radius: 120
};

window.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 4 + 1;
    this.speedX = Math.random() * 1.5 - 0.75;
    this.speedY = Math.random() * 1.5 - 0.75;
    this.color = 'rgba(247, 223, 30, 0.8)'; // Cor viva (CSS do JS)
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Colisão com as bordas
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

    // Interação com o mouse
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 2;
      if (mouse.x > this.x && this.x > this.size * 10) this.x -= 2;
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 2;
      if (mouse.y > this.y && this.y > this.size * 10) this.y -= 2;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init() {
  particlesArray = [];
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
  }
  requestAnimationFrame(animate);
}

init();
animate();
