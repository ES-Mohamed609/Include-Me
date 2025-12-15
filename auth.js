// ===================================
// Authentication Pages JavaScript
// Include Me Platform
// ===================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
    initializeAuthPage();
});

// ===================================
// Initialize Authentication Page
// ===================================
function initializeAuthPage() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        initializeLoginPage();
    }

    if (signupForm) {
        initializeSignupPage();
    }
}

// ===================================
// Login Page Initialization
// ===================================
function initializeLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // Toggle password visibility
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function () {
            togglePasswordVisibility(passwordInput, togglePasswordBtn);
        });
    }

    // Real-time validation
    emailInput.addEventListener('blur', function () {
        validateEmail(emailInput);
    });

    passwordInput.addEventListener('blur', function () {
        validatePassword(passwordInput, 'password-error', false);
    });

    // Form submission
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        handleLoginSubmit();
    });

    // Load remembered email if exists
    loadRememberedEmail();
}

// ===================================
// Sign Up Page Initialization
// ===================================
function initializeSignupPage() {
    const signupForm = document.getElementById('signupForm');
    const signupPasswordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const toggleSignupPasswordBtn = document.getElementById('toggleSignupPassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');

    // Toggle password visibility
    if (toggleSignupPasswordBtn) {
        toggleSignupPasswordBtn.addEventListener('click', function () {
            togglePasswordVisibility(signupPasswordInput, toggleSignupPasswordBtn);
        });
    }

    if (toggleConfirmPasswordBtn) {
        toggleConfirmPasswordBtn.addEventListener('click', function () {
            togglePasswordVisibility(confirmPasswordInput, toggleConfirmPasswordBtn);
        });
    }

    // Password strength indicator
    signupPasswordInput.addEventListener('input', function () {
        updatePasswordStrength(signupPasswordInput.value);
    });

    // Real-time validation
    document.getElementById('firstName').addEventListener('blur', function (e) {
        validateRequired(e.target, 'First name is required');
    });

    document.getElementById('lastName').addEventListener('blur', function (e) {
        validateRequired(e.target, 'Last name is required');
    });

    document.getElementById('signupEmail').addEventListener('blur', function (e) {
        validateEmail(e.target);
    });

    signupPasswordInput.addEventListener('blur', function () {
        validatePassword(signupPasswordInput, 'signupPassword-error', true);
    });

    confirmPasswordInput.addEventListener('blur', function () {
        validateConfirmPassword();
    });

    // Form submission
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        handleSignupSubmit();
    });
}

// ===================================
// Toggle Password Visibility
// ===================================
function togglePasswordVisibility(input, button) {
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);

    // Update icon
    const icon = button.querySelector('.eye-icon');
    if (type === 'text') {
        icon.innerHTML = `
            <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        `;
    } else {
        icon.innerHTML = `
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
        `;
    }
}

// ===================================
// Password Strength Indicator
// ===================================
function updatePasswordStrength(password) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    if (!strengthFill || !strengthText) return;

    let strength = 0;
    let strengthLabel = '';

    if (password.length === 0) {
        strengthFill.style.width = '0%';
        strengthFill.className = 'strength-fill';
        strengthText.textContent = 'Password strength';
        return;
    }

    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Character variety checks
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    // Determine strength level
    if (strength <= 2) {
        strengthFill.className = 'strength-fill weak';
        strengthLabel = 'Weak';
    } else if (strength <= 4) {
        strengthFill.className = 'strength-fill medium';
        strengthLabel = 'Medium';
    } else {
        strengthFill.className = 'strength-fill strong';
        strengthLabel = 'Strong';
    }

    strengthText.textContent = `Password strength: ${strengthLabel}`;
}

// ===================================
// Validation Functions
// ===================================

function validateRequired(input, message) {
    const errorElement = document.getElementById(`${input.id}-error`);

    if (!input.value.trim()) {
        showError(input, errorElement, message);
        return false;
    }

    clearError(input, errorElement);
    return true;
}

function validateEmail(input) {
    const errorElement = document.getElementById(`${input.id}-error`);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!input.value.trim()) {
        showError(input, errorElement, 'Email is required');
        return false;
    }

    if (!emailRegex.test(input.value)) {
        showError(input, errorElement, 'Please enter a valid email address');
        return false;
    }

    clearError(input, errorElement);
    return true;
}

function validatePassword(input, errorId, checkStrength) {
    const errorElement = document.getElementById(errorId);
    const password = input.value;

    if (!password) {
        showError(input, errorElement, 'Password is required');
        return false;
    }

    if (checkStrength) {
        if (password.length < 8) {
            showError(input, errorElement, 'Password must be at least 8 characters');
            return false;
        }

        if (!/[a-z]/.test(password)) {
            showError(input, errorElement, 'Password must contain lowercase letters');
            return false;
        }

        if (!/[A-Z]/.test(password)) {
            showError(input, errorElement, 'Password must contain uppercase letters');
            return false;
        }

        if (!/[0-9]/.test(password)) {
            showError(input, errorElement, 'Password must contain numbers');
            return false;
        }
    }

    clearError(input, errorElement);
    return true;
}

function validateConfirmPassword() {
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword');
    const errorElement = document.getElementById('confirmPassword-error');

    if (!confirmPassword.value) {
        showError(confirmPassword, errorElement, 'Please confirm your password');
        return false;
    }

    if (password !== confirmPassword.value) {
        showError(confirmPassword, errorElement, 'Passwords do not match');
        return false;
    }

    clearError(confirmPassword, errorElement);
    return true;
}

