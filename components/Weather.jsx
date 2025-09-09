import React, { useState, useEffect } from 'react';

const styles = {
  mainContainer: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom right, #1e3c72, #2a5298)',
    fontFamily: 'Inter, sans-serif',
    padding: '20px',
    boxSizing: 'border-box'
  },
  contentWrapper: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.75rem',
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '2rem',
    letterSpacing: '1px',
    textShadow: '0 4px 12px rgba(0,0,0,0.4)',
  },
  form: {
    display: 'flex',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  input: {
    flexGrow: 1,
    padding: '14px',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    borderRadius: '10px 0 0 10px',
  },
  searchButton: {
    background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
    color: 'white',
    padding: '14px 20px',
    borderRadius: '0 10px 10px 0',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  locationButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #ff512f, #dd2476)',
    color: 'white',
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    marginBottom: '2rem',
    transition: 'all 0.3s ease',
  },
  weatherCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(12px)',
    padding: '28px',
    borderRadius: '20px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
    color: '#fff',
    width: '100%',
    maxWidth: '500px',
  },
  cardHeader: { textAlign: 'center' },
  cardCity: { fontSize: '2.25rem', fontWeight: '700', margin: 0 },
  cardDescription: { fontSize: '1.25rem', margin: '0.5rem 0', opacity: 0.9 },
  cardBody: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px 0',
  },
  cardIcon: { width: '110px', height: '110px' },
  cardTemp: { fontSize: '4.5rem', fontWeight: '800', marginLeft: '20px' },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px',
    textAlign: 'center',
    marginTop: '28px'
  },
  gridItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '14px',
    borderRadius: '12px',
    boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.2)',
  },
  gridLabel: { fontWeight: '600', margin: 0, fontSize: '0.9rem', opacity: 0.85 },
  gridValue: { fontSize: '1.4rem', margin: '6px 0 0', fontWeight: '700' },
  footer: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: '2.5rem',
    fontSize: '0.9rem',
  },
  message: { color: 'white', textAlign: 'center', fontSize: '1.3rem' },
  error: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    color: 'white',
    padding: '16px',
    borderRadius: '10px',
    textAlign: 'center',
    fontWeight: '600',
    boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
  }
};

const WeatherCard = ({ data }) => {
  const { location, current } = data;
  return (
    <div style={styles.weatherCard}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardCity}>{location.name}, {location.country}</h2>
        <p style={styles.cardDescription}>{current.condition.text}</p>
      </div>
      <div style={styles.cardBody}>
        <img src={current.condition.icon} alt={current.condition.text} style={styles.cardIcon} />
        <p style={styles.cardTemp}>{Math.round(current.temp_c)}°C</p>
      </div>
      <div style={styles.cardGrid}>
        <div style={styles.gridItem}>
          <p style={styles.gridLabel}>Feels Like</p>
          <p style={styles.gridValue}>{Math.round(current.feelslike_c)}°C</p>
        </div>
        <div style={styles.gridItem}>
          <p style={styles.gridLabel}>Humidity</p>
          <p style={styles.gridValue}>{current.humidity}%</p>
        </div>
        <div style={styles.gridItem}>
          <p style={styles.gridLabel}>Wind Speed</p>
          <p style={styles.gridValue}>{current.wind_kph} kph</p>
        </div>
        <div style={styles.gridItem}>
          <p style={styles.gridLabel}>Pressure</p>
          <p style={styles.gridValue}>{current.pressure_mb} hPa</p>
        </div>
      </div>
    </div>
  );
};

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = "6d39be97256245c0ae945928250909";

  const fetchWeather = async (url) => {
    setLoading(true);
    setError('');
    setWeatherData(null);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Could not fetch weather data');
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = (cityName) => {
    if (!cityName.trim()) {
      setError('Please enter a city name.');
      return;
    }
    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(cityName)}&aqi=no`;
    fetchWeather(url);
  };

  const fetchWeatherByCoords = (lat, lon) => {
    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`;
    fetchWeather(url);
  };

  const getLocationAndFetch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeatherByCoords(position.coords.latitude, position.coords.longitude),
        () => {
          setError('Location access denied. Showing weather for London instead.');
          fetchWeatherByCity('London');
        }
      );
    } else {
      setError('Geolocation not supported. Showing weather for London instead.');
      fetchWeatherByCity('London');
    }
  };

  useEffect(() => { getLocationAndFetch(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherByCity(city);
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.contentWrapper}>
        <h1 style={styles.title}>Simple Weather App</h1>

        <form onSubmit={handleSearch} style={styles.form}>
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.searchButton}>Search</button>
        </form>

        <button onClick={getLocationAndFetch} style={styles.locationButton}>
          Get Weather for My Location
        </button>

        {loading && <p style={styles.message}>Loading weather...</p>}
        {error && <div style={styles.error}>{error}</div>}
        {weatherData && <WeatherCard data={weatherData} />}
      </div>
      <footer style={styles.footer}>
        <p>Powered by WeatherAPI.com</p>
      </footer>
    </div>
  );
}

export default Weather;
