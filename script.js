function logEvent(eventType, element) 
{
  const timestamp = new Date().toISOString();
  let objectType = 'Unknown';
  
  if (element.tagName === 'IMG') 
  {
    objectType = 'Image';
  }
  else if (element.tagName === 'A') 
  {
    if (element.href.endsWith('.pdf')) 
    {
      objectType = 'PDF Link';
    } 
    else 
    {
      objectType = 'Link';
    }
  }
  else if (element.tagName === 'P') 
  {
    objectType = 'Paragraph';
  }
  else if (element.tagName === 'H1' || element.tagName === 'H2') 
  {
    objectType = 'Header';
  }
  else if (element.tagName === 'UL' || element.tagName === 'LI') 
  {
    objectType = 'List Item';
  }
  else if (element.tagName === 'BUTTON') 
  {
    objectType = 'Button';
  }
  else if (element.tagName === 'INPUT') 
  {
    objectType = 'Input';
  }
  else if (element.tagName === 'SELECT') 
  {
    objectType = 'Dropdown';
  }
  
  console.log(timestamp + ', ' + eventType + ', ' + objectType);
}

// Store visibility state
let isVisible = true;

// Handle visibility change events
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    isVisible = false;
    // Save the state when tab becomes hidden
    console.log('Tab hidden');
  } else {
    isVisible = true;
    console.log('Tab visible again');
    // Ensure content is displayed when tab becomes visible again
    document.body.style.display = 'block';
  }
});

// On page load, log elements but don't modify visibility
window.addEventListener('load', function() {
  // Set a delay to avoid any race conditions
  setTimeout(function() {
    document.body.style.display = 'block';
    
    // Log elements if needed
    let allElements = document.querySelectorAll('*');
    for (let i = 0; i < allElements.length; i++) {
      logEvent('view', allElements[i]);
    }
  }, 100);
});

document.addEventListener('click', function(event) {
  logEvent('click', event.target);
});

// Additional safeguard - check every few seconds that content is visible
setInterval(function() {
  if (isVisible && document.body.style.display !== 'block') {
    document.body.style.display = 'block';
    console.log('Restored visibility');
  }
}, 1000);
