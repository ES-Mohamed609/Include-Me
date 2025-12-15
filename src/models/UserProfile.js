/**
 * UserProfile Model
 * Following SRP: Encapsulates user profile data and validation
 */

import { DISABILITY_TYPES, GENDER_OPTIONS } from '../core/constants.js';
import { isValidEmail, isValidPhone, isEmptyOrWhitespace } from '../core/utils.js';

export class UserProfile {
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

    /**
     * Validates the user profile
     * @returns {Object} Validation result with isValid and errors
     */
    validate() {
        const errors = [];

        // Personal information validation
        if (isEmptyOrWhitespace(this.personal.name)) {
            errors.push('Name is required');
        }

        if (this.personal.age && (this.personal.age < 18 || this.personal.age > 100)) {
            errors.push('Age must be between 18 and 100');
        }

        if (this.personal.gender && !GENDER_OPTIONS.includes(this.personal.gender)) {
            errors.push('Invalid gender option');
        }

        // Contact information validation
        if (this.contact.email && !isValidEmail(this.contact.email)) {
            errors.push('Invalid email address');
        }

        if (this.contact.phone && !isValidPhone(this.contact.phone)) {
            errors.push('Invalid phone number');
        }

        // Disability information validation
        if (this.disability.type && !DISABILITY_TYPES.includes(this.disability.type)) {
            errors.push('Invalid disability type');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Checks if profile is complete
     * @returns {boolean}
     */
    isComplete() {
        return !isEmptyOrWhitespace(this.personal.name) &&
            !isEmptyOrWhitespace(this.contact.email) &&
            !isEmptyOrWhitespace(this.contact.phone);
    }

    /**
     * Gets profile completion percentage
     * @returns {number}
     */
    getCompletionPercentage() {
        const fields = [
            this.personal.name,
            this.personal.age,
            this.personal.gender,
            this.contact.email,
            this.contact.phone,
            this.disability.type
        ];

        const completedFields = fields.filter(field => !isEmptyOrWhitespace(field)).length;
        return Math.round((completedFields / fields.length) * 100);
    }

    /**
     * Adds a certificate
     * @param {Object} certificate - Certificate data
     */
    addCertificate(certificate) {
        if (!certificate.name || !certificate.issuer || !certificate.year) {
            throw new Error('Certificate must have name, issuer, and year');
        }
        this.certificates.push(certificate);
    }

    /**
     * Removes a certificate by index
     * @param {number} index - Certificate index
     */
    removeCertificate(index) {
        if (index >= 0 && index < this.certificates.length) {
            this.certificates.splice(index, 1);
        }
    }

    /**
     * Adds a course
     * @param {Object} course - Course data
     */
    addCourse(course) {
        if (!course.name || !course.provider || course.progress === undefined) {
            throw new Error('Course must have name, provider, and progress');
        }
        this.courses.push(course);
    }

    /**
     * Removes a course by index
     * @param {number} index - Course index
     */
    removeCourse(index) {
        if (index >= 0 && index < this.courses.length) {
            this.courses.splice(index, 1);
        }
    }

    /**
     * Updates skills from CV analysis
     * @param {Array} skills - Array of skill names
     */
    updateSkills(skills) {
        this.skills = [...new Set(skills)]; // Remove duplicates
    }

    /**
     * Converts profile to JSON
     * @returns {Object}
     */
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

    /**
     * Creates a UserProfile from JSON
     * @param {Object} json - JSON data
     * @returns {UserProfile}
     */
    static fromJSON(json) {
        return new UserProfile(json);
    }
}
