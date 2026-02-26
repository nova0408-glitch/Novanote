const day = new Date();
const todayKey = day.toISOString().split('T')[0];
let finalConclusion = Number(localStorage.getItem(`progress-${todayKey}`));

const success = document.getElementById("successTasks");
const unsuccess = document.getElementById("unsuccessTasks");
const title = document.getElementById("final-title");
const conclusion = document.getElementById("conclusion");

console.log("Final Progress:", finalConclusion);
console.log("Type of finalProgress:", typeof finalConclusion);

// Handle invalid/NaN (e.g., no tasks)
if (isNaN(finalConclusion)) {
    finalConclusion = 0;
    console.log("Invalid final progress value; setting to 0");
}

if (finalConclusion === 100) {
    success.removeAttribute("hidden"); 
    title.innerHTML = "You're doing good!";
} else {
    unsuccess.removeAttribute("hidden"); 
    title.innerHTML = "Keep going!";
}
conclusion.innerText = `Your final progress: ${Math.round(finalConclusion)}%`;

// Restart button functionality
const restartBtn = document.getElementById("restart-btn");
restartBtn.addEventListener("click", () => { window.electronAPI.loadPage("index.html"); });