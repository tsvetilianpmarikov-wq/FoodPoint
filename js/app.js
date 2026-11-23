
/* =========================================
   FOODPOINT - JAVASCRIPT
========================================= */

// Взимане на количката от Local Storage
function getCart() {
    return JSON.parse(localStorage.getItem("foodpoint_cart")) || [];
}

// Запазване на количката
function saveCart(cart) {
    localStorage.setItem("foodpoint_cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Брой продукти в количката
function updateCartCount() {
    const cart = getCart();

    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    const counter = document.getElementById("cart-count");

    if (counter) {
        counter.textContent = count;
    }
}

// Добавяне на продукт
function addToCart(name, price) {
    const cart = getCart();

    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart(cart);

    alert(name + " е добавен в количката!");
}

// Промяна на количество
function changeQuantity(name, change) {
    let cart = getCart();

    const item = cart.find(product => product.name === name);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.name !== name);
    }

    saveCart(cart);
}

// Изтриване на продукт
function removeFromCart(name) {
    const cart = getCart().filter(item => item.name !== name);
    saveCart(cart);
}

// Филтриране на меню
function filterFood(category, button) {
    const cards = document.querySelectorAll(".food-card");

    cards.forEach(card => {
        const cardCategory = card.dataset.category;

        if (category === "all" || cardCategory === category) {
            card.classList.remove("hidden");
        } else {
            card.classList.add("hidden");
        }
    });

    document.querySelectorAll(".category-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    }
}

// Форматиране на цени
function formatPrice(price) {
    return Number(price).toFixed(2) + " лв.";
}

// Рендериране на количката
function renderCart() {
    const cartContainer = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    if (!cartContainer || !totalElement) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <p>🛒 Твоята количка е празна.</p>
                <a href="menu.html" class="text-link">
                    Разгледай менюто →
                </a>
            </div>
        `;

        totalElement.textContent = formatPrice(0);
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-row">

            <div class="cart-row-info">
                <strong>${item.name}</strong>
                <small>${formatPrice(item.price)} / бр.</small>
                <small>Общо: ${formatPrice(item.price * item.quantity)}</small>
            </div>

            <div class="quantity-controls">
                <button onclick="changeQuantity('${item.name}', -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity('${item.name}', 1)">+</button>
            </div>

            <button
                class="remove-btn"
                onclick="removeFromCart('${item.name}')"
                title="Премахни"
                style="background:none;border:none;color:#ff6b2c;cursor:pointer;">
                ✕
            </button>
        </div>
    `).join("");

    const total = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    totalElement.textContent = formatPrice(total);
}

// Настройка минимална дата за поръчка
function setMinDate() {
    const dateInput = document.getElementById("pickup-date");

    if (!dateInput) return;

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dateInput.min = `${year}-${month}-${day}`;
    dateInput.value = `${year}-${month}-${day}`;
}

// Обработка на формата за поръчка
function setupCheckout() {
    const form = document.getElementById("checkout-form");

    if (!form) return;

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const cart = getCart();

        if (cart.length === 0) {
            alert("Количката ти е празна! Добави продукти.");
            return;
        }

        const name = document.getElementById("customer-name").value.trim();
        const phone = document.getElementById("customer-phone").value.trim();
        const date = document.getElementById("pickup-date").value;
        const time = document.getElementById("pickup-time").value;
        const note = document.getElementById("order-note").value.trim();

        if (!name || !phone || !date || !time) {
            alert("Моля, попълни всички задължителни полета.");
            return;
        }

        const total = cart.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);

        const products = cart.map(item => {
            return `${item.name} x ${item.quantity}`;
        }).join("\n");

        const message = `
ПОРЪЧКАТА Е ГОТОВА (ДЕМО)!

Клиент: ${name}
Телефон: ${phone}
Дата: ${date}
Час: ${time}

Продукти:
${products}

Общо: ${formatPrice(total)}

Бележка: ${note || "Няма"}
        `;

        alert(message);

        // Изчистване на количката след демонстрация
        localStorage.removeItem("foodpoint_cart");

        updateCartCount();
        renderCart();

        form.reset();
        setMinDate();
    });
}

// Инициализация
document.addEventListener("DOMContentLoaded", function() {
    updateCartCount();
    renderCart();
    setMinDate();
    setupCheckout();
});
