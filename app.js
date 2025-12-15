// ========================================
// CV ANALYZER - Enhanced Features
// Job Board, Learning Center, Accessibility
// ========================================

// Accessibility Settings
let accessibilitySettings = {
    fontSize: 'medium', // small, medium, large, xlarge
    highContrast: false,
    notificationsEnabled: false
};

// Load settings from localStorage
function loadAccessibilitySettings() {
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
        accessibilitySettings = JSON.parse(saved);
        applyAccessibilitySettings();
    }
}

function saveAccessibilitySettings() {
    localStorage.setItem('accessibilitySettings', JSON.stringify(accessibilitySettings));
}

function applyAccessibilitySettings() {
    // Font size
    document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
    document.body.classList.add(`font-${accessibilitySettings.fontSize}`);

    // High contrast
    if (accessibilitySettings.highContrast) {
        document.body.classList.add('high-contrast');
    } else {
        document.body.classList.remove('high-contrast');
    }
}

// Font Size Toggle
document.getElementById('fontSizeBtn')?.addEventListener('click', () => {
    const sizes = ['small', 'medium', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(accessibilitySettings.fontSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    accessibilitySettings.fontSize = sizes[nextIndex];
    applyAccessibilitySettings();
    saveAccessibilitySettings();

    // Announce to screen readers
    announceToScreenReader(`Font size changed to ${sizes[nextIndex]}`);
});

// High Contrast Toggle
document.getElementById('contrastBtn')?.addEventListener('click', () => {
    accessibilitySettings.highContrast = !accessibilitySettings.highContrast;
    applyAccessibilitySettings();
    saveAccessibilitySettings();
    announceToScreenReader(`High contrast ${accessibilitySettings.highContrast ? 'enabled' : 'disabled'}`);
});

// Notification Toggle
document.getElementById('notificationToggle')?.addEventListener('click', async () => {
    if (!accessibilitySettings.notificationsEnabled) {
        const permission = await requestNotificationPermission();
        if (permission === 'granted') {
            accessibilitySettings.notificationsEnabled = true;
            saveAccessibilitySettings();
            showNotification('Job Alerts Enabled', 'You will receive notifications for new matching jobs');
            announceToScreenReader('Job notifications enabled');
        }
    } else {
        accessibilitySettings.notificationsEnabled = false;
        saveAccessibilitySettings();
        announceToScreenReader('Job notifications disabled');
    }
});

// Screen Reader Announcements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================

async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return 'denied';
    }

    if (Notification.permission === 'granted') {
        return 'granted';
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission;
    }

    return Notification.permission;
}

function showNotification(title, body, data = {}) {
    if (!accessibilitySettings.notificationsEnabled || Notification.permission !== 'granted') {
        return;
    }

    const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: data.tag || 'cv-analyzer',
        data
    });

    notification.onclick = function (event) {
        event.preventDefault();
        window.focus();
        if (data.action) {
            data.action();
        }
    };

    // Update notification count
    updateNotificationCount();
}

function updateNotificationCount() {
    const badge = document.getElementById('notificationCount');
    const count = parseInt(badge.textContent) + 1;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
}

// ========================================
// JOB BOARD DATA
// ========================================

