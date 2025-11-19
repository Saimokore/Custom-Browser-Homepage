// Espera o conteúdo da página carregar
document.addEventListener('DOMContentLoaded', () => {

    if (!chrome?.storage?.sync) {
        console.error('Chrome storage API not available');
        return;
    }

    // background cycling
    const totalDeImagens = 25;
    let autoresFoto = ["Loic Lagarde", "Kohki Yamaguchi", "Kate Hook", "Justin Choquette", "Frauke Hamesiter", 
                       "Caleb Wielhouwer", "Zac Watson", "Marek Piwnicki", "Colin Watts", "Caleb Wielhouwer", 
                       "Davide Longo", "Dan Meyers", "Johannes Groll", "John Towner", "Luca Bravo", "Marek Piwnicki", 
                       "Pascal Debrunner", "Shang Li", "Silas Baisch", "Vedant Sonani", "Ahmet Yüksek", "Colin Watts", 
                       "Slava Auchynnikau", "Venti Views", "Colin Watts"
                    ];
    
    let linksFoto = [   "https://www.instagram.com/loic.lagarde/",
                        "https://www.instagram.com/kohki/",
                        "https://www.instagram.com/kateh00k/",
                        "https://www.instagram.com/justin.choquette/",
                        "https://www.frauki.com/story",
                        "https://www.instagram.com/calebwielhouwer/",
                        "https://www.instagram.com/watzac/",
                        "https://unsplash.com/pt-br/fotografias/majestosos-picos-de-montanhas-banhados-pela-luz-suave-do-por-do-sol-rgGXloz8juY",
                        "https://unsplash.com/pt-br/fotografias/uma-cordilheira-coberta-de-neve-sob-um-ceu-nublado-8tvSElhPqKE",
                        "https://www.instagram.com/calebwielhouwer/",
                        "https://www.instagram.com/davidelongoph/",
                        "https://unsplash.com/pt-br/fotografias/relampagos-caem-durante-uma-noite-tempestuosa-sobre-as-arvores-M3CjIfsOqvw",
                        "https://unsplash.com/pt-br/fotografias/montanha-ao-lado-do-corpo-de-agua-upXoQv5GAr8",
                        "https://unsplash.com/pt-br/fotografias/estrada-de-concreto-vazia-coberta-cercada-por-tress-altos-com-raios-de-sol-3Kv48NS4WUU",
                        "https://unsplash.com/photos/worms-eye-view-of-mountain-during-daytime-ii5JY_46xH0",
                        "https://unsplash.com/pt-br/fotografias/montanhas-cobertas-de-neve-contra-um-ceu-colorido-78oufSOElMk",
                        "https://unsplash.com/pt-br/fotografias/flores-amarelas-desabrocham-no-sope-da-montanha-TOKeCFmRtj4",
                        "https://www.shangliphotos.com/",
                        "https://unsplash.com/pt-br/fotografias/fotografia-aerea-de-estrada-Wn4ulyzVoD4",
                        "https://www.instagram.com/vedant.sonani/",
                        "https://unsplash.com/pt-br/fotografias/picos-de-montanha-em-silhueta-contra-um-ceu-quente-do-por-do-sol-mybaeBtxOj8",
                        "https://unsplash.com/pt-br/fotografias/trilhas-de-estrelas-sobre-nuvens-e-picos-de-montanhas-a-noite-Fhv1yWQFrSQ",
                        "https://unsplash.com/pt-br/fotografias/paisagem-lunar-nevada-sob-um-ceu-noturno-estrelado-DjPMpSqHxPs",
                        "https://unsplash.com/pt-br/fotografias/arco-rochoso-em-um-litoral-enevoado-com-ondas-do-mar-pvmCObXdIu8",
                        "https://unsplash.com/pt-br/fotografias/picos-de-montanhas-emergem-das-nuvens-no-crepusculo-kCF-KQD7ZAE"
                    ];

    
    loadBackground();

    async function loadBackground() {
        console.log(Date.now());
        const idArray = await getIdArray();
        console.log('idArray: ', idArray);
        if (idArray.length > 0) {
            console.log('Loading Customized Background.');

            const index = await getImageIndex(idArray.length);
            // const backImg = backgroundArray[index - 1];
            const backImg = await getBackground(idArray[index - 1]);

            document.body.style.backgroundImage = `url('${backImg}')`;
            loadImageDisplay(idArray)
            hideAutor();
            return;
        }

        console.log('Loading normal background images.');
        showAutor();

        let index = await getImageIndex(totalDeImagens);

        const imagemEscolhida = `img/${index}.jpg`;
        console.log('indice', index, 'imagemEscolhida', imagemEscolhida);

        const autorFoto = autoresFoto[index - 1] ?? 'Unknown';
        const linkFoto = linksFoto[index - 1] ?? '#';

        const autorElem = document.getElementsByClassName('autor')[0];
        autorElem.innerText = `Photo by: ${autorFoto}`;
        autorElem.href = linkFoto;

        document.body.style.backgroundImage = `url('${imagemEscolhida}')`;
    }

    async function getBackground(id) {
        console.log('Getting BG: ', id)
        return new Promise(resolve => {
            chrome.storage.local.get([id], (result) => {
                const valor = result[id]
                //console.log("Result ID ", valor)
                resolve(valor);
            });
        });
    }


    async function getImageIndex(imagesLength) {
        const { lastImageIndex = 0 } = await chrome.storage.sync.get('lastImageIndex');

        let proximoIndice = lastImageIndex + 1;

        if (proximoIndice > imagesLength) proximoIndice = 1;

        await chrome.storage.sync.set({ lastImageIndex: proximoIndice });

        console.log('prox indice ', proximoIndice);
        return proximoIndice;
    }


    function hideAutor() {
        const autor = document.getElementById('autor');
        autor.style.display = "none";
    }
    
    function showAutor() {
        const autor = document.getElementById('autor');
        autor.style.display = "flex";
    }

    // ELEMENTOS
    const closeOverlayBtn   =   document.getElementById('close-overlay-btn');
    const overlay           =   document.getElementById('add-link-overlay');
    const form              =   document.getElementById('add-link-form');
    const addLinkBtn        =   document.getElementById('add-link-btn');
    const contextMenu       =   document.getElementById('context-menu');
    const removeBtn         =   document.getElementById('remove-btn');
    const editBtn           =   document.getElementById('edit-btn');

    // Grid configuration
    const GRID_ROWS = 4;
    const GRID_COLS = 7; // Changed to 7 columns
    let gridMatrix = Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(null));

    // Creates the grid structure
    function createGrid() {
        const gridContainer = document.querySelector('.grid-container');
        if (!gridContainer) return;
        
        gridContainer.innerHTML = '';
        
        for (let row = 0; row < GRID_ROWS; row++) {
            for (let col = 0; col < GRID_COLS; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                gridContainer.appendChild(cell);
            }
        }
    }

    // Renderiza um único link
    function renderLink(name, url, customIcon, id, row = 0, col = 0) {
        const fullUrl = url?.startsWith('http') ? url : ('https://' + (url || ''));
        let hostname;
        try { hostname = new URL(fullUrl).hostname; } catch (e) { hostname = url || ''; }

        const newLink = document.createElement('a');
        newLink.href = fullUrl; // use fullUrl (was url)
        newLink.className = 'quick-link';
        newLink.dataset.name = name;
        newLink.dataset.id = id || generateId();
        newLink.dataset.row = String(row);
        newLink.dataset.col = String(col);
        if (customIcon) newLink.dataset.customIcon = customIcon;

        // icon + text...
        const icon = document.createElement('img');
        icon.className = 'link-icon';
        icon.alt = '';
        icon.src = customIcon || `https://favicons.seadfeng.workers.dev/${encodeURIComponent(hostname)}.ico`;
        icon.onerror = () => { icon.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="100%" height="100%" fill="#444"/><text x="50%" y="55%" font-size="20" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif">?</text></svg>'; };

        newLink.appendChild(icon);
        newLink.appendChild(document.createTextNode(name));

        // Context menu handler always uses closest cell (evita dados stale)
        newLink.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showContextMenu(e, newLink);
        });

        return newLink;
    }

    // Carrega e renderiza links
    function loadLinks() {
        createGrid(); // Create grid first

        chrome.storage.sync.get(['links'], (result) => {
            const links = result.links || [];
            
            // Reset matrix
            gridMatrix = Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(null));
            
            links.forEach(link => {
                const row = parseInt(link.row) || 0;
                const col = parseInt(link.col) || 0;
                
                if (row < GRID_ROWS && col < GRID_COLS) {
                    const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
                    if (cell && !cell.hasChildNodes()) { // Only place if cell is empty
                        const linkEl = renderLink(link.name, link.url, link.customIcon, link.id, row, col);
                        cell.appendChild(linkEl);
                        gridMatrix[row][col] = link;
                    }
                }
            });
            console.log(result.links);
            initSortable();
        });
    }

    // helper id generator
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }

    // state for editing
    let activeLink = null;
    let isEditing = false;
    let editingCell = null; // HTMLElement da célula que está sendo editada
    let editingRow = null;
    let editingCol = null;

    // Rebuild matrix from DOM (robusto após qualquer drag/drop)
    function rebuildMatrixFromDOM() {
        gridMatrix = Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(null));
        document.querySelectorAll('.grid-cell').forEach(cell => {
            const row = parseInt(cell.dataset.row, 10);
            const col = parseInt(cell.dataset.col, 10);
            const linkEl = cell.querySelector('.quick-link');
            if (linkEl) {
                // atualiza dataset do link para ficar coerente
                linkEl.dataset.row = String(row);
                linkEl.dataset.col = String(col);

                gridMatrix[row][col] = {
                    id: linkEl.dataset.id,
                    name: linkEl.dataset.name,
                    url: linkEl.href,
                    customIcon: linkEl.dataset.customIcon || null,
                    row,
                    col
                };
            }
        });
    }

    // Remove link usando referência DOM atual (closest cell)
    function removeLink(linkElement) {
        if (!linkElement) return hideContextMenu();
        const cell = linkElement.closest('.grid-cell');
        if (!cell) return hideContextMenu();
        const row = parseInt(cell.dataset.row, 10);
        const col = parseInt(cell.dataset.col, 10);

        // Limpa matriz e DOM
        gridMatrix[row][col] = null;
        cell.innerHTML = '';

        // Salva e esconde menu
        chrome.storage.sync.set({ links: getLinksFromMatrix() }, () => {
            hideContextMenu();
        });
    }

    // Ao abrir o menu "Editar", guarda a célula atual e preenche o formulário
    function openEditFor(linkElement) {
        if (!linkElement) return;
        const cell = linkElement.closest('.grid-cell');
        if (!cell) return;
        editingCell = cell;
        editingRow = parseInt(cell.dataset.row, 10);
        editingCol = parseInt(cell.dataset.col, 10);

        isEditing = true;
        activeLink = linkElement;

        // Preenche o formulário com dados atuais
        document.getElementById('site-name').value = linkElement.dataset.name || '';
        document.getElementById('site-url').value = linkElement.href || '';

        showOverlay();
    }

    // Helper: converte matriz em array plano para storage
    function getLinksFromMatrix() {
        const links = [];
        gridMatrix.forEach((rowArr, r) => {
            rowArr.forEach((cellObj, c) => {
                if (cellObj) {
                    links.push({
                        id: cellObj.id,
                        name: cellObj.name,
                        url: cellObj.url,
                        customIcon: cellObj.customIcon || null,
                        row: r,
                        col: c
                    });
                }
            });
        });
        return links;
    }

    // UI helpers (were missing and caused runtime errors)
    function showOverlay() {
        closeMenu();
        hideTutorialHighlight();
        if (!overlay) return;
        overlay.style.display = 'flex';
        // focus input if present
        const nameInput = document.getElementById('site-name');
        if (nameInput) nameInput.focus();
    }

    function hideOverlay() {
        if (!overlay) return;
        overlay.style.display = 'none';
        if (form) form.reset();
        isEditing = false;
        activeLink = null;
        editingCell = null;
        editingRow = null;
        editingCol = null;
    }

    function hideContextMenu() {
        if (!contextMenu) return;
        contextMenu.style.display = 'none';
        activeLink = null;
    }

    // Ajuste de renderLink: garante dataset row/col e bind do menu de contexto
    function renderLink(name, url, customIcon, id, row = 0, col = 0) {
        const fullUrl = url?.startsWith('http') ? url : ('https://' + (url || ''));
        let hostname;
        try { hostname = new URL(fullUrl).hostname; } catch (e) { hostname = url || ''; }

        const newLink = document.createElement('a');
        newLink.href = fullUrl; // use fullUrl (was url)
        newLink.className = 'quick-link';
        newLink.dataset.name = name;
        newLink.dataset.id = id || generateId();
        newLink.dataset.row = String(row);
        newLink.dataset.col = String(col);
        if (customIcon) newLink.dataset.customIcon = customIcon;

        // icon + text...
        const icon = document.createElement('img');
        icon.className = 'link-icon';
        icon.alt = '';
        icon.src = customIcon || `https://favicons.seadfeng.workers.dev/${encodeURIComponent(hostname)}.ico`;
        icon.onerror = () => { icon.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="100%" height="100%" fill="#444"/><text x="50%" y="55%" font-size="20" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif">?</text></svg>'; };

        newLink.appendChild(icon);
        newLink.appendChild(document.createTextNode(name));

        // Context menu handler always uses closest cell (evita dados stale)
        newLink.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showContextMenu(e, newLink);
        });

        return newLink;
    }

    // Inicializa Sortable com restrição e sem alterar layout
    function initSortable() {
        // destroy previous instances if you kept them (not shown here)
        document.querySelectorAll('.grid-cell').forEach(cell => {
            // ensure cell is a valid Sortable container
            new Sortable(cell, {
                animation: 150,
                ghostClass: 'link-ghost',
                group: {
                    name: 'links',
                    pull: true,
                    put: function (to, from, dragged) {
                        // allow put only if target cell currently empty OR target === source
                        const toEl = to.el;
                        // if dropping back into same cell allow (reorder)
                        if (toEl === from.el) return true;
                        // otherwise allow only if no quick-link inside
                        return toEl.querySelectorAll('.quick-link').length === 0;
                    }
                },
                onStart: function () {
                    // marca apenas células vazias como alvo visual — usa classe que não altera layout
                    document.querySelectorAll('.grid-cell').forEach(c => {
                        if (c.querySelectorAll('.quick-link').length === 0) c.classList.add('valid-target');
                    });
                },
                onEnd: function (evt) {
                    // limpa indicadores
                    document.querySelectorAll('.grid-cell.valid-target').forEach(c => c.classList.remove('valid-target'));

                    // rebuild matrix from DOM para garantir consistência
                    rebuildMatrixFromDOM();

                    // salva alterações
                    chrome.storage.sync.set({ links: getLinksFromMatrix() });
                }
            });
        });
    }

    // Buttons and menu actions
    addLinkBtn.addEventListener('click', showOverlay);
    closeOverlayBtn.addEventListener('click', hideOverlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) hideOverlay(); });

    removeBtn.addEventListener('click', () => {
        if (activeLink) removeLink(activeLink);
        hideContextMenu();
    });

    editBtn.addEventListener('click', () => {
        if (activeLink) openEditFor(activeLink);
        hideContextMenu();
    });

    // showContextMenu: grava referência do link clicado (activeLink) e posiciona menu
    function showContextMenu(event, linkElement) {
        event.preventDefault();
        event.stopPropagation();
        activeLink = linkElement; // referência ao <a> clicado
        // posicionamento...
        const menuWidth = contextMenu.offsetWidth;
        const menuHeight = contextMenu.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        let x = event.clientX, y = event.clientY;
        if (x + menuWidth > windowWidth) x = windowWidth - menuWidth;
        if (y + menuHeight > windowHeight) y = windowHeight - menuHeight;
        contextMenu.style.top = `${y}px`;
        contextMenu.style.left = `${x}px`;
        contextMenu.style.display = 'block';
    }

    // Form submit: trata ADD e EDIT usando editingCell
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const siteName = document.getElementById('site-name').value.trim();
        let siteUrl = document.getElementById('site-url').value.trim();
        const fileInput = document.getElementById('custom-icon');
        const file = fileInput?.files[0];

        if (!siteName || !siteUrl) {
            alert('Please fill all required fields.');
            return;
        }
        if (!siteUrl.startsWith('http')) siteUrl = 'https://' + siteUrl;

        let customIcon = null;
        if (file) {
            try { customIcon = await convertToBase64(file); } catch (err) { console.error(err); }
        }

        if (isEditing && editingCell) {
            // update existing
            const r = editingRow;
            const c = editingCol;
            const existing = gridMatrix[r][c] || {};
            const updated = {
                id: existing.id || generateId(),
                name: siteName,
                url: siteUrl,
                customIcon: customIcon || existing.customIcon || null,
                row: r, col: c
            };
            gridMatrix[r][c] = updated;

            // update DOM
            editingCell.innerHTML = '';
            const linkEl = renderLink(updated.name, updated.url, updated.customIcon, updated.id, r, c);
            editingCell.appendChild(linkEl);

            // reset editing flags
            isEditing = false;
            activeLink = null;
            editingCell = null;
            editingRow = null;
            editingCol = null;
        } else {
            // find first empty cell
            let found = false;
            let targetCell = null;
            let tr = 0, tc = 0;
            for (let r = 0; r < GRID_ROWS && !found; r++) {
                for (let c = 0; c < GRID_COLS && !found; c++) {
                    const cell = document.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
                    if (cell && cell.querySelectorAll('.quick-link').length === 0) {
                        found = true;
                        tr = r; tc = c;
                        targetCell = cell;
                    }
                }
            }
            if (!found) { alert('Não há células vazias'); return; }

            const newLink = {
                id: generateId(),
                name: siteName,
                url: siteUrl,
                customIcon,
                row: tr, col: tc
            };
            gridMatrix[tr][tc] = newLink;

            if (targetCell) {
                const linkEl = renderLink(newLink.name, newLink.url, newLink.customIcon, newLink.id, tr, tc);
                targetCell.appendChild(linkEl);
            }
        }

        // save and close
        chrome.storage.sync.set({ links: getLinksFromMatrix() }, () => {
            hideOverlay();
            form.reset();
        });
    });

    // Quando abrir menu por clique direito, use activeLink (setado em showContextMenu)
    window.addEventListener('click', (e) => {
        if (contextMenu.style.display === 'block' && !contextMenu.contains(e.target)) {
            hideContextMenu();
        }
    });

    // Carrega e inicializa
    createGrid();
    loadLinks();
    initSortable();

    // Validação de arquivo
    function validateFile(file) {
        const maxSize = 1024 * 1024;
        if (file.size > maxSize) return 'File must be less than 1MB';
        const validTypes = ['image/x-icon','image/png','image/jpeg','image/gif'];
        if (!validTypes.includes(file.type)) return 'Invalid Format. Use SVG, ICO, PNG, WEBP, JPG or GIF';
        return null;
    }

    function showTutorialHighlight() {
        const tutorialOverlay = document.getElementById('tutorial');
        const button = document.getElementById('add-link-btn');
        const circle1 = document.getElementById('circle1');
        const circle2 = document.getElementById('circle2');
        
        tutorialOverlay.style.display = 'block';

        if (!button || !circle1 || !circle2) {
            console.error('Tutorial elements not found!');
            return;
        }

        button.style.boxShadow = '0 0 15px 5px rgba(92, 121, 250, 0.45)';

        // 1. Obter posições e tamanhos
        const rect = button.getBoundingClientRect();
        const rectCircle1 = circle1.getBoundingClientRect();
        const rectCircle2 = circle2.getBoundingClientRect();

        // 2. Calcular o centro CORRETO do botão
        const buttonCenterX = rect.left + (rect.width / 2);
        const buttonCenterY = rect.top + (rect.height / 2);

        // 3. Calcular a posição (top, left) para CADA círculo
        //    para que seu centro se alinhe com o centro do botão.
        // (Assumindo que os círculos usam 'position: fixed' ou 'absolute')

        viewportWidth = window.innerWidth
        viewportHeight = window.innerHeight

        // Posição para o Círculo 1
        const circle1Bottom = (viewportHeight - buttonCenterY) - (rectCircle1.height / 2);
        const circle1Right = (viewportWidth - buttonCenterX) - (rectCircle1.width / 2);
        // Posição para o Círculo 2
        const circle2Bottom = (viewportHeight - buttonCenterY) - (rectCircle2.height / 2);
        const circle2Right = (viewportWidth - buttonCenterX) - (rectCircle2.width / 2);

        // 4. Aplicar os estilos usando 'top' e 'left'
        circle1.style.bottom = `${circle1Bottom}px`;
        circle1.style.right = `${circle1Right}px`;
        
        circle2.style.bottom = `${circle2Bottom}px`;
        circle2.style.right = `${circle2Right}px`;
    }

    function hideTutorialHighlight() {
        const tutorialOverlay = document.getElementById('tutorial');
        const button = document.getElementById('add-link-btn');
        tutorialOverlay.style.display = 'none';
        button.style.boxShadow = '';

        chrome.storage.sync.set({
              showTutorial: false
          }, () => {
              console.log('Tutorial set to false.');
          });
    }

    chrome.storage.sync.get(['showTutorial'], (result) => {
        console.log('Tutorial flag:', result.showTutorial);
        if (result.showTutorial) {
            showTutorialHighlight();
        }
    });

    // convert file to base64
    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    const openBtn = document.getElementById('open-settings-btn');
    const closeBtn = document.getElementById('close-settings-btn');
    const backdrop = document.getElementById('settings-backdrop');
    const settingsMenu = document.getElementById('settings-menu');
    const changeBgBtn = document.getElementById('change-bg-btn');
    const exportLinksBtn = document.getElementById('export-links-btn');
    const importLinksBtn = document.getElementById('import-links-btn');
    const fileInput = document.getElementById('selectFiles');
    const changeBGInput = document.getElementById('changeBGInput');
    const resetBgBtn = document.getElementById('reset-bg-settings-btn');
    const closeNotificationBtn = document.getElementById('close-notification-btn');
    const displayContainer = document.getElementById('img-display-container');
    const btnColMaxGrid = document.getElementById('max-col');
    const btnColMinGrid = document.getElementById('min-col');
    const btnRowMaxGrid = document.getElementById('max-row');
    const btnRowMinGrid = document.getElementById('min-row');
    const inputColGrid = document.getElementById('col');
    const inputRowGrid = document.getElementById('row');

    const openMenu = () => {
        hideOverlay();
        backdrop.style.display = 'block';
        settingsMenu.style.display = 'flex'; // Usar 'flex' pois definimos no CSS
    };

    const closeMenu = () => {
        backdrop.style.display = 'none';
        settingsMenu.style.display = 'none';
    };

    const exportLinks = () => {
        console.log('Exporting links...');
        chrome.storage.sync.get(['links'], (result) => {
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result.links));
            console.log('DataSTR: ', dataStr)
            var dlAnchorElem = document.getElementById('downloadAnchorElem');
            dlAnchorElem.setAttribute("href",     dataStr     );
            dlAnchorElem.setAttribute("download", "websiteLinks.json");
            dlAnchorElem.click();
        });
    };

    const importLinks = () => {
        fileInput.click();
    };

    const importLinksInput = () => {
        files = fileInput.files;
        console.log('Importing links...', files);
        if (files.length === 0) {
            return false;
        }

        const blob = new Blob([files], {type:"application/json"});

        const fr = new FileReader();

        fr.onload = () => {
            try {
                const linksJson = JSON.parse(fr.result);

                chrome.storage.sync.set({ links: linksJson }, () => {
                    console.log('Links imported successfully.');
                    loadLinks();
                    closeMenu();
                    fileInput.value = '';
                });

            } catch (err) {
                console.error("Invalid JSON file:", err);
            }
        };

        fr.readAsText(files[0]); // <- arquivo real
    };

    const changeBgButton = () => {
        changeBGInput.click();
    };

    function getIdArray() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['idArray'], (result) => {
                const idArray = result.idArray || [];
                console.log(Date.now());
                resolve(idArray);
            });
        });
    }

    const changeBgInput = async () => {
        console.log('Changing BG Image')
        let imgBg = changeBGInput?.files;
        if (!imgBg || imgBg.length === 0) return false;

        for (let i = 0; i < imgBg.length; i++) {
            const base64 = await convertToBase64(imgBg[i]);
            await addBackground(base64);
        }

        const idArray = await getIdArray();

        showNotification("Success. Background picture changed successfully");
        console.log('idar: ', idArray)

        await loadBackground();

        changeBGInput.value = '';
    }

    async function addBackground(base64) {
        const result = await chrome.storage.local.get(['idArray']);
        let idArrayB = result.idArray || [];

        const id = 'bg_' + idArrayB.length;
        idArrayB.push(id);

        await chrome.storage.local.set({ idArray: idArrayB });
        await chrome.storage.local.set({ [id]: base64 });

        addDisplayImage(id);

        console.log("New background:", id);
        return id;
    }

    function initSortableDisplay() {
        new Sortable(document.getElementById('img-display-container'), {
            animation: 150,
            ghostClass: 'ghost',
            onEnd: function (evt) {
                    // salva alterações
                    console.log('getlinks ', getLinksFromDisplayArray());
                    chrome.storage.local.set({ idArray: getLinksFromDisplayArray() });
                }
        });
    }

    function getLinksFromDisplayArray() {
        const items = document.querySelectorAll('#img-display-container .div-display');
        return Array.from(items).map(item => item.id);
    }

    function getLinksFromMatrix() {
        const links = [];
        gridMatrix.forEach((rowArr, r) => {
            rowArr.forEach((cellObj, c) => {
                if (cellObj) {
                    links.push({
                        id: cellObj.id,
                        name: cellObj.name,
                        url: cellObj.url,
                        customIcon: cellObj.customIcon || null,
                        row: r,
                        col: c
                    });
                }
            });
        });
        return links;
    }

    async function loadImageDisplay(idArray) {
        console.log('LoadImageDisplay, idArray: ', idArray)
        if (displayContainer.childElementCount == 0) {
            for (let i = 0; i < idArray.length; i++) {
                await addDisplayImage(idArray[i]);
            }
            initSortableDisplay()
        }
    }

    async function addDisplayImage(idArray) {
        console.log('Adding Image: ', idArray)
        const imgSrc = await getBackground(idArray);
        
        const divElem = document.createElement('div');
        divElem.style.position = 'relative';
        divElem.className = 'div-display';
        divElem.id = idArray;

        const aElem = document.createElement('button');
        aElem.className = 'img-display-a';

        const btnElem = document.createElement('img');
        btnElem.className = 'img-display-btn';
        btnElem.src = 'icons/svg/trash.svg';

        const imgElem = document.createElement('img');
        imgElem.src = imgSrc;
        imgElem.className = 'img-display-back';

        aElem.appendChild(imgElem);
        aElem.appendChild(btnElem);
        divElem.appendChild(aElem);
        displayContainer.appendChild(divElem);

        aElem.addEventListener('click', () => removeBg(divElem.id));
    }

    async function removeDisplayImage(id) {
        divElem = document.getElementById(id);
        divElem.remove();
    }

    const resetBg = async () => {
        arrayId = await getIdArray();
        for (let i; i < arrayId.length; i++) {
            const key = arrayId[i];
            chrome.storage.local.set({[key]: null});
        }
        chrome.storage.local.set({idArray: null});
        console.log('Background Reset');
        displayContainer.innerHTML = '';
        showNotification("Success. Background reseted successfully");
        loadBackground();
    }

    function showNotification(message) {
        console.log('Showing notification: ', message);
        document.getElementById('notif-message').innerText = message;
        document.getElementById('notification').style.opacity = "1";
        setTimeout(() => {
            closeNotification();
        }, 3 * 1000);
    }

    function closeNotification() {
        console.log("Closing notification");
        document.getElementById('notification').style.opacity = "0";
    }

    async function removeBg(id) {
        console.log("Removing Background");

        let idArrayB = await getIdArray();

        idArrayB = idArrayB.filter(item => item !== id);

        await chrome.storage.local.set({ idArray: idArrayB });
        chrome.storage.local.remove(id);

        // atualiza UI
        loadImageDisplay(idArrayB);
        loadBackground();
        removeDisplayImage(id);
    };
    
    function inputGrid(input) {
        console.log('sla ', input.value);
        if (input.value < 0) {
            input.value = 0;
        } else if (input.value > 15) {
            input.value = 15;
        }
    }


    // Event Listeners
    openBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    backdrop.addEventListener('click', closeMenu); // Fecha ao clicar fora
    exportLinksBtn.addEventListener('click', exportLinks);
    changeBgBtn.addEventListener('click', changeBgButton);
    changeBGInput.addEventListener('change', changeBgInput)
    importLinksBtn.addEventListener('click', importLinks);
    fileInput.addEventListener('change', importLinksInput);
    resetBgBtn.addEventListener('click', resetBg);
    closeNotificationBtn.addEventListener('click', closeNotification);
    btnColMaxGrid.addEventListener('click', () => maxGrid(btnColMaxGrid));
    btnColMinGrid.addEventListener('click', () => minGrid(btnColMinGrid));
    btnRowMaxGrid.addEventListener('click', () => maxGrid(btnRowMaxGrid))
    btnRowMinGrid.addEventListener('click', () => minGrid(btnRowMinGrid))
    inputColGrid.addEventListener('change', () => inputGrid(inputColGrid));
    inputRowGrid.addEventListener('change', () => inputGrid(inputRowGrid));

});