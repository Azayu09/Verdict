// Global state
let currentGoal = '';
let customGoalData = {};
let mappingData = {
    category: null,
    successType: null,
    competition: null,
    measurable: null,
    deadline: null
};

// Goal configurations
const goalConfigs = {
    'faang': {
        name: 'FAANG/Product Companies',
        baseSuccessRate: 0.08,
        requiredDailyHours: 4,
        minimumMonths: 6,
        dropoutRate: 0.65,
        burnoutRate: 0.40,
        underestimating: [
            'Competition density - thousands with CS degrees',
            'Interview difficulty compounds over rounds',
            'Consistency fatigue after 3-4 months',
            'Rejection impact on motivation',
            'System design and behavioral prep time'
        ],
        overestimating: [
            'Leetcode-only strategy effectiveness',
            'Weekend cramming productivity',
            'Motivation after first rejections',
            'Tutorial comprehension vs actual coding',
            'Network effect without referrals'
        ]
    },
    'career-switch': {
        name: 'Career Switch to Tech',
        baseSuccessRate: 0.12,
        requiredDailyHours: 3.5,
        minimumMonths: 8,
        dropoutRate: 0.58,
        burnoutRate: 0.45,
        underestimating: [
            'Learning curve from zero',
            'Age bias in hiring (if 30+)',
            'Portfolio quality needed vs bootcamp certificates',
            'Time to job-ready vs tutorial-complete',
            'Current job energy drain'
        ],
        overestimating: [
            'Bootcamp/course completion = job ready',
            'Side project impressiveness',
            'Networking event ROI',
            'Resume strength without tech experience',
            'Salary expectations for entry level'
        ]
    },
    'startup': {
        name: 'Profitable Startup',
        baseSuccessRate: 0.05,
        requiredDailyHours: 6,
        minimumMonths: 12,
        dropoutRate: 0.72,
        burnoutRate: 0.55,
        underestimating: [
            'Time to first dollar (usually 6-12 months)',
            'Market saturation in chosen niche',
            'Sales and marketing difficulty',
            'Cash burn rate and runway',
            'Customer acquisition cost reality'
        ],
        overestimating: [
            'Product-market fit timing',
            'Viral growth probability',
            'Founder discipline without accountability',
            'Technical execution speed',
            'Idea uniqueness and demand'
        ]
    },
    'weight-loss': {
        name: 'Physical Transformation',
        baseSuccessRate: 0.15,
        requiredDailyHours: 1.5,
        minimumMonths: 6,
        dropoutRate: 0.70,
        burnoutRate: 0.35,
        underestimating: [
            'Metabolic adaptation after initial loss',
            'Social pressure and food events',
            'Plateau duration (2-4 weeks)',
            'Hunger intensity after deficit',
            'Maintenance difficulty post-goal'
        ],
        overestimating: [
            'Willpower during stress or travel',
            'Weekend adherence vs weekday',
            'Exercise calorie burn impact',
            'Cheat meal control',
            'Linear progress expectation'
        ]
    },
    'competitive-exam': {
        name: 'Competitive Examination',
        baseSuccessRate: 0.03,
        requiredDailyHours: 8,
        minimumMonths: 12,
        dropoutRate: 0.75,
        burnoutRate: 0.50,
        underestimating: [
            'Syllabus vastness vs preparation time',
            'Competition from full-time aspirants',
            'Revision cycles needed (minimum 3)',
            'Mental stamina for long-form exams',
            'Multiple attempt statistical reality'
        ],
        overestimating: [
            'Single-pass retention',
            'Mock test scores vs actual exam',
            'Study hours vs effective hours',
            'Coaching institute impact',
            'Smart work vs hard work balance'
        ]
    },
    'fullstack': {
        name: 'Full-Stack Development',
        baseSuccessRate: 0.18,
        requiredDailyHours: 3,
        minimumMonths: 6,
        dropoutRate: 0.55,
        burnoutRate: 0.38,
        underestimating: [
            'Frontend + Backend + DevOps scope',
            'Framework churn and tech debt learning',
            'Debugging time vs coding time ratio',
            'Production vs tutorial gap',
            'Portfolio quality bar for hiring'
        ],
        overestimating: [
            'Tutorial completion = skill mastery',
            'CRUD app impressiveness',
            'Code-along retention',
            'Multi-tasking between topics',
            'Git and deployment ease'
        ]
    }
};

