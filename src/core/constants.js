/**
 * Application Constants
 * Following Clean Code: Extract magic numbers and strings
 */

export const APP_CONFIG = {
    NAME: 'Include Me',
    VERSION: '1.0.0',
    MAX_FILE_SIZE_MB: 10,
    SUPPORTED_FILE_TYPES: ['.pdf', '.doc', '.docx', '.txt']
};

export const SCORE_THRESHOLDS = {
    EXCELLENT: 80,
    GOOD: 60,
    MODERATE: 40,
    MIN: 0,
    MAX: 100
};

export const MATCH_LEVELS = {
    HIGH: { min: 70, label: 'High Match', class: 'high' },
    MEDIUM: { min: 50, label: 'Medium Match', class: 'medium' },
    LOW: { min: 0, label: 'Low Match', class: 'low' }
};

export const DISABILITY_TYPES = [
    'Visual Impairment',
    'Hearing Impairment',
    'Mobility Impairment',
    'Cognitive Disability',
    'Learning Disability',
    'Multiple Disabilities',
    'Other',
    'None'
];

export const GENDER_OPTIONS = [
    'Male',
    'Female',
    'Non-binary',
    'Prefer not to say'
];

export const FONT_SIZES = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    XLARGE: 'xlarge'
};

export const STORAGE_KEYS = {
    USER_PROFILE: 'userProfile',
    SAVED_JOBS: 'savedJobs',
    ACCESSIBILITY_SETTINGS: 'accessibilitySettings',
    LAST_ANALYSIS: 'lastAnalysisResults'
};

export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning'
};

export const SKILLS_DATABASE = [
    'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go',
    'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt', 'gatsby',
    'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails',
    'sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible',
    'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence',
    'agile', 'scrum', 'kanban', 'devops', 'ci/cd',
    'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
    'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap',
    'typescript', 'graphql', 'rest api', 'microservices', 'serverless',
    'machine learning', 'deep learning', 'ai', 'data science', 'data analysis',
    'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
    'project management', 'product management', 'business analysis',
    'testing', 'unit testing', 'integration testing', 'e2e testing', 'jest', 'cypress',
    'security', 'authentication', 'authorization', 'oauth', 'jwt',
    'responsive design', 'mobile development', 'ios', 'android', 'react native', 'flutter',
    'figma', 'adobe xd', 'user research', 'accessibility'
];

export const BREAKPOINTS = {
    MOBILE_SMALL: 480,
    MOBILE_LARGE: 768,
    TABLET: 1024,
    DESKTOP: 1440
};

export const ANIMATION_DURATION = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
};
