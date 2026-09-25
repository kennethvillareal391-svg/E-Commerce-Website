(function () {
    const STORAGE_KEY = "breathLastTransactionId";

    function generateTransactionId() {
        const prefix = "BRTH";
        const timestamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");
        const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
        return `${prefix}-${timestamp}-${randomPart}`;
    }

    function setTransactionId() {
        const idNode = document.getElementById("transactionId");
        if (!idNode) return;

        const savedId = localStorage.getItem(STORAGE_KEY);
        const transactionId = savedId || generateTransactionId();

        idNode.textContent = transactionId;
        localStorage.setItem(STORAGE_KEY, transactionId);
    }

    document.addEventListener("DOMContentLoaded", () => {
        setTransactionId();

        const returnHomeBtn = document.getElementById("returnHomeBtn");
        if (returnHomeBtn) {
            returnHomeBtn.addEventListener("click", () => {
                window.location.href = "../index.html";
            });
        }
    });
})();
