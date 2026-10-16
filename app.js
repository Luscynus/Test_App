const levelsData = [
    {
        id: 1,
        chapter: "Section 4",
        title: "Quadratic Models and Factorisation",
        objectives: [
            "Isolate global common algebraic factors from expressions using the distributive property in reverse.",
            "Deploy notable identity structures, monic sum-product relationships, and non-monic grouping splits to factorise expressions."
        ],
        templateId: "level-1", 
        quiz: {
            question: "Factorise the non-monic expression completely: \(9x^2 + 24x + 7\).",
            options: ["\((3x + 1)(3x + 7)\)", "\((9x + 1)(x + 7)\)", "\((3x - 1)(3x - 7)\)", "\(x^2(9x + 24) + 7\)"],
            correctIndex: 0
        }
    }
];

let userProgress = { unlockedLevel: 1, completedLevels: [] };
if (localStorage.getItem('quadratic_campaign_progress')) {
    userProgress = JSON.parse(localStorage.getItem('quadratic_campaign_progress'));
}

// Pull layout text safely from the iframe window context
window.initAppEngine = function() {
    try {
        const iframe = document.getElementById('curriculum-loader');
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const warehouse = document.getElementById('curriculum-warehouse');
        
        warehouse.innerHTML = iframeDoc.body.innerHTML;
        renderCampaignMap();
    } catch (err) {
        console.error("Iframe context load block, trying fallback fetch...", err);
        fetch('./sections.html?v=' + Date.now())
            .then(res => res.text())
            .then(html => {
                document.getElementById('curriculum-warehouse').innerHTML = html;
                renderCampaignMap();
            })
            .catch(fetchErr => {
                document.getElementById('map-target').innerHTML = 
                    "<div style='padding:20px; background:#fff3cd; border:2px solid #eab308; color:#a16207; border-radius:8px;'> +" +
                    "<h3>System Note: Data Bridge Active</h3>" +
                    "<p>Push your workspace code to GitHub to authorize the live channel!</p>" +
                    "</div>";
            });
    }
};

function renderCampaignMap() {
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

            const mustDoSource = document.getElementById(level.templateId + '-mustDo');
            const shouldDoSource = document.getElementById(level.templateId + '-shouldDo');
            const aspireSource = document.getElementById(level.templateId + '-aspireToDo');

            const mustDoText = mustDoSource ? mustDoSource.innerHTML : "Content block missing in sections.html.";
            const shouldDoText = shouldDoSource ? shouldDoSource.innerHTML : "Tasks block missing in sections.html.";
            const aspireText = aspireSource ? aspireSource.innerHTML : "Challenge block missing in sections.html.";

            contentHTML += `
                <div class="objectives">
                    <strong>🎯 Learning Objectives:</strong>
                    <ul>${objectivesHTML}</ul>
                </div>
                <div class="task-sections">
                    <div class="tier-box tier-must">
                        <div class="tier-title">🟢 MUST-DO TASKS (Mandatory Benchmark)</div>
                        <div>${mustDoText}</div>
                    </div>
                    <div class="tier-box tier-should">
                        <div class="tier-title">🔵 SHOULD-DO TASKS (Deepen Mastery)</div>
                        <div>${shouldDoText}</div>
                    </div>
                    <div class="tier-box tier-aspire">
                        <div class="tier-title">🟡 ASPIRE-TO-DO TASKS (Fast-Finisher Boss Room)</div>
                        <div>${aspireText}</div>
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
}

window.evaluateAnswer = function(levelId, chosenIdx) {
    const level = levelsData.find(l => l.id === levelId);
    const feedbackZone = document.getElementById('quiz-feedback-' + levelId);
    if (chosenIdx === level.quiz.correctIndex) {
        feedbackZone.style.color = "var(--success)";
        feedbackZone.innerHTML = "✓ Correct! Mastery verified. Module unlocked.";
        if (!userProgress.completedLevels.includes(levelId)) userProgress.completedLevels.push(levelId);
        if (levelId === userProgress.unlockedLevel && userProgress.unlockedLevel < levelsData.length) userProgress.unlockedLevel = levelId + 1;
        saveState();
        setTimeout(renderCampaignMap, 1200);
    } else {
        feedbackZone.style.color = "var(--danger)";
        feedbackZone.innerHTML = "❌ Verification Failed. Review calculations and try again!";
    }
};

function updateProgressBar() {
    const total = levelsData.length;
    const completedCount = userProgress.completedLevels.length;
    const percentage = Math.max(9, Math.round((completedCount / total) * 100));
    const progressBar = document.getElementById('global-progress');
    if (progressBar) progressBar.style.width = percentage + '%';
}

function saveState() { localStorage.setItem('quadratic_campaign_progress', JSON.stringify(userProgress)); }

window.resetCampaign = function() {
    if(confirm("Reset progress variables?")) {
        userProgress = { unlockedLevel: 1, completedLevels: [] };
        saveState();
        renderCampaignMap();
    }
};

// 🔄 Instant, Synchronous KaTeX Formatter Sweep
function applyMathTypesetting() {
    if (window.renderMathInElement) {
        window.renderMathInElement(document.body, {
            delimiters: [
                {left: '\[', right: '\]', display: true},
                {left: '\(', right: '\)', display: false},
                {left: '\\(', right: '\\', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false
        });
    } else {
        setTimeout(applyMathTypesetting, 100);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('reset-campaign-btn');
    if (resetBtn) resetBtn.addEventListener('click', window.resetCampaign);
});
