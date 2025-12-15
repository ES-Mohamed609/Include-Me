/**
 * SUPER SIMPLE SIDEBAR TOGGLE
 * No complications, just works!
 */

console.log('🚀 Loading sidebar toggle...');

// Run when page loads
window.addEventListener('load', function () {
    console.log('✅ Page loaded!');

    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.querySelector('.sidebar');

    if (!menuBtn) {
        console.error('❌ Menu button not found');
        return;
    }

    if (!sidebar) {
        console.error('❌ Sidebar not found');
        return;
    }

    console.log('✅ Found menu button and sidebar');

    // Create overlay
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        console.log('✅ Created overlay');
    }

    // Simple click handler
    menuBtn.onclick = function () {
        console.log('🖱️ Menu button clicked!');

        if (sidebar.classList.contains('mobile-open')) {
            // Close
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            console.log('🔒 Closed');
        } else {
            // Open
            sidebar.classList.add('mobile-open');
            overlay.classList.add('active');
            menuBtn.setAttribute('aria-expanded', 'true');
            console.log('🔓 Opened');
        }
    };

    // Close when clicking overlay
    overlay.onclick = function () {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        console.log('🔒 Closed (overlay)');
    };

    console.log('✅ Sidebar toggle ready!');
});
