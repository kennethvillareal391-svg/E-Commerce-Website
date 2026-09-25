/* =====================================
   PRODUCT SEARCH
   Matches typed keywords against each
   product's name + description, shows a
   dropdown of matching products to pick
   from, and scrolls to + highlights the
   chosen product.
===================================== */

document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector(".search-box");
    const searchInput = searchForm.querySelector("input[name='search']");
    const searchBoxSection = document.querySelector(".search-box-section");
    const productSections = document.querySelectorAll(".product-container");

    // Build the dropdown container and attach it under the search bar
    const suggestionsBox = document.createElement("div");
    suggestionsBox.className = "search-suggestions";
    searchBoxSection.appendChild(suggestionsBox);

    // Pull each product's searchable info once up front
    const products = Array.from(productSections).map((section) => ({
        section,
        name: section.querySelector(".productName").textContent,
        description: section.querySelector(".description").textContent,
    }));

    // ----- LIVE SUGGESTIONS AS THE USER TYPES -----

    searchInput.addEventListener("input", () => {
        showSuggestions(searchInput.value);
    });

    searchInput.addEventListener("focus", () => {
        if (searchInput.value.trim() !== "") {
            showSuggestions(searchInput.value);
        }
    });

    // Hide the dropdown when clicking anywhere outside it
    document.addEventListener("click", (e) => {
        if (!searchBoxSection.contains(e.target)) {
            hideSuggestions();
        }
    });

    // ----- SUBMIT (enter / magnifying glass icon) -----

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const matches = getMatches(searchInput.value);

        if (matches.length > 0) {
            selectProduct(matches[0].section);
        } else if (searchInput.value.trim() !== "") {
            alert("No products found matching your search.");
        }
    });

    // ----- CORE LOGIC -----

    function getMatches(query) {
        const keywords = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
        if (keywords.length === 0) return [];

        return products.filter((product) => {
            const combinedText = `${product.name} ${product.description}`.toLowerCase();
            return keywords.some((word) => combinedText.includes(word));
        });
    }

    function showSuggestions(query) {
        const matches = getMatches(query);

        suggestionsBox.innerHTML = "";

        if (matches.length === 0) {
            hideSuggestions();
            return;
        }

        matches.forEach((product) => {
            const item = document.createElement("div");
            item.className = "search-suggestion-item";
            item.textContent = product.name;

            item.addEventListener("click", () => {
                searchInput.value = product.name;
                selectProduct(product.section);
            });

            suggestionsBox.appendChild(item);
        });

        suggestionsBox.classList.add("show");
    }

    function hideSuggestions() {
        suggestionsBox.classList.remove("show");
        suggestionsBox.innerHTML = "";
    }

    function selectProduct(section) {
        clearHighlights();
        section.classList.add("search-highlight");
        section.scrollIntoView({ behavior: "smooth", block: "center" });
        hideSuggestions();
    }

    function clearHighlights() {
        productSections.forEach((s) => s.classList.remove("search-highlight"));
    }
});