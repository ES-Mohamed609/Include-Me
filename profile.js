// ========================================
// USER PROFILE MANAGEMENT
// ========================================

// Profile Data Structure
let userProfile = {
    personal: {
        name: '',
        age: '',
        gender: ''
    },
    contact: {
        email: '',
        phone: ''
    },
    disability: {
        type: '',
        accommodations: '',
        assistiveTech: ''
    },
    certificates: [],
    courses: [],
    skills: []
};

// Load profile from localStorage
function loadUserProfile() {
    // First check if there's registration data from signup
    const registrationData = localStorage.getItem('userData');

    if (registrationData) {
        const userData = JSON.parse(registrationData);

        // Populate userProfile with registration data
        userProfile.personal.name = userData.fullName || '';
        userProfile.personal.age = userData.age || '';
        userProfile.personal.gender = userData.gender || '';

        userProfile.contact.email = userData.email || '';
        userProfile.contact.phone = userData.phone || '';

        userProfile.disability.type = userData.disabilityType || '';
        userProfile.disability.accommodations = userData.accommodations || '';
        userProfile.disability.assistiveTech = userData.assistiveTech || '';

        // Save to userProfile storage
        saveUserProfile();
    } else {
        // Load from existing userProfile if no registration data
        const saved = localStorage.getItem('userProfile');
        if (saved) {
            userProfile = JSON.parse(saved);
        }
    }

    displayProfile();
}

