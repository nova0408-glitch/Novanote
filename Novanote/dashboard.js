const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const today = new Date();
const todayKey = today.toISOString().split('T')[0];

document.getElementById("day").textContent = weekday[today.getDay()];
document.getElementById("number").textContent = today.getDate();
document.getElementById("month").textContent = month[today.getMonth()];

let tasks = [];
let notes = "";

const taskListEl = document.getElementById("task-list");
const notesEl = document.getElementById("daily-notes");
const progressBar = document.getElementById("progress-bar");
const addBtn = document.getElementById("add-btn");
const inputTask = document.getElementById("write-task");
const finishBtn = document.getElementById("finish-btn");

// Load data
async function loadDayData() {
  const data = await window.electronAPI.loadDay(todayKey);
  if (data) {
    tasks = data.tasks || [];
    notes = data.notes || "";
    notesEl.value = notes;
  }
  renderTasks();
  updateProgress();
}

function saveDayData() {
  const data = { tasks, notes };
  window.electronAPI.saveDay(todayKey, data);
}

function renderTasks() {
  taskListEl.innerHTML = "";
  tasks.forEach((task, index) => {
    const taskEl = document.createElement("div");
    taskEl.className = `task-item ${task.done ? "done" : ""}`;
    taskEl.innerHTML = `
      <i class='bx bxs-leaf'></i>
      <span class="task-text">${task.text}</span>
      <div class="task-actions">
        <button class="edit-btn" data-index="${index}">✏️</button>
        <button class="delete-btn" data-index="${index}">🗑️</button>
      </div>
    `;
    
    taskEl.querySelector(".task-text").addEventListener("click", () => toggleDone(index));
    taskEl.querySelector(".edit-btn").addEventListener("click", () => editTask(index));
    taskEl.querySelector(".delete-btn").addEventListener("click", () => deleteTask(index));
    
    taskListEl.appendChild(taskEl);
  });
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  renderTasks();
  updateProgress();
  saveDayData();
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    renderTasks();
    saveDayData();
  }
}

function deleteTask(index) {
  if (confirm("Delete this task?")) {
    tasks.splice(index, 1);
    renderTasks();
    updateProgress();
    saveDayData();
  }
}

function updateProgress() {
  const doneCount = tasks.filter(t => t.done).length;
  const progress = tasks.length > 0 ? (doneCount / tasks.length) * 100 : 0;
  progressBar.value = progress;
}

addBtn.addEventListener("click", addTask);
inputTask.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  if (inputTask.value.trim() === "") return;
  tasks.push({ text: inputTask.value.trim(), done: false });
  renderTasks();
  updateProgress();
  saveDayData();
  inputTask.value = "";
}

// Notes auto-save
notesEl.addEventListener("input", () => {
  notes = notesEl.value;
  saveDayData();
});

finishBtn.addEventListener("click", async () => {
  updateProgress();
  saveDayData();
  await window.electronAPI.loadPage("finishDay.html");
});

// Init
loadDayData();const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const displayWeekDay = document.getElementById("day")
const displayDayNb = document.getElementById("number")
const displayMonth = document.getElementById("month")

const day = new Date()
let todayName = day.getDay()
let todayNumber = day.getDate()
let todayMonth = day.getMonth()

// Date key for daily persistence (e.g., '2026-02-26')
const todayKey = day.toISOString().split('T')[0];

displayWeekDay.innerHTML = weekday[todayName]
displayDayNb.innerHTML = todayNumber
displayMonth.innerHTML = month[todayMonth]

const addTaskBtn = document.getElementById("add-btn")
const inputTask = document.getElementById("write-task")
let taskList = []; // Array of {text: string, done: boolean}
const taskSpans = [];

const progressBarValue = document.getElementById("progress-bar")

const finishBtn = document.getElementById("finish-btn");
finishBtn.addEventListener("click", () => {
    updateProgressBar(); // Ensure latest progress
    console.log("Saving progress:", progressBarValue.value);
    localStorage.setItem(`progress-${todayKey}`, progressBarValue.value);
    window.electronAPI.loadPage("finishDay.html");
})

// Load tasks from localStorage for today
function loadTasks() {
    const savedTasks = localStorage.getItem(`tasks-${todayKey}`);
    if (savedTasks) {
        taskList = JSON.parse(savedTasks);
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem(`tasks-${todayKey}`, JSON.stringify(taskList));
}

loadTasks(); // Load on init

for (let i = 1; i <= 7; i++) {
    let taskSpan = document.getElementById("text-task-" + i);

    if (taskSpan) {
        taskSpans.push(taskSpan);

        taskSpan.addEventListener("click", (event) => {
            if (event.target.textContent.trim() === "") return; // Prevent toggle on empty
            event.target.classList.toggle("done")
            event.target.classList.toggle("checked")
            const index = taskSpans.indexOf(event.target);
            if (index !== -1 && index < taskList.length) {
                taskList[index].done = event.target.classList.contains("done");
                saveTasks();
            }
            updateProgressBar()
        })
    }
}

addTaskBtn.addEventListener("click", () => {
    if (inputTask.value.trim() === "") {
        console.warn("Please enter a task before adding to the list.");
    } else if (taskList.length >= 7) {
        console.warn("Task list is full. You can only add up to 7 tasks.");
    } else {
        taskList.push({ text: inputTask.value, done: false });
        updateTaskDisplay();
        saveTasks();
        inputTask.value = ""; // Clear input field
        updateProgressBar()
    }
});

function updateTaskDisplay() {
    for (let i = 0; i < taskSpans.length; i++) {
        if (i < taskList.length) {
            taskSpans[i].textContent = taskList[i].text;
            if (taskList[i].done) {
                taskSpans[i].classList.add("done", "checked");
            } else {
                taskSpans[i].classList.remove("done", "checked");
            }
        } else {
            taskSpans[i].textContent = "";
            taskSpans[i].classList.remove("done", "checked");
        }
    }
}

function updateProgressBar() {
    let checkedCount = 0;
    taskList.forEach(task => {
        if (task.done) checkedCount++;
    });
    const totalTasks = taskList.length;
    let progress = 0;
    if (totalTasks > 0) {
        progress = (checkedCount / totalTasks) * 100;
    }
    progressBarValue.value = progress;
}

updateTaskDisplay(); // Initial display
updateProgressBar(); // Initial progress