// Model templates for mapped goals
const modelTemplates = {
    skill: {
        name: 'Long-Horizon Skill Acquisition',
        description: 'Gradual progress model with compounding returns and consistency requirements',
        baseSuccessRate: 0.16,
        requiredDailyHours: 3,
        minimumMonths: 8,
        dropoutRate: 0.60,
        burnoutRate: 0.42
    },
    exam: {
        name: 'High-Competition Exam Model',
        description: 'Binary outcome with fixed deadline and intense competition pressure',
        baseSuccessRate: 0.04,
        requiredDailyHours: 7,
        minimumMonths: 12,
        dropoutRate: 0.75,
        burnoutRate: 0.55
    },
    career: {
        name: 'Career Transition with Delayed Payoff',
        description: 'Portfolio-building phase followed by job search with market dependencies',
        baseSuccessRate: 0.11,
        requiredDailyHours: 4,
        minimumMonths: 10,
        dropoutRate: 0.62,
        burnoutRate: 0.48
    },
    physical: {
        name: 'Physical Transformation with Relapse Risk',
        description: 'Measurable progress with high maintenance requirement and regression risk',
        baseSuccessRate: 0.14,
        requiredDailyHours: 1.5,
        minimumMonths: 6,
        dropoutRate: 0.72,
        burnoutRate: 0.38
    },
    business: {
        name: 'Business Goal with High Variance',
        description: 'Revenue generation with external dependencies and market uncertainty',
        baseSuccessRate: 0.06,
        requiredDailyHours: 6,
        minimumMonths: 14,
        dropoutRate: 0.70,
        burnoutRate: 0.58
    }
};

// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
}

// Goal selection
function selectGoal(goal) {
    currentGoal = goal;
    document.getElementById('goal-name-display').textContent = `Current analysis: ${goalConfigs[goal].name}`;
    showPage('reality-input');
}

// Start goal mapping
function startGoalMapping() {
    showPage('goal-mapping');
    updateMappingProgress(1);
    showMappingStep('step-category');
}

// Update mapping progress
function updateMappingProgress(step) {
    const progress = (step / 4) * 100;
    document.getElementById('mapping-progress').style.width = progress + '%';
    document.getElementById('current-step').textContent = step;
}