const jobsDatabase = [
    {
        id: 'job-1',
        title: 'Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'Remote',
        type: 'Full-time',
        salary: '$60,000 - $90,000',
        description: 'We are looking for a talented Frontend Developer to join our team.',
        requirements: 'Experience with React, JavaScript, HTML, CSS. Good communication skills.',
        skills: ['react', 'javascript', 'html', 'css', 'git', 'communication'],
        postedDate: new Date('2025-12-10'),
        accessibilityFriendly: true,
        disabilityAccommodations: ['Remote work', 'Flexible hours', 'Screen reader compatible tools']
    },
    {
        id: 'job-2',
        title: 'Python Data Analyst',
        company: 'DataViz Solutions',
        location: 'New York, NY',
        type: 'Full-time',
        salary: '$70,000 - $95,000',
        description: 'Join our data team to analyze and visualize complex datasets.',
        requirements: 'Python, pandas, data analysis, SQL. Bachelor degree preferred.',
        skills: ['python', 'pandas', 'sql', 'data analysis', 'machine learning'],
        postedDate: new Date('2025-12-11'),
        accessibilityFriendly: true,
        disabilityAccommodations: ['Accessible office', 'Assistive technology provided']
    },
    {
        id: 'job-3',
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$80,000 - $120,000',
        description: 'Build scalable web applications using modern technologies.',
        requirements: 'Node.js, React, MongoDB, AWS. 3+ years experience.',
        skills: ['node.js', 'react', 'mongodb', 'aws', 'docker', 'rest api'],
        postedDate: new Date('2025-12-09'),
        accessibilityFriendly: true,
        disabilityAccommodations: ['Remote option available', 'Ergonomic workspace']
    },
    {
        id: 'job-4',
        title: 'UX/UI Designer',
        company: 'DesignHub',
        location: 'Remote',
        type: 'Contract',
        salary: '$50 - $80/hour',
        description: 'Create beautiful and accessible user interfaces.',
        requirements: 'Figma, Adobe XD, user research, accessibility standards (WCAG).',
        skills: ['figma', 'adobe xd', 'user research', 'accessibility', 'responsive design'],
        postedDate: new Date('2025-12-12'),
        accessibilityFriendly: true,
        disabilityAccommodations: ['Flexible schedule', 'Accessibility-first design culture']
    },
    {
        id: 'job-5',
        title: 'DevOps Engineer',
        company: 'CloudTech',
        location: 'Austin, TX',
        type: 'Full-time',
        salary: '$90,000 - $130,000',
        description: 'Manage cloud infrastructure and CI/CD pipelines.',
        requirements: 'AWS, Kubernetes, Docker, Terraform, Jenkins.',
        skills: ['aws', 'kubernetes', 'docker', 'terraform', 'jenkins', 'ci/cd'],
        postedDate: new Date('2025-12-08'),
        accessibilityFriendly: true,
        disabilityAccommodations: ['Remote work', 'Flexible hours']
    }
];

// ========================================
// LEARNING RESOURCES DATA
// ========================================

const learningResources = [
    {
        id: 'learn-1',
        title: 'JavaScript Fundamentals',
        type: 'course',
        skill: 'javascript',
        difficulty: 'beginner',
        duration: '4 weeks',
        provider: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
        free: true,
        accessibleFormat: true,
        description: 'Learn JavaScript basics including variables, functions, and DOM manipulation.'
    },
    {
        id: 'learn-2',
        title: 'React Complete Guide',
        type: 'course',
        skill: 'react',
        difficulty: 'intermediate',
        duration: '6 weeks',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/react',
        free: false,
        accessibleFormat: true,
        description: 'Master React including hooks, context, and state management.'
    },
    {
        id: 'learn-3',
        title: 'Python for Data Science',
        type: 'course',
        skill: 'python',
        difficulty: 'beginner',
        duration: '8 weeks',
        provider: 'edX',
        url: 'https://www.edx.org/learn/python',
        free: true,
        accessibleFormat: true,
        description: 'Learn Python programming with focus on data analysis and visualization.'
    },
    {
        id: 'learn-4',
        title: 'AWS Cloud Practitioner',
        type: 'course',
        skill: 'aws',
        difficulty: 'beginner',
        duration: '3 weeks',
        provider: 'AWS Training',
        url: 'https://aws.amazon.com/training/',
        free: true,
        accessibleFormat: true,
        description: 'Get started with AWS cloud services and prepare for certification.'
    },
    {
        id: 'learn-5',
        title: 'Accessibility Best Practices',
        type: 'article',
        skill: 'accessibility',
        difficulty: 'intermediate',
        duration: '2 hours',
        provider: 'MDN Web Docs',
        url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility',
        free: true,
        accessibleFormat: true,
        description: 'Learn how to build accessible web applications following WCAG guidelines.'
    },
    {
        id: 'learn-6',
        title: 'Docker Mastery',
        type: 'course',
        skill: 'docker',
        difficulty: 'intermediate',
        duration: '5 weeks',
        provider: 'Udemy',
        url: 'https://www.udemy.com/topic/docker/',
        free: false,
        accessibleFormat: true,
        description: 'Master Docker containerization and orchestration.'
    }
];

