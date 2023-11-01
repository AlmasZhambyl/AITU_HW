document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('weather-form');
    const resultDiv = document.getElementById('weather-result');
    const newsResultDiv = document.getElementById('news-result');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = document.getElementById('city').value;

        fetch(`/weather?city=${city}`)
            .then((response) => response.json())
            .then((data) => {
                resultDiv.innerHTML = `
                    <p>Temperature: ${data.temperature}°C</p>
                    <p>Description: ${data.description}</p>
                    <p>Feels Like: ${data.feels_like}°C</p>
                    <p>Humidity: ${data.humidity}%</p>
                    <p>Pressure: ${data.pressure} hPa</p>
                    <p>Wind Speed: ${data.wind_speed} m/s</p>
                    <p>Country Code: ${data.country}</p>
                    <p>Rain Volume (last 3 hours): ${data.rainVolume}</p>
                `;
                
                if (data.news && data.news.length > 0) {
                    const newsHTML = data.news
                        .map((article) => `
                            <div class="news-article">
                                <h3>${article.title}</h3>
                                <p>${article.description}</p>
                                <a href="${article.url}" target="_blank">Read more</a>
                            </div>
                        `)
                        .join('');
                    
                    newsResultDiv.innerHTML = newsHTML;
                } else {
                    newsResultDiv.innerHTML = 'No news articles found for this city.';
                }
            })
            .catch((error) => {
                resultDiv.innerHTML = 'Error fetching weather data.';
            });
    });
});
