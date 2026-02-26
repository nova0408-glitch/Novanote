const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
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