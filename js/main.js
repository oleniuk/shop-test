
//===== BURGER MENU =====
document.addEventListener('DOMContentLoaded', () => {
  const burgerMenu = document.querySelector('.burger-menu');
  const closeMenuButton = document.querySelector('.close-menu');
  const navMenu = document.querySelector('.main-nav');

  // Відкриття меню
  burgerMenu.addEventListener('click', () => {
    navMenu.classList.add('active'); // Додаємо клас active для меню
    if (navMenu) {
      document.body.style.overflow = 'hidden';
  }
  });

  // Закриття меню
  closeMenuButton.addEventListener('click', () => {
    navMenu.classList.remove('active'); // Видаляємо клас active для меню
    document.body.style.overflow = '';
  });
});
//===== END BURGER MENU =====


//===== СТАВИМО КНОПКУ "Перейти до каталогу" ПІД СПИСОК =====
document.addEventListener("DOMContentLoaded", () => {
  const heroButton = document.querySelector(".hero-button-block");
  const heroText = document.querySelector(".hero-text");
  const previewGrid = document.querySelector(".preview-grid");

  const moveHeroButton = () => {
    if (window.innerWidth <= 991) {
      if (heroButton.parentElement === heroText) {
        // Переміщуємо кнопку після preview-grid
        previewGrid.insertAdjacentElement("afterend", heroButton);
      }
    } else {
      if (heroButton.parentElement !== heroText) {
        // Повертаємо кнопку назад у hero-text
        heroText.appendChild(heroButton);
      }
    }
  };

  // Викликаємо функцію при завантаженні сторінки та зміні розміру вікна
  moveHeroButton();
  window.addEventListener("resize", moveHeroButton);
});
//===== END СТАВИМО КНОПКУ "Перейти до каталогу" ПІД СПИСОК =====


//===== ПЛАВНИЙ СКРОЛ ДЛЯ КНОПКИ "Перейти до каталогу" =====
document.addEventListener("DOMContentLoaded", () => {
  const smoothScrollLinks = document.querySelectorAll(".preview-link, .hero-button");

  smoothScrollLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Запобігає стандартному переходу за якірною посиланням
      const targetSection = document.querySelector(link.getAttribute("href"));
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth", // Плавний скрол
          block: "start" // Прокрутка до початку елементу
        });
      }
    });
  });
});
//===== END ПЛАВНИЙ СКРОЛ ДЛЯ КНОПКИ "Перейти до каталогу" =====


//=====КАРТОЧКИ ТОВАРІВ=====
var swiper = new Swiper(".mySwiper", {
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
//=====END КАРТОЧКИ ТОВАРІВ=====


//===== HOVER TO IMAGE CARDS зміна фоток при наведенні =====
document.addEventListener("DOMContentLoaded", function () {
  // Знаходимо всі картки продуктів
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
      const mainImage = card.querySelector('.main-image'); // Головне зображення
      const thumbnailImages = card.querySelectorAll('.thumbnail-images img'); // Всі мініатюри
      const initialImageSrc = mainImage.src; // Початковий стан головного зображення

      // Додаємо події для мініатюр
      thumbnailImages.forEach(thumbnail => {
          // При наведенні на мініатюру
          thumbnail.addEventListener('mouseover', function () {
              mainImage.src = thumbnail.src; // Змінюємо головне зображення
          });

          // При знятті курсора з мініатюри
          thumbnail.addEventListener('mouseout', function () {
              mainImage.src = initialImageSrc; // Відновлюємо початкове зображення
          });
      });
  });
});
//===== END HOVER TO IMAGE CARDS зміна фоток при наведенні =====


