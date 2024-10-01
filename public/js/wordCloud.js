fetch('/data/filteredWords.json')
    .then(response => response.json())
    .then(data => {

        // Ordenar las palabras por frecuencia
        const sortedData = data.sort((a, b) => b.count - a.count);
        
        // Limitar el número de palabras a mostrar 
        const wordsArray = sortedData.slice(0, 30).map(item => ({ x: item.word, value: item.count }));

        //Configuro la wordCloud        
        
        var chart = anychart.tagCloud(wordsArray);
        chart.title('Word Cloud from Filtered Product Descriptions');
        chart.angles([0]);

        var customColor = anychart.scales.linearColor();
        customColor.colors(["#D2B48C", "#8B4513", "#A0522D", "#DEB887", "#F5DEB3"]);
        chart.colorScale(customColor);

        chart.hovered().fill('#8B4513').fontWeight(600);

        chart.container('word-cloud');
        chart.draw();
    })
    .catch(error => {
        console.error('Error al cargar las palabras:', error);
        document.getElementById('error-message').style.display = 'block';
    });
