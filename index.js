document.addEventListener("DOMContentLoaded", () => {
  loadLinesAndProducts();

  // Завантаження лінійок і продуктів
  async function loadLinesAndProducts() {
      try {
          const [linesRes, productsRes] = await Promise.all([
              fetch("https://vps-kondordevice.onrender.com/api/lines"),
              fetch("https://vps-kondordevice.onrender.com/api/products"),
          ]);

          if (!linesRes.ok || !productsRes.ok) {
              throw new Error("Помилка завантаження лінійок або продуктів");
          }

          const lines = await linesRes.json();
          const products = await productsRes.json();

          displayLinesAndProducts(lines, products);
      } catch (error) {
          console.error("Помилка завантаження даних:", error);
      }
  }

  // Відображення лінійок і продуктів
  function displayLinesAndProducts(lines, products) {
    const container = document.getElementById("lines-container");
    container.innerHTML = ""; // Очистити старі дані

    lines.forEach((line) => {
        // Створити контейнер для лінійки
        const lineContainer = document.createElement("div");
        lineContainer.classList.add("product-container");
        lineContainer.id = `line-${line._id}`;
        lineContainer.innerHTML = `
            <h2>${line.name}</h2>
            <div class="slider-wrapper">
                <div class="swiper mySwiper">
                    <div class="swiper-wrapper" id="line-products-${line._id}">
                        <!-- Продукти будуть завантажені сюди -->
                    </div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-pagination"></div>
                </div>
            </div>
        `;
        container.appendChild(lineContainer);

        // Завантажити продукти для цієї лінійки
        const lineProducts = products.filter(product => {
            const productLineId = product.lineId._id || product.lineId.toString(); // Врахувати можливість об'єкта або рядка
            return productLineId === line._id.toString();
        });

        console.log(`Продукти для лінійки ${line._id}:`, lineProducts);

        displayProducts(lineProducts, line._id);
    });

    initSwipers();
}

  // Відображення продуктів у конкретній лінійці
  function displayProducts(products, lineId) {
    const lineProductsContainer = document.getElementById(`line-products-${lineId}`);
    if (!lineProductsContainer) {
        console.warn(`Контейнер для лінійки ${lineId} не знайдено`);
        return;
    }

    lineProductsContainer.innerHTML = ""; // Очистити старі продукти

    products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card", "swiper-slide");
        productCard.setAttribute("data-product-id", product._id);
        productCard.innerHTML = `
            <div class="product-images">
                <img class="main-image" src="${product.image || ''}" alt="${product.name}">
                <div class="thumbnail-images" src="${thumbnail.images || ''}" alt="${thumbnail.images}"></div>
            </div>

            <div class="product-details">
                <h3 class="product-title">
                    <span class="product-title-type">${product.type}</span><br>
                    <span class="product-title-name">${product.name}</span>
                </h3>

                <div class="color-options">
                    <span class="color-circle ${product.color}" data-color="${product.color}"></span>
                </div>

                <div class="product-price">
                    <span class="current-price">${product.price} ГРН</span>

                    <div class="price-info-block">
                        ${product.discount > 0 ? `
                        <span class="discount-info">Економія: ${product.discount}%</span>
                        <span class="old-price">${(product.price / (1 - product.discount / 100)).toFixed(2)} ГРН</span>
                        ` : ""}
                    </div>
                </div>

                <div class="dropdown-buttons">
                    <p class="dropdown-btn" data-popup-type="specs">
                      Характеристики
                      <svg class="arrow-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </p>
      
                    <p class="dropdown-btn" data-popup-type="bundle">
                      Комплект поставки
                      <svg class="arrow-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </p>
                </div>

                <button class="order-btn">Оформити замовлення</button>
            </div>
        `;

        // Додати продукт у контейнер лінійки
        lineProductsContainer.appendChild(productCard);
    });
}




  // Ініціалізація Swiper для слайдерів
  function initSwipers() {
      document.querySelectorAll(".swiper").forEach((swiperContainer) => {
          new Swiper(swiperContainer, {
              slidesPerView: "auto", // Динамічна ширина слайдів
    centeredSlides: true,  // Центрування активного слайду
    loop: true,            // Зациклення слайдів
    spaceBetween: 30,      // Відстань між слайдами

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    breakpoints: {
      // Якщо ширина екрану менше 440px
      0: { // для всіх пристроїв з шириною екрану >= 0
          spaceBetween: 10,
      },
      440: { // для пристроїв з шириною екрану >= 440px
          spaceBetween: 30,
      }
  }
          });
      });
  }
});
