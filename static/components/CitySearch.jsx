import React, { useState } from 'react';

const CitySearch = () => {
  const [city, setCity] = useState('');

  const handleSearch = () => {
    // Call API to get weather data
  };

  return (
    <div>
      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default CitySearch;