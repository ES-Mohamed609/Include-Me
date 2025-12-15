/**
 * Storage Service
 * Following DIP: Abstract storage interface that can be implemented by different storage mechanisms
 * Following SRP: Only responsible for data persistence
 */

import { STORAGE_KEYS } from '../core/constants.js';
import { safeJSONParse } from '../core/utils.js';

/**
 * Abstract Storage Interface
 * Following ISP: Interface segregation - only methods needed
 */
export class IStorageService {
    get(key) {
        throw new Error('Method not implemented');
    }

    set(key, value) {
        throw new Error('Method not implemented');
    }

    remove(key) {
        throw new Error('Method not implemented');
    }

    clear() {
        throw new Error('Method not implemented');
    }
}

/**
 * LocalStorage Implementation
 * Following LSP: Can substitute IStorageService
 */
export class LocalStorageService extends IStorageService {
    /**
     * Gets a value from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*}
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? safeJSONParse(item, defaultValue) : defaultValue;
        } catch (error) {
            console.error(`Error getting item from localStorage: ${key}`, error);
            return defaultValue;
        }
    }

    /**
     * Sets a value in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} Success status
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error setting item in localStorage: ${key}`, error);
            return false;
        }
    }

    /**
     * Removes a value from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing item from localStorage: ${key}`, error);
            return false;
        }
    }

    /**
     * Clears all localStorage
     * @returns {boolean} Success status
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage', error);
            return false;
        }
    }

    /**
     * Checks if a key exists
     * @param {string} key - Storage key
     * @returns {boolean}
     */
    has(key) {
        return localStorage.getItem(key) !== null;
    }
}

/**
 * Profile Storage Service
 * Following SRP: Specialized service for profile operations
 */
export class ProfileStorageService {
    constructor(storageService) {
        this.storage = storageService; // Dependency injection
    }

    /**
     * Saves user profile
     * @param {UserProfile} profile - User profile to save
     * @returns {boolean}
     */
    saveProfile(profile) {
        return this.storage.set(STORAGE_KEYS.USER_PROFILE, profile.toJSON());
    }

    /**
     * Loads user profile
     * @returns {Object|null}
     */
    loadProfile() {
        return this.storage.get(STORAGE_KEYS.USER_PROFILE);
    }

    /**
     * Deletes user profile
     * @returns {boolean}
     */
    deleteProfile() {
        return this.storage.remove(STORAGE_KEYS.USER_PROFILE);
    }
}

/**
 * Job Storage Service
 * Following SRP: Specialized service for job operations
 */
export class JobStorageService {
    constructor(storageService) {
        this.storage = storageService;
    }

    /**
     * Saves a job to saved jobs
     * @param {string} jobId - Job ID
     * @returns {boolean}
     */
    saveJob(jobId) {
        const savedJobs = this.getSavedJobs();
        if (!savedJobs.includes(jobId)) {
            savedJobs.push(jobId);
            return this.storage.set(STORAGE_KEYS.SAVED_JOBS, savedJobs);
        }
        return true;
    }

    /**
     * Removes a job from saved jobs
     * @param {string} jobId - Job ID
     * @returns {boolean}
     */
    unsaveJob(jobId) {
        const savedJobs = this.getSavedJobs();
        const filtered = savedJobs.filter(id => id !== jobId);
        return this.storage.set(STORAGE_KEYS.SAVED_JOBS, filtered);
    }

    /**
     * Gets all saved job IDs
     * @returns {Array}
     */
    getSavedJobs() {
        return this.storage.get(STORAGE_KEYS.SAVED_JOBS, []);
    }

    /**
     * Checks if a job is saved
     * @param {string} jobId - Job ID
     * @returns {boolean}
     */
    isJobSaved(jobId) {
        return this.getSavedJobs().includes(jobId);
    }

    /**
     * Clears all saved jobs
     * @returns {boolean}
     */
    clearSavedJobs() {
        return this.storage.remove(STORAGE_KEYS.SAVED_JOBS);
    }
}

/**
 * Analysis Storage Service
 * Following SRP: Specialized service for analysis results
 */
export class AnalysisStorageService {
    constructor(storageService) {
        this.storage = storageService;
    }

    /**
     * Saves analysis results
     * @param {Object} results - Analysis results
     * @returns {boolean}
     */
    saveAnalysis(results) {
        return this.storage.set(STORAGE_KEYS.LAST_ANALYSIS, results);
    }

    /**
     * Loads last analysis results
     * @returns {Object|null}
     */
    loadAnalysis() {
        return this.storage.get(STORAGE_KEYS.LAST_ANALYSIS);
    }

    /**
     * Deletes analysis results
     * @returns {boolean}
     */
    deleteAnalysis() {
        return this.storage.remove(STORAGE_KEYS.LAST_ANALYSIS);
    }
}
