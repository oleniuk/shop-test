document.addEventListener("DOMContentLoaded", () => {
    loadLines();
    loadProducts();

// Додавання нової лінійки
document.getElementById("add-line-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const lineNameInput = document.getElementById("line-name");

    if (!lineNameInput) {
        console.error("Елемент введення 'line-name' не знайдено.");
        return;
    }

    const lineName = lineNameInput.value.trim();

    if (!lineName) {
        alert("Назва лінійки не може бути порожньою");
        return;
    }

    try {
        const res = await fetch("https://vps-kondordevice.onrender.com/api/lines", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: lineName }),
        });

        if (res.ok) {
            alert("Лінійку створено");
            lineNameInput.value = ""; // Очистити поле вводу
            loadLines(); // Перезавантажити список лінійок
        } else {
            const errorText = await res.text();
            console.error("Помилка створення лінійки:", errorText);
            alert("Помилка створення лінійки. Спробуйте ще раз.");
        }
    } catch (error) {
        console.error("Помилка створення лінійки:", error);
        alert("Помилка з'єднання. Перевірте підключення до інтернету.");
    }
});

    // Додавання нового продукту
    document.getElementById("add-product-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const lineId = document.getElementById("product-line").value.trim();
        const type = document.getElementById("product-type").value.trim();
        const name = document.getElementById("product-name").value.trim();
        const price = parseFloat(document.getElementById("product-price").value.trim());
        const discount = parseFloat(document.getElementById("product-discount").value.trim()) || 0;
        const discountedPrice = (price - (price * discount) / 100).toFixed(2);
        const mainImage = document.getElementById("product-main-image").value.trim();
        const additionalImages = Array.from(document.querySelectorAll(".additional-image-input"))
            .map(input => input.value.trim())
            .filter(image => image);
        const colors = Array.from(document.querySelectorAll(".color-input-container")).map(container => ({
            hex: container.querySelector(".color-hex").value.trim(),
            name: container.querySelector(".color-name").value.trim(),
        }));
        const specs = Array.from(document.querySelectorAll(".specs-item")).map(item => item.value.trim()).filter(spec => spec);
        const bundle = Array.from(document.querySelectorAll(".bundle-item")).map(item => item.value.trim()).filter(bundleItem => bundleItem);
        const mainButton = document.querySelector('input[name="main-button"]:checked').value;

        if (!lineId || !type || !name || isNaN(price) || price <= 0 || !mainImage) {
            alert("Будь ласка, заповніть усі обов'язкові поля");
            return;
        }

        try {
            const res = await fetch("https://vps-kondordevice.onrender.com/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    lineId,
                    type,
                    name,
                    price,
                    discount,
                    discountedPrice,
                    mainImage,
                    additionalImages,
                    colors,
                    specs,
                    bundle,
                    mainButton,
                }),
            });

            if (res.ok) {
                alert("Продукт створено");
                document.getElementById("add-product-form").reset();
                document.getElementById("colors-container").innerHTML = ""; // Очистити кольори
                document.getElementById("additional-images-container").innerHTML = ""; // Очистити додаткові зображення
                document.getElementById("specs-container").innerHTML = ""; // Очистити характеристики
                document.getElementById("bundle-container").innerHTML = ""; // Очистити комплектацію
            } else {
                alert("Помилка створення продукту");
            }
        } catch (error) {
            console.error("Помилка створення продукту:", error);
        }
    });

    // Додавання кольору
    document.getElementById("add-color").addEventListener("click", () => {
        const colorContainer = document.createElement("div");
        colorContainer.classList.add("color-input-container");
        colorContainer.innerHTML = `
            <input type="color" class="color-hex">
            <input type="text" class="color-name" placeholder="Назва кольору">
        `;
        document.getElementById("colors-container").appendChild(colorContainer);
    });

    // Додавання додаткового зображення
    document.getElementById("add-additional-image").addEventListener("click", () => {
        const imageInput = document.createElement("input");
        imageInput.type = "text";
        imageInput.placeholder = "URL додаткового зображення";
        imageInput.classList.add("additional-image-input");
        document.getElementById("additional-images-container").appendChild(imageInput);
    });

    // Додавання характеристики
    document.getElementById("add-spec").addEventListener("click", () => {
        const specInput = document.createElement("input");
        specInput.type = "text";
        specInput.placeholder = "Характеристика";
        specInput.classList.add("specs-item");
        document.getElementById("specs-container").appendChild(specInput);
    });

    // Додавання пункту комплектації
    document.getElementById("add-bundle").addEventListener("click", () => {
        const bundleInput = document.createElement("input");
        bundleInput.type = "text";
        bundleInput.placeholder = "Комплектація";
        bundleInput.classList.add("bundle-item");
        document.getElementById("bundle-container").appendChild(bundleInput);
    });

    // Завантаження лінійок
    async function loadLines() {
        try {
            const res = await fetch("https://vps-kondordevice.onrender.com/api/lines");
            if (res.ok) {
                const lines = await res.json();
                displayLines(lines);
                populateLineSelect(lines);
            } else {
                console.error("Помилка завантаження лінійок:", res.statusText);
                alert("Не вдалося завантажити лінійки.");
            }
        } catch (error) {
            console.error("Помилка завантаження лінійок:", error);
            alert("Помилка з'єднання. Перевірте підключення до інтернету.");
        }
    }

    // Завантаження продуктів
    async function loadProducts() {
        try {
            const res = await fetch("https://vps-kondordevice.onrender.com/api/products");
            if (res.ok) {
                const products = await res.json();
                displayProducts(products);
            } else {
                console.error("Помилка завантаження продуктів:", res.statusText);
            }
        } catch (error) {
            console.error("Помилка завантаження продуктів:", error);
        }
    }

    function displayLines(lines) {
        const linesContainer = document.getElementById("lines-container");
        if (!linesContainer) {
            console.error("Контейнер для лінійок 'lines-container' не знайдено.");
            return;
        }

        linesContainer.innerHTML = ""; // Очистити перед додаванням

        if (lines.length === 0) {
            linesContainer.innerHTML = `<p>Лінійки відсутні.</p>`;
            return;
        }

        lines.forEach((line) => {
            const lineElement = document.createElement("div");
            lineElement.classList.add("line");

            lineElement.innerHTML = `
                <div class="line-edit">
                    <input type="text" class="line-name-input" value="${line.name}" data-id="${line._id}">
                    <button class="save-line-btn" data-id="${line._id}">Зберегти</button>
                    <button class="delete-line-btn" data-id="${line._id}">Видалити</button>
                </div>
            `;

            linesContainer.appendChild(lineElement);
        });

        document.querySelectorAll(".save-line-btn").forEach((btn) => {
            btn.addEventListener("click", saveLine);
        });

        document.querySelectorAll(".delete-line-btn").forEach((btn) => {
            btn.addEventListener("click", deleteLine);
        });
    }

    function displayProducts(products) {
        const productsContainer = document.getElementById("products-container");
        productsContainer.innerHTML = ""; // Очистити перед додаванням

        products.forEach((product) => {
            const productElement = document.createElement("div");
            productElement.classList.add("product");

            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <p>Тип: ${product.type}</p>
                <p>Ціна: ${product.price} грн</p>
                <p>Знижка: ${product.discount}%</p>
                <p>Ціна зі знижкою: ${(product.price - (product.price * product.discount) / 100).toFixed(2)} грн</p>
                <button class="delete-product-btn" data-id="${product._id}">Видалити</button>
            `;

            productsContainer.appendChild(productElement);
        });

        document.querySelectorAll(".delete-product-btn").forEach((btn) => {
            btn.addEventListener("click", deleteProduct);
        });
    }

    function populateLineSelect(lines) {
        const lineSelect = document.getElementById("product-line");
        if (!lineSelect) {
            console.error('Елемент із id "product-line" не знайдено.');
            return;
        }
    
        lineSelect.innerHTML = ""; // Очистити перед додаванням
    
        lines.forEach((line) => {
            const option = document.createElement("option");
            option.value = line._id;
            option.textContent = line.name;
            lineSelect.appendChild(option);
        });
    }    

    async function saveLine(e) {
        const lineId = e.target.dataset.id;
        const lineNameInput = document.querySelector(`.line-name-input[data-id="${lineId}"]`);

        if (!lineNameInput) {
            console.error(`Елемент введення для лінійки з ID ${lineId} не знайдено.`);
            return;
        }

        const newName = lineNameInput.value.trim();

        if (!newName) {
            alert("Назва лінійки не може бути порожньою");
            return;
        }

        try {
            const res = await fetch(`https://vps-kondordevice.onrender.com/api/lines/${lineId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName }),
            });

            if (res.ok) {
                alert("Лінійку оновлено");
                loadLines();
            } else {
                const errorText = await res.text();
                console.error("Помилка оновлення лінійки:", errorText);
                alert("Помилка оновлення лінійки.");
            }
        } catch (error) {
            console.error("Помилка оновлення лінійки:", error);
            alert("Помилка з'єднання. Перевірте підключення до інтернету.");
        }
    }

    async function deleteLine(e) {
        const lineId = e.target.dataset.id;

        if (!confirm("Ви впевнені, що хочете видалити цю лінійку?")) return;

        try {
            const res = await fetch(`https://vps-kondordevice.onrender.com/api/lines/${lineId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("Лінійку видалено");
                loadLines();
            } else {
                const errorText = await res.text();
                console.error("Помилка видалення лінійки:", errorText);
                alert("Помилка видалення лінійки.");
            }
        } catch (error) {
            console.error("Помилка видалення лінійки:", error);
            alert("Помилка з'єднання. Перевірте підключення до інтернету.");
        }
    }

    async function deleteProduct(e) {
        const productId = e.target.dataset.id;

        if (confirm("Ви впевнені, що хочете видалити цей продукт?")) {
            try {
                const res = await fetch(`https://vps-kondordevice.onrender.com/api/products/${productId}`, {
                    method: "DELETE",
                });

                if (res.ok) {
                    alert("Продукт видалено");
                    loadProducts();
                } else {
                    const errorText = await res.text();
                    console.error("Помилка видалення продукту:", errorText);
                    alert("Помилка видалення продукту");
                }
            } catch (error) {
                console.error("Помилка видалення продукту:", error);
            }
        }
    }
});
