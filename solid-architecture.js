/**
 * Include Me - SOLID Architecture (Browser-Compatible Version)
 * All modules combined for direct browser use
 */

// ========================================
// CONSTANTS
// ========================================
const APP_CONSTANTS = {
    STORAGE_KEYS: {
        USER_PROFILE: 'userProfile',
        SAVED_JOBS: 'savedJobs',
        ACCESSIBILITY_SETTINGS: 'accessibilitySettings',
        LAST_ANALYSIS: 'lastAnalysisResults'
    },
    FONT_SIZES: {
        SMALL: 'small',
        MEDIUM: 'medium',
        LARGE: 'large',
        XLARGE: 'xlarge'
    },
    DISABILITY_TYPES: [
        'Visual Impairment',
        'Hearing Impairment',
        'Mobility Impairment',
        'Cognitive Disability',
        'Learning Disability',
        'Multiple Disabilities',
        'Other',
        'None'
    ],
    GENDER_OPTIONS: [
        'Male',
        'Female',
        'Non-binary',
        'Prefer not to say'
    ]
};

// ========================================
// UTILITIES
// ========================================
const Utils = {
    isValidEmail(email) {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
        return emailRegex.test(email);
    },

    isValidPhone(phone) {
        const phoneRegex = /^(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;
        return phoneRegex.test(phone);
    },

    isEmptyOrWhitespace(str) {
        return !str || str.trim().length === 0;
    },

    safeJSONParse(json, defaultValue = null) {
        try {
            return JSON.parse(json);
        } catch (error) {
            console.error('JSON parse error:', error);
            return defaultValue;
        }
    },

    calculatePercentage(value, total) {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    }
};

// ========================================
// USER PROFILE MODEL
// ========================================
class UserProfile {
    constructor(data = {}) {
        this.personal = {
            name: data.personal?.name || '',
            age: data.personal?.age || '',
            gender: data.personal?.gender || ''
        };

        this.contact = {
            email: data.contact?.email || '',
            phone: data.contact?.phone || ''
        };

        this.disability = {
            type: data.disability?.type || '',
            accommodations: data.disability?.accommodations || '',
            assistiveTech: data.disability?.assistiveTech || ''
        };

        this.certificates = data.certificates || [];
        this.courses = data.courses || [];
        this.skills = data.skills || [];
    }

    validate() {
        const errors = [];

        if (Utils.isEmptyOrWhitespace(this.personal.name)) {
            errors.push('Name is required');
        }

        if (this.personal.age && (this.personal.age < 18 || this.personal.age > 100)) {
            errors.push('Age must be between 18 and 100');
        }

        if (this.contact.email && !Utils.isValidEmail(this.contact.email)) {
            errors.push('Invalid email address');
        }

        if (this.contact.phone && !Utils.isValidPhone(this.contact.phone)) {
            errors.push('Invalid phone number');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    getCompletionPercentage() {
        const fields = [
            this.personal.name,
            this.personal.age,
            this.personal.gender,
            this.contact.email,
            this.contact.phone,
            this.disability.type
        ];

        const completedFields = fields.filter(field => !Utils.isEmptyOrWhitespace(field)).length;
        return Math.round((completedFields / fields.length) * 100);
    }

    addCertificate(certificate) {
        if (!certificate.name || !certificate.issuer || !certificate.year) {
            throw new Error('Certificate must have name, issuer, and year');
        }
        this.certificates.push(certificate);
    }

    removeCertificate(index) {
        if (index >= 0 && index < this.certificates.length) {
            this.certificates.splice(index, 1);
        }
    }

    addCourse(course) {
        if (!course.name || !course.provider || course.progress === undefined) {
            throw new Error('Course must have name, provider, and progress');
        }
        this.courses.push(course);
    }

    removeCourse(index) {
        if (index >= 0 && index < this.courses.length) {
            this.courses.splice(index, 1);
        }
    }

    updateSkills(skills) {
        this.skills = [...new Set(skills)];
    }

    toJSON() {
        return {
            personal: { ...this.personal },
            contact: { ...this.contact },
            disability: { ...this.disability },
            certificates: [...this.certificates],
            courses: [...this.courses],
            skills: [...this.skills]
        };
    }

    static fromJSON(json) {
        return new UserProfile(json);
    }
}

// ========================================
// STORAGE SERVICE
// ========================================
class StorageService {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? Utils.safeJSONParse(item, defaultValue) : defaultValue;
        } catch (error) {
            console.error(`Error getting item from localStorage: ${key}`, error);
            return defaultValue;
        }
    }

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error setting item in localStorage: ${key}`, error);
            return false;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing item from localStorage: ${key}`, error);
            return false;
        }
    }
}

