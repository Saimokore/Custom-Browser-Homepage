chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // This code runs ONLY when the extension is first installed
    console.log('Extension installed for the first time!');
    
    initialize();

  } else if (details.reason === 'update') {
    
    // Optional: Run this when you push an update (e.g., migration scripts)
    console.log('Extension updated to version ' + chrome.runtime.getManifest().version);

    initialize();
  }
});

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function initialize() {
  // This code runs ONLY when the extension is first installed
  
  const links = [
    {
      id: generateId(),
      name: 'Google',
      url: 'https://google.com',
      customIcon: null,
      row: 0,
      col: 0
    },
    {
      id: generateId(),
      name: 'Youtube',
      url: 'https://youtube.com',
      customIcon: null,
      row: 0,
      col: 1
    }
  ];

  chrome.storage.sync.get(['links'], (result) =>{
      // Check if the 'items' object has any keys
      if (!result.links || result.links.length === 0) {
          console.log('Sync storage is empty.');
          chrome.storage.sync.set({ 
              links: links,
              showTutorial: true
          }, () => {
              console.log('Default links and tutorial flag initialized.');
          });
      } else {
          console.log('Sync storage is NOT empty.');
          console.log(result);
      }
  });
  

  chrome.tabs.create({
    url: 'chrome://newtab'
  });
}