//===== POP UP =====
document.addEventListener("DOMContentLoaded", () => {
  let productData = {};

  // Завантаження JSON
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      productData = data;
    })
    .catch((error) => console.error("Помилка завантаження JSON:", error));

  // Слухаємо кліки на кнопки
  document.addEventListener("click", (e) => {
    const popup = document.getElementById("universal-popup");

    if (e.target.classList.contains("dropdown-btn")) {
      const productCard = e.target.closest(".product-card");
      const productId = productCard.dataset.productId; // ID товару
      const popupType = e.target.dataset.popupType; // Тип попапу: specs чи bundle

      if (productData[productId]) {
        const product = productData[productId];
        const popupTitle = popup.querySelector(".popup-title");
        const popupContent = popup.querySelector(".popup-content");

        // Наповнюємо попап
        popupTitle.textContent =
          popupType === "specs"
            ? `Характеристики: ${product.name}`
            : `Комплект поставки: ${product.name}`;
        popupContent.innerHTML = ""; // Очищаємо старі дані

        const data = popupType === "specs" ? product.specs : product.bundle;

        // Генерація таблиці
        data.forEach((item) => {
          const row = document.createElement("tr");
          if (popupType === "specs") {
            row.innerHTML = `<td class="text-position">${item.label}:</td>
                             <td class="text-description">${item.value}</td>`;
          } else if (popupType === "bundle") {
            row.innerHTML = `<td class="text-position"><img src="${item.icon}" alt=""></td>
                             <td class="text-description">${item.description}</td>`;
          }
          popupContent.appendChild(row);
        });

        // Додаємо жовті лінії
        addYellowLinesToTable(popupContent);

        // Відкриваємо попап з анімацією
        openPopup(popup);

        // Блокування скролу сторінки
        document.body.style.overflow = "hidden";
      } else {
        console.error("Товар із таким ID не знайдено:", productId);
      }
    }

    // Закриття попапу при кліку на хрестик або на порожнє поле
    if (e.target.id === "close-popup" || e.target.classList.contains("popup-overlay")) {
      closePopup(popup);
    }
  });

  // Функція для додавання жовтих ліній
  function addYellowLinesToTable(tableElement) {
    const rows = tableElement.querySelectorAll("tr");
    rows.forEach((row, index) => {
      if (index % 2 !== 0) {
        row.classList.add("yellow-line");
      }
    });
  }

  // Функція відкриття попапу з анімацією
  function openPopup(popup) {
    popup.classList.add("active");
    popup.style.visibility = "visible";
    popup.style.opacity = "1"; // Плавно показуємо попап
  }

  // Функція закриття попапу з анімацією
  function closePopup(popup) {
    popup.style.opacity = "0"; // Плавно ховаємо попап
    setTimeout(() => {
      popup.classList.remove("active");
      popup.style.visibility = "hidden";
    }, 300); // Час, що відповідає CSS transition

    // Відновлення скролу сторінки
    document.body.style.overflow = "auto";
  }
});
//===== END POP UP =====


//===== POP UP ТОВАР ДОДАНО У КОРЗИНУ =====
document.addEventListener("DOMContentLoaded", () => {
  const cartNotification = document.getElementById("cart-notification");

  function showNotification() {
    cartNotification.classList.remove("hidden");
    cartNotification.classList.add("show");

    setTimeout(() => {
      cartNotification.classList.remove("show");
      setTimeout(() => {
        cartNotification.classList.add("hidden");
      }, 500);
    }, 1000); // Тривалість показу повідомлення 2 секунди
  }

  // Обробка кліків на кнопки
  document.querySelectorAll(".order-btn, .order-btn-preorder, .popup-order-btn").forEach((button) => {
    button.addEventListener("click", () => {
      showNotification();
    });
  });
});
//===== END POP UP ТОВАР ДОДАНО У КОРЗИНУ =====


//===== Фотки в залежності від вибраного кольору =====
document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const mainImage = card.querySelector('.main-image'); // Головне зображення
        const thumbnails = card.querySelector('.thumbnail-images'); // Блок мініатюр
        const colorOptions = card.querySelectorAll('.color-circle'); // Опції кольорів
        const productId = card.dataset.productId; // Унікальний ID товару (starlight, moonlight, тощо)

        // Функція для оновлення мініатюр та головного зображення
        function updateImages(color) {
            // Оновлення головного зображення
            mainImage.src = `image/keyboard/${productId}/${productId}-main-${color}.png`;
            mainImage.alt = `${color} ${productId} main image`;

            // Оновлення мініатюр
            const images = generateThumbnailImages(productId, color);
            thumbnails.innerHTML = ''; // Очищаємо попередні зображення

            // Якщо мініатюри є, додаємо тільки доступні
            if (images.length > 0) {
                images.forEach((src, index) => {
                    const thumbnail = document.createElement('img');
                    thumbnail.src = src;
                    thumbnail.alt = `${color} Thumbnail ${index + 1}`;
                    thumbnail.classList.add('thumbnail');
                    thumbnails.appendChild(thumbnail);
                });

                // Додаємо події для мініатюр
                const thumbnailImages = thumbnails.querySelectorAll('img');
                const initialImageSrc = mainImage.src; // Початковий стан головного зображення

                thumbnailImages.forEach(thumbnail => {
                    // При наведенні на мініатюру
                    thumbnail.addEventListener('mouseover', () => {
                        mainImage.src = thumbnail.src; // Змінюємо головне зображення
                    });

                    // При знятті курсора з мініатюри
                    thumbnail.addEventListener('mouseout', () => {
                        mainImage.src = initialImageSrc; // Відновлюємо початкове зображення
                    });
                });
            }
        }

        // Автоматично вибираємо перший активний колір
        if (colorOptions.length > 0) {
            const defaultColorOption = colorOptions[0]; // Перший елемент
            const defaultColor = defaultColorOption.dataset.color;

            // Встановлюємо перший колір як активний
            defaultColorOption.classList.add('active');

            // Оновлюємо зображення для першого кольору
            updateImages(defaultColor);
        }

        // Додаємо події для вибору кольору
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                const selectedColor = option.dataset.color; // Отримуємо вибраний колір

                // Знімаємо клас 'active' з усіх кольорів
                colorOptions.forEach(c => c.classList.remove('active'));
                // Додаємо клас 'active' до вибраного кольору
                option.classList.add('active');

                // Оновлюємо зображення для вибраного кольору
                updateImages(selectedColor);
            });
        });
    });

    /**
     * Генерує список зображень для мініатюр на основі товару та кольору.
     * Максимум 3 зображення.
     * @param {string} productId ID товару (наприклад, starlight).
     * @param {string} color Вибраний колір.
     * @returns {string[]} Масив шляхів до доступних зображень.
     */
    function generateThumbnailImages(productId, color) {
        const maxThumbnails = 3; // Максимальна кількість мініатюр
        const availableImages = [];

        for (let i = 1; i <= maxThumbnails; i++) {
            const imgPath = `image/keyboard/${productId}/${productId}-${i}-${color}.png`;

            // Додаємо тільки існуючі зображення
            if (imageExists(imgPath)) {
                availableImages.push(imgPath);
            }
        }

        return availableImages;
    }

    /**
     * Перевіряє, чи існує зображення за заданим шляхом.
     * @param {string} src Шлях до зображення.
     * @returns {boolean} true, якщо зображення існує.
     */
    function imageExists(src) {
        const http = new XMLHttpRequest();
        http.open('HEAD', src, false);
        http.send();
        return http.status === 200;
    }
});
//===== END Фотки в залежності від вибраного кольору =====











