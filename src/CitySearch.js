import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';

const CitySearch = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState({});

  const handleCityChange = debounce(async (city) => {
    try {
      const response = await fetch(`/api/weather?q=${city}`);
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error(error);
    }
  }, 500);

  const handleInputChange = (event) => {
    setCity(event.target.value);
    handleCityChange(event.target.value);
  };

  return (
    <div>
      <input type="text" value={city} onChange={handleInputChange} placeholder="Search city" />
      {weather && (
        <div>
          <h2>Current Weather in {weather.name}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Condition: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default CitySearch;
