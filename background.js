// Function to fetch blocked domains and update the dynamic rules
function fetchBlockedDomainsAndSetRules() {
    fetch('http://127.0.0.1/5000/getData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de réseau');
            }
            return response.json();
        })
        .then(domains => {
            // Convert the domains to rules for declarativeNetRequest
            const rules = domains.map((domain, index) => ({
                id: index + 1,
                priority: 1,
                action: { type: 'block' },
                condition: {
                    urlFilter: '||' + domain,
                    resourceTypes: ['main_frame']
                }
            }));

            // Update the dynamic rules with the new rules
            chrome.declarativeNetRequest.updateDynamicRules({
                addRules: rules
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });
}

// Call the function to fetch the blocked domains and set the rules
fetchBlockedDomainsAndSetRules();

// If you decide to add a feature to refresh the list at regular intervals, use the function below:
// setInterval(fetchBlockedDomainsAndSetRules, 3600000); // Update every hour
