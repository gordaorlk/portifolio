// --- Carrossel de Imagens Responsivo de Alta Performance ---
// Autor: Hubert
// Descrição: Um carrossel interativo construído com JavaScript Baunilha (Vanilla),
// otimizado para dispositivos móveis com suporte a gestos de arraste (swipe).

class PremiumCarousel {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.slides = Array.from(this.container.querySelectorAll('.slide'));
    this.currentIndex = 0;
    this.interval = options.interval || 3000;
    this.autoPlay = options.autoPlay !== false;
    
    this.init();
  }

  init() {
    this.setupStyles();
    this.createControls();
    if (this.autoPlay) this.startAutoPlay();
    this.setupSwipeEvents();
  }

  setupStyles() {
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';
    this.slides.forEach((slide, idx) => {
      slide.style.position = 'absolute';
      slide.style.top = '0';
      slide.style.left = '0';
      slide.style.width = '100%';
      slide.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      slide.style.transform = `translateX(${100 * idx}%)`;
    });
  }

  createControls() {
    // Botão Anterior
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '←';
    prevBtn.className = 'carousel-btn prev';
    prevBtn.onclick = () => this.prev();

    // Botão Próximo
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '→';
    nextBtn.className = 'carousel-btn next';
    nextBtn.onclick = () => this.next();

    this.container.appendChild(prevBtn);
    this.container.appendChild(nextBtn);
  }

  goTo(index) {
    if (index < 0) index = this.slides.length - 1;
    if (index >= this.slides.length) index = 0;
    
    this.currentIndex = index;
    this.slides.forEach((slide, idx) => {
      slide.style.transform = `translateX(${100 * (idx - this.currentIndex)}%)`;
    });
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }

  startAutoPlay() {
    this.timer = setInterval(() => this.next(), this.interval);
    this.container.onmouseenter = () => clearInterval(this.timer);
    this.container.onmouseleave = () => this.startAutoPlay();
  }

  setupSwipeEvents() {
    let startX = 0;
    this.container.ontouchstart = (e) => startX = e.touches[0].clientX;
    this.container.ontouchend = (e) => {
      let deltaX = e.changedTouches[0].clientX - startX;
      if (deltaX > 50) this.prev();
      if (deltaX < -50) this.next();
    };
  }
}

// Inicializando
const carousel = new PremiumCarousel('meu-carrossel', { interval: 4000 });
