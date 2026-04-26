import React from 'react';

const ForecastDisplay = ({ forecast }) => {
  return (
    <div className='forecast-container'>
      {forecast.map((day, index) => (
        <div key={index} className='day-card'>
          <h2>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</h2>
          <img src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`} alt='weather-icon' />
          <p>High: {day.highTemp}°C</p>
          <p>Low: {day.lowTemp}°C</p>
        </div>
      ))}
    </div>
  );
};

export default ForecastDisplay;
