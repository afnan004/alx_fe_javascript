const quotes = [
  { text: "The best way to predict the future is to invent it.", category: "inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "Success is not final, failure is not fatal.", category: "success" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// Populate category dropdown
function populateCategories() {
  const uniqueCategories = new Set(quotes.map(q => q.category));
  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.innerText = category;
    categoryFilter.appendChild(option);
  });
}

// ✅ Function must be named exactly this:
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
  quoteDisplay.innerHTML = filteredQuotes[randomIndex].text;
}

// ✅ Also required
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
  } else {
    alert("Please fill in both fields.");
  }
}

// ✅ Event listener for the button
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initialize on load
populateCategories();
