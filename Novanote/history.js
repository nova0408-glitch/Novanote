async function loadHistory() {
  const dates = await window.electronAPI.getAllDates();
  const container = document.getElementById("history-list");
  container.innerHTML = "";

  if (dates.length === 0) {
    container.innerHTML = "<p>No past entries yet. Start completing days!</p>";
    return;
  }

  for (const date of dates) {
    const data = await window.electronAPI.loadDay(date);
    if (!data) continue;

    const done = data.tasks ? data.tasks.filter(t => t.done).length : 0;
    const total = data.tasks ? data.tasks.length : 0;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;

    const entry = document.createElement("div");
    entry.className = "history-entry";
    entry.innerHTML = `
      <strong>${date}</strong><br>
      Progress: ${progress}% (${done}/${total} tasks)<br>
      ${data.notes ? `<small>${data.notes.substring(0, 80)}...</small>` : ''}
      <button class="delete-history" data-date="${date}">Delete</button>
    `;
    container.appendChild(entry);
  }

  document.querySelectorAll(".delete-history").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (confirm("Delete this day permanently?")) {
        await window.electronAPI.deleteDay(btn.dataset.date);
        loadHistory();
      }
    });
  });
}

document.getElementById("back-btn").addEventListener("click", () => {
  window.electronAPI.loadPage("index.html");
});

loadHistory();
