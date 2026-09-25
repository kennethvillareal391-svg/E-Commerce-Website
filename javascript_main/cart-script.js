/* =========================================================
   CART PAGE LOGIC (view-cart.html)
   Reads/writes the shared "breathCart" cart in localStorage
   so it stays in sync with the ADD TO CART buttons on
   index.html (see add-to-cart-script.js).
   ========================================================= */

(function () {
    const CART_KEY = "breathCart";
    const TAX_RATE = 0.08;

    // Cart items store image paths as "images/product1.png" — the same
    // path index.html (at the project root) already uses. But this script
    // runs on view-cart.html, which lives one folder deeper (/view-cart/),
    // so every stored path needs "../" stuck on the front before it's put
    // into an <img> tag here. If you ever move view-cart.html to a
    // different depth, this is the one line to update.
    const IMAGE_PATH_PREFIX = "../";

    function resolveImagePath(path) {
        // Leave alone anything that's already a full URL or already
        // adjusted, so this stays safe to call more than once.
        if (/^(https?:)?\/\//.test(path) || path.startsWith(IMAGE_PATH_PREFIX)) {
            return path;
        }
        return IMAGE_PATH_PREFIX + path;
    }

    // Shown once, only on a first-ever visit (no cart key yet at all),
    // so the page demonstrates the POS-style total calculation.
    // Once a real cart exists (even an emptied one), this is never used again.
    const DEMO_CART = [
        { id: "product1", name: "Sand White",    price: 54.00, image: "images/product1.png", qty: 1 },
        { id: "product6", name: "Midnight Blue", price: 58.00, image: "images/product6.png", qty: 2 },
        { id: "product9", name: "Wood Grain",    price: 72.00, image: "images/product9.png", qty: 1 }
    ];

    function loadCart() {
        const raw = localStorage.getItem(CART_KEY);

        if (raw === null) {
            localStorage.setItem(CART_KEY, JSON.stringify(DEMO_CART));
            return DEMO_CART.slice();
        }

        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function formatCurrency(amount) {
        return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
    }

    function updateCartBadge(cart) {
        const badge = document.getElementById("cartCount");
        if (!badge) return;

        const count = cart.reduce((sum, item) => sum + item.qty, 0);
        badge.textContent = count;

        const link = badge.closest(".cart-link");
        if (link) {
            link.setAttribute("aria-label", `View cart, ${count} item${count === 1 ? "" : "s"}`);
        }
    }

    function render() {
        const cart = loadCart();
        updateCartBadge(cart);

        const listEl = document.getElementById("cartList");
        const emptyEl = document.getElementById("cartEmpty");
        const layoutEl = document.getElementById("cartLayout");
        if (!listEl || !emptyEl || !layoutEl) return;

        if (cart.length === 0) {
            layoutEl.hidden = true;
            emptyEl.hidden = false;
            // Keep the summary numbers themselves at zero too, so if the
            // layout is ever shown again there's no stale total flashing.
            const summaryCount = document.getElementById("summaryCount");
            const summarySubtotal = document.getElementById("summarySubtotal");
            const summaryTax = document.getElementById("summaryTax");
            const summaryTotal = document.getElementById("summaryTotal");
            if (summaryCount) summaryCount.textContent = "0 items";
            if (summarySubtotal) summarySubtotal.textContent = formatCurrency(0);
            if (summaryTax) summaryTax.textContent = formatCurrency(0);
            if (summaryTotal) summaryTotal.textContent = formatCurrency(0);
            return;
        }

        layoutEl.hidden = false;
        emptyEl.hidden = true;
        listEl.innerHTML = "";

        let subtotal = 0;

        // FIX: loop with the array index (idx) and use that — not item.id —
        // as the data-index on each row's controls. item.id is the PRODUCT
        // id, so if the same product ever ends up in the cart as two
        // separate line entries (or any id is reused), filtering/finding by
        // item.id would match every line with that id, not just the one
        // the user actually clicked. That's what caused the trash icon to
        // sometimes wipe out the wrong line (it looked like it always
        // deleted the "last" matching product and zeroed the summary).
        // Using the row's array index makes every control point at exactly
        // one, unambiguous line.
        cart.forEach((item, idx) => {
            const lineTotal = item.price * item.qty;
            subtotal += lineTotal;

            // Once the cart is down to a single line item, don't render a
            // per-row remove button at all. This forces "Clear Cart" to be
            // the only way to empty that last item, instead of the trash
            // icon quietly doing the same thing.
            const removeBtnHtml = cart.length > 1
                ? `<button type="button" class="remove-btn" aria-label="Remove ${item.name} from cart" data-index="${idx}">
                    <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                </button>`
                : "";

            const li = document.createElement("li");
            li.className = "cart-item";
            li.innerHTML = `
                <div class="cart-item-image">
                    <img src="${resolveImagePath(item.image)}" alt="${item.name} product photo">
                </div>

                <div class="cart-item-details">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">${formatCurrency(item.price)} each</p>
                </div>

                <div class="cart-item-qty">
                    <button type="button" class="qty-btn qty-decrease" aria-label="Decrease quantity of ${item.name}" data-index="${idx}">&minus;</button>
                    <label class="sr-only" for="qty-${idx}">Quantity for ${item.name}</label>
                    <input type="number" id="qty-${idx}" class="qty-input" min="1" max="99" value="${item.qty}" data-index="${idx}">
                    <button type="button" class="qty-btn qty-increase" aria-label="Increase quantity of ${item.name}" data-index="${idx}">+</button>
                </div>

                <p class="cart-item-linetotal">
                    <span class="sr-only">Line total: </span>${formatCurrency(lineTotal)}
                </p>

                ${removeBtnHtml}
            `;
            listEl.appendChild(li);
        });

        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax;
        const count = cart.reduce((sum, item) => sum + item.qty, 0);

        document.getElementById("summaryCount").textContent = `${count} item${count === 1 ? "" : "s"}`;
        document.getElementById("summarySubtotal").textContent = formatCurrency(subtotal);
        document.getElementById("summaryTax").textContent = formatCurrency(tax);
        document.getElementById("summaryTotal").textContent = formatCurrency(total);

        attachRowHandlers();
    }

    function changeQty(index, delta, absoluteValue) {
        let cart = loadCart();
        if (index < 0 || index >= cart.length) return;

        let newQty = absoluteValue !== undefined ? absoluteValue : cart[index].qty + delta;
        if (!Number.isFinite(newQty) || newQty < 1) newQty = 1;
        newQty = Math.min(99, Math.round(newQty));

        cart[index] = { ...cart[index], qty: newQty };

        saveCart(cart);
        render();
    }

    function removeItem(index) {
        const cart = loadCart();
        if (index < 0 || index >= cart.length) return;

        cart.splice(index, 1);
        saveCart(cart);
        render();
    }

    function attachRowHandlers() {
        document.querySelectorAll(".qty-decrease").forEach((btn) => {
            btn.addEventListener("click", () => {
                changeQty(parseInt(btn.dataset.index, 10), -1);
            });
        });

        document.querySelectorAll(".qty-increase").forEach((btn) => {
            btn.addEventListener("click", () => {
                changeQty(parseInt(btn.dataset.index, 10), 1);
            });
        });

        document.querySelectorAll(".qty-input").forEach((input) => {
            input.addEventListener("change", () => {
                changeQty(parseInt(input.dataset.index, 10), 0, parseInt(input.value, 10));
            });
        });

        document.querySelectorAll(".remove-btn").forEach((btn) => {
            btn.addEventListener("click", () => removeItem(parseInt(btn.dataset.index, 10)));
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        render();

        const clearBtn = document.getElementById("clearCartBtn");
        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                // Wipe the item images/rows off the screen right away,
                // then persist the empty cart and re-render (shows the empty state).
                const listEl = document.getElementById("cartList");
                if (listEl) listEl.innerHTML = "";

                saveCart([]);
                render();
            });
        }

        const checkoutBtn = document.getElementById("checkoutBtn");
        if (checkoutBtn) {
            checkoutBtn.addEventListener("click", () => {
                const cart = loadCart();

                if (cart.length === 0) {
                    alert("The cart is empty.");
                    return;
                }

                // Clear the cart in storage FIRST, before navigating away —
                // this guarantees that hitting the browser's back button,
                // or coming back to view-cart.html later, shows an empty
                // cart instead of the just-checked-out items reappearing.
                saveCart([]);

                // Redirect to the confirmation page for the transaction receipt.
                window.location.href = "../check-out/checkout-confirmation.html";
            });
        }
    });
})();
