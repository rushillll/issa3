// Log event function
function logEvent(eventType, element) {
  const timestamp = new Date().toISOString();
  let objectType = 'Unknown';
  
  if (element.tagName === 'IMG') {
    objectType = 'Image';
  } else if (element.tagName === 'A') {
    objectType = element.href.endsWith('.pdf') ? 'PDF Link' : 'Link';
  } else if (element.tagName === 'P') {
    objectType = 'Paragraph';
  } else if (element.tagName === 'H1' || element.tagName === 'H2') {
    objectType = 'Header';
  } else if (element.tagName === 'UL' || element.tagName === 'LI') {
    objectType = 'List Item';
  } else if (element.tagName === 'BUTTON') {
    objectType = 'Button';
  } else if (element.tagName === 'INPUT') {
    objectType = 'Input';
  } else if (element.tagName === 'SELECT') {
    objectType = 'Dropdown';
  }
  
  console.log(`${timestamp}, ${eventType}, ${objectType}`);
}

// Handle visibility change
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    console.log('Tab hidden');
  } else {
    console.log('Tab visible again');
    document.body.style.display = 'block';
  }
});

// On page load, ensure visibility and log elements
window.addEventListener('load', function() {
  document.body.style.display = 'block';
  
  const elementsToLog = document.querySelectorAll('img, a, p, h1, h2, ul, li, button, input, select');
  elementsToLog.forEach(element => logEvent('view', element));
});

// Click event logging
document.addEventListener('click', function(event) {
  logEvent('click', event.target);
});

// Fallback to ensure visibility if loading stalls
setTimeout(() => {
  if (document.body.style.display !== 'block') {
    document.body.style.display = 'block';
    console.log('Forced visibility after timeout');
  }
}, 2000);
