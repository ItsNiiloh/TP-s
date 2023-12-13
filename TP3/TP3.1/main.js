document.querySelector('#get-citation').addEventListener('click', (e) => {
    fetch('https://kaamelott.reiter.tf/quote/random').then(response => response.json()).then(data => {
        console.log(data)

        const citation = data.citation;
        const personnage = data.infos.personnage;
        const customerTable = document.querySelector('#afficherCitation tbody');
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
                <p>Citation: "${citation}"</p>
                <p>Personnage: ${personnage}</p>
            `;

        customerTable.appendChild(newRow);
    })
});

