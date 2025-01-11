document.addEventListener("DOMContentLoaded", () => {
  const cartSticker = document.getElementById("cart-sticker");
  const cartPopupOverlay = document.getElementById("cart-popup-overlay");
  const cartPopup = document.getElementById("cart-popup");
  const cartItemsList = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const closeCartButton = document.getElementById("close-cart");
  const recommendedProducts = document.getElementById("recommended-products");
  const continueShoppingButton = document.querySelector(".cart-popup-btn-left");
  const proceedToOrderButton = document.querySelector(".cart-popup-btn-right");

  // Створюємо елемент для підсумкової вартості
  const totalBlock = document.createElement("div");
  totalBlock.id = "cart-total";

  // Додаємо кнопку очистити корзину
  const clearCartButton = document.createElement("p");
  clearCartButton.id = "clear-cart";
  clearCartButton.textContent = "Очистити корзину";
  clearCartButton.style.marginTop = "10px";

  // Зчитування корзини з localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Якщо корзина не порожня, показуємо стікер
  if (cart.length > 0) {
    cartSticker.classList.remove("hidden");
    updateCart();
  }

  // Додаємо події на кнопки "Оформити замовлення"
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("order-btn")) {
      const productCard = event.target.closest(".product-card");
      const productId = productCard.dataset.productId;
      const productName = productCard.querySelector(".product-title-name").innerText;
      const productTitle = productCard.querySelector(".product-title-type").innerText;
      const productType = productCard.querySelector(".product-title-type").innerText; //цей по суті не треба
      const productPrice = parseFloat(productCard.querySelector(".current-price").innerText.replace(" грн", ""));
      const productOldPrice = parseFloat(productCard.querySelector(".old-price")?.innerText.replace(" грн", "") || 0);
      const productImage = productCard.querySelector(".main-image").src;
      const selectedColor = productCard.querySelector(".color-circle.active")?.dataset.color || "default";

      // Перевірка, чи товар вже в корзині
      const existingItem = cart.find(item => item.id === productId && item.color === selectedColor);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        const product = {
          id: productId,
          name: productName,
          title: productTitle,
          type: productType,
          price: productPrice,
          oldPrice: productOldPrice,
          image: productImage,
          color: selectedColor,
          quantity: 1,
        };
        cart.push(product);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      cartSticker.classList.remove("hidden");
      updateCart();
    }
  });




// 1. Функція addToCart (універсальна для обох кнопок):
function addToCart(productId, productName, productTitle, productPrice, productOldPrice, productImage, selectedColor) {
  const existingItem = cart.find(item => item.id === productId && item.color === selectedColor);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    const product = {
      id: productId,
      name: productName,
      title: productTitle,
      price: productPrice,
      oldPrice: productOldPrice,
      image: productImage,
      color: selectedColor,
      quantity: 1,
    };
    cart.push(product);
  }

  // Зберігаємо корзину і оновлюємо інтерфейс
  localStorage.setItem("cart", JSON.stringify(cart));
  cartSticker.classList.remove("hidden");
  updateCart();
}

// 2. Подія для кнопки popup-order-btn (у попапі):
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("popup-order-btn")) {
    const popup = document.getElementById("universal-popup");
    const productId = popup.dataset.productId;
    const productName = popup.querySelector(".popup-title").textContent.split(":")[1]?.trim() || "Unknown Product";
    const productTitle = popup.querySelector(".popup-title").textContent.split(":")[0]?.trim() || "Product Specs";
    const productPrice = parseFloat(popup.dataset.productPrice || "0");
    const productOldPrice = parseFloat(popup.dataset.productOldPrice || "0");
    const productImage = popup.dataset.productImage || "";
    const selectedColor = popup.dataset.selectedColor || "default";

    addToCart(productId, productName, productTitle, productPrice, productOldPrice, productImage, selectedColor);
  }
});

