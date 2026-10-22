// ==========================================
// ⚙️ CORE STATE & GRAPHICS RENDERING ENGINE
// ==========================================

let gameState = {
    highestUnlocked: 1,
    currentActiveLevel: 1,
    completedLevels: [],
    xp: 0
};

function initProgressEngine() {
    const memory = localStorage.getItem("calculus_matrix_state");
    if (memory) {
        try {
            gameState = JSON.parse(memory);
        } catch(e) {
            console.error("State recovery corrupted, resetting defaults.");
        }
    }
    renderVerticalMapTrack();
    switchLevelView(gameState.currentActiveLevel);
}

function saveEngineState() {
    localStorage.setItem("calculus_matrix_state", JSON.stringify(gameState));
    syncSidebarInterface();
}

function resetEngineState() {
    if(confirm("Are you sure you want to clear your local dashboard memory checkpoint?")) {
        localStorage.removeItem("calculus_matrix_state");
        gameState = { highestUnlocked: 1, currentActiveLevel: 1, completedLevels: [], xp: 0 };
        saveEngineState();
        location.reload();
    }
}

/* 📡 CLEAN HORIZONTAL MATRIX GRID MAP RENDERER */
function renderVerticalMapTrack() {
    const trackContainer = document.getElementById("vertical-map-track");
    if (!trackContainer) return;
    trackContainer.innerHTML = "";

    const modulesPerRow = 3; 
    let currentScaleRow = [];

    for (let i = 1; i <= TOTAL_NODES; i++) {
        currentScaleRow.push(i);

        if (currentScaleRow.length === modulesPerRow || i === TOTAL_NODES) {
            const rowDiv = document.createElement("div");
            rowDiv.className = "map-track-row";

            currentScaleRow.forEach(levelNum => {
                const nodeWrapper = document.createElement("div");
                nodeWrapper.className = "map-node-container";
                
                if (levelNum === gameState.currentActiveLevel) nodeWrapper.classList.add("active");
                if (gameState.completedLevels.includes(levelNum)) nodeWrapper.classList.add("completed");
                
                if (levelNum <= gameState.highestUnlocked) {
                    nodeWrapper.onclick = () => { switchLevelView(levelNum); };
                } else {
                    nodeWrapper.style.opacity = "0.25";
                    nodeWrapper.style.cursor = "not-allowed";
                }

                // 🟢 REMOVED THE ARROW SPAN COMPLETELY
                nodeWrapper.innerHTML = `
                    <div class="map-node">${levelNum}</div>
                    <div class="node-label" style="font-size: 0.8rem; margin-top: 6px; text-align: center;">Section ${levelNum}</div>
                `;
                rowDiv.appendChild(nodeWrapper);
            });

            trackContainer.appendChild(rowDiv);
            // 🟢 REMOVED THE PATH-DROP-ELBOW CONNECTORS GENERATOR COMPLETELY
            currentScaleRow = [];
        }
    }
    syncSidebarInterface();
}


function syncSidebarInterface() {
    document.getElementById("stat-xp").textContent = gameState.completedLevels.length * 150 + " XP";
    document.getElementById("stat-nodes").textContent = gameState.completedLevels.length + " / " + TOTAL_NODES;
    
    const containers = document.querySelectorAll(".map-node-container");
    containers.forEach((box, index) => {
        const levelNum = index + 1;
        box.classList.remove("active", "completed");
        if (levelNum === gameState.currentActiveLevel) box.classList.add("active");
        if (gameState.completedLevels.includes(levelNum)) box.classList.add("completed");
    });
}

/* 🖥️ LESSON VIEWPORT CORE DISPLAY ENGINE */
function switchLevelView(levelId) {
    gameState.currentActiveLevel = levelId;
    saveEngineState();

    const viewport = document.getElementById("viewport-root");
    if (!viewport) return;
    viewport.innerHTML = "";

    if (levelId <= TOTAL_NODES) {
        viewport.innerHTML = `
            <iframe src="sections/section${levelId}.html" class="content-iframe" style="height: 100%; border: none;"></iframe>
        `;
    } else {
        viewport.innerHTML = `
            <div style="background:#111827; border:1px solid var(--border-glow); padding:40px; border-radius:12px; text-align:center; width:100%; box-sizing:border-box;">
                <h3 style="color:var(--neon-blue); margin-top:0;">📚 ${nodeTitles[levelId]}</h3>
                <p style="color:var(--text-muted); max-width:400px; margin:15px auto;">This section template is ready in the directory timeline framework shell.</p>
            </div>
        `;
    }
}