// ========================================
// PROFILE MANAGER (Following SOLID)
// ========================================
class ProfileManager {
    constructor() {
        this.storage = new StorageService();
        this.currentProfile = null;
        this.loadProfile();
    }

    loadProfile() {
        const profileData = this.storage.get(APP_CONSTANTS.STORAGE_KEYS.USER_PROFILE);
        if (profileData) {
            this.currentProfile = UserProfile.fromJSON(profileData);
            console.log('✅ Profile loaded (SOLID):', this.currentProfile.personal.name);
        } else {
            this.currentProfile = new UserProfile();
            console.log('✅ New profile created (SOLID)');
        }
        return this.currentProfile;
    }

    saveProfile() {
        if (this.currentProfile) {
            const success = this.storage.set(
                APP_CONSTANTS.STORAGE_KEYS.USER_PROFILE,
                this.currentProfile.toJSON()
            );
            if (success) {
                console.log('✅ Profile saved (SOLID)');
            }
            return success;
        }
        return false;
    }

    updatePersonalInfo(data) {
        this.currentProfile.personal = { ...this.currentProfile.personal, ...data };
        return this.saveProfile();
    }

    updateContactInfo(data) {
        this.currentProfile.contact = { ...this.currentProfile.contact, ...data };
        return this.saveProfile();
    }

    updateDisabilityInfo(data) {
        this.currentProfile.disability = { ...this.currentProfile.disability, ...data };
        return this.saveProfile();
    }

    addCertificate(certificate) {
        this.currentProfile.addCertificate(certificate);
        return this.saveProfile();
    }

    removeCertificate(index) {
        this.currentProfile.removeCertificate(index);
        return this.saveProfile();
    }

    addCourse(course) {
        this.currentProfile.addCourse(course);
        return this.saveProfile();
    }

    removeCourse(index) {
        this.currentProfile.removeCourse(index);
        return this.saveProfile();
    }

    getProfile() {
        return this.currentProfile;
    }

    getCompletionPercentage() {
        return this.currentProfile.getCompletionPercentage();
    }
}

// ========================================
// INITIALIZE
// ========================================
console.log('🚀 Include Me - SOLID Architecture Loaded');
console.log('📦 Modules: UserProfile, StorageService, ProfileManager');
console.log('✨ Following Clean Code & SOLID Principles');

// Make available globally
window.UserProfile = UserProfile;
window.StorageService = StorageService;
window.ProfileManager = ProfileManager;
window.APP_CONSTANTS = APP_CONSTANTS;
window.Utils = Utils;

// Auto-initialize profile manager
window.profileManager = new ProfileManager();
console.log('✅ ProfileManager initialized and ready');

// ========================================
// UPDATE USER NAME IN HEADER
// ========================================
function updateHeaderUserName() {
  const profileManager = window.profileManager;
  if (profileManager) {
    const profile = profileManager.getProfile();
    const userName = profile.personal.name || 'User';
    const headerUserName = document.getElementById('headerUserName');
    if (headerUserName) {
      headerUserName.textContent = userName;
      console.log(' Header user name updated to:', userName);
    }
    
    // Update avatar URL
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar && userName !== 'User') {
      userAvatar.src = \https://ui-avatars.com/api/?name=\&background=DC143C&color=fff\;
    }
  }
}

// Call on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateHeaderUserName);
} else {
  updateHeaderUserName();
}

// Update when profile changes
window.addEventListener('profileUpdated', updateHeaderUserName);

console.log(' Dynamic user name feature loaded');
