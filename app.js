// Progressive Campaign State Management Configuration
let userProgress = {
    unlockedLevel: 1,
    completedLevels: []
};

// Retrieve local storage state history if cached
if (localStorage.getItem('quadratic_campaign_progress')) {
    userProgress = JSON.parse(localStorage.getItem('quadratic_campaign_progress'));
}

// 🚀 Expose renderCampaignMap globally so the MathJax engine can trigger it directly
window.renderCampaignMap = function() {
    const container = document.getElementById('map-target');
    if (!container) return;
    container.innerHTML = '';

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
    
    // Compile elements immediately if MathJax finishes booting up early
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetClear();
        window.MathJax.typesetPromise();
    }
}

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

function updateProgressBar() {
    const total = levelsData.length;
    const completedCount = userProgress.completedLevels.length;
    const percentage = Math.max(9, Math.round((completedCount / total) * 100));
    const progressBar = document.getElementById('global-progress');
    if (progressBar) progressBar.style.width = percentage + '%';
}

function saveState() {
    localStorage.setItem('quadratic_campaign_progress', JSON.stringify(userProgress));
}

// Development hard reset tool
window.resetCampaign = function() {
    if(confirm("Are you sure you want to completely clear all progress variables? This action reverts all locks.")) {
        userProgress = { unlockedLevel: 1, completedLevels: [] };
        saveState();
        window.renderCampaignMap();
    }
};

// 🔄 Force MathJax to scan the entire updated layout map synchronously
function applyMathTypesetting() {
    if (window.MathJax && window.MathJax.typeset) {
        window.MathJax.typeset();
    }
}

// Build your card board as soon as the files finish reading
window.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('reset-campaign-btn');
    if (resetBtn) resetBtn.addEventListener('click', window.resetCampaign);
    window.renderCampaignMap();
});

// Force a bulletproof second sweep the microsecond the network finishes downloading MathJax
window.addEventListener('load', () => {
    applyMathTypesetting();
});