// ========================================
// NAVIGATION SYSTEM
// ========================================

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.page-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.dataset.section;

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show corresponding section
            sections.forEach(section => {
                section.style.display = 'none';
            });

            const targetSection = document.getElementById(`${sectionId}Section`);
            if (targetSection) {
                targetSection.style.display = 'block';

                // Load section content if needed
                if (sectionId === 'jobs') {
                    displayJobs();
                } else if (sectionId === 'learning') {
                    displayLearningResources();
                } else if (sectionId === 'saved') {
                    displaySavedJobs();
                } else if (sectionId === 'profile') {
                    // Profile loads automatically from localStorage
                    if (window.displayProfile) {
                        window.displayProfile();
                    }
                } else if (sectionId === 'community') {
                    // Community section - no special loading needed
                    console.log('Community section loaded');
                }
            }

            // Announce to screen readers
            announceToScreenReader(`Navigated to ${item.textContent.trim()}`);
        });
    });
}

// ========================================
// JOB BOARD FUNCTIONS
// ========================================

function calculateJobMatch(job, cvSkills) {
    if (!cvSkills || cvSkills.length === 0) {
        return 0;
    }

    const matchedSkills = job.skills.filter(skill =>
        cvSkills.some(cvSkill => cvSkill.toLowerCase() === skill.toLowerCase())
    );

    return Math.round((matchedSkills.length / job.skills.length) * 100);
}

function displayJobs(filter = 'all') {
    const jobsGrid = document.getElementById('jobsGrid');
    const cvSkills = window.lastAnalysisResults?.skills || [];

    let filteredJobs = jobsDatabase;

    // Apply match filter
    if (filter !== 'all' && cvSkills.length > 0) {
        filteredJobs = jobsDatabase.filter(job => {
            const match = calculateJobMatch(job, cvSkills);
            if (filter === 'high') return match >= 70;
            if (filter === 'medium') return match >= 50 && match < 70;
            if (filter === 'low') return match < 50;
            return true;
        });
    }

    if (filteredJobs.length === 0) {
        jobsGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No jobs found. Try adjusting your filters or upload your CV for better matches.</p>';
        return;
    }

    jobsGrid.innerHTML = filteredJobs.map(job => {
        const matchScore = cvSkills.length > 0 ? calculateJobMatch(job, cvSkills) : null;
        const daysAgo = Math.floor((new Date() - job.postedDate) / (1000 * 60 * 60 * 24));

        return `
            <div class="job-card" data-job-id="${job.id}">
                <div class="job-header">
                    <h3>${job.title}</h3>
                    ${matchScore !== null ? `
                        <div class="match-badge ${matchScore >= 70 ? 'high' : matchScore >= 50 ? 'medium' : 'low'}">
                            ${matchScore}% Match
                        </div>
                    ` : ''}
                </div>
                <div class="job-company">${job.company}</div>
                <div class="job-meta">
                    <span><svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/></svg> ${job.location}</span>
                    <span><svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/></svg> ${job.type}</span>
                    <span><svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"/></svg> ${job.salary}</span>
                </div>
                <p class="job-description">${job.description}</p>
                <div class="job-skills">
                    ${job.skills.slice(0, 5).map(skill => `<span class="skill-tag-small">${skill}</span>`).join('')}
                    ${job.skills.length > 5 ? `<span class="skill-tag-small">+${job.skills.length - 5} more</span>` : ''}
                </div>
                ${job.accessibilityFriendly ? `
                    <div class="accessibility-badge">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                        </svg>
                        Accessibility Friendly
                    </div>
                ` : ''}
                <div class="job-actions">
                    <button class="btn-primary btn-small" onclick="viewJobDetails('${job.id}')">View Details</button>
                    <button class="btn-secondary btn-small" onclick="toggleSaveJob('${job.id}')">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
                        </svg>
                        Save
                    </button>
                </div>
                <div class="job-posted">Posted ${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago</div>
            </div>
        `;
    }).join('');

    // Check for high-match jobs and send notification
    if (cvSkills.length > 0 && accessibilitySettings.notificationsEnabled) {
        const highMatchJobs = filteredJobs.filter(job => calculateJobMatch(job, cvSkills) >= 70);
        if (highMatchJobs.length > 0) {
            showNotification(
                'High Match Jobs Found!',
                `${highMatchJobs.length} job${highMatchJobs.length > 1 ? 's' : ''} match your CV with 70%+ compatibility`,
                { tag: 'high-match-jobs' }
            );
        }
    }
}

