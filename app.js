// Progressive Campaign State Management Configuration
let userProgress = {
    unlockedLevel: 1,
    completedLevels: []
};

// Retrieve local storage state history if cached safely
try {
    if (localStorage.getItem('quadratic_campaign_progress')) {
        userProgress = JSON.parse(localStorage.getItem('quadratic_campaign_progress'));
    }
} catch (e) {
    console.log("Progress storage read error:", e);
}

// 🚀 Expose renderCampaignMap globally so it can be initiated reliably
window.renderCampaignMap = function() {
    const container = document.getElementById('map-target');
    if (!container) return;
    container.innerHTML = '';

    // Check if data module loaded properly
    if (typeof levelsData === 'undefined' || !Array.isArray(levelsData)) {
        container.innerHTML = '<div class="locked-msg"><span>Error: Curriculum database (data.js) failed to load properly. Check your file links.</span></div>';
        return;
    }

    levelsData.forEach((level) => {
        const card = document.createElement('div');
        card.id = 'level-card-' + level.id;
        
        let statusClass = 'locked';
        let badgeText = 'Locked 🔒';
        let badgeClass = 'badge-locked';

        if (userProgress.completedLevels.includes(level.id)) {
            statusClass = 'unlocked completed';
            badgeText = 'Mastered ✓';
            badgeClass = 'badge-completed';
        } else if (level.id === userProgress.unlockedLevel) {
            statusClass = 'unlocked';
            badgeText = 'Active Quest ⚡';
            badgeClass = 'badge-unlocked';
        }

        card.className = 'level-card ' + statusClass;
        
        let contentHTML = `
            <div class="level-header">
                <div class="level-title"><strong>${level.chapter}:</strong> ${level.title}</div>
                <span class="badge ${badgeClass}">${badgeText}</span>
            </div>
        `;

        if (statusClass !== 'locked') {
            let objectivesHTML = '';
            level.objectives.forEach((obj) => {
                objectivesHTML += '<li>' + obj + '</li>';
            });

            let buttonsHTML = '';
            level.quiz.options.forEach((opt, idx) => {
                let letter = String.fromCharCode(65 + idx);
                buttonsHTML += '<button class="quiz-option" onclick="evaluateAnswer(' + level.id + ',' + idx + ')">' + letter + ') ' + opt + '</button>';
            });

            contentHTML += `
                <div class="objectives">
                    <strong>🎯 Learning Objectives:</strong>
                    <ul>${objectivesHTML}</ul>
                </div>
                <div class="task-sections">
                    <div class="tier-box tier-must">
                        <div class="tier-title">🟢 MUST-DO TASKS (Mandatory Benchmark)</div>
                        <div>${level.mustDo}</div>
                    </div>
                    <div class="tier-box tier-should">
                        <div class="tier-title">🔵 SHOULD-DO TASKS (Deepen Mastery)</div>
                        <div>${level.shouldDo}</div>
                    </div>
                    <div class="tier-box tier-aspire">
                        <div class="tier-title">🟡 ASPIRE-TO-DO TASKS (Fast-Finisher Boss Room)</div>
                        <div>${level.aspireToDo}</div>
                    </div>
                </div>
            `;

            if (!userProgress.completedLevels.includes(level.id)) {
                contentHTML += `
                    <div class="quiz-container" id="quiz-zone-${level.id}">
                        <h4>🏁 Gatekeeper Verification Quiz</h4>
                        <p>Pass this question to authenticate mastery and unlock the next sequential chapter level!</p>
                        <p class="math-block"><strong>Question:</strong> ${level.quiz.question}</p>
                        <div style="margin-top: 10px;">${buttonsHTML}</div>
                        <div id="quiz-feedback-${level.id}" style="margin-top:10px; font-weight:700;"></div>
                    </div>
                `;
            }
        } else {
            contentHTML += `
                <div class="locked-msg">
                    <span>Complete previous curricular validation check-points to release this module.</span>
                </div>
            `;
        }

        card.innerHTML = contentHTML;
        container.appendChild(card);
    });

    updateProgressBar();
    applyMathTypesetting();
};

// Global Verification Processor
window.evaluateAnswer = function(levelId, chosenIdx) {
    const level = levelsData.find(l => l.id === levelId);
    const feedbackZone = document.getElementById('quiz-feedback-' + levelId);
    if (!level || !feedbackZone) return;
    
    if (chosenIdx === level.quiz.correctIndex) {
        feedbackZone.style.color = "var(--success)";
        feedbackZone.innerHTML = "✓ Correct! Mastery verified. Module unlocked.";
        
        if (!userProgress.completedLevels.includes(levelId)) {
            userProgress.completedLevels.push(levelId);
        }
        
        if (levelId === userProgress.unlockedLevel && userProgress.unlockedLevel < levelsData.length) {
            userProgress.unlockedLevel = levelId + 1;
        }

        saveState();
        setTimeout(window.renderCampaignMap, 1200);
    } else {
        feedbackZone.style.color = "var(--danger)";
        feedbackZone.innerHTML = "❌ Verification Failed. Review your whiteboard notes, check intermediate calculations, and try again! If stuck, report to the Guided Table.";
    }
};

// Progressive Progress Layout Math Calculator
function updateProgressBar() {
    if (typeof levelsData === 'undefined' || !Array.isArray(levelsData)) return;
    const total = levelsData.length;
    const completedCount = userProgress.completedLevels.length;
    const percentage = Math.max(9, Math.round((completedCount / total) * 100));
    const progressBar = document.getElementById('global-progress');
    if (progressBar) progressBar.style.width = percentage + '%';
}

// Local storage backup saver
function saveState() {
    localStorage.setItem('quadratic_campaign_progress', JSON.stringify(userProgress));
}

// System reset algorithm hook
window.resetCampaign = function() {
    if(confirm("Are you sure you want to completely clear all progress variables? This action reverts all locks.")) {
        userProgress = { unlockedLevel: 1, completedLevels: [] };
        saveState();
        window.renderCampaignMap();
    }
};

// 🔄 Explicit, bulletproof manual compilation framework call
function applyMathTypesetting() {
    if (window.MathJax && window.MathJax.typeset) {
        try {
            window.MathJax.typeset();
        } catch (err) {
            console.log("MathJax typesetting execution note:", err);
        }
    }
}

// Synchronous application initialization triggers
window.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('reset-campaign-btn');
    if (resetBtn) resetBtn.addEventListener('click', window.resetCampaign);
    window.renderCampaignMap();
});

// Post-network download verification trigger sweep
window.addEventListener('load', () => {
    window.renderCampaignMap();
    applyMathTypesetting();
});