//=====FAQ SECTION=====
document.addEventListener('DOMContentLoaded', function () {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
      const answer = item.querySelector('.answer');

      item.addEventListener('click', () => {
          // Якщо елемент відкритий, закриваємо його
          if (item.classList.contains('open')) {
              item.classList.remove('open');
              answer.style.height = '0';
          } else {
              // Закриваємо всі інші FAQ-елементи, якщо потрібна тільки одна відкрита відповідь
              faqItems.forEach(i => {
                  i.classList.remove('open');
                  i.querySelector('.answer').style.height = '0';
              });

              // Відкриваємо вибраний елемент
              item.classList.add('open');
              answer.style.height = answer.scrollHeight + 'px'; // Встановлюємо висоту відповідно до контенту
          }
      });
  });
});
//=====END FAQ SECTION=====


//===== ПРАВИЛЬНИЙ ВВОД ТЕЛЕФОНУ =====
document.addEventListener("DOMContentLoaded", () => {
  const phoneInput = document.getElementById("phone-input");
  const phoneWarning = document.getElementById("phone-warning");

  // Максимальна кількість цифр для формату +380 (XX) XXX-XX-XX
  const maxDigits = 12;

  // Функція для форматування номера телефону
  function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, ""); // Залишаємо лише цифри

    if (cleaned.length === 0) {
      return ""; // Пустий ввід
    }

    // Форматуємо у вигляді +380 (XX) XXX-XX-XX
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{0,2})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}${match[5] ? `-${match[5]}` : ""}`;
    }

    if (cleaned.length <= 3) return `+${cleaned}`;
    if (cleaned.length <= 5) return `+${cleaned.slice(0, 3)} (${cleaned.slice(3)}`;
    if (cleaned.length <= 8) return `+${cleaned.slice(0, 3)} (${cleaned.slice(3, 5)}) ${cleaned.slice(5)}`;
    if (cleaned.length <= 10) return `+${cleaned.slice(0, 3)} (${cleaned.slice(3, 5)}) ${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
    
    return phoneNumber; // Якщо не підходить під формат
  }

  // Функція перевірки валідності
  function validatePhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, ""); // Очищуємо від нечислових символів
    return cleaned.length === maxDigits && phoneNumber.startsWith("+380"); // Перевіряємо кількість цифр та формат
  }

  // Обробник вводу
  phoneInput.addEventListener("input", (event) => {
    let input = event.target.value;

    // Очищаємо від нечислових символів для перевірки
    const cleaned = input.replace(/\D/g, "");

    // Забороняємо вводити більше, ніж maxDigits
    if (cleaned.length > maxDigits) {
      input = formatPhoneNumber(cleaned.slice(0, maxDigits));
    } else {
      input = formatPhoneNumber(cleaned);
    }

    // Форматуємо номер
    phoneInput.value = input;

    // Під час вводу не показуємо помилку
    phoneWarning.style.display = "none";
  });

  // Обробник втрати фокусу
  phoneInput.addEventListener("blur", () => {
    const cleaned = phoneInput.value.replace(/\D/g, "");
    if (!validatePhoneNumber(phoneInput.value)) {
      phoneWarning.style.display = "inline"; // Показуємо помилку лише після втрати фокусу
    }
  });

  // При повторному фокусі на полі ховаємо помилку
  phoneInput.addEventListener("focus", () => {
    phoneWarning.style.display = "none";
  });
});

//===== END ПРАВИЛЬНИЙ ВВОД ТЕЛЕФОНУ =====