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

// Tab functionality
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.content-section');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Show target section with animation
      sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
      });
      
      const targetSection = document.getElementById(targetId);
      targetSection.style.display = 'block';
      
      // Animate section elements
      setTimeout(() => {
        targetSection.classList.add('active');
        animateSectionElements(targetSection);
      }, 50);
    });
  });
}

function animateSectionElements(section) {
  const elements = section.querySelectorAll('h2, p, li, .result-box, .skill-category');
  
  elements.forEach((el, index) => {
    el.style.setProperty('--index', index);
    el.classList.add('section-animate', 'fade-in-up');
    
    // Clean up animation classes after animation completes
    setTimeout(() => {
      el.classList.remove('section-animate', 'fade-in-up');
    }, 1000);
  });
}

// Initialize skill bars
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const percentage = progressBar.getAttribute('data-progress') + '%';
        progressBar.style.width = percentage;
        observer.unobserve(progressBar);
      }
    });
  }, { threshold: 0.2 });
  
  skillBars.forEach(bar => {
    observer.observe(bar);
  });
}

// Event tracking functionality 
function logEvent(eventType, element) {
  const timestamp = new Date().toISOString();
  let objectType = 'Unknown';
  
  if (element.tagName === 'IMG') {
    objectType = 'Image';
  }
  else if (element.tagName === 'A') {
    if (element.href && element.href.endsWith('.pdf')) {
      objectType = 'PDF Link';
    } else {
      objectType = 'Link';
    }
  }
  else if (element.tagName === 'P') {
    objectType = 'Paragraph';
  }
  else if (element.tagName === 'H1' || element.tagName === 'H2') {
    objectType = 'Header';
  }
  else if (element.tagName === 'UL' || element.tagName === 'LI') {
    objectType = 'List Item';
  }
  else if (element.tagName === 'BUTTON') {
    objectType = 'Button';
  }
  else if (element.tagName === 'INPUT') {
    objectType = 'Input';
  }
  else if (element.tagName === 'SELECT') {
    objectType = 'Dropdown';
  }
  else if (element.classList.contains('nav-tab')) {
    objectType = 'Navigation Tab';
  }
  
  console.log(`${timestamp}, ${eventType}, ${objectType}`);
}

// Text analysis functionality
const textInput = document.getElementById('text-input');
const analyzeBtn = document.getElementById('analyze-btn');

// Real-time analysis on input with debounce
let debounceTimer;
textInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(analyzeText, 500);
});

// Optional: Keep button for manual analysis
analyzeBtn.addEventListener('click', () => {
  analyzeText();
  
  // Add button click animation
  analyzeBtn.classList.add('clicked');
  setTimeout(() => {
    analyzeBtn.classList.remove('clicked');
  }, 300);
});

function analyzeText() {
  const text = textInput.value;
  
  // Show loading animation
  document.querySelector('.loader').style.display = 'flex';
  
  setTimeout(() => {
    const letterCount = text.replace(/[^a-z]/gi, "").length;
    const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const spaceCount = (text.match(/ /g) || []).length;
    const newlineCount = (text.match(/\n/g) || []).length;
    const specialCharCount = text.replace(/[a-z0-9\s]/gi, "").length;
    
    const pronouns = ["i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them"];
    const prepositions = ["in", "on", "at", "by", "for", "with", "about", "between", "above", "below"];
    const articles = ["a", "an", "the"];
    
    const pronounCounts = countWords(text, pronouns);
    const prepositionCounts = countWords(text, prepositions);
    const articleCounts = countWords(text, articles);
    
    // Hide loading animation
    document.querySelector('.loader').style.display = 'none';
    
    showBasicStats(letterCount, wordCount, spaceCount, newlineCount, specialCharCount);
    showResults("pronouns-stats", "Pronouns", pronounCounts);
    showResults("prepositions-stats", "Prepositions", prepositionCounts);
    showResults("articles-stats", "Articles", articleCounts);
    
    // Animate the results appearance
    animateResults();
  }, 300); // Simulated processing time
}

function countWords(text, wordList) {
  const counts = {};
  const allWords = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  wordList.forEach(word => {
    counts[word] = allWords.filter(w => w === word).length;
  });
  
  return counts;
}

function showBasicStats(letters, words, spaces, newlines, specials) {
  document.getElementById('basic-stats').innerHTML = `
    <h3>Basic Counts</h3>
    <div class="result-item"><span>Letters:</span> <span class="highlight">${letters}</span></div>
    <div class="result-item"><span>Words:</span> <span class="highlight">${words}</span></div>
    <div class="result-item"><span>Spaces:</span> <span class="highlight">${spaces}</span></div>
    <div class="result-item"><span>Newlines:</span> <span class="highlight">${newlines}</span></div>
    <div class="result-item"><span>Special Chars:</span> <span class="highlight">${specials}</span></div>
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

function animateResults() {
  const resultBoxes = document.querySelectorAll('.result-box');
  
  resultBoxes.forEach((box, index) => {
    box.style.opacity = '0';
    box.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      box.style.transition = 'all 0.5s ease';
      box.style.opacity = '1';
      box.style.transform = 'translateY(0)';
    }, index * 150);
  });
}

// Page load animations
window.addEventListener('load', function() {
  // Add animations to sections
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    section.style.setProperty('--index', index);
  });
  
  // Setup theme based on local storage
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode) {
    isDarkMode = savedDarkMode === 'true';
    if (!isDarkMode) {
      document.body.classList.add('light-mode');
      document.querySelector('.theme-toggle i').textContent = '🌙';
    }
  }
  
  // Initialize tabs
  initTabs();
  
  // Initialize skill bars
  initSkillBars();
  
  // Show first tab by default
  document.querySelector('.nav-tab').click();
  
  // Event tracking
  let allElements = document.querySelectorAll('*');
  for (let i = 0; i < allElements.length; i++) {
    logEvent('view', allElements[i]);
  }
  
  // Remove loader
  setTimeout(() => {
    document.querySelector('.loader').style.display = 'none';
  }, 800);
});

// Track click events
document.addEventListener('click', function(event) {
  logEvent('click', event.target);
});

// Initial empty analysis
setTimeout(() => {
  analyzeText();
}, 1000);
