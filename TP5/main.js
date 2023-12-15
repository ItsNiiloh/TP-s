const baseUrl = 'https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/';

// Récupérer les cinémas en France en function de leur nombre de fauteuils
const franceCinemas = async () => {
    const apiUrlFauteuils = `${baseUrl}records?order_by=fauteuils%20DESC&limit=10`;

    try {
        const response = await fetch(apiUrlFauteuils);
        const data = await response.json();
        const tableBody = document.getElementById('cinemaTableBody');
        tableBody.innerHTML = '';

        data.results.forEach((result) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `<td>${result.nom}</td>
                <td>${result.adresse}</td>
                <td>${result.commune}</td>
                <td>${result.fauteuils}</td>`;
            tableBody.appendChild(newRow);
        });
    } catch (error) {
        console.error(error);
    }
};


// Récupérer la géolocalisation de l'utilisateur
const getUserLocation = async () => {
    return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => resolve({ lat: position.coords.latitude, lon: position.coords.longitude }),
                (error) => reject(error)
            );
        } else {
            reject('Erreur de géolocalisation');
        }
    });
};


// Recherche de cinémas les plus proches en fonction de la localisation de l'utilisateur
const fetchNearbyCinemas = async (userLocation) => {
    try {
        const response = await fetch(`${baseUrl}records?where=within_distance(geolocalisation%2C%20geom'POINT(${userLocation.lon}%20${userLocation.lat})'%2C%2020km)&limit=10`);
        const nearbyCinemas = await response.json();

        nearbyCinemas.results.forEach((cinema) => {
            const cinemaLocation = {
                lat: cinema.latitude,
                lon: cinema.longitude,
            };
            const distance = haversine(userLocation.lat, userLocation.lon, cinemaLocation.lat, cinemaLocation.lon);
            cinema.distance = distance;
        });

        const cinemas = nearbyCinemas.results.filter((cinema) => cinema.distance <= 20);
        console.log(cinemas);
        return cinemas;
    } catch (error) {
        console.error(error);
        return [];
    }
};


// Function pour afficher les cinémas à proximité
const displayNearbyCinemas = (cinemas) => {
    const nearCinemasList = document.getElementById('nearCinemasList');
    const noResultsMessage = document.getElementById('noResultsMessage');
    noResultsMessage.style.display = cinemas.length ? 'none' : 'block';

    cinemas.sort((a, b) => a.distance - b.distance);
    nearCinemasList.innerHTML = '';

    cinemas.forEach((cinema) => {
        const cinemaElement = document.createElement('tr');
        cinemaElement.innerHTML = `<td>${cinema.nom}</td>
            <td>${cinema.adresse}</td>
            <td>${cinema.commune}</td>
            <td>${cinema.fauteuils}</td>
            <td>${cinema.distance.toFixed(2)} km</td>`;
        nearCinemasList.appendChild(cinemaElement);
    });
};


// Gestion de la localisation saisie par l'utilisateur et recherche des cinémas à proximité
const getInputLocation = async () => {
    const inputValue = document.getElementById('searchInput').value;
    if (!inputValue) return;

    try {
        const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${inputValue}&type=municipality&autocomplete=1`);
        const data = await response.json();
        const location = {
            lat: data.features[0].geometry.coordinates[1],
            lon: data.features[0].geometry.coordinates[0],
        };
        const nearbyCinemas = await fetchNearbyCinemas(location);
        displayNearbyCinemas(nearbyCinemas);
    } catch (error) {
        console.error(error);
    }
};


// Event listeners
const searchForm = document.querySelector('form');
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    getInputLocation();
});

const searchBtn = document.getElementById('searchBtn');
const geolocateBtn = document.getElementById('geolocateBtn');
searchBtn.addEventListener('click', getInputLocation);
geolocateBtn.addEventListener('click', async () => {
    try {
        const userLocation = await getUserLocation();
        const nearbyCinemas = await fetchNearbyCinemas(userLocation);
        displayNearbyCinemas(nearbyCinemas);
    } catch (error) {
        console.error('Erreur:', error);
    }
});

window.addEventListener('load', async () => {
    try {
        await franceCinemas();
        const userLocation = await getUserLocation();
        const nearbyCinemas = await fetchNearbyCinemas(userLocation);
        displayNearbyCinemas(nearbyCinemas);
    } catch (error) {
        console.error('Erreur:', error);
    }
});


// Function Helper pour calculer la distance
function haversine(lat1, lon1, lat2, lon2) {
    // Rayon de la Terre en kilomètres (approximatif)
    const earthRadius = 6371;

    // Conversion des degrés en radians
    const lat1Rad = (Math.PI / 180) * lat1;
    const lon1Rad = (Math.PI / 180) * lon1;
    const lat2Rad = (Math.PI / 180) * lat2;
    const lon2Rad = (Math.PI / 180) * lon2;

    // Différence de latitude et de longitude
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    // Calcul de la distance en utilisant la formule de la haversine
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance en kilomètres
    const distance = earthRadius * c;

    return distance;
};

