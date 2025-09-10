//=================== FILTROS DE PRODUCTOS JS ===============
const filterButtons = document.querySelectorAll('.catalog-filters button');
const products = document.querySelectorAll('.product-card');

// Añadir evento a cada botón de filtro
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Quitar la clase 'active' de todos los botones y agregarla al seleccionado
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filterValue = button.getAttribute('data-filter');

    // Mostrar u ocultar productos según la categoría seleccionada
    products.forEach(product => {
      const category = product.getAttribute('data-category');
      if (filterValue === 'all' || category === filterValue) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    });
  });
});
