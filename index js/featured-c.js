const carousel = document.querySelector(".carousel");
const items = document.querySelectorAll(".carousel-item");
const dotsContainer = document.querySelector(".carousel-dots");

let index = 0;
let autoPlay;

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

function showSlide(i) {
  if (i >= items.length) index = 0;
  if (i < 0) index = items.length - 1;
  carousel.style.transform = `translateX(${-index * 100}%)`;

  dots.forEach(dot => dot.classList.remove("active"));
  dots[index].classList.add("active");
}

function nextSlide() {
  index++;
  showSlide(index);
}

function prevSlide() {
  index--;
  showSlide(index);
}

function startAutoPlay() {
  autoPlay = setInterval(nextSlide, 4000);
}

function resetAutoPlay() {
  clearInterval(autoPlay);
  startAutoPlay();
}

startAutoPlay();


//Swipe support for mobile
let startX = 0;
let isDragging = false;

carousel.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
  clearInterval(autoPlay); //pause autoplay while swiping
});

carousel.addEventListener("touchend", (e) => {
  if (!isDragging) return;
  isDragging = false;
  let diff = e.changedTouches[0].clientX - startX;

  if (diff > 50) {
    prevSlide(); // swipe right
  } else if (diff < -50) {
    nextSlide(); // swipe left
  } else {
    showSlide(index); //not enough swipe → snap back
  }

  startAutoPlay(); //resume autoplay
});