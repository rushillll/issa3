// Theme toggle functionality
let isDarkMode = true;

function toggleTheme() {
  const body = document.body;
  
  if (isDarkMode) {
    body.classList.add('light-mode');
    document.querySelector('.theme-toggle i').textContent = '🌙';
  } else {
    body.classList.remove('light-mode');
    document.querySelector('.theme-toggle i').textContent = '☀️';
  }
  
  isDarkMode = !isDarkMode;
  
  // Save preference
  localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
}

// Tokenizer: Tokenize and display words
const textInput = document.getElementById('text-input');
const analyzeBtn = document.getElementById('analyze-btn');
const clearBtn = document.getElementById('clear-btn');
const resultsContainer = document.getElementById('results');
const resultText = document.getElementById('result-text');

// Function to analyze text
function analyzeText() {
  const text = textInput.value.trim();
  
  if (text === "") {
    alert("Please enter some text to analyze.");
    return;
  }

  // Show loading animation
  document.querySelector('.loader').style.display = 'flex';
  
  setTimeout(() => {
    const tokens = text.split(/\s+/);  // Tokenize by spaces
    const wordCount = tokens.length;
    
    // Display results
    resultsContainer.style.display = 'block';
    resultText.innerHTML = `Tokenized Words: <br>${tokens.join('<br>')}`;
    
    document.querySelector('.loader').style.display = 'none';
    
    // Additional analysis here (letters, spaces, etc.)
    const letterCount = text.replace(/[^a-zA-Z]/g, "").length;
    const spaceCount = (text.match(/ /g) || []).length;
    const newlineCount = (text.match(/\n/g) || []).length;
    
    showBasicStats(letterCount, wordCount, spaceCount, newlineCount);
    
    // Optional: Pronoun, preposition, and article analysis
    showResults("pronouns-stats", "Pronouns", countWords(text, ["i", "you", "he", "she", "it", "we", "they"]));
    showResults("prepositions-stats", "Prepositions", countWords(text, ["in", "on", "at", "by", "for", "with", "about"]));
    showResults("articles-stats", "Articles", countWords(text, ["a", "an", "the"]));
  }, 300);  // Simulated delay for processing
}

// Function to count occurrences of words in a list
function countWords(text, wordList) {
  const counts = {};
  const allWords = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  wordList.forEach(word => {
    counts[word] = allWords.filter(w => w === word).length;
  });
  
  return counts;
}

function showBasicStats(letters, words, spaces, newlines) {
  document.getElementById('basic-stats').innerHTML = `
    <h3>Basic Counts</h3>
    <div class="result-item"><span>Letters:</span> <span class="highlight">${letters}</span></div>
    <div class="result-item"><span>Words:</span> <span class="highlight">${words}</span></div>
    <div class="result-item"><span>Spaces:</span> <span class="highlight">${spaces}</span></div>
    <div class="result-item"><span>Newlines:</span> <span class="highlight">${newlines}</span></div>
  `;
}

function showResults(boxId, title, wordCounts) {
  let html = `<h3>${title}</h3>`;
  let hasResults = false;
  
  // Sort by count (descending)
  const sortedEntries = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);
  
  for (const [word, count] of sortedEntries) {
    if (count > 0) {
      html += `<div class="result-item"><span>${word}:</span> <span class="highlight">${count}</span></div>`;
      hasResults = true;
    }
  }
  
  if (!hasResults) html += `<div>No ${title.toLowerCase()} found</div>`;
  
  document.getElementById(boxId).innerHTML = html;
}

// Event listeners for buttons
analyzeBtn.addEventListener('click', analyzeText);
clearBtn.addEventListener('click', () => {
  textInput.value = ''; // Clear the input field
  resultsContainer.style.display = 'none'; // Hide the results
});

// Event tracking
function logEvent(eventType, element) {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp}, ${eventType}, ${element.tagName}`);
}

// Page load setup
window.addEventListener('load', function() {
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode) {
    isDarkMode = savedDarkMode === 'true';
    if (!isDarkMode) {
      document.body.classList.add('light-mode');
    }
  }
  
  // Event tracking for clicks
  document.addEventListener('click', function(event) {
    logEvent('click', event.target);
  });
  
  // Initial empty analysis
  setTimeout(() => {
    analyzeText();
  }, 1000);
});
