//===================PRODUCT CARD FILTERS JS===============
const filterButtons = document.querySelectorAll('.catalog-filters button');
  const products = document.querySelectorAll('.product-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

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