// Show mapping step
function showMappingStep(stepId) {
    document.querySelectorAll('.mapping-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(stepId).classList.add('active');
}

// Select category
function selectCategory(category) {
    mappingData.category = category;
    
    // Visual feedback
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.closest('.category-btn').classList.add('selected');
    
    // Move to structural questions after brief delay
    setTimeout(() => {
        updateMappingProgress(2);
        showMappingStep('step-structural');
    }, 400);
}

// Process structural data
function processStructuralData() {
    // Collect structural answers
    mappingData.successType = document.querySelector('input[name="success-type"]:checked')?.value;
    mappingData.competition = document.querySelector('input[name="competition"]:checked')?.value;
    mappingData.measurable = document.querySelector('input[name="measurable"]:checked')?.value;
    mappingData.deadline = document.querySelector('input[name="deadline"]:checked')?.value;
    
    // Validate all questions answered
    if (!mappingData.successType || !mappingData.competition || !mappingData.measurable || !mappingData.deadline) {
        alert('Please answer all questions before continuing');
        return;
    }
    
    // Check if goal can be mapped
    if (mappingData.measurable === 'no') {
        showUnsupportedGoal(['Effort cannot be measured consistently', 'Success criteria lacks quantifiable metrics']);
        return;
    }
    
    // Assign model
    assignModel();
}

// Assign model based on mapping data
function assignModel() {
    const template = modelTemplates[mappingData.category];
    
    // Adjust template based on structural data
    let adjustedTemplate = { ...template };
    
    // Competition adjustment
    if (mappingData.competition === 'national') {
        adjustedTemplate.baseSuccessRate *= 0.6;
        adjustedTemplate.dropoutRate *= 1.2;
    } else if (mappingData.competition === 'local') {
        adjustedTemplate.baseSuccessRate *= 0.85;
    }
    
    // Deadline adjustment
    if (mappingData.deadline === 'fixed') {
        adjustedTemplate.burnoutRate *= 1.15;
    }
    
    // Success type adjustment
    if (mappingData.successType === 'binary') {
        adjustedTemplate.baseSuccessRate *= 0.8;
    }
    
    // Store custom goal config
    currentGoal = 'custom';
    goalConfigs['custom'] = {
        ...adjustedTemplate,
        underestimating: [
            'Time required vs time estimated',
            'Skill gap between current and target level',
            'Consistency needed over extended periods',
            'External factors and unexpected interruptions',
            'Plateau periods and motivation erosion'
        ],
        overestimating: [
            'Initial motivation sustainability',
            'Weekend and holiday productivity levels',
            'Learning speed and information retention',
            'Support system availability and effectiveness',
            'Discipline maintenance without accountability'
        ]
    };
    
    // Display model assignment
    updateMappingProgress(3);
    showMappingStep('step-model');
    
    document.getElementById('assigned-model').textContent = template.name;
    document.getElementById('model-description').textContent = template.description;
    
    // Animate characteristics
    setTimeout(() => {
        const competitionLevel = mappingData.competition === 'national' ? 90 : 
                                 mappingData.competition === 'local' ? 60 : 30;
        const timelineLevel = mappingData.deadline === 'fixed' ? 80 : 40;
        const effortLevel = mappingData.measurable === 'yes' ? 85 : 30;
        const failureLevel = adjustedTemplate.dropoutRate * 100;
        
        document.getElementById('char-competition').style.width = competitionLevel + '%';
        document.getElementById('char-timeline').style.width = timelineLevel + '%';
        document.getElementById('char-effort').style.width = effortLevel + '%';
        document.getElementById('char-failure').style.width = failureLevel + '%';
    }, 300);
}

// Show unsupported goal
function showUnsupportedGoal(reasons) {
    updateMappingProgress(4);
    showMappingStep('step-unsupported');
    
    const reasonsList = document.getElementById('unsupported-reasons');
    reasonsList.innerHTML = '';
    reasons.forEach(reason => {
        const li = document.createElement('li');
        li.textContent = reason;
        reasonsList.appendChild(li);
    });
}

// Continue to inputs from model assignment
function continueToInputs() {
    document.getElementById('goal-name-display').textContent = `Current analysis: ${goalConfigs['custom'].name}`;
    showPage('reality-input');
}

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reality-form');
    
    // Slider interactivity
    const slider = document.getElementById('daily-effort');
    slider.addEventListener('input', function() {
        const labels = document.querySelectorAll('.slider-labels span');
        labels.forEach((label, index) => {
            label.style.opacity = index === parseInt(this.value) ? '1' : '0.4';
            label.style.fontWeight = index === parseInt(this.value) ? '600' : '400';
        });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            skillLevel: parseInt(document.querySelector('input[name="skill-level"]:checked')?.value),
            dailyEffort: parseInt(document.getElementById('daily-effort').value),
            consistency: parseInt(document.getElementById('consistency').value),
            failedAttempts: parseInt(document.getElementById('failed-attempts').value),
            constraints: parseInt(document.getElementById('constraints').value),
            distractions: parseInt(document.getElementById('distractions').value),
            timeline: parseInt(document.getElementById('timeline').value)
        };
        
        calculateReality(formData);
        showPage('reality-report');
    });
});

