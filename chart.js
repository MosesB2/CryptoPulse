// Get the crypto ID from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const cryptoId = urlParams.get('id');

// Fetch historical data and display the chart
async function fetchAndDisplayChart() {
    if (!cryptoId) {
        console.error('No crypto ID found in the URL');
        return;
    }

    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=30`);
        const data = await response.json();
        const prices = data.prices.map(price => price[1]);
        const timestamps = data.prices.map(price => new Date(price[0]).toLocaleDateString());

        const ctx = document.getElementById('crypto-chart').getContext('2d');

        new Chart(ctx, {
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

// Fetch and display the chart when the page loads
fetchAndDisplayChart();