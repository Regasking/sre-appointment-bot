# Bot d'Automatisation de Prise de Rendez-vous SRE (citas.sre.gob.mx)

**Dépôt GitHub :** [https://github.com/Regasking/sre-appointment-bot](https://github.com/Regasking/sre-appointment-bot)

Ce projet est une application web simple basée sur **Node.js** et **Express** qui utilise la librairie **Playwright** pour automatiser le processus de prise de rendez-vous sur le site du Secrétariat des Relations Extérieures (SRE) du Mexique.

**ATTENTION IMPORTANTE :** Le site `citas.sre.gob.mx` est complexe et change fréquemment. Les sélecteurs Playwright dans `appointmentBot.js` sont des **placeholders** et doivent être ajustés manuellement par l'utilisateur après inspection du site web.

## Structure du Projet

| Fichier | Description |
| :--- | :--- |
| `index.js` | Le serveur Express principal. Il expose une interface web simple et une route pour démarrer le bot. |
| `appointmentBot.js` | Le script Playwright contenant la logique d'automatisation pour naviguer et interagir avec le site SRE. **C'est le fichier à modifier.** |
| `.env` | Fichier de configuration pour stocker vos informations personnelles (Nom, CURP, Email, etc.) de manière sécurisée. |
| `package.json` | Liste des dépendances Node.js (Playwright, Express, dotenv). |
| `Procfile` | Fichier de configuration pour les plateformes d'hébergement comme Render. |
| `.gitignore` | Liste des fichiers à ignorer par Git (comme `node_modules` et `.env`). |

## 1. Configuration Locale et GitHub

### Étape 1 : Créer le Dépôt GitHub

Le dépôt a été créé pour vous : [https://github.com/Regasking/sre-appointment-bot](https://github.com/Regasking/sre-appointment-bot).

Vous pouvez le cloner ou le forker pour commencer :

```bash
git clone https://github.com/Regasking/sre-appointment-bot.git
cd sre-appointment-bot
```

### Étape 2 : Installation des Dépendances

Assurez-vous d'avoir **Node.js** (version 18+) et **npm** installés.

```bash
# Installez les dépendances Node.js
npm install

# Installez les navigateurs Playwright (Chromium, Firefox, WebKit)
npx playwright install
```

### Étape 3 : Configuration des Informations

1.  **Créez le fichier `.env`** à la racine du projet et **modifiez-le** avec vos informations réelles (Nom, Email, CURP, etc.). **Ne poussez jamais ce fichier sur GitHub.**

    ```
    # Variables d'environnement pour le bot de prise de rendez-vous
    # Remplacer les valeurs par vos informations réelles

    # Informations de l'utilisateur
    USER_NAME="Votre Nom Complet"
    USER_EMAIL="votre.email@example.com"
    USER_PHONE="5512345678" # Numéro de téléphone à 10 chiffres (Mexique)
    USER_CURP="VOTRECURP" # Clave Única de Registro de Población

    # Détails du rendez-vous
    APPOINTMENT_TYPE="PASAPORTE" # Exemple: PASAPORTE, VISA, etc.
    APPOINTMENT_OFFICE="MEXICO_CITY" # Exemple: Nom du bureau ou code
    APPOINTMENT_DATE="2025-12-31" # Date souhaitée (peut être ignorée si le bot cherche la première dispo)
    ```

### Étape 4 : Ajustement du Script Playwright

1.  Ouvrez le fichier `appointmentBot.js`.
2.  **Inspectez le site `citas.sre.gob.mx`** dans votre navigateur.
3.  **Remplacez les sélecteurs (ex: `#input-curp`, `#confirm-button`)** dans `appointmentBot.js` par les sélecteurs réels que vous trouvez sur le site. C'est l'étape la plus importante pour que le bot fonctionne.

### Étape 5 : Pousser les Modifications sur GitHub

Si vous modifiez le code (sauf `.env`), n'oubliez pas de le pousser :

```bash
git add .
git commit -m "Mise à jour des sélecteurs Playwright"
git push
```

## 2. Déploiement Gratuit sur Render

Render est une excellente plateforme pour héberger des services web qui nécessitent un serveur (comme Express) et des dépendances binaires (comme Playwright/Chromium).

### Étape 1 : Créer un Compte Render

1.  Allez sur [https://render.com/](https://render.com/) et créez un compte (vous pouvez vous connecter avec GitHub).

### Étape 2 : Créer un Nouveau Service Web

1.  Dans votre tableau de bord Render, cliquez sur **New** -> **Web Service**.
2.  **Connectez votre dépôt GitHub** (celui que vous venez de créer).

### Étape 3 : Configurer le Service

Utilisez les paramètres suivants :

| Paramètre | Valeur |
| :--- | :--- |
| **Name** | `sre-appointment-bot` (ou autre) |
| **Root Directory** | (Laisser vide) |
| **Environment** | `Node` |
| **Branch** | `main` (ou `master`) |
| **Build Command** | `npm install && npx playwright install` |
| **Start Command** | `node index.js` |
| **Instance Type** | `Free` |

### Étape 4 : Ajouter les Variables d'Environnement

Render ne peut pas lire votre fichier `.env`. Vous devez ajouter les variables manuellement :

1.  Dans la section **Environment Variables** de la configuration Render.
2.  Ajoutez une variable pour **chaque ligne** de votre fichier `.env` (ex: `USER_NAME`, `USER_EMAIL`, `USER_CURP`, etc.).

### Étape 5 : Déployer

1.  Cliquez sur **Create Web Service**.
2.  Render va cloner votre dépôt, exécuter la commande de construction (`npm install` et `npx playwright install`), puis démarrer le service.

### Utilisation

Une fois le déploiement réussi, Render vous fournira une URL publique.

1.  Accédez à cette URL dans votre navigateur.
2.  Cliquez sur le bouton **"Démarrer le Bot de Prise de Rendez-vous"**.
3.  Le bot s'exécutera sur le serveur Render.

**Note sur le Headless :** Dans `appointmentBot.js`, Playwright est lancé en mode `headless: true` (sans interface graphique), ce qui est nécessaire pour le déploiement sur un serveur.

## 3. Déploiement Alternatif (Railway)

Railway est une autre excellente option qui fonctionne de manière similaire à Render.

1.  Allez sur [https://railway.app/](https://railway.app/) et connectez-vous.
2.  Créez un nouveau projet et liez-le à votre dépôt GitHub.
3.  Railway détectera automatiquement que c'est une application Node.js.
4.  **Variables d'Environnement :** Ajoutez toutes les variables de votre fichier `.env` dans la section **Variables** du projet.
5.  **Build Command :** Assurez-vous que la commande de construction inclut `npx playwright install` si elle n'est pas détectée automatiquement.

```bash
npm install && npx playwright install
```

6.  **Start Command :** `node index.js`

Le bot sera accessible via le domaine fourni par Railway.
