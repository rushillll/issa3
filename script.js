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

window.addEventListener('load', function() 
{
  let allElements = document.querySelectorAll('*')
  
  for (let i = 0; i < allElements.length; i++) 
  {
    logEvent('view', allElements[i])
  }
})

document.addEventListener('click', function(event) 
{
  logEvent('click', event.target)
})

