fetch('https://geo.api.gouv.fr/regions')
    .then(response => response.json())
    .then(data => {
        const regionsSelect = document.querySelector('#regions select');
        for (let row of data) {
            const newOption = document.createElement('option');
            newOption.value = row.code;
            newOption.textContent = row.nom;
            regionsSelect.appendChild(newOption);
        }
    });


fetch('https://geo.api.gouv.fr/departements').then(response => response.json()).then(data => {

    const departementsSelect = document.querySelector('#departements select');

    for (let row of data) {
        const newOption = document.createElement('option');
        newOption.value = row.code;
        newOption.textContent = row.nom;
        departementsSelect.appendChild(newOption);
    }
});


function departementsByRegion(regionCode) {
    fetch(`https://geo.api.gouv.fr/regions/${regionCode}/departements`)
        .then(response => response.json())
        .then(data => {
            const departementsSelect = document.querySelector('#departements select');
            departementsSelect.innerHTML = '';

            for (let row of data) {
                const newOption = document.createElement('option');
                newOption.value = row.code;
                newOption.textContent = row.nom;
                departementsSelect.appendChild(newOption);
            }
        });
};


document.querySelector('#regions select').addEventListener('change', (e) => {
    const selectedRegion = e.target.value;
    departementsByRegion(selectedRegion);
});


document.querySelector('#fetchVilles').addEventListener('click', (e) => {
    e.preventDefault();
    const selectedDepartement = document.querySelector('#departements select').value;

    fetch(`https://geo.api.gouv.fr/departements/${selectedDepartement}/communes`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#villes-table tbody');
            tableBody.innerHTML = '';

            data.forEach(ville => {
                const newRow = document.createElement('tr');
                const villeName = document.createElement('li');
                villeName.textContent = ville.nom;
                newRow.appendChild(villeName);
                tableBody.appendChild(newRow);
            });
        })
});
