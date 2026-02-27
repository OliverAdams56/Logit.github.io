// Initializing global variables to interact with HTML elements
const logList = document.getElementById("log-list");
const addBtn = document.getElementById("add-btn");
const searchBar = document.getElementById('search-bar');
const noResultsMsg = document.getElementById('no-results');
const sortOptions = document.getElementById('sort-options');
const helpBtn = document.getElementById("help-btn");
const helpModal = document.getElementById("help-modal");
const closeModal = document.querySelector(".close-modal");

// When the page finishes loading, retrieve and show saved logs
window.onload = () => {
  let saved = JSON.parse(localStorage.getItem("myLogs"));
  
  if (!saved || saved.length === 0) {
    const initialLogs = [
      {
        id: 1,
        title: "Inception",
        rank: "10",
        genre: "Sci-Fi",
        reason: "A mind-bending masterpiece with incredible visuals.",
        status: "Completed"
      },
      {
        id: 2,
        title: "The Godfather",
        rank: "9",
        genre: "Crime",
        reason: "An absolute classic. The storytelling is unmatched.",
        status: "Completed"
      },
      {
        id: 3,
        title: "Interstellar",
        rank: "—", 
        genre: "Sci-Fi",
        reason: "Planning to watch this soon! Heard great things about the soundtrack.",
        status: "To Watch"
      }
    ];
    localStorage.setItem("myLogs", JSON.stringify(initialLogs));
    saved = initialLogs;
  }
  
  saved.forEach((entry) => renderEntry(entry));
};

// This listener handles everything when the 'Add to Log' button is clicked
addBtn.addEventListener("click", () => {
  // Pulling the current values from the form inputs
  const status = document.getElementById("status").value;
  const title = document.getElementById("title").value;
  const genre = document.getElementById("genre").value;
  const reason = document.getElementById("reason").value;
  const rank = document.getElementById("rank").value;

  // Variables for error handling and visual feedback
  const titleInput = document.getElementById("title");
  const titleError = document.getElementById("title-error");
  const rankInput = document.getElementById("rank");
  const rankError = document.getElementById("rank-error");
  const rankValue = parseInt(rank);

  // Clear any existing error styles before validating
  titleInput.classList.remove("input-error");
  titleError.innerText = "";
  rankInput.classList.remove("input-error");
  rankError.innerText = "";

  let hasError = false;

  // Check if Rank is between 1 and 10
  if (rank.trim() !== "" && (rankValue < 1 || rankValue > 10 || isNaN(rankValue))) {
    rankInput.classList.add("input-error");
    rankError.innerText = "Rank must be between 1 and 10.";
    hasError = true;
  }
  // Check if Title is provided
  if (!title.trim()) {
    titleInput.classList.add("input-error");
    titleError.innerText = "Title is required.";
    hasError = true;
  }

  // If validation fails, stop the function here
  if (hasError) return;

  // Provide celebratory feedback for completed movies
  if (status === "Completed") {
    showToast("🎉 <strong>Awesome!</strong> You finished a movie!");
  } else {
    showToast("✅ Entry added successfully.");
  }

  // Create a movie object and save it
  const entry = { status, title, genre, reason, rank: rank || "—", id: Date.now() };
  saveToLocal(entry);
  renderEntry(entry);

  // Reset the form inputs to blank
  document.getElementById("status").selectedIndex = 0;
  document.getElementById("title").value = "";
  document.getElementById("genre").value = "";
  document.getElementById("reason").value = "";
  document.getElementById("rank").value = "";
});

// Creates the HTML structure for a single movie card and adds it to the list
function renderEntry(entry) {
  const div = document.createElement("div");
  const isCompleted = entry.status === "Completed";
  
  // Apply specific styles if the movie is completed
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

// Function to push a new entry into LocalStorage
function saveToLocal(entry) {
  const logs = JSON.parse(localStorage.getItem("myLogs")) || [];
  logs.push(entry);
  localStorage.setItem("myLogs", JSON.stringify(logs));
}

// Function to handle single entry deletion with a confirmation prompt
function deleteEntry(id) {
  if (confirm("Are you sure you want to delete this entry?")) {
    const itemToRemove = document.querySelector(`[data-id="${id}"]`);
    if (itemToRemove) itemToRemove.remove();

    let logs = JSON.parse(localStorage.getItem("myLogs")) || [];
    logs = logs.filter((log) => log.id !== id);
    localStorage.setItem("myLogs", JSON.stringify(logs));
    showToast("🗑️ Entry removed.");
  }
}

// Button listener to wipe all data from storage and the UI
const clearBtn = document.getElementById("clear-all-btn");
clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all entries?")) {
    localStorage.removeItem("myLogs");
    logList.innerHTML = "";
    showToast("🧹 All entries cleared.");
  }
});

// Search functionality to filter logs by title in real-time
searchBar.addEventListener('keyup', (e) => {
  const term = e.target.value.toLowerCase();
  const items = logList.querySelectorAll('.log-item');
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

  // Display 'no results' if search returns nothing
  noResultsMsg.style.display = (hasVisibleItems || term === "") ? 'none' : 'block';
});

// Sorting logic for Rank, Title, and Newest
sortOptions.addEventListener('change', () => {
  const criteria = sortOptions.value;
  let entries = JSON.parse(localStorage.getItem('myLogs')) || [];
  
  const getRankValue = (rank) => {
    const val = parseInt(rank);
    return isNaN(val) ? 0 : val;
  };

  if (criteria === 'rank-high') {
    entries.sort((a, b) => getRankValue(a.rank) - getRankValue(b.rank));
  } else if (criteria === 'rank-low') {
    entries.sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));
  } else if (criteria === 'title-az') {
    entries.sort((a, b) => b.title.localeCompare(a.title));
  } else {
    entries.sort((a, b) => a.id - b.id);
  }

  // Clear list and re-render in the new order
  logList.innerHTML = '';
  entries.forEach(entry => renderEntry(entry));
});

// Function to display non-intrusive 'Toast' notifications
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

helpBtn.onclick = () => {
  helpModal.style.display = "flex";
};

closeModal.onclick = () => {
  helpModal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target == helpModal) {
    helpModal.style.display = "none";
  }
};