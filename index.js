const express = require('express');
const { scrapeDescription } = require('./scraper/scraper');
const path = require('path');

// Seteo del servidor
const app = express();
const PORT = 4000;

app.use(express.static('public'));

//Llama al scraping
app.get('/scrape', async (req, res) => {
    const { url } = req.query;

    try {
        await scrapeDescription(url);
        res.send('Scraping completado');
    } catch (error) {
        console.error('Error durante el proceso:', error);
        res.status(500).send('Ocurrió un error durante el scraping');
    }
});

//Carga la wordCloud
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'wordCloud.html'));
});

// Espera a ser llamado
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
