import requests
import json
import smtplib
from email.message import EmailMessage

def send_email():
    # Créer un message email
    msg = EmailMessage()
    msg.set_content('Le script de récupération des domaines a été exécuté avec succès.')
    msg['Subject'] = 'Mise à jour des domaines réussie'
    # msg['From'] = 'votre_email@gmail.com' # Changez ceci par votre email
    # msg['To'] = 'rudy.alerte@gmail.com'

    # # Envoyer l'email via SMTP de Gmail
    # server = smtplib.SMTP('smtp.gmail.com', 587)
    # server.starttls()
    # server.login('votre_email@gmail.com', 'votre_mot_de_passe') # Changez ces informations
    # server.send_message(msg)
    # server.quit()

def fetch_and_save_data():
    # Récupérer les données depuis l'URL
    response = requests.get('https://dl.red.flag.domains/red.flag.domains.txt')
    response.raise_for_status() # Vérifiez que la demande a réussi

    # Divisez les données en une liste de domaines
    domains = response.text.split("\n")
    
    # Sauvegarder dans un fichier JSON
    with open('blocked_domains.json', 'w') as file:
        json.dump(domains, file)

    print("Données récupérées et sauvegardées avec succès.")
    send_email()

if __name__ == "__main__":
    fetch_and_save_data()
