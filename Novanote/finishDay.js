const todayKey = new Date().toISOString().split('T')[0];

async function init() {
  const data = await window.electronAPI.loadDay(todayKey);
  const progress = data && data.tasks ? 
    (data.tasks.filter(t => t.done).length / data.tasks.length * 100) || 0 : 0;

  const title = document.getElementById("final-title");
  const emoji = document.getElementById("emoji-result");
  const conclusion = document.getElementById("conclusion");

  if (progress >= 100) {
    title.textContent = "Amazing Day!";
    emoji.textContent = "🌟";
  } else if (progress >= 70) {
    title.textContent = "Great Job!";
    emoji.textContent = "👍";
  } else if (progress >= 40) {
    title.textContent = "Good Effort!";
    emoji.textContent = "🙂";
  } else {
    title.textContent = "Keep Going!";
    emoji.textContent = "🌱";
  }

  conclusion.textContent = `Progress: ${Math.round(progress)}% • ${data?.tasks?.length || 0} tasks completed`;
}

document.getElementById("restart-btn").addEventListener("click", () => {
  window.electronAPI.loadPage("index.html");
});

init();
