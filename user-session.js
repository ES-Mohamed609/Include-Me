// ========================================
// USER SESSION MANAGEMENT
// ========================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    setupUserDropdown();
    setupLogout();
    checkAuthStatus();
});

// ===================================
// Get User Initials
// ===================================
function getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

// ===================================
// Setup User Dropdown
// ===================================
function setupUserDropdown() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');

    if (!userMenuBtn || !userDropdown) return;

    // Toggle dropdown on button click
    userMenuBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isExpanded = userMenuBtn.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
            closeUserDropdown();
        } else {
            openUserDropdown();
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
            closeUserDropdown();
        }
    });

    // Close dropdown on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeUserDropdown();
        }
    });
}

function openUserDropdown() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');

    if (userMenuBtn && userDropdown) {
        userMenuBtn.setAttribute('aria-expanded', 'true');
        userDropdown.classList.add('active');
    }
}

function closeUserDropdown() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');

    if (userMenuBtn && userDropdown) {
        userMenuBtn.setAttribute('aria-expanded', 'false');
        userDropdown.classList.remove('active');
    }
}

// ===================================
// Setup Logout
// ===================================
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            handleLogout();
        });
    }
}

function handleLogout() {
    // Show confirmation
    if (confirm('Are you sure you want to logout?')) {
        // Clear all user data from localStorage
        localStorage.removeItem('userData');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUserEmail');

        // Show logout message
        showLogoutMessage();

        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

function showLogoutMessage() {
    // Create logout notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, #DC143C 0%, #FF4757 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(220, 20, 60, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideInRight 0.3s ease-out;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
    `;

    notification.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" />
        </svg>
        <span>Logging out...</span>
    `;

    document.body.appendChild(notification);

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Remove after animation
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 1000);
}

// ===================================
// Check Authentication Status
// ===================================
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentPath = window.location.pathname;

    // If not logged in and not on login/signup page, redirect to login
    if (!isLoggedIn && !currentPath.includes('login.html') && !currentPath.includes('signup.html')) {
        // Don't redirect immediately - just show a message
        console.log('User not logged in');
        // Optionally show login prompt
    }
}

// ===================================
// Separate User Data by Email
// ===================================
function getUserDataKey(email) {
    return `userData_${email}`;
}

function saveUserData(email, data) {
    const key = getUserDataKey(email);
    localStorage.setItem(key, JSON.stringify(data));
}

function loadUserData(email) {
    const key = getUserDataKey(email);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// ===================================
// Export functions for use in other scripts
// ===================================
window.updateUserDisplay = updateUserDisplay;
window.handleLogout = handleLogout;
window.getUserDataKey = getUserDataKey;
window.saveUserData = saveUserData;
window.loadUserData = loadUserData;
