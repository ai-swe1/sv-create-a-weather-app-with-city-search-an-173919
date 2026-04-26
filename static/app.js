// static/app.js
// React application bootstrapped via CDN (React & ReactDOM are loaded globally)
// This script is referenced by the auto‑generated static/index.html.

(() => {
  const { useState, useEffect } = React;

  const API_BASE = "/api";

  const WeatherApp = () => {
    const [city, setCity] = useState("");
    const [query, setQuery] = useState(""); // city to fetch when form submitted
    const [current, setCurrent] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch weather whenever query changes
    useEffect(() => {
      if (!query) return;
      const fetchWeather = async () => {
        setLoading(true);
        setError("");
        try {
          const weatherRes = await fetch(`${API_BASE}/weather?city=${encodeURIComponent(query)}`);
          if (!weatherRes.ok) throw new Error("Weather request failed");
          const weatherData = await weatherRes.json();
          setCurrent(weatherData);

          const forecastRes = await fetch(`${API_BASE}/forecast?city=${encodeURIComponent(query)}`);
          if (!forecastRes.ok) throw new Error("Forecast request failed");
          const forecastData = await forecastRes.json();
          setForecast(forecastData?.list || []);
        } catch (err) {
          console.error(err);
          setError("Unable to load weather data. Please try another city.");
          setCurrent(null);
          setForecast([]);
        } finally {
          setLoading(false);
        }
      };
      fetchWeather();
    }, [query]);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (city.trim()) setQuery(city.trim());
    };

    const formatDate = (ts) => {
      const date = new Date(ts * 1000);
      return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    };

    return (
      React.createElement("div", { className: "weather-app container" },
        React.createElement("h1", { className: "title" }, "Weather Forecast"),
        React.createElement("form", { onSubmit: handleSubmit, className: "search-form" },
          React.createElement("input", {
            type: "text",
            placeholder: "Enter city…",
            value: city,
            onChange: (e) => setCity(e.target.value),
            className: "search-input"
          }),
          React.createElement("button", { type: "submit", className: "search-button" }, "Search")
        ),
        loading && React.createElement("p", { className: "loading" }, "Loading…"),
        error && React.createElement("p", { className: "error" }, error),
        current && (
          React.createElement("section", { className: "current-weather card" },
            React.createElement("h2", null, `${current.cityName || query}`),
            React.createElement("div", { className: "weather-main" },
              React.createElement("img", {
                src: `https://openweathermap.org/img/wn/${current.icon}@2x.png`,
                alt: current.description,
                className: "weather-icon"
              }),
              React.createElement("p", { className: "temp" }, `${Math.round(current.temp)}°C`)
            ),
            React.createElement("p", { className: "description" }, current.description)
          )
        ),
        forecast.length > 0 && (
          React.createElement("section", { className: "forecast-section" },
            React.createElement("h2", null, "7‑Day Forecast"),
            React.createElement("div", { className: "forecast-grid" },
              forecast.map((day) => (
                React.createElement("div", { key: day.dt, className: "forecast-card card" },
                  React.createElement("p", { className: "date" }, formatDate(day.dt)),
                  React.createElement("img", {
                    src: `https://openweathermap.org/img/wn/${day.icon}@2x.png`,
                    alt: day.description,
                    className: "forecast-icon"
                  }),
                  React.createElement("p", { className: "temp-max" }, `${Math.round(day.tempMax)}°C`),
                  React.createElement("p", { className: "temp-min" }, `${Math.round(day.tempMin)}°C`)
                )
              ))
            )
          )
        )
      )
    );
  };

  // Render the app into the div with id "root" (assumed present in index.html)
  ReactDOM.render(
    React.createElement(WeatherApp, null, null),
    document.getElementById("root")
  );
})();
