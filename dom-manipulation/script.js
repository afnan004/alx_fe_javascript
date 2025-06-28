const quotes = [
  { text: "The best way to predict the future is to invent it.", category: "inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "Success is not final, failure is not fatal.", category: "success" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// --- FORM CREATION ---
function createAddQuoteForm() {
  const formContainer = document.getElementById("quoteFormContainer");

  const heading = document.createElement("h3");
  heading.textContent = "Add a New Quote";

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(heading);
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// --- SHOW RANDOM QUOTE ---
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const selectedQuote = filteredQuotes[randomIndex].text;
  quoteDisplay.textContent = selectedQuote;

  sessionStorage.setItem("lastQuote", selectedQuote);
}

// --- ADD QUOTE FUNCTION ---
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added!");

    saveQuotes();
    populateCategories();
  } else {
    alert("Please fill in both fields.");
  }
}

// --- POPULATE CATEGORY FILTER ---
function populateCategories() {
  const selected = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  categoryFilter.value = selected;
  filterQuote();
}

// --- FILTER QUOTES FUNCTION ---
function filterQuote() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);

  const filteredQuotes = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }

  quoteDisplay.textContent = filteredQuotes[0].text;
}

// --- LOCAL STORAGE ---
function loadQuotesFromStorage() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    try {
      const parsedQuotes = JSON.parse(storedQuotes);
      quotes.length = 0;
      quotes.push(...parsedQuotes);
    } catch {
      alert("Error loading quotes from localStorage.");
    }
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// --- SESSION STORAGE (optional) ---
function loadLastQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    quoteDisplay.textContent = last;
  }
}

// --- JSON IMPORT ---
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch {
      alert("Error reading the file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// --- JSON EXPORT ---
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// --- SYNC WITH SERVER ---
async function syncWithServer() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();

    // Simulate server quote structure: use first 10 for brevity
    const serverQuotes = data.slice(0, 10).map(post => ({
      text: post.title,
      category: "server"
    }));

    let updatesMade = false;

    // Conflict resolution: server wins
    serverQuotes.forEach(serverQuote => {
      const local = quotes.find(q => q.text === serverQuote.text);
      if (!local) {
        quotes.push(serverQuote);
        updatesMade = true;
      } else if (local.category !== serverQuote.category) {
        local.category = serverQuote.category;
        updatesMade = true;
      }
    });

    if (updatesMade) {
      saveQuotes();
      populateCategories();
      showNotification("Quotes synced from server (conflicts resolved).");
    }
  } catch (e) {
    console.error("Failed to sync with server:", e);
  }
}

// --- NOTIFICATION UI ---
function showNotification(message) {
  const note = document.createElement("div");
  note.textContent = message;
  note.style.position = "fixed";
  note.style.bottom = "20px";
  note.style.right = "20px";
  note.style.padding = "10px 15px";
  note.style.backgroundColor = "#333";
  note.style.color = "#fff";
  note.style.borderRadius = "5px";
  note.style.zIndex = 1000;
  document.body.appendChild(note);

  setTimeout(() => note.remove(), 4000);
}

// --- INITIALIZATION ---
newQuoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", filterQuote);

loadQuotesFromStorage();
populateCategories();
createAddQuoteForm();
loadLastQuote();
syncWithServer(); // initial sync
setInterval(syncWithServer, 60000); // periodic sync every 60 seconds
