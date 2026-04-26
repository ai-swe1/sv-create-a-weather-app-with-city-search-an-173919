import React from 'react';
import ReactDOM from 'react-dom';
import CitySearch from './components/CitySearch';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';

const App = () => {
  return (
    <div>
      <CitySearch />
      <CurrentWeather />
      <Forecast />
    </div>
  );
);

ReactDOM.render(<App />, document.getElementById('root'));