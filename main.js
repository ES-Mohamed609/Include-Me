/**
 * Include Me - Main Application
 * Refactored following Clean Code and SOLID Principles
 */

// Import core utilities and constants
import { STORAGE_KEYS, FONT_SIZES } from './src/core/constants.js';
import { onDOMReady } from './src/core/utils.js';

// Import models
import { UserProfile } from './src/models/UserProfile.js';
import { Job } from './src/models/Job.js';

// Import services
import {
    LocalStorageService,
    ProfileStorageService,
    JobStorageService,
    AnalysisStorageService
} from './src/services/StorageService.js';

/**
 * Application Class - Main entry point
 * Following SRP: Coordinates application initialization
 */
class IncludeMeApp {
    constructor() {
        // Initialize services (Dependency Injection)
        this.storageService = new LocalStorageService();
        this.profileStorage = new ProfileStorageService(this.storageService);
        this.jobStorage = new JobStorageService(this.storageService);
        this.analysisStorage = new AnalysisStorageService(this.storageService);

        // Initialize state
        this.currentUser = null;
        this.accessibilitySettings = this.loadAccessibilitySettings();

        console.log('Include Me - Application initialized with SOLID architecture');
    }

    /**
     * Initializes the application
     */
    initialize() {
        this.loadUserProfile();
        this.applyAccessibilitySettings();
        this.setupEventListeners();
        this.initializeUI();
    }

    /**
     * Loads user profile from storage
     */
    loadUserProfile() {
        const profileData = this.profileStorage.loadProfile();
        if (profileData) {
            this.currentUser = UserProfile.fromJSON(profileData);
            console.log('User profile loaded:', this.currentUser);
        } else {
            this.currentUser = new UserProfile();
            console.log('New user profile created');
        }
    }

    /**
     * Saves user profile to storage
     */
    saveUserProfile() {
        if (this.currentUser) {
            const success = this.profileStorage.saveProfile(this.currentUser);
            if (success) {
                console.log('User profile saved successfully');
                this.announceToScreenReader('Profile saved successfully');
            }
        }
    }

    /**
     * Loads accessibility settings
     */
    loadAccessibilitySettings() {
        return this.storageService.get(STORAGE_KEYS.ACCESSIBILITY_SETTINGS, {
            fontSize: FONT_SIZES.MEDIUM,
            highContrast: false,
            notificationsEnabled: false
        });
    }

    /**
     * Saves accessibility settings
     */
    saveAccessibilitySettings() {
        this.storageService.set(STORAGE_KEYS.ACCESSIBILITY_SETTINGS, this.accessibilitySettings);
    }

