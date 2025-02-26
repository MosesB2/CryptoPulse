// Fetch Crypto Data from CoinGecko API
async function fetchCryptoData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
        const data = await response.json();
        displayCryptoData(data);
    } catch (error) {
        console.error('Error fetching crypto data:', error);
    }
}

// Display Crypto Data
function displayCryptoData(data) {
    const cryptoList = document.getElementById('crypto-list');
    cryptoList.innerHTML = ''; // Clear previous data

    data.forEach(crypto => {
        const cryptoCard = document.createElement('div');
        cryptoCard.classList.add('crypto-card');
        cryptoCard.innerHTML = `
            <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
            <p>Price: $${crypto.current_price}</p>
            <p>Market Cap: $${crypto.market_cap}</p>
            <p>24h Change: <span class="${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">${crypto.price_change_percentage_24h}%</span></p>
        `;
        cryptoList.appendChild(cryptoCard);
    });
}

// Search Functionality
document.getElementById('search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const cryptoCards = document.querySelectorAll('.crypto-card');

    cryptoCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        if (name.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Dark/Light Mode Toggle
const toggleButton = document.getElementById('theme-toggle');
toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    document.body.setAttribute('data-theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});

// Initial Fetch
fetchCryptoData();
