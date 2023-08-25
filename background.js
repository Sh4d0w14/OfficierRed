// Initialisez une variable pour stocker les domaines bloqués
let blockedSites = [];

// Fonction pour récupérer les domaines bloqués depuis votre serveur Flask
function fetchBlockedDomains() {
    fetch('http://localhost:5000/getData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de réseau');
            }
            return response.json();
        })
        .then(data => {
            blockedSites = data; // Mettez à jour la variable globale
            chrome.storage.local.set({ "blockedDomains": data }); // Stockez également dans le stockage local
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });
}

// Appelez la fonction au démarrage de l'extension pour récupérer la liste initiale
fetchBlockedDomains();

// Fonction d'écoute pour bloquer les requêtes web vers les domaines spécifiés
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        const currentDomain = new URL(details.url).hostname;

        // Vérifiez si le domaine courant est dans la liste des domaines bloqués
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

// Si vous décidez d'ajouter une fonctionnalité pour actualiser la liste à intervalles réguliers, utilisez la fonction ci-dessous :
// setInterval(fetchBlockedDomains, 3600000); // Met à jour toutes les heures
