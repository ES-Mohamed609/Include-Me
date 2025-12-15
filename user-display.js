/**
 * Dynamic User Name and Avatar Update
 * Updates header based on user profile
 */

console.log('👤 Loading dynamic user name feature...');

// Function to update user name and avatar
function updateUserDisplay() {
    let userName = 'User';
    let userEmail = 'user@example.com';

    // First, try to get data from userData (registration data)
    const userData = localStorage.getItem('userData');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            if (user.fullName) {
                userName = user.fullName;
            } else if (user.firstName) {
                userName = user.firstName + (user.lastName ? ' ' + user.lastName : '');
            }
            if (user.email) {
                userEmail = user.email;
            }
            console.log('✅ Loaded user from userData:', userName);
        } catch (e) {
            console.error('Error parsing userData:', e);
        }
    } else {
        // Fallback to userProfile
        const profileData = localStorage.getItem('userProfile');
        if (profileData) {
            try {
                const profile = JSON.parse(profileData);
                if (profile.personal && profile.personal.name) {
                    userName = profile.personal.name;
                }
                if (profile.contact && profile.contact.email) {
                    userEmail = profile.contact.email;
                }
                console.log('✅ Loaded user from userProfile:', userName);
            } catch (e) {
                console.error('Error parsing profile:', e);
            }
        }
    }

    // Update user name in header (main button)
    const headerUserName = document.getElementById('headerUserName');
    if (headerUserName) {
        headerUserName.textContent = userName;
        console.log('✅ Updated header user name to:', userName);
    }

    // Update user name in dropdown
    const dropdownUserName = document.getElementById('dropdownUserName');
    if (dropdownUserName) {
        dropdownUserName.textContent = userName;
        console.log('✅ Updated dropdown user name to:', userName);
    }

    // Update user email in dropdown
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');
    if (dropdownUserEmail) {
        dropdownUserEmail.textContent = userEmail;
        console.log('✅ Updated dropdown email to:', userEmail);
    }

    // Update avatar images
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=DC143C&color=fff&bold=true`;

    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        userAvatar.src = avatarUrl;
        console.log('✅ Updated main avatar for:', userName);
    }

    const userAvatarLarge = document.getElementById('userAvatarLarge');
    if (userAvatarLarge) {
        userAvatarLarge.src = avatarUrl;
        console.log('✅ Updated large avatar for:', userName);
    }
}

// Update on page load
window.addEventListener('load', function () {
    console.log('🔄 Page loaded, updating user display...');
    updateUserDisplay();
});

// Update when profile changes
window.addEventListener('storage', function (e) {
    if (e.key === 'userProfile' || e.key === 'userData') {
        console.log('🔄 Storage changed, updating user display...');
        updateUserDisplay();
    }
});

// Make function available globally
window.updateUserDisplay = updateUserDisplay;

console.log('✅ Dynamic user name feature loaded');
