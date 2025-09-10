//======JS para el menú hamburguesa de la navbar==============
const toggleMenu = document.getElementById("menuToggle");
const enlacesNav = document.querySelector(".nav-links");

toggleMenu.addEventListener("click", () => {
  enlacesNav.classList.toggle("active");
});