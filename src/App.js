import React, { useState, useEffect } from 'react';
import keys from './keys';

const api = {
  key: keys.API_KEY,
  base: keys.BASE_URL,
};

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [unit, setUnit] = useState('metric');
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    fetchWeatherData();
    fetchForecastData();
  }, [unit]); // Fetch data on component mount and when unit changes

  const fetchWeatherData = () => {
    fetch(`${api.base}weather?q=${query}&units=${unit}&APPID=${api.key}`)
      .then(response => response.json())
      .then(data => {
        setWeather(data);
      })
      .catch(error => console.error('Error fetching weather data:', error));
  };

  const fetchForecastData = () => {
    fetch(`${api.base}forecast?q=${query}&units=${unit}&APPID=${api.key}`)
      .then(response => response.json())
      .then(data => {
        setForecast(data.list);
      })
      .catch(error => console.error('Error fetching forecast data:', error));
  };

  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchWeatherData();
      fetchForecastData();
    }
  };

  return (
    <div className="app">
      <main>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="search-bar"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onKeyPress={handleSearch}
          />
        </div>
        <button onClick={toggleUnit}>Toggle Unit</button>
        {weather.main && (
          <div className="weather-container">
            <div className="location">
              {weather.name}, {weather.sys.country}
            </div>
            <div className="date">{new Date().toLocaleDateString()}</div>
            <div className="temperature">
              {Math.round(weather.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
            </div>
            <div className="weather">{weather.weather[0].main}</div>
          </div>
        )}
        {forecast && forecast.length > 0 && (
          <div className="forecast">
            <h2>5-Day Forecast</h2>
            {forecast.map((item, index) => (
              <div key={index} className="forecast-item">
                <p>Date: {new Date(item.dt * 1000).toLocaleDateString()}</p>
                <p>Temperature: {Math.round(item.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</p>
                <p>Weather: {item.weather[0].main}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
