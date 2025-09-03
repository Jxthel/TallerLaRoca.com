//================Cart item adding, total cost, name, price, product image and item removing JS=======================

document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartTotalElement = document.querySelector(".cart-total");
  const cotizarBtn = document.getElementById("cotizarBtn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function parseCurrency(text) {
    if (typeof text === "number") return text;
    if (!text) return 0;
    const cleaned = text.toString().replace(/[^0-9.,-]/g, ""); 
    const normalized = cleaned.replace(/,/g, "");
    const num = parseFloat(normalized);
    return isNaN(num) ? 0 : num;
  }

  function formatCurrency(num) {
    return "L" + Number(num).toLocaleString("es-HN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateBadge() {
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

  function renderCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>No tienes artículos en tu carrito</p>";
      if (cartTotalElement) cartTotalElement.textContent = "Total: " + formatCurrency(0);
      updateBadge();
      saveCart();
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
          ${item.code ? `<p class="cart-code">Codigo: ${item.code}</p>` : ""}
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
            <span class="remove-label">Eliminar todo</span>
        </button>
      `;

      cartItemsContainer.appendChild(div);

      // Quantity controls
      div.querySelector(".increase").addEventListener("click", () => {
        item.quantity++;
        saveCart();
        renderCart();
      });

      div.querySelector(".decrease").addEventListener("click", () => {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          cart.splice(index, 1);
        }
        saveCart();
        renderCart();
      });

      // Remove button
      div.querySelector(".remove-item").addEventListener("click", () => {
        cart.splice(index, 1);
        saveCart();
        renderCart();
      });
    });

    if (cartTotalElement) cartTotalElement.textContent = "Total: " + formatCurrency(total);

    updateBadge();
  }

  // Add to cart
  addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const productCard = button.closest(".product-card");
    const name = productCard.querySelector("h3").innerText;
    const code = productCard.querySelector("h4")?.innerText || "";
    const priceText = productCard.querySelector(".price").innerText;
    const priceNum = parseCurrency(priceText);
    const img = productCard.querySelector("img").src;

    // check if product already exists (by name + code)
    const existing = cart.find(
      (item) => item.name === name && item.code === code
    );

    if (existing) {
      existing.quantity++;
    } else {
      cart.push({
        name,
        code,
        priceNum,
        img,
        quantity: 1,
      });
    }

    saveCart();
    renderCart();
    showNotification(name);
    cartPopup(); // still shows popup
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


  // WhatsApp cotizar button
  if (cotizarBtn) {
    cotizarBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
      }

      let message = "¡Hola! Quiero cotizar los siguientes productos:\n\n";
      cart.forEach((item) => {
        message += `- ${item.name} (Código: ${item.code}) (Cantidad: ${item.quantity}) (Precio: L${(item.priceNum * item.quantity).toFixed(2)})\n`;
      });

      const phone = "50497257161";
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    });
  } 

  // Notification
  function showNotification(productName) {
    const notification = document.getElementById("cart-notification");
    notification.textContent = `${productName} agregado al carrito ✅`;
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 2500);
  }

  // Initial render
  renderCart();
  
});

