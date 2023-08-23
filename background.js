let blockedSites = [];

// Récupérer les données depuis votre serveur local (votre script Python)
function fetchBlockedDomains() {
    fetch('http://localhost:5000/getData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de réseau');
            }
            return response.json();
        })
        .then(data => {
            // Stockez les domaines dans le stockage local ou en mémoire pour utilisation future
            blockedSites = data;
            chrome.storage.local.set({ "blockedDomains": data });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });
}

// Appel de la fonction au démarrage de l'extension
fetchBlockedDomains();

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        const currentDomain = new URL(details.url).hostname;
        if (blockedSites.includes(currentDomain)) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icon.png',
                title: 'Attention!',
                message: 'Vous visitez actuellement un site Web répertorié sur red.flag.domains'
            });
            return { cancel: true };
        }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

// Si vous souhaitez actualiser les données à intervalles réguliers, vous pouvez utiliser setTimeout ou setInterval.
