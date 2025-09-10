document.addEventListener("DOMContentLoaded", () => {
  const inputBusqueda = document.querySelector(".search-input");
  const btnBusqueda = document.querySelector(".search-btn");
  const sinResultados = document.getElementById("noResults");
  const catalogo = document.getElementById("catalog");

  if (!inputBusqueda) return;

  const esCatalogo = window.location.pathname.includes("Catalogo.html");

  // Función para redirigir al catálogo con el query
  function irACatalogo() {
    const consulta = inputBusqueda.value.trim();
    const url = consulta ? `Catalogo.html?q=${encodeURIComponent(consulta)}` : "Catalogo.html";
    window.location.href = url;
  }

  // Función para escapar caracteres especiales en regex
  function escapeRegExp(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Función para resaltar coincidencias
  function resaltarTexto(elemento, consulta) {
    if (!elemento) return;
    const texto = elemento.textContent || "";
    if (!consulta) {
      elemento.innerHTML = texto;
      return;
    }
    const regex = new RegExp(`(${escapeRegExp(consulta)})`, "gi");
    elemento.innerHTML = texto.replace(regex, "<mark>$1</mark>");
  }

  // Función principal de búsqueda en catálogo
  function ejecutarBusqueda(consulta) {
    if (!esCatalogo) return;

    const q = (consulta || "").toLowerCase().trim();
    const tarjetasProducto = document.querySelectorAll(".product-card");
    let coincidencias = 0;

    tarjetasProducto.forEach(tarjeta => {
      const nombreEl = tarjeta.querySelector("h3");
      const codigoEl = tarjeta.querySelector("h4");

      const nombre = nombreEl ? nombreEl.textContent.toLowerCase() : "";
      const codigo = codigoEl ? codigoEl.textContent.toLowerCase() : "";

      const visible = q === "" ? true : (nombre.includes(q) || codigo.includes(q));
      tarjeta.style.display = visible ? "block" : "none";
      if (visible) coincidencias++;

      resaltarTexto(nombreEl, q);
      if (codigoEl) resaltarTexto(codigoEl, q);
    });

    if (sinResultados) {
      sinResultados.style.display = coincidencias === 0 ? "block" : "none";
    }
  }

  // Manejo de Enter
  inputBusqueda.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (esCatalogo) {
        ejecutarBusqueda(inputBusqueda.value);
        if (catalogo) catalogo.scrollIntoView({ behavior: "smooth" });
      } else {
        irACatalogo();
      }
    }
  });

  // Click en lupa
  if (btnBusqueda) {
    btnBusqueda.addEventListener("click", (e) => {
      e.preventDefault();
      if (esCatalogo) {
        ejecutarBusqueda(inputBusqueda.value);
        if (catalogo) catalogo.scrollIntoView({ behavior: "smooth" });
      } else {
        irACatalogo();
      }
    });
  }

  // Si venimos con ?q=... en la URL (solo catálogo)
  if (esCatalogo) {
    const params = new URLSearchParams(window.location.search);
    const queryInicial = params.get("q");
    if (queryInicial) inputBusqueda.value = queryInicial;

    // Espera que las tarjetas existan antes de filtrar
    const esperarTarjetas = setInterval(() => {
      const tarjetasProducto = document.querySelectorAll(".product-card");
      if (tarjetasProducto.length) {
        if (queryInicial) ejecutarBusqueda(queryInicial);
        clearInterval(esperarTarjetas);
      }
    }, 100);

    // Filtrar mientras escriben en catálogo
    inputBusqueda.addEventListener("input", () => {
      ejecutarBusqueda(inputBusqueda.value);
    });
  }
});
