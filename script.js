const BASE_URL = 'http://localhost:3000'; 

document.getElementById('search-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    if (!query) {
        alert('Please enter a movie or TV show name.');
        return;
    }
    try {
        const res = await fetch(`${BASE_URL}/search?query=${query}`);
        const data = await res.json();
        displayResults(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data. Please try again later.');
    }
});

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    if (data.Search) {
        data.Search.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-3');
            card.innerHTML = `
                <div class="card h-100">
                    <img src="${item.Poster}" class="card-img-top" alt="${item.Title}">
                    <div class="card-body">
                        <h5 class="card-title">${item.Title}</h5>
                        <p class="card-text">Year: ${item.Year}</p>
                        <p class="card-text">Type: ${item.Type}</p>
                        <button class="btn btn-primary favourite-btn" data-id="${item.imdbID}" data-title="${item.Title}" data-year="${item.Year}" data-type="${item.Type}" data-poster="${item.Poster}">Favourite</button>
                    </div>
                </div>
            `;
            resultsDiv.appendChild(card);
        });

        document.querySelectorAll('.favourite-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const imdbID = e.target.getAttribute('data-id');
                const title = e.target.getAttribute('data-title');
                const year = e.target.getAttribute('data-year');
                const type = e.target.getAttribute('data-type');
                const poster = e.target.getAttribute('data-poster');

                try {
                    const res = await fetch(`${BASE_URL}/favourites`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ imdbID, title, year, type, poster })
                    });
                    const data = await res.json();
                    alert(data.message);
                } catch (error) {
                    console.error('Error adding to favourites:', error);
                    alert('Error adding to favourites. Please try again later.');
                }
            });
        });
    } else {
        resultsDiv.innerHTML = '<p class="text-center">No results found</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const favouritesPage = document.getElementById('favourites');
    if (favouritesPage) {
        fetchFavorites();
    }
});

async function fetchFavorites() {
    try {
        const response = await fetch(`${BASE_URL}/favourites`);
        const data = await response.json();
        displayFavorites(data);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        alert('Error fetching favorites. Please try again later.');
    }
}

function displayFavorites(favorites) {
    const favouritesDiv = document.getElementById('favourites');
    if (!favouritesDiv) return;
   
    favouritesDiv.innerHTML = '';
    favorites.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3');
        card.innerHTML = `
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${item.poster}" class="img-fluid rounded-start" alt="${item.title}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">Year: ${item.year}</p>
                        <p class="card-text">Type: ${item.type}</p>
                    </div>
                </div>
            </div>
        `;
        favouritesDiv.appendChild(card);
    });
}