// Save profile to localStorage
function saveUserProfile() {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

// Display Profile Data
function displayProfile() {
    // Personal Information
    document.getElementById('profileName').textContent = userProfile.personal.name || '-';
    document.getElementById('profileAge').textContent = userProfile.personal.age || '-';
    document.getElementById('profileGender').textContent = userProfile.personal.gender || '-';

    // Contact Information
    document.getElementById('profileEmail').textContent = userProfile.contact.email || '-';
    document.getElementById('profilePhone').textContent = userProfile.contact.phone || '-';

    // Disability Information
    document.getElementById('profileDisability').textContent = userProfile.disability.type || '-';
    document.getElementById('profileAccommodations').textContent = userProfile.disability.accommodations || '-';
    document.getElementById('profileAssistiveTech').textContent = userProfile.disability.assistiveTech || '-';

    // Certificates
    displayCertificates();

    // Courses
    displayCourses();

    // Skills (from CV analysis)
    if (window.lastAnalysisResults && window.lastAnalysisResults.skills) {
        userProfile.skills = window.lastAnalysisResults.skills;
        displayProfileSkills();
    }
}

// Display Certificates
function displayCertificates() {
    const container = document.getElementById('certificatesList');

    if (userProfile.certificates.length === 0) {
        container.innerHTML = '<p class="empty-state">No certificates added yet</p>';
        return;
    }

    container.innerHTML = userProfile.certificates.map((cert, index) => `
        <div class="certificate-item">
            <div class="certificate-info">
                <h4>${cert.name}</h4>
                <p>${cert.issuer} • ${cert.year}</p>
            </div>
            <button class="btn-icon" onclick="removeCertificate(${index})" aria-label="Remove certificate">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/>
                </svg>
            </button>
        </div>
    `).join('');
}

// Display Courses
function displayCourses() {
    const container = document.getElementById('coursesList');

    if (userProfile.courses.length === 0) {
        container.innerHTML = '<p class="empty-state">No ongoing courses</p>';
        return;
    }

    container.innerHTML = userProfile.courses.map((course, index) => `
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
            <button class="btn-icon" onclick="removeCourse(${index})" aria-label="Remove course">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/>
                </svg>
            </button>
        </div>
    `).join('');
}

// Display Profile Skills
function displayProfileSkills() {
    const container = document.getElementById('profileSkills');

    if (userProfile.skills.length === 0) {
        container.innerHTML = '<p class="empty-state">Upload your CV to detect skills</p>';
        return;
    }

    container.innerHTML = userProfile.skills.map(skill =>
        `<span class="skill-tag">${skill}</span>`
    ).join('');
}

// Edit Profile Modal
function showEditProfileModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h2>Edit Profile</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()" aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <h3 style="margin-bottom: 1rem; font-size: 1.1rem;">Personal Information</h3>
                <div class="form-group">
                    <label for="editName">Full Name *</label>
                    <input type="text" id="editName" class="form-input" value="${userProfile.personal.name}" required>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label for="editAge">Age *</label>
                        <input type="number" id="editAge" class="form-input" value="${userProfile.personal.age}" min="18" max="100">
                    </div>
                    <div class="form-group">
                        <label for="editGender">Gender *</label>
                        <select id="editGender" class="form-select">
                            <option value="">Select gender</option>
                            <option value="Male" ${userProfile.personal.gender === 'Male' ? 'selected' : ''}>Male</option>
                            <option value="Female" ${userProfile.personal.gender === 'Female' ? 'selected' : ''}>Female</option>
                            <option value="Non-binary" ${userProfile.personal.gender === 'Non-binary' ? 'selected' : ''}>Non-binary</option>
                            <option value="Prefer not to say" ${userProfile.personal.gender === 'Prefer not to say' ? 'selected' : ''}>Prefer not to say</option>
                        </select>
                    </div>
                </div>
                
                <h3 style="margin: 1.5rem 0 1rem; font-size: 1.1rem;">Contact Information</h3>
                <div class="form-group">
                    <label for="editEmail">Email *</label>
                    <input type="email" id="editEmail" class="form-input" value="${userProfile.contact.email}" required>
                </div>
                <div class="form-group">
                    <label for="editPhone">Phone Number *</label>
                    <input type="tel" id="editPhone" class="form-input" value="${userProfile.contact.phone}">
                </div>
                
                <h3 style="margin: 1.5rem 0 1rem; font-size: 1.1rem;">Disability Information</h3>
                <div class="form-group">
                    <label for="editDisabilityType">Type of Disability</label>
                    <select id="editDisabilityType" class="form-select">
                        <option value="">Select type</option>
                        <option value="Visual Impairment" ${userProfile.disability.type === 'Visual Impairment' ? 'selected' : ''}>Visual Impairment</option>
                        <option value="Hearing Impairment" ${userProfile.disability.type === 'Hearing Impairment' ? 'selected' : ''}>Hearing Impairment</option>
                        <option value="Mobility Impairment" ${userProfile.disability.type === 'Mobility Impairment' ? 'selected' : ''}>Mobility Impairment</option>
                        <option value="Cognitive Disability" ${userProfile.disability.type === 'Cognitive Disability' ? 'selected' : ''}>Cognitive Disability</option>
                        <option value="Learning Disability" ${userProfile.disability.type === 'Learning Disability' ? 'selected' : ''}>Learning Disability</option>
                        <option value="Multiple Disabilities" ${userProfile.disability.type === 'Multiple Disabilities' ? 'selected' : ''}>Multiple Disabilities</option>
                        <option value="Other" ${userProfile.disability.type === 'Other' ? 'selected' : ''}>Other</option>
                        <option value="None" ${userProfile.disability.type === 'None' ? 'selected' : ''}>None</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editAccommodations">Accommodations Needed</label>
                    <textarea id="editAccommodations" class="form-input" rows="3" placeholder="e.g., Screen reader, Flexible hours, Remote work">${userProfile.disability.accommodations}</textarea>
                </div>
                <div class="form-group">
                    <label for="editAssistiveTech">Assistive Technology Used</label>
                    <textarea id="editAssistiveTech" class="form-input" rows="3" placeholder="e.g., JAWS, Voice recognition software, Ergonomic keyboard">${userProfile.disability.assistiveTech}</textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                <button class="btn-primary" onclick="saveProfileEdits()">Save Changes</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Save Profile Edits
function saveProfileEdits() {
    userProfile.personal.name = document.getElementById('editName').value;
    userProfile.personal.age = document.getElementById('editAge').value;
    userProfile.personal.gender = document.getElementById('editGender').value;

    userProfile.contact.email = document.getElementById('editEmail').value;
    userProfile.contact.phone = document.getElementById('editPhone').value;

    userProfile.disability.type = document.getElementById('editDisabilityType').value;
    userProfile.disability.accommodations = document.getElementById('editAccommodations').value;
    userProfile.disability.assistiveTech = document.getElementById('editAssistiveTech').value;

    saveUserProfile();
    displayProfile();

    // Close modal
    document.querySelector('.modal').remove();

    // Show success message
    if (window.announceToScreenReader) {
        announceToScreenReader('Profile updated successfully');
    }
}

// Add Certificate Modal
function showAddCertificateModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>Add Certificate</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()" aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="certName">Certificate Name *</label>
                    <input type="text" id="certName" class="form-input" placeholder="e.g., AWS Certified Developer" required>
                </div>
                <div class="form-group">
                    <label for="certIssuer">Issuing Organization *</label>
                    <input type="text" id="certIssuer" class="form-input" placeholder="e.g., Amazon Web Services" required>
                </div>
                <div class="form-group">
                    <label for="certYear">Year Obtained *</label>
                    <input type="number" id="certYear" class="form-input" min="1990" max="2025" placeholder="2024" required>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                <button class="btn-primary" onclick="addCertificate()">Add Certificate</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Add Certificate
function addCertificate() {
    const name = document.getElementById('certName').value;
    const issuer = document.getElementById('certIssuer').value;
    const year = document.getElementById('certYear').value;

    if (!name || !issuer || !year) {
        alert('Please fill in all fields');
        return;
    }

    userProfile.certificates.push({ name, issuer, year });
    saveUserProfile();
    displayCertificates();

    document.querySelector('.modal').remove();

    if (window.announceToScreenReader) {
        announceToScreenReader('Certificate added successfully');
    }
}

// Remove Certificate
function removeCertificate(index) {
    if (confirm('Are you sure you want to remove this certificate?')) {
        userProfile.certificates.splice(index, 1);
        saveUserProfile();
        displayCertificates();

        if (window.announceToScreenReader) {
            announceToScreenReader('Certificate removed');
        }
    }
}

// Add Course Modal
function showAddCourseModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>Add Ongoing Course</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()" aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="courseName">Course Name *</label>
                    <input type="text" id="courseName" class="form-input" placeholder="e.g., Full Stack Web Development" required>
                </div>
                <div class="form-group">
                    <label for="courseProvider">Provider *</label>
                    <input type="text" id="courseProvider" class="form-input" placeholder="e.g., Coursera, Udemy" required>
                </div>
                <div class="form-group">
                    <label for="courseProgress">Progress (%) *</label>
                    <input type="number" id="courseProgress" class="form-input" min="0" max="100" placeholder="50" required>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                <button class="btn-primary" onclick="addCourse()">Add Course</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Add Course
function addCourse() {
    const name = document.getElementById('courseName').value;
    const provider = document.getElementById('courseProvider').value;
    const progress = parseInt(document.getElementById('courseProgress').value);

    if (!name || !provider || isNaN(progress)) {
        alert('Please fill in all fields');
        return;
    }

    userProfile.courses.push({ name, provider, progress });
    saveUserProfile();
    displayCourses();

    document.querySelector('.modal').remove();

    if (window.announceToScreenReader) {
        announceToScreenReader('Course added successfully');
    }
}

// Remove Course
function removeCourse(index) {
    if (confirm('Are you sure you want to remove this course?')) {
        userProfile.courses.splice(index, 1);
        saveUserProfile();
        displayCourses();

        if (window.announceToScreenReader) {
            announceToScreenReader('Course removed');
        }
    }
}

// Event Listeners
document.getElementById('editProfileBtn')?.addEventListener('click', showEditProfileModal);
document.getElementById('addCertificateBtn')?.addEventListener('click', showAddCertificateModal);
document.getElementById('addCourseBtn')?.addEventListener('click', showAddCourseModal);

// Initialize profile on page load
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();

    // Update profile skills when CV is analyzed
    const originalDisplayResults = window.displayResults;
    if (originalDisplayResults) {
        window.displayResults = function (results) {
            originalDisplayResults(results);
            if (results.skills) {
                userProfile.skills = results.skills;
                saveUserProfile();
                displayProfileSkills();
            }
        };
    }
});

// Make functions globally available
window.saveProfileEdits = saveProfileEdits;
window.addCertificate = addCertificate;
window.removeCertificate = removeCertificate;
window.addCourse = addCourse;
window.removeCourse = removeCourse;
window.userProfile = userProfile;
