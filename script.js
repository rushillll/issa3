function logEvent(eventType, element) 
{
  const timestamp = new Date().toISOString()
  let objectType = 'Unknown'
  
  if (element.tagName === 'IMG') 
  {
    objectType = 'Image'
  }
  else if (element.tagName === 'A') 
  {
    if (element.href.endsWith('.pdf')) 
    {
      objectType = 'PDF Link'
    } 
    else 
    {
      objectType = 'Link'
    }
  }
  else if (element.tagName === 'P') 
  {
    objectType = 'Paragraph'
  }
  else if (element.tagName === 'H1' || element.tagName === 'H2') 
  {
    objectType = 'Header'
  }
  else if (element.tagName === 'UL' || element.tagName === 'LI') 
  {
    objectType = 'List Item'
  }
  else if (element.tagName === 'BUTTON') 
  {
    objectType = 'Button'
  }
  else if (element.tagName === 'INPUT') 
  {
    objectType = 'Input'
  }
  else if (element.tagName === 'SELECT') 
  {
    objectType = 'Dropdown'
  }
  
  console.log(timestamp + ', ' + eventType + ', ' + objectType)
}

// Tab Navigation System
function initTabNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const contentSections = document.querySelectorAll('.content-section');

  // Hide all sections except the first one
  for (let i = 1; i < contentSections.length; i++) {
    contentSections[i].style.display = 'none';
  }
  contentSections[0].style.display = 'block';

  // Add click event listeners to each nav item
  navItems.forEach((item, index) => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the section ID from the link href
      const targetId = this.querySelector('a').getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      // Remove active class from all nav items and hide all sections
      navItems.forEach(navItem => {
        navItem.classList.remove('active');
      });
      
      contentSections.forEach(section => {
        section.style.display = 'none';
      });
      
      // Add active class to clicked nav item and show target section
      this.classList.add('active');
      targetSection.style.display = 'block';
      
      // Log the event
      logEvent('tab navigation', this.querySelector('a'));
    });
  });
}

window.addEventListener('load', function() 
{
  let allElements = document.querySelectorAll('*')
  
  for (let i = 0; i < allElements.length; i++) 
  {
    logEvent('view', allElements[i])
  }

  // Initialize tab navigation
  initTabNavigation();
})

document.addEventListener('click', function(event) 
{
  logEvent('click', event.target)
})

const textInput = document.getElementById('text-input');
const analyzeBtn = document.getElementById('analyze-btn');

// Real-time analysis on input
textInput.addEventListener('input', analyzeText);

// Optional: Keep button for manual analysis
analyzeBtn.addEventListener('click', analyzeText);

function analyzeText() {
  const text = textInput.value;
  
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
  
  showBasicStats(letterCount, wordCount, spaceCount, newlineCount, specialCharCount);
  showResults("pronouns-stats", "Pronouns", pronounCounts);
  showResults("prepositions-stats", "Prepositions", prepositionCounts);
  showResults("articles-stats", "Articles", articleCounts);
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
  for (const [word, count] of Object.entries(wordCounts)) {
    if (count > 0) {
      html += `<div class="result-item"><span>${word}:</span> <span class="highlight">${count}</span></div>`;
      hasResults = true;
    }
  }
  
  if (!hasResults) html += `<div>No ${title.toLowerCase()} found</div>`;
  
  document.getElementById(boxId).innerHTML = html;
}

// Initialize the text analysis
analyzeText();