function viewJobDetails(jobId) {
    const job = jobsDatabase.find(j => j.id === jobId);
    if (!job) return;

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h2>${job.title}</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()" aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 1.5rem;">
                    <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">${job.company}</h3>
                    <div class="job-meta">
                        <span>${job.location}</span>
                        <span>${job.type}</span>
                        <span>${job.salary}</span>
                    </div>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="margin-bottom: 0.5rem;">Description</h4>
                    <p style="color: var(--text-secondary);">${job.description}</p>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="margin-bottom: 0.5rem;">Requirements</h4>
                    <p style="color: var(--text-secondary);">${job.requirements}</p>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="margin-bottom: 0.5rem;">Required Skills</h4>
                    <div class="skills-list">
                        ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                
                ${job.disabilityAccommodations.length > 0 ? `
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="margin-bottom: 0.5rem;">Disability Accommodations</h4>
                        <ul style="color: var(--text-secondary); margin-left: 1.5rem;">
                            ${job.disabilityAccommodations.map(acc => `<li>${acc}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                <button class="btn-primary" onclick="window.open('https://example.com/apply/${job.id}', '_blank')">Apply Now</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function toggleSaveJob(jobId) {
    let savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');

    if (savedJobs.includes(jobId)) {
        savedJobs = savedJobs.filter(id => id !== jobId);
        announceToScreenReader('Job removed from saved jobs');
    } else {
        savedJobs.push(jobId);
        announceToScreenReader('Job saved successfully');
    }

    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
}

function displaySavedJobs() {
    const savedJobsGrid = document.getElementById('savedJobsGrid');
    const savedJobIds = JSON.parse(localStorage.getItem('savedJobs') || '[]');

    if (savedJobIds.length === 0) {
        savedJobsGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No saved jobs yet. Browse the job board to save positions!</p>';
        return;
    }

    const savedJobs = jobsDatabase.filter(job => savedJobIds.includes(job.id));
    const cvSkills = window.lastAnalysisResults?.skills || [];

    savedJobsGrid.innerHTML = savedJobs.map(job => {
        const matchScore = cvSkills.length > 0 ? calculateJobMatch(job, cvSkills) : null;

        return `
            <div class="job-card" data-job-id="${job.id}">
                <div class="job-header">
                    <h3>${job.title}</h3>
                    ${matchScore !== null ? `
                        <div class="match-badge ${matchScore >= 70 ? 'high' : matchScore >= 50 ? 'medium' : 'low'}">
                            ${matchScore}% Match
                        </div>
                    ` : ''}
                </div>
                <div class="job-company">${job.company}</div>
                <div class="job-meta">
                    <span>${job.location}</span>
                    <span>${job.type}</span>
                    <span>${job.salary}</span>
                </div>
                <p class="job-description">${job.description}</p>
                <div class="job-actions">
                    <button class="btn-primary btn-small" onclick="viewJobDetails('${job.id}')">View Details</button>
                    <button class="btn-secondary btn-small" onclick="toggleSaveJob('${job.id}'); displaySavedJobs();">Remove</button>
                </div>
            </div>
        `;
    }).join('');
}

// ========================================
// LEARNING CENTER FUNCTIONS
// ========================================

function displayLearningResources() {
    const learningGrid = document.getElementById('learningGrid');
    const cvSkills = window.lastAnalysisResults?.skills || [];
    const missingSkills = window.lastJobMatch?.missingSkills || [];

    // Recommend resources based on missing skills
    let recommendedResources = learningResources;

    if (missingSkills.length > 0) {
        recommendedResources = learningResources.filter(resource =>
            missingSkills.some(skill => skill.toLowerCase() === resource.skill.toLowerCase())
        );

        // If no exact matches, show all
        if (recommendedResources.length === 0) {
            recommendedResources = learningResources;
        }
    }

    learningGrid.innerHTML = recommendedResources.map(resource => `
        <div class="learning-card">
            <div class="learning-header">
                <div class="learning-type ${resource.type}">${resource.type}</div>
                <div class="learning-difficulty ${resource.difficulty}">${resource.difficulty}</div>
            </div>
            <h3>${resource.title}</h3>
            <p class="learning-description">${resource.description}</p>
            <div class="learning-meta">
                <span><svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/></svg> ${resource.duration}</span>
                <span><svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/></svg> ${resource.provider}</span>
                ${resource.free ? '<span class="free-badge">FREE</span>' : ''}
            </div>
            ${resource.accessibleFormat ? `
                <div class="accessibility-badge">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                    Accessible Format
                </div>
            ` : ''}
            <button class="btn-primary btn-small" onclick="window.open('${resource.url}', '_blank')">Start Learning</button>
        </div>
    `).join('');
}

// ========================================
// SEARCH AND FILTER
// ========================================

document.getElementById('jobSearch')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const jobCards = document.querySelectorAll('.job-card');

    jobCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
});

