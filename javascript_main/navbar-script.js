document.addEventListener('DOMContentLoaded', () => {

    const dropdown = document.querySelector('.nav-links .dropdown');
    const toggle = dropdown ? dropdown.querySelector('.dropdown-toggle') : null;

    if (!dropdown || !toggle) return;

    // Open/close on click (works for both mouse and touch)
    toggle.addEventListener('click', (event) => {
        event.stopPropagation();
        dropdown.classList.toggle('active');
    });

    // Close when clicking anywhere outside the dropdown
    document.addEventListener('click', (event) => {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('active');
        }
    });

    // Close after a menu item is chosen
    dropdown.querySelectorAll('.dropdown-menu a').forEach((link) => {
        link.addEventListener('click', () => {
            dropdown.classList.remove('active');
        });
    });

    // Close on Escape for keyboard users
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            dropdown.classList.remove('active');
        }
    });

});
