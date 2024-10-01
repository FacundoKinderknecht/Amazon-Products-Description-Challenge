const puppeteer = require('puppeteer');
const fs = require('fs');
const stopword = require('stopword');

const filteredWordsPath = './public/data/filteredWords.json';
const processedUrlsPath = './cache/processedUrls.json';

//Carga las palabras filtradas existentes
function loadFilteredWords() {
    try {
        const data = fs.readFileSync(filteredWordsPath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

//Carga las URLs procesadas
function loadProcessedUrls() {
    try {
        const data = fs.readFileSync(processedUrlsPath, 'utf-8');
        return new Set(JSON.parse(data));
    } catch (err) {
        return new Set();
    }
}

// Guarda las URL procesada
function saveProcessedUrl(url) {
    const processedUrls = loadProcessedUrls();
    processedUrls.add(url);
    fs.writeFileSync(processedUrlsPath, JSON.stringify(Array.from(processedUrls), null, 2));
}

// Filtrar palabras comunes
function filterWords(descriptions) {
    let allWords = descriptions.join(' ').split(/\s+/);
    
    // Quita slas stopwords
    let filteredWords = stopword.removeStopwords(allWords);

    let wordCount = {};
    filteredWords.forEach(word => {
        word = word.toLowerCase();
        if (/^[a-zA-Zñáéíóúü]+[a-zA-Z0-9ñáéíóúü]*$/.test(word) && word.length > 1) {
            wordCount[word] = (wordCount[word] || 0) + 1;
        }
    });

    // Devuelve las palabras
    let sortedWords = Object.entries(wordCount).sort((a, b) => b[1] - a[1]);
    return sortedWords.map(([word, count]) => ({ word, count }));
}

// Función de scraping
async function scrapeDescription(url) {
    const processedUrls = loadProcessedUrls();
    if (processedUrls.has(url)) {
        console.log(`URL ya procesada: ${url}`);
        return null;
    }

    const browser = await puppeteer.launch({ headless: 'shell' }); //Inicia en modo shell asi no hay ventana emergente
    const page = await browser.newPage();
    await page.goto(url);

    const descriptions = await page.evaluate(() => {
        let productDescription = document.querySelector('#productDescription')?.innerText || '';
        return [productDescription];
    });

    await browser.close();

    if (descriptions.length === 0 || !descriptions[0]) {
        console.log('No se encontró una descripción válida. Saliendo.');
        return null;
    }

    const newFilteredWords = filterWords(descriptions);

    if (newFilteredWords.length === 0) {
        console.log('No se encontraron palabras relevantes para filtrar.');
        return null;
    }

    const existingFilteredWords = loadFilteredWords();
    const combinedWords = [...existingFilteredWords, ...newFilteredWords];

    fs.writeFileSync(filteredWordsPath, JSON.stringify(combinedWords, null, 2));

    saveProcessedUrl(url);

    console.log(`Scraping realizado con exito: ${url}`);
}

module.exports = {
    scrapeDescription
};
