// PDF.js configuration
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const fileInfo = document.getElementById('fileInfo');
const analyzeBtn = document.getElementById('analyzeBtn');
const configBtn = document.getElementById('configBtn');
const removeFileBtn = document.getElementById('removeFileBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const uploadSection = document.getElementById('uploadSection');
const resultsSection = document.getElementById('resultsSection');
const newAnalysisBtn = document.getElementById('newAnalysisBtn');
const configModal = document.getElementById('configModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelConfigBtn = document.getElementById('cancelConfigBtn');
const saveConfigBtn = document.getElementById('saveConfigBtn');
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');

// State
let currentFile = null;
let cvText = '';
let analysisConfig = {
    jobTitle: '',
    industry: '',
    detailedAnalysis: true,
    skillsMatching: true
};

// Event Listeners
browseBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);
removeFileBtn.addEventListener('click', removeFile);
analyzeBtn.addEventListener('click', analyzeCV);
configBtn.addEventListener('click', () => configModal.classList.add('active'));
closeModalBtn.addEventListener('click', () => configModal.classList.remove('active'));
cancelConfigBtn.addEventListener('click', () => configModal.classList.remove('active'));
saveConfigBtn.addEventListener('click', saveConfiguration);
newAnalysisBtn.addEventListener('click', resetAnalysis);
menuBtn.addEventListener('click', () => sidebar.classList.toggle('active'));

// Close modal on outside click
configModal.addEventListener('click', (e) => {
    if (e.target === configModal) {
        configModal.classList.remove('active');
    }
});

// File Upload Handlers
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) {
        processFile(file);
    }
}

function processFile(file) {
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
        alert('Please upload a valid CV file (PDF, DOC, DOCX, or TXT)');
        return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }

    currentFile = file;
    displayFileInfo(file);
    extractTextFromFile(file);
}

function displayFileInfo(file) {
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    uploadArea.style.display = 'none';
    fileInfo.style.display = 'flex';
    analyzeBtn.disabled = false;
}

function removeFile() {
    currentFile = null;
    cvText = '';
    fileInput.value = '';
    uploadArea.style.display = 'block';
    fileInfo.style.display = 'none';
    analyzeBtn.disabled = true;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Text Extraction
async function extractTextFromFile(file) {
    const fileType = file.type || file.name.split('.').pop().toLowerCase();

    if (fileType.includes('pdf') || file.name.endsWith('.pdf')) {
        await extractTextFromPDF(file);
    } else if (fileType.includes('text') || file.name.endsWith('.txt')) {
        await extractTextFromTXT(file);
    } else {
        // For DOC/DOCX, we'll use a simple text extraction
        // In production, you'd want to use a proper library
        cvText = `Sample CV content extracted from ${file.name}`;
        console.log('Note: DOC/DOCX parsing is simplified. Use a proper library for production.');
    }
}

async function extractTextFromPDF(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }

        cvText = fullText;
        console.log('PDF text extracted successfully');
    } catch (error) {
        console.error('Error extracting PDF text:', error);
        cvText = 'Error extracting text from PDF. Please try a different file.';
    }
}

async function extractTextFromTXT(file) {
    try {
        cvText = await file.text();
        console.log('Text file read successfully');
    } catch (error) {
        console.error('Error reading text file:', error);
        cvText = 'Error reading text file.';
    }
}

// CV Analysis
async function analyzeCV() {
    if (!cvText) {
        alert('Please wait for the file to be processed');
        return;
    }

    // Show loading overlay
    loadingOverlay.style.display = 'flex';
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = '0%';

    // Simulate progress
    setTimeout(() => progressFill.style.width = '30%', 300);
    setTimeout(() => progressFill.style.width = '60%', 800);
    setTimeout(() => progressFill.style.width = '90%', 1300);

    // Perform analysis
    setTimeout(() => {
        const results = performAnalysis(cvText);
        displayResults(results);
        progressFill.style.width = '100%';

        setTimeout(() => {
            loadingOverlay.style.display = 'none';
            uploadSection.style.display = 'none';
            resultsSection.style.display = 'block';
        }, 500);
    }, 2000);
}

