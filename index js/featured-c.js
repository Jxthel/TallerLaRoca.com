const carousel = document.querySelector(".carousel");
const items = document.querySelectorAll(".carousel-item");
const dotsContainer = document.querySelector(".carousel-dots");

let index = 0;
let autoPlay;

// Crear los puntos del carrusel
function createDots() {
  items.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      index = i;
      showSlide(index);
      resetAutoPlay();
    });
    dotsContainer.appendChild(dot);
  });
}
createDots();

const dots = document.querySelectorAll(".dot");

// Mostrar la diapositiva actual
function showSlide(i) {
  if (i >= items.length) index = 0;
  if (i < 0) index = items.length - 1;
  carousel.style.transform = `translateX(${-index * 100}%)`;

  dots.forEach(dot => dot.classList.remove("active"));
  dots[index].classList.add("active");
}

// Pasar a la siguiente diapositiva
function nextSlide() {
  index++;
  showSlide(index);
}

// Pasar a la diapositiva anterior
function prevSlide() {
  index--;
  showSlide(index);
}

// Iniciar reproducción automática
function startAutoPlay() {
  autoPlay = setInterval(nextSlide, 4000);
}

// Reiniciar reproducción automática
function resetAutoPlay() {
  clearInterval(autoPlay);
  startAutoPlay();
}

startAutoPlay();

// Soporte de swipe para móviles
let startX = 0;
let isDragging = false;

carousel.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
  clearInterval(autoPlay); // pausar autoplay mientras se desliza
});

carousel.addEventListener("touchend", (e) => {
  if (!isDragging) return;
  isDragging = false;
  let diff = e.changedTouches[0].clientX - startX;

  if (diff > 50) {
    prevSlide(); // deslizar a la derecha
  } else if (diff < -50) {
    nextSlide(); // deslizar a la izquierda
  } else {
    showSlide(index); // swipe insuficiente → volver a la posición
  }

  startAutoPlay(); // reanudar autoplay
});