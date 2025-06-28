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
  heading.innerText = "Add a New Quote";

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.innerText = "Add Quote";
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
    quoteDisplay.innerHTML = "No quotes in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const selectedQuote = filteredQuotes[randomIndex].text;
  quoteDisplay.innerHTML = selectedQuote;

  sessionStorage.setItem("lastQuote", selectedQuote);
}

// --- ADD QUOTE FUNCTION ---
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });

    const existingCategories = [...categoryFilter.options].map(opt => opt.value);
    if (!existingCategories.includes(category)) {
      const option = document.createElement("option");
      option.value = category;
      option.innerText = category;
      categoryFilter.appendChild(option);
    }

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added!");

    saveQuotes(); // save to localStorage
  } else {
    alert("Please fill in both fields.");
  }
}

// --- CATEGORY DROPDOWN SETUP ---
function populateCategories() {
  const uniqueCategories = new Set(quotes.map(q => q.category));
  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.innerText = category;
    categoryFilter.appendChild(option);
  });
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
    quoteDisplay.innerHTML = last;
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

// --- INITIALIZATION ---
newQuoteBtn.addEventListener("click", showRandomQuote);

loadQuotesFromStorage();
populateCategories();
createAddQuoteForm();
loadLastQuote();