function validateTerms() {
    const termsCheckbox = document.getElementById('terms');
    const errorElement = document.getElementById('terms-error');

    if (!termsCheckbox.checked) {
        showError(termsCheckbox, errorElement, 'You must accept the terms and conditions');
        return false;
    }

    clearError(termsCheckbox, errorElement);
    return true;
}

function showError(input, errorElement, message) {
    input.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
    }
    input.setAttribute('aria-invalid', 'true');
}

function clearError(input, errorElement) {
    input.classList.remove('error');
    if (errorElement) {
        errorElement.textContent = '';
    }
    input.setAttribute('aria-invalid', 'false');
}

// ===================================
// Form Submission Handlers
// ===================================

function handleLoginSubmit() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const loginBtn = document.getElementById('loginBtn');

    // Validate all fields
    const isEmailValid = validateEmail(emailInput);
    const isPasswordValid = validatePassword(passwordInput, 'password-error', false);

    if (!isEmailValid || !isPasswordValid) {
        return;
    }

    // Show loading state
    loginBtn.disabled = true;
    loginBtn.querySelector('.btn-text').textContent = 'Logging in...';

    // Remember email if checkbox is checked
    if (rememberMeCheckbox.checked) {
        localStorage.setItem('rememberedEmail', emailInput.value);
    } else {
        localStorage.removeItem('rememberedEmail');
    }

    // Simulate API call
    setTimeout(() => {
        // In a real application, you would make an API call here
        console.log('Login submitted:', {
            email: emailInput.value,
            rememberMe: rememberMeCheckbox.checked
        });

        // Mark user as logged in
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUserEmail', emailInput.value);

        // Show success message
        showSuccessMessage('Login successful! Redirecting...');

        // Redirect to main platform
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1500);
}

function handleSignupSubmit() {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('signupEmail');
    const password = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const signupBtn = document.getElementById('signupBtn');

    // Validate all fields
    const isFirstNameValid = validateRequired(firstName, 'First name is required');
    const isLastNameValid = validateRequired(lastName, 'Last name is required');
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password, 'signupPassword-error', true);
    const isConfirmPasswordValid = validateConfirmPassword();
    const areTermsAccepted = validateTerms();

    if (!isFirstNameValid || !isLastNameValid || !isEmailValid ||
        !isPasswordValid || !isConfirmPasswordValid || !areTermsAccepted) {
        return;
    }

    // Show loading state
    signupBtn.disabled = true;
    signupBtn.querySelector('.btn-text').textContent = 'Creating account...';

    // Collect form data
    const formData = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phone: document.getElementById('phone').value,
        disabilityType: document.getElementById('disabilityType').value,
        accommodations: document.getElementById('accommodations').value,
        newsletter: document.getElementById('newsletter').checked
    };

    // Simulate API call
    setTimeout(() => {
        // In a real application, you would make an API call here
        console.log('Signup submitted:', formData);

        // Save user data to localStorage for profile population
        const userData = {
            fullName: `${formData.firstName} ${formData.lastName}`,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone || '-',
            disabilityType: getDisabilityTypeLabel(formData.disabilityType),
            accommodations: formData.accommodations || '-',
            assistiveTech: '-', // Can be updated later in profile
            age: '-', // Can be updated later in profile
            gender: '-', // Can be updated later in profile
            registrationDate: new Date().toISOString()
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('isLoggedIn', 'true');

        // Show success message
        showSuccessMessage('Account created successfully! Redirecting to login...');

        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }, 2000);
}

// Helper function to convert disability type value to label
function getDisabilityTypeLabel(value) {
    const labels = {
        'visual': 'Visual Impairment',
        'hearing': 'Hearing Impairment',
        'mobility': 'Mobility Impairment',
        'cognitive': 'Cognitive Disability',
        'multiple': 'Multiple Disabilities',
        'other': 'Other',
        '': 'Prefer not to say'
    };
    return labels[value] || 'Prefer not to say';
}

// ===================================
// Helper Functions
// ===================================

function loadRememberedEmail() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const emailInput = document.getElementById('email');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    if (rememberedEmail && emailInput) {
        emailInput.value = rememberedEmail;
        if (rememberMeCheckbox) {
            rememberMeCheckbox.checked = true;
        }
    }
}

function showSuccessMessage(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, #10B981 0%, #059669 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideInRight 0.3s ease-out;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
    `;

    notification.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
        </svg>
        <span>${message}</span>
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

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

// ===================================
// Social Login Handlers
// ===================================

document.addEventListener('click', function (e) {
    if (e.target.closest('.google-btn')) {
        handleSocialLogin('Google');
    } else if (e.target.closest('.microsoft-btn')) {
        handleSocialLogin('Microsoft');
    }
});

function handleSocialLogin(provider) {
    console.log(`${provider} login initiated`);

    // Show informational message
    const message = `${provider} login integration is not yet implemented. This would redirect to ${provider}'s OAuth page in production.`;
    alert(message);

    // In a real application, you would redirect to the OAuth provider here
    // Example: window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=...`;

    console.log(`${provider} login would be processed here`);
}

// ===================================
// Keyboard Navigation Enhancement
// ===================================

document.addEventListener('keydown', function (e) {
    // Submit form on Enter key in input fields
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'checkbox') {
        const form = e.target.closest('form');
        if (form) {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    }
});

// ===================================
// Accessibility: Announce form errors
// ===================================

function announceError(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'alert');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

// Add screen reader only class
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
`;
document.head.appendChild(style);