    /**
     * Applies accessibility settings to UI
     */
    applyAccessibilitySettings() {
        // Font size
        document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
        document.body.classList.add(`font-${this.accessibilitySettings.fontSize}`);

        // High contrast
        if (this.accessibilitySettings.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }

    /**
     * Sets up global event listeners
     */
    setupEventListeners() {
        // Profile edit button
        const editProfileBtn = document.getElementById('editProfileBtn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => this.showEditProfileModal());
        }

        // Add certificate button
        const addCertBtn = document.getElementById('addCertificateBtn');
        if (addCertBtn) {
            addCertBtn.addEventListener('click', () => this.showAddCertificateModal());
        }

        // Add course button
        const addCourseBtn = document.getElementById('addCourseBtn');
        if (addCourseBtn) {
            addCourseBtn.addEventListener('click', () => this.showAddCourseModal());
        }

        // Accessibility controls
        this.setupAccessibilityControls();
    }

    /**
     * Sets up accessibility control buttons
     */
    setupAccessibilityControls() {
        // Font size toggle
        const fontSizeBtn = document.getElementById('fontSizeBtn');
        if (fontSizeBtn) {
            fontSizeBtn.addEventListener('click', () => this.toggleFontSize());
        }

        // High contrast toggle
        const contrastBtn = document.getElementById('contrastBtn');
        if (contrastBtn) {
            contrastBtn.addEventListener('click', () => this.toggleHighContrast());
        }

        // Notification toggle
        const notifBtn = document.getElementById('notificationToggle');
        if (notifBtn) {
            notifBtn.addEventListener('click', () => this.toggleNotifications());
        }
    }

    /**
     * Toggles font size
     */
    toggleFontSize() {
        const sizes = [FONT_SIZES.SMALL, FONT_SIZES.MEDIUM, FONT_SIZES.LARGE, FONT_SIZES.XLARGE];
        const currentIndex = sizes.indexOf(this.accessibilitySettings.fontSize);
        const nextIndex = (currentIndex + 1) % sizes.length;
        this.accessibilitySettings.fontSize = sizes[nextIndex];
        this.applyAccessibilitySettings();
        this.saveAccessibilitySettings();
        this.announceToScreenReader(`Font size changed to ${sizes[nextIndex]}`);
    }

    /**
     * Toggles high contrast mode
     */
    toggleHighContrast() {
        this.accessibilitySettings.highContrast = !this.accessibilitySettings.highContrast;
        this.applyAccessibilitySettings();
        this.saveAccessibilitySettings();
        this.announceToScreenReader(`High contrast ${this.accessibilitySettings.highContrast ? 'enabled' : 'disabled'}`);
    }

    /**
     * Toggles notifications
     */
    async toggleNotifications() {
        if (!this.accessibilitySettings.notificationsEnabled) {
            const permission = await this.requestNotificationPermission();
            if (permission === 'granted') {
                this.accessibilitySettings.notificationsEnabled = true;
                this.saveAccessibilitySettings();
                this.announceToScreenReader('Notifications enabled');
            }
        } else {
            this.accessibilitySettings.notificationsEnabled = false;
            this.saveAccessibilitySettings();
            this.announceToScreenReader('Notifications disabled');
        }
    }

    /**
     * Requests notification permission
     */
    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            return 'denied';
        }
        if (Notification.permission === 'granted') {
            return 'granted';
        }
        if (Notification.permission !== 'denied') {
            return await Notification.requestPermission();
        }
        return Notification.permission;
    }

    /**
     * Announces message to screen readers
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    /**
     * Initializes UI components
     */
    initializeUI() {
        this.displayProfile();
        console.log('UI initialized');
    }

    /**
     * Displays user profile
     */
    displayProfile() {
        if (!this.currentUser) return;

        // Personal information
        this.updateElement('profileName', this.currentUser.personal.name || '-');
        this.updateElement('profileAge', this.currentUser.personal.age || '-');
        this.updateElement('profileGender', this.currentUser.personal.gender || '-');

        // Contact information
        this.updateElement('profileEmail', this.currentUser.contact.email || '-');
        this.updateElement('profilePhone', this.currentUser.contact.phone || '-');

        // Disability information
        this.updateElement('profileDisabilityType', this.currentUser.disability.type || '-');
        this.updateElement('profileAccommodations', this.currentUser.disability.accommodations || '-');
        this.updateElement('profileAssistiveTech', this.currentUser.disability.assistiveTech || '-');

        // Certificates and courses
        this.displayCertificates();
        this.displayCourses();
        this.displaySkills();
    }

    /**
     * Updates element text content
     */
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    /**
     * Displays certificates
     */
    displayCertificates() {
        const container = document.getElementById('certificatesList');
        if (!container) return;

        if (this.currentUser.certificates.length === 0) {
            container.innerHTML = '<p class="empty-state">No certificates added yet</p>';
            return;
        }

        container.innerHTML = this.currentUser.certificates.map((cert, index) => `
      <div class="certificate-item">
        <div class="certificate-info">
          <h4>${cert.name}</h4>
          <p>${cert.issuer} • ${cert.year}</p>
        </div>
        <button class="btn-icon" onclick="app.removeCertificate(${index})" aria-label="Remove certificate">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/>
          </svg>
        </button>
      </div>
    `).join('');
    }

    /**
     * Displays courses
     */
    displayCourses() {
        const container = document.getElementById('coursesList');
        if (!container) return;

        if (this.currentUser.courses.length === 0) {
            container.innerHTML = '<p class="empty-state">No ongoing courses</p>';
            return;
        }

        container.innerHTML = this.currentUser.courses.map((course, index) => `
      <div class="course-item">
        <div class="course-info">
          <h4>${course.name}</h4>
          <p>${course.provider}</p>
          <div class="course-progress">
            <div class="progress-bar-small">
              <div class="progress-fill-small" style="width: ${course.progress}%"></div>
            </div>
            <span>${course.progress}% Complete</span>
          </div>
        </div>
        <button class="btn-icon" onclick="app.removeCourse(${index})" aria-label="Remove course">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/>
          </svg>
        </button>
      </div>
    `).join('');
    }

    /**
     * Displays skills
     */
    displaySkills() {
        const container = document.getElementById('profileSkills');
        if (!container) return;

        if (this.currentUser.skills.length === 0) {
            container.innerHTML = '<p class="empty-state">Upload your CV to detect skills</p>';
            return;
        }

        container.innerHTML = this.currentUser.skills.map(skill =>
            `<span class="skill-tag">${skill}</span>`
        ).join('');
    }

    /**
     * Shows edit profile modal
     */
    showEditProfileModal() {
        // Modal implementation will be handled by existing code
        // This is a hook for the new architecture
        console.log('Edit profile modal triggered');
        if (window.showEditProfileModal) {
            window.showEditProfileModal();
        }
    }

    /**
     * Shows add certificate modal
     */
    showAddCertificateModal() {
        console.log('Add certificate modal triggered');
        if (window.showAddCertificateModal) {
            window.showAddCertificateModal();
        }
    }

    /**
     * Shows add course modal
     */
    showAddCourseModal() {
        console.log('Add course modal triggered');
        if (window.showAddCourseModal) {
            window.showAddCourseModal();
        }
    }

    /**
     * Removes a certificate
     */
    removeCertificate(index) {
        if (confirm('Are you sure you want to remove this certificate?')) {
            this.currentUser.removeCertificate(index);
            this.saveUserProfile();
            this.displayCertificates();
            this.announceToScreenReader('Certificate removed');
        }
    }

    /**
     * Removes a course
     */
    removeCourse(index) {
        if (confirm('Are you sure you want to remove this course?')) {
            this.currentUser.removeCourse(index);
            this.saveUserProfile();
            this.displayCourses();
            this.announceToScreenReader('Course removed');
        }
    }
}

// Initialize application when DOM is ready
let app;
onDOMReady(() => {
    app = new IncludeMeApp();
    app.initialize();
    window.app = app; // Make available globally for onclick handlers
    console.log('Include Me application ready');
});

export { IncludeMeApp };
