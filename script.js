const logList = document.getElementById("log-list");
const addBtn = document.getElementById("add-btn");


window.onload = () => {
  const saved = JSON.parse(localStorage.getItem("myLogs")) || [];
  saved.forEach((entry) => renderEntry(entry));
};


addBtn.addEventListener("click", () => {

  const status = document.getElementById("status").value;
  const title = document.getElementById("title").value;
  const genre = document.getElementById("genre").value;
  const reason = document.getElementById("reason").value;
  const rank = document.getElementById("rank").value;

  const titleInput = document.getElementById("title");
  const titleError = document.getElementById("title-error");
  const rankInput = document.getElementById("rank");
  const rankError = document.getElementById("rank-error");
  const rankValue = parseInt(rank);

  titleInput.classList.remove("input-error");
  titleError.innerText = "";
  rankInput.classList.remove("input-error");
  rankError.innerText = "";

  let hasError = false;

  if (!rank || rankValue < 1 || rankValue > 10 || isNaN(rankValue)) {
    rankInput.classList.add("input-error");
    rankError.innerText = "Rank must be between 1 and 10.";
    hasError = true;
  }

  if (!title.trim()) {
    titleInput.classList.add("input-error");
    titleError.innerText = "Title is required.";
    hasError = true;
  }

  if (hasError) return;

  if (status === "Completed") {
    showToast("🎉 <strong>Awesome!</strong> You finished a movie!");
  } else {
    showToast("✅ Entry added successfully.");
  }

  const entry = { status, title, genre, reason, rank, id: Date.now() };

  saveToLocal(entry);
  renderEntry(entry);

  document.getElementById("status").selectedIndex = 0;
  document.getElementById("title").value = "";
  document.getElementById("genre").value = "";
  document.getElementById("reason").value = "";
  document.getElementById("rank").value = "";
});

function renderEntry(entry) {
  const div = document.createElement("div");

  const isCompleted = entry.status === "Completed";
  div.className = `log-item ${isCompleted ? 'celebrate' : ''}`;

  div.setAttribute("data-id", entry.id);
  div.innerHTML = `
    <span class="rank-badge">Rank: ${entry.rank}</span>
    <h3>${entry.title} <small style="color:gray;">(${entry.genre})</small></h3>
    <p><strong>Status:</strong> ${entry.status || 'Not Set'}</p>
    <p>${entry.reason}</p>
    <button class="delete-btn" onclick="deleteEntry(${entry.id})">Delete</button>
  `;
  logList.prepend(div);
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

const searchBar = document.getElementById('search-bar');
const noResultsMsg = document.getElementById('no-results');

searchBar.addEventListener('keyup', (e) => {
  const term = e.target.value.toLowerCase();
  const items = document.querySelectorAll('.log-item');
  let hasVisibleItems = false;

  items.forEach((item) => {
    const title = item.querySelector('h3').innerText.toLowerCase();

    if (title.includes(term)) {
      item.style.display = 'block';
      hasVisibleItems = true;
    } else {
      item.style.display = 'none';
    }
  });

  if (hasVisibleItems) {
    noResultsMsg.style.display = 'none';
  } else {
    noResultsMsg.style.display = 'block';
  }
});

const sortOptions = document.getElementById('sort-options');

sortOptions.addEventListener('change', () => {
  const criteria = sortOptions.value;
  let entries = JSON.parse(localStorage.getItem('myLogs')) || [];

  if (criteria === 'rank-high') {
        // Want 10 at top? Sort 1 -> 10
    entries.sort((a, b) => parseInt(a.rank) - parseInt(b.rank));
  } else if (criteria === 'rank-low') {
        // Want 1 at top? Sort 10 -> 1
    entries.sort((a, b) => parseInt(b.rank) - parseInt(a.rank));
  } else if (criteria === 'title-az') {
        // Want A at top? Sort Z -> A
    entries.sort((a, b) => b.title.localeCompare(a.title));
  } else {
        // Newest (Default): Want New at top? Sort Old -> New
    entries.sort((a, b) => a.id - b.id);
  }

    // Clear current list
  logList.innerHTML = '';

    // Re-render all items
  entries.forEach(entry => renderEntry(entry));
});

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}