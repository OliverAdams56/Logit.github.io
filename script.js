const logList = document.getElementById("log-list");
const addBtn = document.getElementById("add-btn");

// Load entries when page opens
window.onload = () => {
  const saved = JSON.parse(localStorage.getItem("myLogs")) || [];
  saved.forEach((entry) => renderEntry(entry));
};

// Listen for the Add Button click
addBtn.addEventListener("click", () => {
  const status = document.getElementById("status").value;
  const title = document.getElementById("title").value;
  const genre = document.getElementById("genre").value;
  const reason = document.getElementById("reason").value;
  const rank = document.getElementById("rank").value;

  if (!title || !rank) return alert("Please fill in Title and Rank");

  const entry = { status, title, genre, reason, rank, id: Date.now() };

  saveToLocal(entry);
  renderEntry(entry);

  // Clear inputs
  document.getElementById("status").selectedIndex = 0;
  document.getElementById("title").value = "";
  document.getElementById("genre").value = "";
  document.getElementById("reason").value = "";
  document.getElementById("rank").value = "";
});

function renderEntry(entry) {
  const div = document.createElement("div");
  div.className = "log-item";
  div.setAttribute("data-id", entry.id); // Set unique ID for deletion
  div.innerHTML = `
    <span class="rank-badge">Rank: ${entry.rank}</span>
    <h3>${entry.title} <small style="color:gray;">(${entry.genre})</small></h3>
    <p><strong>Status:</strong> ${entry.status || 'Not Set'}</p>
    <p>${entry.reason}</p>
    <button class="delete-btn" onclick="deleteEntry(${entry.id})">Delete</button>
  `;
}

function saveToLocal(entry) {
  const logs = JSON.parse(localStorage.getItem("myLogs")) || [];
  logs.push(entry);
  localStorage.setItem("myLogs", JSON.stringify(logs));
}

function deleteEntry(id) {
  // 1. Remove from UI
  const itemToRemove = document.querySelector(`[data-id="${id}"]`);
  itemToRemove.remove();

  // 2. Remove from LocalStorage
  let logs = JSON.parse(localStorage.getItem("myLogs")) || [];
  logs = logs.filter((log) => log.id !== id);
  localStorage.setItem("myLogs", JSON.stringify(logs));
}

const clearBtn = document.getElementById("clear-all-btn");

clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all entries?")) {
    // 1. Clear the storage
    localStorage.removeItem("myLogs");

    // 2. Clear the screen
    logList.innerHTML = "";
  }
});