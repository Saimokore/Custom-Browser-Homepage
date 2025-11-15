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


  // Migrar dados do local storage para o sync storage
  chrome.storage.local.get(['links'], (result) => {
    // Verifica se 'links' existe e tem conteúdo
    if (result.links && result.links.length > 0) {
        console.log('Dados encontrados no local. Migrando para sync...');
        console.log(result);

        // 1. Salva os dados no storage 'sync'
        chrome.storage.sync.set({
            links: result.links,
            showTutorial: false // Assumindo que você sempre quer definir isso
        }, () => {
            console.log('Dados armazenados com sucesso no sync.');

            // 2. APENAS APÓS salvar no sync, remove os dados do 'local'
            chrome.storage.local.remove('links', () => {
                console.log('Dados originais do local storage foram excluídos.');
            });
        });
    } else {
        console.log('Local storage está vazio ou "links" não foi encontrado. Nada a migrar.');
    }
  });

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