// Reality calculation
function calculateReality(formData) {
    const config = goalConfigs[currentGoal];
    
    // Generate report number
    document.getElementById('report-number').textContent = '#' + Math.floor(Math.random() * 900000 + 100000);
    
    // Calculate probabilities
    let successProb = config.baseSuccessRate;
    successProb += formData.skillLevel * 0.08;
    successProb += formData.dailyEffort * 0.10;
    successProb += formData.consistency * 0.12;
    successProb -= formData.failedAttempts * 0.08;
    successProb -= formData.constraints * 0.06;
    successProb -= formData.distractions * 0.10;
    
    const effortHoursMap = [0.5, 1, 1.5, 3, 5, 7];
    const currentDailyHours = effortHoursMap[formData.dailyEffort];
    const requiredHours = config.requiredDailyHours;
    const effortGap = requiredHours - currentDailyHours;
    
    if (effortGap > 2) successProb *= 0.5;
    else if (effortGap > 1) successProb *= 0.7;
    
    if (formData.consistency < 2) successProb *= 0.6;
    if (formData.failedAttempts >= 2) successProb *= 0.7;
    
    successProb = Math.max(0.01, Math.min(0.95, successProb));
    
    let burnoutProb = config.burnoutRate;
    burnoutProb += (Math.max(0, effortGap)) * 0.08;
    burnoutProb += formData.constraints * 0.12;
    burnoutProb -= formData.consistency * 0.08;
    burnoutProb = Math.max(0.05, Math.min(0.90, burnoutProb));
    
    let quitProb = config.dropoutRate;
    quitProb += formData.distractions * 0.08;
    quitProb += formData.failedAttempts * 0.10;
    quitProb -= formData.consistency * 0.12;
    quitProb = Math.max(0.05, Math.min(0.95, quitProb));
    
    const timeMultiplier = requiredHours / Math.max(0.5, currentDailyHours);
    const realisticMonths = Math.ceil(config.minimumMonths * timeMultiplier);
    
    let failurePoint;
    if (formData.consistency < 2) {
        failurePoint = 'Month 2-3: Consistency collapse';
    } else if (effortGap > 2) {
        failurePoint = 'Month 3-4: Effort gap burnout';
    } else if (formData.distractions >= 2) {
        failurePoint = 'Month 4-5: Distraction spiral';
    } else {
        failurePoint = 'Month 6-8: Plateau frustration';
    }
    
    // Generate verdict
    let verdict;
    if (successProb < 0.15) {
        verdict = `At current pace, goal failure is probable within ${Math.min(6, realisticMonths)} months.`;
    } else if (successProb < 0.30) {
        verdict = `Success probability is low. Timeline extends to ${realisticMonths}+ months with elevated dropout risk.`;
    } else if (successProb < 0.50) {
        verdict = `Success is achievable but requires significant effort increase. Minimum timeline: ${realisticMonths} months.`;
    } else {
        verdict = `Moderate success probability exists if behavior remains consistent. Projected timeline: ${realisticMonths} months.`;
    }
    
    // Generate outcome
    let outcome;
    if (quitProb > 0.60) {
        outcome = `Dropout probability is ${Math.round(quitProb * 100)}%. Current pattern indicates abandonment within 3-5 months. Effort gap combined with distraction level creates unsustainable trajectory without structural intervention.`;
    } else if (burnoutProb > 0.50) {
        outcome = `Burnout risk is elevated at ${Math.round(burnoutProb * 100)}%. Required vs actual effort gap generates unsustainable pressure. Expected pattern: intense push for 2-4 months followed by crash. Recovery period adds 2-3 months to timeline if goal is resumed.`;
    } else if (successProb < 0.25) {
        outcome = `Current inputs do not support goal achievement. Daily effort deficit: ${effortGap.toFixed(1)} hours. Projected timeline of ${realisticMonths} months exceeds target by ${Math.max(0, realisticMonths - formData.timeline)} months. Historical data shows 75% dropout before midpoint under these conditions.`;
    } else {
        outcome = `Path to success exists with current effort levels. Realistic timeline: ${realisticMonths} months. Target of ${formData.timeline} months is ${realisticMonths > formData.timeline ? 'optimistic' : 'achievable'}. Expect motivation challenges during plateau phases (months 3-5).`;
    }
    
    // Populate UI
    setTimeout(() => {
        document.getElementById('verdict-text').textContent = verdict;
        document.getElementById('success-prob').textContent = Math.round(successProb * 100) + '%';
        document.getElementById('burnout-prob').textContent = Math.round(burnoutProb * 100) + '%';
        document.getElementById('quit-prob').textContent = Math.round(quitProb * 100) + '%';
        
        // Effort bars
        document.getElementById('required-bar').style.width = '100%';
        document.getElementById('required-value').textContent = requiredHours.toFixed(1) + 'h';
        
        const currentPercent = (currentDailyHours / requiredHours) * 100;
        document.getElementById('current-bar').style.width = Math.min(100, currentPercent) + '%';
        document.getElementById('current-value').textContent = currentDailyHours.toFixed(1) + 'h';
        
        document.getElementById('gap-value').textContent = effortGap > 0 ? 
            `-${effortGap.toFixed(1)}h daily` : 'On track';
        document.getElementById('timeline-value').textContent = realisticMonths + ' months';
        document.getElementById('failure-value').textContent = failurePoint;
        
        // Lists
        const underList = document.getElementById('underestimate-list');
        underList.innerHTML = '';
        config.underestimating.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            underList.appendChild(li);
        });
        
        const overList = document.getElementById('overestimate-list');
        overList.innerHTML = '';
        config.overestimating.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            overList.appendChild(li);
        });
        
        document.getElementById('outcome-text').textContent = outcome;
        
        // Decision options
        const acceptList = document.getElementById('accept-list');
        acceptList.innerHTML = '';
        [
            `Extend timeline to ${realisticMonths} months`,
            `Reduce scope to intermediate milestone`,
            `Switch to adjacent lower-difficulty goal`,
            `Reclassify as hobby rather than career objective`
        ].forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            acceptList.appendChild(li);
        });
        
        const changeList = document.getElementById('change-list');
        changeList.innerHTML = '';
        [
            `Increase daily effort to ${requiredHours}h minimum`,
            `Reduce distractions by ${Math.round(formData.distractions * 1.5)}h daily`,
            `Eliminate one major time commitment`,
            `Implement external accountability system`
        ].forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            changeList.appendChild(li);
        });
    }, 400);
}
