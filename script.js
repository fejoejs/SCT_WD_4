const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const clearBtn = document.getElementById("clear-all");
const themeToggle = document.getElementById("theme-toggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let isDark = localStorage.getItem("darkMode") === "true";

// THEME
document.body.classList.toggle("dark", isDark);
themeToggle.innerHTML = isDark ? `<i class="fas fa-sun"></i>` : `<i class="fas fa-moon"></i>`;

themeToggle.addEventListener("click", () => {
  isDark = !isDark;
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("darkMode", isDark);
  themeToggle.innerHTML = isDark ? `<i class="fas fa-sun"></i>` : `<i class="fas fa-moon"></i>`;
});

// UTIL
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getRemainingTime(taskDate, taskTime) {
  const taskTimeStamp = new Date(`${taskDate}T${taskTime}`);
  const now = new Date();
  const diff = taskTimeStamp - now;

  if (diff <= 0) return "⏰ Time Passed";

  const mins = Math.floor(diff / (1000 * 60)) % 60;
  const hrs = Math.floor(diff / (1000 * 60 * 60));
  return `🕒 ${hrs}h ${mins}m left`;
}

// RENDER
function renderTasks() {
  taskList.innerHTML = "";
  const filter = filterSelect.value.toLowerCase();
  const search = searchInput.value.toLowerCase();

  tasks.forEach((task, index) => {
    const isToday = new Date(task.date).toDateString() === new Date().toDateString();
    if (
      (filter === "completed" && !task.completed) ||
      (filter === "today" && !isToday) ||
      !task.title.toLowerCase().includes(search)
    ) return;

    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <div class="task-info">
        <strong>${task.title}</strong>
        <div class="task-time">${task.date} @ ${task.time} <br>${getRemainingTime(task.date, task.time)}</div>
      </div>
      <div class="task-actions">
        <button onclick="toggleDone(${index})">✅</button>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

function addTask(e) {
  e.preventDefault();
  const title = document.getElementById("task-title").value;
  const date = document.getElementById("task-date").value;
  const time = document.getElementById("task-time").value;

  tasks.push({ title, date, time, completed: false });
  saveTasks();
  renderTasks();
  taskForm.reset();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const task = tasks[index];
  document.getElementById("task-title").value = task.title;
  document.getElementById("task-date").value = task.date;
  document.getElementById("task-time").value = task.time;
  deleteTask(index);
}

function toggleDone(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function clearAll() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// INIT
taskForm.addEventListener("submit", addTask);
searchInput.addEventListener("input", renderTasks);
filterSelect.addEventListener("change", renderTasks);
clearBtn.addEventListener("click", clearAll);
setInterval(renderTasks, 60000);

renderTasks();