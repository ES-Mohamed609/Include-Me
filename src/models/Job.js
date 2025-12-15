/**
 * Job Model
 * Following SRP: Encapsulates job data and matching logic
 */

import { MATCH_LEVELS } from '../core/constants.js';
import { calculatePercentage, formatDaysAgo } from '../core/utils.js';

export class Job {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.company = data.company;
        this.location = data.location;
        this.type = data.type;
        this.salary = data.salary;
        this.description = data.description;
        this.requirements = data.requirements;
        this.skills = data.skills || [];
        this.postedDate = data.postedDate || new Date();
        this.accessibilityFriendly = data.accessibilityFriendly || false;
        this.disabilityAccommodations = data.disabilityAccommodations || [];
    }

    /**
     * Calculates match percentage with candidate skills
     * @param {Array} candidateSkills - Array of candidate skill names
     * @returns {number} Match percentage (0-100)
     */
    calculateMatchPercentage(candidateSkills) {
        if (!candidateSkills || candidateSkills.length === 0) {
            return 0;
        }

        const matchedSkills = this.getMatchedSkills(candidateSkills);
        return calculatePercentage(matchedSkills.length, this.skills.length);
    }

    /**
     * Gets skills that match with candidate
     * @param {Array} candidateSkills - Array of candidate skill names
     * @returns {Array} Matched skills
     */
    getMatchedSkills(candidateSkills) {
        return this.skills.filter(jobSkill =>
            candidateSkills.some(candidateSkill =>
                candidateSkill.toLowerCase() === jobSkill.toLowerCase()
            )
        );
    }

    /**
     * Gets skills that are missing from candidate
     * @param {Array} candidateSkills - Array of candidate skill names
     * @returns {Array} Missing skills
     */
    getMissingSkills(candidateSkills) {
        return this.skills.filter(jobSkill =>
            !candidateSkills.some(candidateSkill =>
                candidateSkill.toLowerCase() === jobSkill.toLowerCase()
            )
        );
    }

    /**
     * Gets match level (high/medium/low)
     * @param {number} matchPercentage - Match percentage
     * @returns {Object} Match level object
     */
    static getMatchLevel(matchPercentage) {
        if (matchPercentage >= MATCH_LEVELS.HIGH.min) {
            return MATCH_LEVELS.HIGH;
        } else if (matchPercentage >= MATCH_LEVELS.MEDIUM.min) {
            return MATCH_LEVELS.MEDIUM;
        }
        return MATCH_LEVELS.LOW;
    }

    /**
     * Gets formatted posted date
     * @returns {string}
     */
    getPostedDateFormatted() {
        return formatDaysAgo(this.postedDate);
    }

    /**
     * Checks if job is recently posted (within 7 days)
     * @returns {boolean}
     */
    isRecentlyPosted() {
        const daysSincePosted = Math.floor((new Date() - this.postedDate) / (1000 * 60 * 60 * 24));
        return daysSincePosted <= 7;
    }

    /**
     * Converts job to JSON
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            company: this.company,
            location: this.location,
            type: this.type,
            salary: this.salary,
            description: this.description,
            requirements: this.requirements,
            skills: [...this.skills],
            postedDate: this.postedDate.toISOString(),
            accessibilityFriendly: this.accessibilityFriendly,
            disabilityAccommodations: [...this.disabilityAccommodations]
        };
    }

    /**
     * Creates a Job from JSON
     * @param {Object} json - JSON data
     * @returns {Job}
     */
    static fromJSON(json) {
        return new Job({
            ...json,
            postedDate: new Date(json.postedDate)
        });
    }
}
