const { chromium } = require('playwright');
const fs = require('fs');

async function inspectPage() {
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        console.log('Navigation vers la page de prise de rendez-vous...');
        await page.goto('https://citas.sre.gob.mx/', { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Attendre que le contenu principal soit chargé
        await page.waitForSelector('body', { timeout: 15000 });

        // Prendre une capture d'écran pour l'analyse visuelle
        await page.screenshot({ path: 'sre_initial_page.png', fullPage: true });
        console.log('Capture d\'écran initiale enregistrée: sre_initial_page.png');

        // Tenter d'extraire des informations sur les formulaires et boutons
        const formInfo = await page.evaluate(() => {
            const forms = Array.from(document.querySelectorAll('form'));
            const buttons = Array.from(document.querySelectorAll('button, input[type="submit"]'));
            const inputs = Array.from(document.querySelectorAll('input, select, textarea'));

            const extractElementInfo = (el) => ({
                tag: el.tagName.toLowerCase(),
                id: el.id,
                name: el.name,
                class: el.className,
                text: el.textContent ? el.textContent.trim().substring(0, 50) : '',
                placeholder: el.placeholder,
                type: el.type,
                selector: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') + (el.className ? `.${el.className.split(' ')[0]}` : '')
            });

            return {
                forms: forms.map(extractElementInfo),
                buttons: buttons.map(extractElementInfo),
                inputs: inputs.map(extractElementInfo)
            };
        });

        fs.writeFileSync('sre_elements_info.json', JSON.stringify(formInfo, null, 2));
        console.log('Informations sur les éléments enregistrées: sre_elements_info.json');

        // Tenter de cliquer sur un bouton d'accès (hypothétique)
        // Le site semble nécessiter une connexion ou une sélection initiale.
        // Je vais chercher un bouton qui pourrait mener à la prise de rendez-vous.
        
        // Exemple: Chercher un bouton avec le texte "Agendar Cita" ou "Iniciar Sesión"
        const loginButtonSelector = 'text="Iniciar Sesión"';
        const loginButton = await page.$(loginButtonSelector);

        if (loginButton) {
            console.log(`Bouton de connexion/démarrage trouvé: ${loginButtonSelector}`);
            // Ne pas cliquer pour ne pas bloquer l'automatisation sans identifiants
        } else {
            console.log('Bouton de connexion/démarrage non trouvé avec le sélecteur "Iniciar Sesión".');
        }

        return 'Inspection terminée. Veuillez analyser sre_initial_page.png et sre_elements_info.json.';

    } catch (error) {
        console.error('Erreur lors de l\'inspection:', error);
        if (browser) {
            const context = browser.contexts()[0];
            const page = context.pages()[0];
            await page.screenshot({ path: 'sre_error_inspection.png' });
        }
        return `Échec de l'inspection. Erreur: ${error.message}. Voir sre_error_inspection.png.`;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

inspectPage().then(console.log).catch(console.error);
