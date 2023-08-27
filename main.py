from flask import Flask, jsonify
import requests
import json
# import smtplib
# from email.message import EmailMessage
from flask_cors import CORS

app = Flask(__name__)
# CORS(app) # Ceci autorisera toutes les origines
CORS(app, resources={r"/getData": {"origins": "chrome-extension://mffgljiccfmndchnjgjdflbljpohdfhd"}})

RED_FLAG_URL = "https://dl.red.flag.domains/red.flag.domains.txt"

@app.route('/getData', methods=['GET'])
def get_data():
    try:
        response = requests.get(RED_FLAG_URL)
        response.raise_for_status()  # Lance une exception en cas d'erreur
        domains = response.text.split('\n')
        return jsonify(domains)
    except requests.RequestException as e:
        return jsonify(error=str(e)), 500

# def send_email():
#     # Créer un message email
#     msg = EmailMessage()
#     msg.set_content('Le script de récupération des domaines a été exécuté avec succès.')
#     msg['Subject'] = 'Mise à jour des domaines réussie'
#     msg['From'] = 'votre_email@gmail.com' # Changez ceci par votre email
#     msg['To'] = 'rudy.alerte@gmail.com'

#     # Envoyer l'email via SMTP de Gmail
#     server = smtplib.SMTP('smtp.gmail.com', 587)
#     server.starttls()
#     server.login('votre_email@gmail.com', 'votre_mot_de_passe') # Changez ces informations
#     server.send_message(msg)
#     server.quit()

def fetch_and_save_data():
    # Récupérer les données depuis l'URL
    response = requests.get(RED_FLAG_URL)
    print("Site RedFlagDomain atteint.")
    response.raise_for_status() # Vérifiez que la demande a réussi
    print("Demande reussie.")
    # Divisez les données en une liste de domaines
    domains = response.text.split("\n")
    print("Split des donnees reussi.")
    
    # Sauvegarder dans un fichier JSON
    with open('blocked_domains.json', 'w') as file:
        json.dump(domains, file)
        print("Sauvegarde du fichier JSON reussie.")

    print("Données récupérées et sauvegardées avec succès.")
    # send_email()

if __name__ == "__main__":
    fetch_and_save_data()
    app.run(debug=True, port=5000)
