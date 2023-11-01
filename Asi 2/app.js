const express = require('express');
const app = express();
const request = require('request-promise');
const path = require('path');

const apiKey = '6bc44d5d232a02f09d2b3a317a0ccfa3'; 
const newsAPIKey = '43a38e5a05a649869f90a3f3e8eae880';

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).send('City parameter is missing.');
    }

    const [weatherData, newsData] = await Promise.all([
        fetchWeatherData(city),
        fetchNewsData(city),
    ]);  

    res.json({ weather: weatherData, news: newsData });
});

async function fetchWeatherData(city) {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
        const data = await request(url);
        const weather = JSON.parse(data);

        const weatherData = {
            temperature: weather.main.temp,
            description: weather.weather[0].description,
            icon: weather.weather[0].icon,
            coordinates: weather.coord,
            feels_like: weather.main.feels_like,
            humidity: weather.main.humidity,
            pressure: weather.main.pressure,
            wind_speed: weather.wind.speed,
            country: weather.sys.country,
            rainVolume: weather.rain && weather.rain['3h'] ? weather.rain['3h'] : 'N/A',
        };
        return weatherData;
    } catch (error) {
        throw new Error('Error fetching weather data.');
    }
}

async function fetchNewsData(city) {
    const url = `https://newsapi.org/v2/everything?q=${city}&apiKey=${newsAPIKey}`;

    try {
        const data = await request(url);
        const news = JSON.parse(data);

        if (news.status === 'ok') {
            const newsData = news.articles.map((article) => ({
                title: article.title,
                description: article.description,
                url: article.url,
            }));
            return newsData;
        } else {
            throw new Error('News API response indicates an error.');
        }
    } catch (error) {
        console.error('Error fetching news data:', error);
        throw new Error('Error fetching news data. Please check your News API key and the request URL.');
    }
}



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