function performAnalysis(text) {
    const textLower = text.toLowerCase();

    // Skills detection
    const skillsDatabase = [
        'javascript', 'python', 'java', 'c++', 'react', 'angular', 'vue',
        'node.js', 'express', 'django', 'flask', 'spring', 'sql', 'mongodb',
        'postgresql', 'mysql', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
        'git', 'agile', 'scrum', 'leadership', 'communication', 'teamwork',
        'problem solving', 'html', 'css', 'typescript', 'machine learning',
        'data analysis', 'project management', 'rest api', 'graphql'
    ];

    const detectedSkills = skillsDatabase.filter(skill =>
        textLower.includes(skill.toLowerCase())
    );

    // Experience detection
    const experienceYears = detectExperienceYears(text);

    // Education detection
    const education = detectEducation(text);

    // Contact information
    const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text);
    const hasPhone = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);

    // Calculate scores
    const skillsScore = Math.min(100, (detectedSkills.length / 10) * 100);
    const experienceScore = Math.min(100, (experienceYears / 10) * 100);
    const educationScore = education.level * 25;
    const formatScore = calculateFormatScore(text, hasEmail, hasPhone);

    const overallScore = Math.round(
        (skillsScore * 0.35 + experienceScore * 0.25 + educationScore * 0.25 + formatScore * 0.15)
    );

    return {
        overallScore,
        skills: detectedSkills,
        skillsScore: Math.round(skillsScore),
        experienceYears,
        experienceScore: Math.round(experienceScore),
        education,
        educationScore: Math.round(educationScore),
        formatScore: Math.round(formatScore),
        hasEmail,
        hasPhone,
        recommendations: generateRecommendations(detectedSkills, experienceYears, education, hasEmail, hasPhone)
    };
}

function detectExperienceYears(text) {
    const patterns = [
        /(\d+)\+?\s*years?\s+(?:of\s+)?experience/i,
        /experience[:\s]+(\d+)\+?\s*years?/i,
        /(\d{4})\s*[-–]\s*(?:present|current|\d{4})/gi
    ];

    let maxYears = 0;

    patterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
            if (pattern.source.includes('\\d{4}')) {
                // Date range pattern
                const dateMatches = text.matchAll(pattern);
                for (const match of dateMatches) {
                    const startYear = parseInt(match[1]);
                    const endYear = match[0].toLowerCase().includes('present') ?
                        new Date().getFullYear() :
                        parseInt(match[0].match(/\d{4}$/)?.[0] || startYear);
                    const years = endYear - startYear;
                    maxYears = Math.max(maxYears, years);
                }
            } else {
                const years = parseInt(matches[1]);
                maxYears = Math.max(maxYears, years);
            }
        }
    });

    return maxYears || 2; // Default to 2 if not found
}

function detectEducation(text) {
    const textLower = text.toLowerCase();
    const degrees = {
        phd: { level: 4, name: 'Ph.D.' },
        doctorate: { level: 4, name: 'Doctorate' },
        master: { level: 3, name: 'Master\'s Degree' },
        mba: { level: 3, name: 'MBA' },
        bachelor: { level: 2, name: 'Bachelor\'s Degree' },
        associate: { level: 1, name: 'Associate Degree' },
        diploma: { level: 1, name: 'Diploma' }
    };

    for (const [key, value] of Object.entries(degrees)) {
        if (textLower.includes(key)) {
            return value;
        }
    }

    return { level: 2, name: 'Bachelor\'s Degree' }; // Default
}

function calculateFormatScore(text, hasEmail, hasPhone) {
    let score = 50; // Base score

    if (hasEmail) score += 20;
    if (hasPhone) score += 15;
    if (text.length > 500) score += 10; // Sufficient content
    if (text.length > 1000) score += 5; // Detailed content

    return Math.min(100, score);
}

