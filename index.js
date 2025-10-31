const express = require('express');
const dotenv = require('dotenv');
const { bookAppointment } = require('./appointmentBot');

// Charger les variables d'environnement du fichier .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser le JSON et les données de formulaire
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Données de l'utilisateur chargées depuis .env
const userData = {
    USER_NAME: process.env.USER_NAME,
    USER_EMAIL: process.env.USER_EMAIL,
    USER_PHONE: process.env.USER_PHONE,
    USER_CURP: process.env.USER_CURP,
    APPOINTMENT_TYPE: process.env.APPOINTMENT_TYPE,
    APPOINTMENT_OFFICE: process.env.APPOINTMENT_OFFICE,
    APPOINTMENT_DATE: process.env.APPOINTMENT_DATE,
};

// Route de base pour l'interface utilisateur simple
app.get('/', (req, res) => {
    res.send(`
        <h1>Bot d'Automatisation de Rendez-vous SRE</h1>
        <p>Statut: Prêt à démarrer l'automatisation.</p>
        <p>Les informations utilisateur sont chargées depuis le fichier <code>.env</code>.</p>
        <p><strong>ATTENTION:</strong> Le script Playwright (<code>appointmentBot.js</code>) contient des sélecteurs qui doivent être ajustés manuellement en inspectant le site <a href="https://citas.sre.gob.mx/">citas.sre.gob.mx</a>.</p>
        <form action="/start-bot" method="post">
            <button type="submit">Démarrer le Bot de Prise de Rendez-vous</button>
        </form>
        <p>Résultat de la dernière exécution: <span id="result">Aucune exécution.</span></p>
        <script>
            document.querySelector('form').addEventListener('submit', async (e) => {
                e.preventDefault();
                document.getElementById('result').textContent = 'Démarrage du bot... (cela peut prendre un moment)';
                const response = await fetch('/start-bot', { method: 'POST' });
                const text = await response.text();
                document.getElementById('result').textContent = text;
            });
        </script>
    `);
});

// Route pour démarrer le bot
app.post('/start-bot', async (req, res) => {
    console.log('Démarrage du bot...');
    try {
        const result = await bookAppointment(userData);
        console.log('Bot terminé avec le résultat:', result);
        res.send(result);
    } catch (error) {
        console.error('Erreur fatale lors de l\'exécution du bot:', error);
        res.status(500).send(`Erreur fatale: ${error.message}`);
    }
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
    console.log(`Accédez à http://localhost:${port} pour l'interface.`);
});
