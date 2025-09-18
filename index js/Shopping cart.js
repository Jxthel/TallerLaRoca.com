document.addEventListener("DOMContentLoaded", () => {
  //Guardar productos dentro del carrito//
  let cart = JSON.parse(localStorage.getItem("cart")) || [];


  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartTotalElement = document.querySelector(".cart-total");
  const cotizarBtn = document.getElementById("cotizarBtn");
  
  let cart = []; // iniciar el carrito vacío

  function parseCurrency(texto) {
    if (typeof texto === "number") return texto;
    if (!texto) return 0;
    const limpio = texto.toString().replace(/[^0-9.,-]/g, ""); 
    const normalizado = limpio.replace(/,/g, "");
    const num = parseFloat(normalizado);
    return isNaN(num) ? 0 : num;
  }

  function formatCurrency(num) {
    return "L" + Number(num).toLocaleString("es-HN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function guardarCarrito() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function actualizarBadge() {
    const cartBadge = document.getElementById("cartBadge");
    if (!cartBadge) return;

    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    if (totalQty > 0) {
      cartBadge.textContent = totalQty;
      cartBadge.style.display = "flex";
      cartBadge.classList.remove("animate");
      void cartBadge.offsetWidth;
      cartBadge.classList.add("animate");
    } else {
      cartBadge.style.display = "none";
    }
  }

  function renderizarCarrito() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>No tienes artículos en tu carrito</p>";
      if (cartTotalElement) cartTotalElement.textContent = "Total: " + formatCurrency(0);
      actualizarBadge();
      guardarCarrito();
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      const subtotal = item.priceNum * item.quantity;
      total += subtotal;

      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="cart-img">
        <div class="cart-info">
          <p><strong>${item.name}</strong></p>
          ${item.code ? `<p class="cart-code">Código: ${item.code}</p>` : ""}
          <p>Precio: ${formatCurrency(item.priceNum)}</p>
          <div class="qty-controls">
            <button class="decrease">-</button>
            <span class="qty">${item.quantity}</span>
            <button class="increase">+</button>
          </div>
          <p>Subtotal: ${formatCurrency(subtotal)}</p>
        </div>
        <button class="remove-item" title="Eliminar">
          <img src="./image/can.png" alt="Eliminar" class="trash-icon"/>
        </button>
      `;

      cartItemsContainer.appendChild(div);

      // Controles de cantidad
      const decreaseBtn = div.querySelector(".decrease");
      const increaseBtn = div.querySelector(".increase");
      const qtySpan = div.querySelector(".qty");

      function actualizarEstadoDecrease() {
        if (item.quantity <= 1) {
          decreaseBtn.disabled = true;
          decreaseBtn.classList.add("disabled");
        } else {
          decreaseBtn.disabled = false;
          decreaseBtn.classList.remove("disabled");
        }
      }

      increaseBtn.addEventListener("click", () => {
        item.quantity++;
        guardarCarrito();
        renderizarCarrito();
      });

      decreaseBtn.addEventListener("click", () => {
        if (decreaseBtn.disabled) return;
        if (item.quantity > 1) {
          item.quantity--;
          guardarCarrito();
          renderizarCarrito();
        }
      });

      actualizarEstadoDecrease();

      // Botón eliminar (animación del icono primero, luego eliminar)
      const removeBtn = div.querySelector(".remove-item");
      const trashIcon = div.querySelector(".trash-icon");

      removeBtn.addEventListener("click", () => {
        if (!trashIcon) {
          cart.splice(index, 1);
          guardarCarrito();
          renderizarCarrito();
          return;
        }

        if (trashIcon.dataset.deleting === "1") return;
        trashIcon.dataset.deleting = "1";

        trashIcon.classList.remove("shake");
        void trashIcon.offsetWidth;
        trashIcon.classList.add("shake");

        let terminado = false;

        const finalizar = () => {
          if (terminado) return;
          terminado = true;
          cart.splice(index, 1);
          guardarCarrito();
          renderizarCarrito();
        };

        trashIcon.addEventListener("animationend", finalizar, { once: true });

        setTimeout(() => {
          finalizar();
        }, 800);
      });
    });

    if (cartTotalElement) cartTotalElement.textContent = "Total: " + formatCurrency(total);
    actualizarBadge();
  }

  // Agregar al carrito
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productCard = button.closest(".product-card");
      const name = productCard.querySelector("h3").innerText;
      const code = productCard.querySelector("h4")?.innerText || "";
      const priceText = productCard.querySelector(".price").innerText;
      const priceNum = parseCurrency(priceText);
      const img = productCard.querySelector("img").src;

      const existente = cart.find(
        (item) => item.name === name && item.code === code
      );

      if (existente) {
        existente.quantity++;
      } else {
        cart.push({
          name,
          code,
          priceNum,
          img,
          quantity: 1,
        });
      }

      guardarCarrito();
      renderizarCarrito();
      mostrarNotificacion(name);
      cartPopup(); // todavía muestra el popup
    });
  });

  // Popup toggle
  const cartButton = document.getElementById("cartButton");
  const cartPopup = document.getElementById("cartPopup");
  const closeCart = document.getElementById("closeCart");

  cartButton.addEventListener("click", () => {
    cartPopup.style.display =
      cartPopup.style.display === "flex" ? "none" : "flex";
  });

  closeCart.addEventListener("click", () => {
    cartPopup.style.display = "none";
  });

  // Botón cotizar WhatsApp
  if (cotizarBtn) {
    cotizarBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
      }

      let mensaje = "¡Hola! Quiero cotizar los siguientes productos:\n\n";
      cart.forEach((item) => {
        mensaje += `- ${item.name} (Código: ${item.code}) (Cantidad: ${item.quantity}) (Precio: L${(item.priceNum * item.quantity).toFixed(2)})\n`;
      });

      const phone = "50497257161";
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, "_blank");
    });
  } 

  // Notificación
  function mostrarNotificacion(nombreProducto) {
    const notification = document.getElementById("cart-notification");
    notification.textContent = `${nombreProducto} agregado al carrito ✅`;
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 2500);
  }

  // Render inicial
  renderizarCarrito();
});