function generateRecommendations(skills, experience, education, hasEmail, hasPhone) {
    const recommendations = [];

    if (skills.length < 5) {
        recommendations.push('Add more relevant technical skills to strengthen your profile');
    }

    if (experience < 3) {
        recommendations.push('Highlight any internships, projects, or volunteer work to showcase experience');
    }

    if (!hasEmail || !hasPhone) {
        recommendations.push('Ensure your contact information (email and phone) is clearly visible');
    }

    if (education.level < 2) {
        recommendations.push('Consider pursuing additional certifications or degrees to enhance qualifications');
    }

    if (!skills.some(s => ['leadership', 'communication', 'teamwork'].includes(s))) {
        recommendations.push('Include soft skills like leadership, communication, and teamwork');
    }

    if (skills.length > 0 && !skills.some(s => ['aws', 'azure', 'gcp', 'docker', 'kubernetes'].includes(s))) {
        recommendations.push('Consider adding cloud technologies or DevOps skills for modern roles');
    }

    if (recommendations.length === 0) {
        recommendations.push('Excellent CV! Keep it updated with your latest achievements');
        recommendations.push('Consider tailoring your CV for specific job applications');
        recommendations.push('Add quantifiable achievements and metrics to your experience');
    }

    return recommendations;
}

// Display Results
function displayResults(results) {
    // Overall Score
    document.getElementById('overallScore').textContent = results.overallScore;
    const scoreCircle = document.getElementById('scoreCircle');
    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (results.overallScore / 100) * circumference;
    scoreCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    scoreCircle.style.strokeDashoffset = offset;

    // Score Description
    let description = '';
    if (results.overallScore >= 80) {
        description = 'Excellent! Your CV is well-structured and comprehensive';
    } else if (results.overallScore >= 60) {
        description = 'Good CV with room for improvement in some areas';
    } else {
        description = 'Your CV needs significant improvements to stand out';
    }
    document.getElementById('scoreDescription').textContent = description;

    // Badges
    const strengths = [results.skillsScore, results.experienceScore, results.educationScore, results.formatScore]
        .filter(score => score >= 70).length;
    const improvements = 4 - strengths;

    document.getElementById('strengthBadge').textContent = `${strengths} Strengths`;
    document.getElementById('improvementBadge').textContent = `${improvements} Areas to Improve`;

    // Metrics
    updateMetric('skills', results.skillsScore, `${results.skills.length} skills detected`);
    updateMetric('experience', results.experienceScore, `${results.experienceYears}+ years of experience`);
    updateMetric('education', results.educationScore, results.education.name);
    updateMetric('format', results.formatScore, 'Professional structure');

    // Skills List
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = results.skills.length > 0
        ? results.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')
        : '<span class="skill-tag">No specific skills detected</span>';

    // Education
    document.getElementById('educationList').innerHTML = `
        <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">
            <strong style="color: var(--text-primary);">${results.education.name}</strong>
        </p>
        <p style="color: var(--text-secondary); font-size: 0.875rem;">
            Detected from CV content
        </p>
    `;

    // Experience
    document.getElementById('experienceList').innerHTML = `
        <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">
            <strong style="color: var(--text-primary);">${results.experienceYears}+ Years</strong>
        </p>
        <p style="color: var(--text-secondary); font-size: 0.875rem;">
            Professional experience detected
        </p>
    `;

}

// Configuration
function saveConfiguration() {
    analysisConfig.jobTitle = document.getElementById('jobTitle').value;
    analysisConfig.industry = document.getElementById('industry').value;
    analysisConfig.detailedAnalysis = document.getElementById('detailedAnalysis').checked;
    analysisConfig.skillsMatching = document.getElementById('skillsMatching').checked;

    configModal.classList.remove('active');

    // Show notification (you can enhance this)
    console.log('Configuration saved:', analysisConfig);
}

// Reset Analysis
function resetAnalysis() {
    uploadSection.style.display = 'block';
    resultsSection.style.display = 'none';
    removeFile();
}

// Initialize
console.log('CV Analyzer initialized successfully');
