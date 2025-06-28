const quotes = [
    { text: "The best way to predict the future is to invent it.", category: "inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "life" },
    { text: "Success is not final, failure is not fatal.", category: "success" }
  ];
  
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteBtn = document.getElementById('newQuote');
  const categoryFilter = document.getElementById('categoryFilter');
  
  function showRandomQuote() {
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = selectedCategory === "all"
      ? quotes
      : quotes.filter(quote => quote.category === selectedCategory);
  
    if (filteredQuotes.length === 0) {
      quoteDisplay.innerText = "No quotes in this category.";
      return;
    }
  
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    quoteDisplay.innerText = filteredQuotes[randomIndex].text;
  }
  
  function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();
  
    if (text && category) {
      quotes.push({ text, category });
  
      if (![...categoryFilter.options].some(opt => opt.value === category)) {
        const option = document.createElement('option');
        option.value = category;
        option.innerText = category;
        categoryFilter.appendChild(option);
      }
  
      document.getElementById('newQuoteText').value = "";
      document.getElementById('newQuoteCategory').value = "";
      alert("Quote added!");
    } else {
      alert("Please fill out both fields.");
    }
  }
  
  newQuoteBtn.addEventListener('click', showRandomQuote);
  