document.getElementById('matchFilter')?.addEventListener('change', (e) => {
    displayJobs(e.target.value);
});

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    loadAccessibilitySettings();
    setupNavigation();

    // Simulate new job notification after 5 seconds (for demo)
    setTimeout(() => {
        if (accessibilitySettings.notificationsEnabled) {
            showNotification(
                'New Job Posted!',
                'Frontend Developer position at TechCorp matches your skills',
                {
                    tag: 'new-job', action: () => {
                        document.querySelector('[data-section="jobs"]').click();
                    }
                }
            );
        }
    }, 5000);
});

// Make functions globally available
window.viewJobDetails = viewJobDetails;
window.toggleSaveJob = toggleSaveJob;
window.displaySavedJobs = displaySavedJobs;
window.calculateJobMatch = calculateJobMatch;

// ========================================
// MOBILE MENU TOGGLE
// ========================================

// Initialize mobile menu after DOM is loaded
function initializeMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');

    if (!menuBtn || !sidebar) return;

    // Create overlay for mobile menu
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active');

        // Update ARIA
        const isOpen = sidebar.classList.contains('mobile-open');
        menuBtn.setAttribute('aria-expanded', isOpen);

        // Announce to screen readers
        if (window.announceToScreenReader) {
            announceToScreenReader(isOpen ? 'Menu opened' : 'Menu closed');
        }
    });

    // Close menu when clicking overlay
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
    });

    // Close menu when clicking a nav item on mobile
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        }, 250);
    });
}

// Call initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobileMenu);
} else {
    initializeMobileMenu();
}