// 3. Додавання даних до попапу:
function openPopup(productId, productPrice, productOldPrice, productImage, selectedColor) {
  const popup = document.getElementById("universal-popup");
  popup.dataset.productId = productId;
  popup.dataset.productPrice = productPrice;
  popup.dataset.productOldPrice = productOldPrice;
  popup.dataset.productImage = productImage;
  popup.dataset.selectedColor = selectedColor;

  // Відкриваємо попап
  popup.classList.add("active");
  document.body.classList.add("no-scroll");
}

// 4. Відкриття попапу з даними товару:
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("dropdown-btn")) {
    const productCard = event.target.closest(".product-card");
    if (!productCard) return;

    const productId = productCard.dataset.productId;
    const productPrice = parseFloat(productCard.querySelector(".current-price").innerText.replace(" грн", ""));
    const productOldPrice = parseFloat(productCard.querySelector(".old-price")?.innerText.replace(" грн", "") || 0);
    const productImage = productCard.querySelector(".main-image").src;
    const selectedColor = productCard.querySelector(".color-circle.active")?.dataset.color || "default";

    openPopup(productId, productPrice, productOldPrice, productImage, selectedColor);
  }
});






  // Оновлення корзини
  function updateCart() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    cartItemsList.innerHTML = "";

    cart.forEach((item, index) => {
        const itemTotalPrice = item.price;
        const itemTotalOldPrice = item.oldPrice;

        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <div class="between">
            <div class="recommended-products-block-base">
              <img src="${item.image}" alt="${item.name}">

              <div class="your-order_text-block">
                  <strong style="color: #fff;">${item.title || ""}</strong><br>
                  <strong style="color: #FFB300;">${item.name}</strong><br>
                  Колір: ${item.color}<br>
              </div>
            </div>

            <div class="recommended-products-block-base">
              <div class="your-order_amount-block">${item.quantity} шт.</div>
              <div class="your-order_price-block">
                  <button class="remove-item" data-index="${index}">✖</button>
                  ${itemTotalPrice.toFixed(0)} грн <br>
                  ${item.oldPrice ? `<span class="recommended-products-old-price-secondary">${itemTotalOldPrice.toFixed(0)} грн</span>` : ""}
              </div>
            </div>
          </div>
        `;
        cartItemsList.appendChild(listItem);
    });

    totalBlock.innerHTML = `
        <h4>Підсумкова вартість: <strong>${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(0)} грн</strong></h4>
    `;
    cartItemsList.insertAdjacentElement("afterend", totalBlock);
    cartItemsList.parentNode.appendChild(clearCartButton);

    document.querySelectorAll(".remove-item").forEach(button => {
      button.addEventListener("click", () => {
          const index = button.dataset.index;
  
          // Отримуємо видалений товар
          const removedItem = cart[index];
  
          if (removedItem) {
              // Видаляємо товар із кошика
              cart = cart.filter((item, idx) => idx !== parseInt(index));
              localStorage.setItem("cart", JSON.stringify(cart));
  
              // Оновлюємо кількість у блоці рекомендованих товарів
              const productName = removedItem.name;
              const recommendedProductsList = document.querySelectorAll("#recommended-products li");
  
              recommendedProductsList.forEach(listItem => {
                  const nameElement = listItem.querySelector(".recommended-products-name");
                  if (nameElement && nameElement.textContent.trim() === productName) {
                      const quantitySpan = listItem.querySelector(".quantity");
                      if (quantitySpan) {
                          quantitySpan.textContent = "0"; // Обнуляємо кількість
                      }
                  }
              });
  
              // Оновлюємо корзину
              updateCart();
  
              // Приховуємо стікер, якщо корзина порожня
              if (cart.length === 0) {
                  cartSticker.classList.add("hidden");
              }
          }
      });
  });
  
  }


  // Очищення всієї корзини та обнулення quantity
  clearCartButton.addEventListener("click", () => {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();

    // Скидання кількості в рекомендованих товарах
    recommendedProducts.querySelectorAll(".quantity").forEach(quantitySpan => {
      quantitySpan.textContent = "0";
    });

    cartSticker.classList.add("hidden");
  });

  // Функція для збереження кількості товарів у localStorage
function saveRecommendedProductsQuantities() {
  const quantities = {};
  cart.forEach((item) => {
    const key = `${item.name}_${item.color}`;
    quantities[key] = item.quantity;
  });
  localStorage.setItem("recommendedQuantities", JSON.stringify(quantities));
}

// Функція для відновлення кількості товарів із localStorage
function restoreRecommendedProductsQuantities() {
  const quantities = JSON.parse(localStorage.getItem("recommendedQuantities")) || {};
  const recommendedProductItems = document.querySelectorAll("#recommended-products li");

  recommendedProductItems.forEach((listItem) => {
    const productName = listItem.querySelector(".recommended-products-name").innerText.trim();
    const productColor = listItem.querySelector(".recommended-products-info").textContent.split('Колір: ')[1]?.trim() || "default";
    const quantitySpan = listItem.querySelector(".quantity");
    const key = `${productName}_${productColor}`;

    // Встановлюємо кількість, якщо вона збережена, або залишаємо 0
    quantitySpan.textContent = quantities[key] || "0";
  });
}

// Обробка додавання/зменшення кількості в recommended-products
recommendedProducts.addEventListener("click", (event) => {
  const target = event.target;

  // Знаходимо елемент товару
  const listItem = target.closest("li");
  if (!listItem) return;

  // Отримуємо дані товару
  const productName = listItem.querySelector(".recommended-products-name").innerText.trim();
  const productTitle = listItem.querySelector(".recommended-products-title").innerText.trim();
  const productColor = listItem.querySelector(".recommended-products-info").textContent.split('Колір: ')[1]?.trim() || "default";
  const productPrice = parseFloat(listItem.querySelector(".recommended-products-current-price").innerText.replace(" грн", ""));
  const productImage = listItem.querySelector("img").src;
  const quantitySpan = listItem.querySelector(".quantity");
  let quantity = parseInt(quantitySpan.textContent, 10);

  if (target.classList.contains("increase-qty")) {
    quantity++;
    const existingItem = cart.find((item) => item.name === productName && item.color === productColor);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({
        name: productName,
        title: productTitle,
        color: productColor,
        price: productPrice,
        image: productImage,
        quantity: 1,
      });
    }
  } else if (target.classList.contains("decrease-qty") && quantity > 0) {
    quantity--;
    const existingItem = cart.find((item) => item.name === productName && item.color === productColor);
    if (existingItem) {
      existingItem.quantity--;
      if (existingItem.quantity <= 0) {
        cart = cart.filter((item) => item !== existingItem);
      }
    }
  }

  quantitySpan.textContent = quantity;

  // Оновлюємо localStorage і кошик
  saveRecommendedProductsQuantities();
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
});

// Відновлення стану recommended-products при завантаженні сторінки
document.addEventListener("DOMContentLoaded", () => {
  cart = JSON.parse(localStorage.getItem("cart")) || []; // Завантажуємо кошик
  updateCart(); // Оновлюємо кошик
  restoreRecommendedProductsQuantities(); // Відновлюємо кількість у recommended-products
});


  // Функція для блокування або розблокування скролу
function updateScrollLock() {
  const isCartPopupOpen = !cartPopupOverlay.classList.contains("hidden");
  const isOrderPopupOpen = !document.getElementById("order-popup-overlay").classList.contains("hidden");

  if (isCartPopupOpen || isOrderPopupOpen) {
      document.body.classList.add("no-scroll");
  } else {
      document.body.classList.remove("no-scroll");
  }
}

// Закриття попапа при кліку на фон
cartPopupOverlay.addEventListener("click", (e) => {
  if (e.target === cartPopupOverlay) {
      cartPopupOverlay.classList.add("hidden");
      updateScrollLock(); // Оновлюємо блокування скролу
  }
});

// Закриття попапа кнопкою "ПРОДОВЖИТИ ПОКУПКИ"
continueShoppingButton.addEventListener("click", () => {
  cartPopupOverlay.classList.add("hidden");
  updateScrollLock(); // Оновлюємо блокування скролу
});

// Відкриття/закриття попапа корзини
cartSticker.addEventListener("click", () => {
  cartPopupOverlay.classList.toggle("hidden");
  updateScrollLock(); // Оновлюємо блокування скролу
});

closeCartButton.addEventListener("click", () => {
  cartPopupOverlay.classList.add("hidden");
  updateScrollLock(); // Оновлюємо блокування скролу
});

proceedToOrderButton.addEventListener("click", () => {
  const orderPopupOverlay = document.getElementById("order-popup-overlay");
  const orderCartItems = document.getElementById("order-cart-items");
  const totalBlockClone = totalBlock.cloneNode(true); // Клон блоку "Підсумкова вартість"

  // Копіюємо вміст корзини до попапу "ОФОРМЛЕННЯ ЗАМОВЛЕННЯ"
  orderCartItems.innerHTML = cartItemsList.innerHTML;

  // Додаємо "Підсумкову вартість" після списку замовлення
  const existingTotalBlock = document.getElementById("order-total-block");
  if (existingTotalBlock) {
    existingTotalBlock.remove(); // Видаляємо попередній блок, якщо є
  }
  totalBlockClone.id = "order-total-block"; // Унікальний ID для блоку в попапі оформлення замовлення
  orderCartItems.appendChild(totalBlockClone);

  // Додаємо обробники для видалення товарів у попапі оформлення замовлення
  orderCartItems.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", () => {
      const index = button.dataset.index;

      // Видаляємо товар із корзини
      const removedItem = cart[index]; // Зберігаємо дані видаленого товару
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));

      // Обнуляємо кількість товару у відповідному блоці
      if (removedItem) {
        const productName = removedItem.name;
        const recommendedProductsList = document.querySelectorAll("#recommended-products li");

        recommendedProductsList.forEach((listItem) => {
          const nameElement = listItem.querySelector(".recommended-products-name");
          if (nameElement && nameElement.textContent.trim() === productName) {
            const quantitySpan = listItem.querySelector(".quantity");
            if (quantitySpan) {
              quantitySpan.textContent = "0"; // Обнуляємо кількість
            }
          }
        });
      }

      // Оновлюємо кількість у головній корзині
      updateCartQuantities();

      // Оновлюємо основну корзину і попап
      updateCart();
      proceedToOrderButton.click(); // Перезапускаємо синхронізацію попапа
    });
  });

  // Відображаємо попап "ОФОРМЛЕННЯ ЗАМОВЛЕННЯ"
  orderPopupOverlay.classList.remove("hidden");
  document.body.classList.add("no-scroll");
});

// Функція для оновлення кількості товарів
function updateCartQuantities() {
  const recommendedProducts = document.querySelectorAll(".recommended-products-block");
  recommendedProducts.forEach((productBlock) => {
    const productName = productBlock.querySelector(".recommended-products-name").innerText;
    const productQuantity = cart.find((item) => item.name === productName)?.quantity || 0;
    const quantitySpan = productBlock.querySelector(".quantity");
    if (quantitySpan) {
      quantitySpan.textContent = productQuantity;
    }
  });
}


// Закриття попапу "ОФОРМЛЕННЯ ЗАМОВЛЕННЯ"
document.getElementById("close-order-popup").addEventListener("click", () => {
  const orderPopupOverlay = document.getElementById("order-popup-overlay");
  orderPopupOverlay.classList.add("hidden");
  updateScrollLock(); // Оновлюємо блокування скролу
});

// Закриття попапу "ОФОРМЛЕННЯ ЗАМОВЛЕННЯ" при кліку на фон
document.getElementById("order-popup-overlay").addEventListener("click", (event) => {
  if (event.target === document.getElementById("order-popup-overlay")) {
      const orderPopupOverlay = document.getElementById("order-popup-overlay");
      orderPopupOverlay.classList.add("hidden");
      updateScrollLock(); // Оновлюємо блокування скролу
  }
});


  // Обробка форми "ОФОРМЛЕННЯ ЗАМОВЛЕННЯ"
  document.getElementById("order-form").addEventListener("submit", (event) => {
    event.preventDefault(); // Запобігаємо стандартній поведінці форми

    const formData = new FormData(event.target);
    const orderData = {
      name: formData.get("name"),
      surname: formData.get("surname"),
      phone: formData.get("phone"),
      city: formData.get("city"),
      novaPost: formData.get("novaPost"),
      items: cart, // Масив із товарами з корзини
    };

    console.log("Замовлення підтверджено:", orderData);
    alert("Дякуємо за замовлення!");

    // Очищення форми
    event.target.reset();

    // Закриваємо попап "ОФОРМЛЕННЯ ЗАМОВЛЕННЯ"
    document.getElementById("order-popup-overlay").classList.add("hidden");
    document.body.classList.remove("no-scroll");

    // Очищення корзини після підтвердження
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  });

});

// Функція для показу 0 в к-ті доп. товарів, якщо їх немає в корзині
function getQuantityFromStorage(productName) {
  const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = storedCart.find(item => item.name === productName);
  return product ? product.quantity : 0;
}

// Функція для завантаження додаткових товарів із JSON
function loadRecommendedProducts() {
  fetch("dop-products.json")
    .then(response => response.json())
    .then(products => {
      const productContainer = document.getElementById("recommended-products");

      products.forEach(product => {
        const productHTML = `
          <li>
            <div class="recommended-products-block">
              <div class="recommended-products-block-base">
                <img src="${product.image}" alt="${product.name}" class="recommended-products-image" />
                <div class="recommended-products-info">
                  <strong>
                    <span class="recommended-products-title" style="color: #191919;">${product.title}</span><br>
                    <span class="recommended-products-name"  style="color: #FFB300;">${product.name}</span> 
                  </strong>
                  <br> Колір: ${product.color}<br>
                </div>
              </div>

              <div class="your-order_price-block">
                <span class="recommended-products-current-price">${product.price} грн</span>
                <span class="recommended-products-old-price">${product.oldPrice} грн</span>
              </div>
            </div>

            <div class="quantity-block">
              <button class="decrease-qty">−</button>
              <span class="quantity">${getQuantityFromStorage(product.name)}</span>
              <button class="increase-qty">+</button>
            </div>
          </li>
        `;
        productContainer.innerHTML += productHTML;
      });
    })
    .catch(error => console.error("Помилка завантаження товарів:", error));
}

// Виклик функції при завантаженні сторінки
document.addEventListener("DOMContentLoaded", loadRecommendedProducts);



// БЛОКУВАННЯ СКРОЛУ ПРИ ВІДКРИТІЙ КОРЗИНІ
document.addEventListener("DOMContentLoaded", () => {
  const cartSticker = document.getElementById("cart-sticker");
  const cartPopupOverlay = document.getElementById("cart-popup-overlay");
  const closeCartButton = document.getElementById("close-cart");
  const continueShoppingButton = document.querySelector(".cart-popup-btn-left");

  let scrollPosition = 0;

  // Функція для блокування скролу
  function lockScroll() {
    scrollPosition = window.scrollY; // Зберігаємо поточну позицію скролу
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";
  }

  // Функція для розблокування скролу
  function unlockScroll() {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollPosition); // Повертаємося на попередню позицію скролу
  }

  // Оновлення блокування скролу
  function updateScrollLock() {
    const isCartPopupOpen = !cartPopupOverlay.classList.contains("hidden");
    if (isCartPopupOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }

  // Відкрити корзину
  cartSticker.addEventListener("click", () => {
    cartPopupOverlay.classList.remove("hidden");
    updateScrollLock();
  });

  // Закрити корзину при кліку на хрестик
  closeCartButton.addEventListener("click", () => {
    cartPopupOverlay.classList.add("hidden");
    updateScrollLock();
  });

  // Закрити корзину при кліку "Продовжити покупки"
  continueShoppingButton.addEventListener("click", () => {
    cartPopupOverlay.classList.add("hidden");
    updateScrollLock();
  });

  // Закрити корзину при кліку на фон
  cartPopupOverlay.addEventListener("click", (e) => {
    if (e.target === cartPopupOverlay) {
      cartPopupOverlay.classList.add("hidden");
      updateScrollLock();
    }
  });
});
// END БЛОКУВАННЯ СКРОЛУ ПРИ ВІДКРИТІЙ КОРЗИНІ





















