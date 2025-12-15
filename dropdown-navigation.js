/**
 * Dropdown Navigation Handler
 * Handles navigation when clicking dropdown menu items
 */

document.addEventListener('DOMContentLoaded', function () {
    // Get all dropdown items with data-section attribute
    const dropdownItems = document.querySelectorAll('.dropdown-item[data-section]');

    dropdownItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            const section = this.getAttribute('data-section');

            // Hide all sections
            document.querySelectorAll('.page-section').forEach(sec => {
                sec.style.display = 'none';
                sec.classList.remove('active');
            });

            // Show target section
            const targetSection = document.getElementById(section + 'Section');
            if (targetSection) {
                targetSection.style.display = 'block';
                targetSection.classList.add('active');
            }

            // Update sidebar nav items
            document.querySelectorAll('.nav-item').forEach(navItem => {
                navItem.classList.remove('active');
                if (navItem.getAttribute('data-section') === section) {
                    navItem.classList.add('active');
                }
            });

            // Close the dropdown
            const dropdown = this.closest('.dropdown');
            if (dropdown) {
                const menu = dropdown.querySelector('.dropdown-menu');
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (menu) menu.classList.remove('show');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
                dropdown.classList.remove('show');
            }

            // Close mobile sidebar if open
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                if (overlay) overlay.classList.remove('active');
            }
        });
    });
});
