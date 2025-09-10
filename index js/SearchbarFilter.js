//Filtra las tarjetas .product dentro de un sistema de barra de búsqueda para encontrar productos
document.addEventListener("DOMContentLoaded", () => {
  const inputBusqueda = document.querySelector(".search-input");
  const tarjetasProducto = document.querySelectorAll(".product-card");
  const sinResultados = document.getElementById("noResults");
  const catalogo = document.getElementById("catalog");

  if (!inputBusqueda || !tarjetasProducto.length) {
    console.error("¡No se encontró el input de búsqueda o las tarjetas de producto!");
    return;
  }

  //Resalta coincidencias dentro de un elemento
  function resaltarTexto(elemento, consulta) {
    const texto = elemento.textContent;
    if (!consulta) {
      elemento.innerHTML = texto; // reiniciar
      return;
    }
    const regex = new RegExp(`(${consulta})`, "gi");
    elemento.innerHTML = texto.replace(regex, "<mark>$1</mark>");
  }

  // Función principal de búsqueda
  function ejecutarBusqueda() {
    const consulta = inputBusqueda.value.toLowerCase().trim();
    let coincidencias = 0;

    tarjetasProducto.forEach(tarjeta => {
      const nombreEl = tarjeta.querySelector("h3");
      const codigoEl = tarjeta.querySelector("h4");

      const nombre = nombreEl.textContent.toLowerCase();
      const codigo = codigoEl ? codigoEl.textContent.toLowerCase() : "";

      const visible = nombre.includes(consulta) || codigo.includes(consulta);

      tarjeta.style.display = visible ? "block" : "none";
      if (visible) coincidencias++;

      // Resaltar coincidencias
      resaltarTexto(nombreEl, consulta);
      if (codigoEl) resaltarTexto(codigoEl, consulta);
    });

    sinResultados.style.display = coincidencias === 0 ? "block" : "none";
  }

  // Filtrar mientras escribes
  inputBusqueda.addEventListener("input", ejecutarBusqueda);

  // Presionar Enter / hacer scroll al catálogo
  inputBusqueda.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      ejecutarBusqueda();
      catalogo.scrollIntoView({ behavior: "smooth" });
    }
  });
});