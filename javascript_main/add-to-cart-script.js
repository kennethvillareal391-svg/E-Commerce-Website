/* =========================================================
   ADD TO CART (index.html)
   Wires up each .addCart button so it pushes the product
   into the shared "breathCart" cart used by view-cart.html.
   ========================================================= */

(function () {
    const CART_KEY = "breathCart";

    function loadCart() {
        const raw = localStorage.getItem(CART_KEY);
        try {
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function updateBadge() {
        const badge = document.getElementById("cartCount");
        if (!badge) return;

        const cart = loadCart();
        const count = cart.reduce((sum, item) => sum + item.qty, 0);
        badge.textContent = count;

        const link = badge.closest(".cart-link");
        if (link) {
            link.setAttribute("aria-label", `View cart, ${count} item${count === 1 ? "" : "s"}`);
        }
    }

    function showToast(message) {
        let toast = document.getElementById("cartToast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "cartToast";
            toast.className = "cart-toast";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toast._hideTimeout);
        toast._hideTimeout = setTimeout(() => toast.classList.remove("show"), 2200);
    }

    document.addEventListener("DOMContentLoaded", () => {
        updateBadge();

        document.querySelectorAll(".addCart").forEach((btn) => {
            btn.addEventListener("click", () => {
                const section = btn.closest(".product-container");
                if (!section) return;

                const id = section.dataset.productId;
                const name = btn.dataset.name || section.querySelector(".productName")?.textContent.trim();
                const price = parseFloat(btn.dataset.price || "0");
                const image = btn.dataset.image || section.querySelector(".productImg img")?.getAttribute("src");

                const cart = loadCart();
                const existing = cart.find((item) => item.id === id);

                if (existing) {
                    existing.qty += 1;
                } else {
                    cart.push({ id, name, price, image, qty: 1 });
                }

                saveCart(cart);
                updateBadge();
                showToast(`${name} added to cart`);
            });
        });
    });
})();
