let cryptoChart;

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
        cryptoCard.addEventListener('click', () => showCryptoChart(crypto.id));
        cryptoList.appendChild(cryptoCard);
    });
}

// Show Crypto Chart
async function showCryptoChart(cryptoId) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=30`);
        const data = await response.json();
        const prices = data.prices.map(price => price[1]);
        const timestamps = data.prices.map(price => new Date(price[0]).toLocaleDateString());

        const chartContainer = document.getElementById('chart-container');
        chartContainer.classList.remove('hidden');

        const ctx = document.getElementById('crypto-chart').getContext('2d');

        if (cryptoChart) {
            cryptoChart.destroy();
        }

        cryptoChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [{
                    label: 'Price (USD)',
                    data: prices,
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderWidth: 2,
                    fill: true,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date',
                        },
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Price (USD)',
                        },
                    },
                },
            },
        });
    } catch (error) {
        console.error('Error fetching chart data:', error);
    }
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
