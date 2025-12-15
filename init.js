// ========================================
// INITIALIZATION FIX - Load this first
// ========================================

console.log('Include Me Platform - Initializing...');

// Ensure all scripts wait for DOM
(function () {
    'use strict';

    // Check if DOM is ready
    function domReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    // Initialize everything when DOM is ready
    domReady(function () {
        console.log('DOM Ready - Initializing Include Me Platform');

        // Make sure all buttons are clickable
        const allButtons = document.querySelectorAll('button, .btn-primary, .btn-secondary');
        allButtons.forEach(btn => {
            btn.style.pointerEvents = 'auto';
            btn.style.cursor = 'pointer';
        });

        // Make sure all links are clickable
        const allLinks = document.querySelectorAll('a, .nav-item');
        allLinks.forEach(link => {
            link.style.pointerEvents = 'auto';
            link.style.cursor = 'pointer';
        });

        // Ensure forms are interactive
        const allInputs = document.querySelectorAll('input, select, textarea');
        allInputs.forEach(input => {
            input.style.pointerEvents = 'auto';
        });

        console.log('All interactive elements enabled');

        // Test button clicks
        const testBtn = document.getElementById('analyzeBtn');
        if (testBtn) {
            console.log('Analyze button found:', testBtn);
        }

        const editProfileBtn = document.getElementById('editProfileBtn');
        if (editProfileBtn) {
            console.log('Edit Profile button found:', editProfileBtn);
        }

        // Log all script files loaded
        console.log('Scripts loaded successfully');
    });
})();
