// Local Storage Campaign State Management Matrix
let campaignProgress = {
    section4Mastered: false
};

// Initialize app variables from LocalStorage cache
if (localStorage.getItem('math_campaign_state')) {
    campaignProgress = JSON.parse(localStorage.getItem('math_campaign_state'));
}

document.addEventListener("DOMContentLoaded", function() {
    evaluateCampaignState();
});

function evaluateCampaignState() {
    const s4Badge = document.getElementById('s4-badge');
    const s4Quiz = document.getElementById('s4-quiz-zone');
    const progressBar = document.getElementById('progress-fill');

    if (campaignProgress.section4Mastered) {
        // Mastered State Configurations
        if (s4Badge) { s4Badge.className = "badge badge-mastered"; s4Badge.textContent = "Mastered ✓"; }
        if (s4Quiz) { s4Quiz.style.display = "none"; }
        if (progressBar) { progressBar.style.width = "100%"; }
    } else {
        // Active State Configurations
        if (s4Badge) { s4Badge.className = "badge badge-active"; s4Badge.textContent = "Active Quest ⚡"; }
        if (s4Quiz) { s4Quiz.style.display = "block"; }
        if (progressBar) { progressBar.style.width = "10%"; }
    }
}

// Global Validation Engine Route
window.checkAnswer = function(chosenIndex) {
    const feedback = document.getElementById('quiz-feedback');
    
    if (chosenIndex === 0) { // Option A is correct
        feedback.style.color = "#16a34a";
        feedback.innerHTML = "🎉 Correct! Mastery verified. Campaign checkpoint achieved!";
        
        campaignProgress.section4Mastered = true;
        localStorage.setItem('math_campaign_state', JSON.stringify(campaignProgress));
        
        // Refresh structural states smoothly
        setTimeout(evaluateCampaignState, 1500);
    } else {
        feedback.style.color = "#dc2626";
        feedback.innerHTML = "❌ Verification Failed. Review your calculations and try again.";
    }
};

window.resetCampaign = function() {
    if (confirm("Reset layout progress data variables?")) {
        campaignProgress.section4Mastered = false;
        localStorage.setItem('math_campaign_state', JSON.stringify(campaignProgress));
        evaluateCampaignState();
        const feedback = document.getElementById('quiz-feedback');
        if (feedback) feedback.innerHTML = "";
    }
};
