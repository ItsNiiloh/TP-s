document.querySelector('#get-citation').addEventListener('click', (e) => {
    fetch('https://kaamelott.reiter.tf/quote/random').then(response => response.json()).then(data => {
        console.log(data)

        const citationTable = document.querySelector('#afficherCitation tbody');
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
                <p>Citation: "${data.citation}"</p>
                <p>Personnage: ${data.infos.personnage}</p>
            `;

        citationTable.appendChild(newRow);
    })
});

