
import WeatherForecast from './components/WeatherForecast';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';
import FavoriteCities from './components/FavoriteCities';

const App = () => {
  const apiKey = "a8513c3f8111b568799dedbb001309fe";
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoritesWeather, setFavoritesWeather] = useState([]);
  const [sortMethod, setSortMethod] = useState("alphabetical");

  const fetchWeather = async () => {
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try{
      const response = await axios.get(url);
      setWeather(response.data);
      setError('');
      setSearchHistory((prevHistory) => [...new Set([city, ...prevHistory])]);
      updateSearchHistory(city);
    }catch(err) {
      setError('City not found!');
      setWeather(null);
    }

    if(!city.trim()) {
      setError("Please enter a valid city name!");
      return;
    }
  };



  const handleHistoryClick = (city) => {
    setCity(city);
    fetchWeather(city);
  }

  const getBackgroundClass = () => {
    if(!weather) return 'default-bg';
    const description = weather.weather[0].main.toLowerCase();
    if(description.includes('clear')) return 'clear-bg';
    if(description.includes('cloud')) return 'cloudy-bg';
    if(description.includes('rain')) return 'rainy-bg';
    if(description.includes('snow')) return 'snowy-bg';
    return 'default-bg';
  };

  const toogleFavorite = (cityName) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.includes(cityName)
      ? prevFavorites.filter((fav) => fav !== cityName)
      : [...prevFavorites, cityName];

      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

      return updatedFavorites;
    });
  };

  const sortFavorites = () => {
    let sortedFavorites = [...favorites];
    if(sortMethod === "alphabetical") {
      sortedFavorites.sort((a, b) => a.localeCompare(b));
    } else if(sortMethod === "recent") {
        sortedFavorites = [...favorites];
    }else if(sortMethod === "temperature") {
      sortedFavorites.sort((a, b) => {
        const tempA = favoritesWeather.find((w) => w.name === a)?.main.temp|| 0;
        const tempB = favoritesWeather.find((w) => w.name === b)?.main.temp|| 0;
        return tempB - tempA;
      });
    }
    return sortedFavorites;
  };

 

  const fetchFavoritesWeather = async () => {
    try {
      const weatherData = await Promise.all(
        favorites.map(async (city) => {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
          );
          return response.data;
        })
      );
      setFavoritesWeather(weatherData);
    } catch (error) {
      console.error("Error fetching favorite cities", error);
    }
  };
  
  useEffect(() => {
    if (favorites.length > 0) {
      fetchFavoritesWeather();
    }
  }, [favorites]);

  const updateSearchHistory = (city) => {
    const updatedHistory = [city, ...searchHistory.filter(item => item !== city)].slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(storedHistory);
    const soredFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(soredFavorites);
  }, []);



  return (
    <div className={`weather-app ${getBackgroundClass()}`}>
    <div className="container text-center py-5">
      <h1 className="mb-4">Weather App</h1>
        
        <input 
        type="text"
        className="form control mb-3"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter City"
        />
        <button className="btn btn-primary mb-3" onClick={fetchWeather}>
          Get Weather
        </button>
      {error && <p className="text-danger">{error}</p>}
      {weather && ( 
  <div className="weather-card mt-4">
    <h2 className="weather-title">{weather.name}</h2>
   <div className="d-flex align-items-center justify-content-center">
     <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
       alt={weather.weather[0].description}
       className="weather-icon" 
       />
       <p className="weather-temp ms-3">{weather.main.temp} &deg;C</p>
    </div>
      <p className="weather-desc">{weather.weather[0].description}</p>
    <button
      onClick={() => toogleFavorite(weather.name)}
      className="btn btn-secondary mt-2">
        {favorites.includes(weather.name) ? "Remove from Favorites" : "Add to favorites"}
    </button>  
   
  </div>
)}
    </div>
    <ul className="list-group">
    {sortFavorites().map((fav, index) => (
        <li 
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
        >
            <span 
                onClick={() => setCity(fav)}
                style={{ cursor: "pointer" }}
            >
                {fav} ⭐
            </span>
            <button
                className="btn btn-danger btn-sm"
                onClick={() => toogleFavorite(fav)}
            >
                Remove
            </button>
        </li>
    ))}
</ul>

    <div className="mb-3">
      <label htmlFor="sortFavorites" className="form-label">
        Sort Favorites By:
      </label>
      <select
        id="sortFavorites"
        className="form-select"
        value={sortMethod}
        onChange={(e) => setSortMethod(e.target.value)}
      >
        <option value="alphabetical">Alphabetical</option>
        <option value="recent">Recently Added</option>
        <option value="temperature">Temperature (High to Low)</option>
      </select>
    </div>
    <FavoriteCities
      favoritesWeather={favoritesWeather}
      toogleFavorite={toogleFavorite}
      setCity={setCity}
    />
      {searchHistory.length > 0 && (    
    <div className="mt-4">
        <div className="history-section">
            <h3> Search History</h3>
          <ul className="list-group">
            {searchHistory.map((item, index) => (
                  <li 
                  key={index}
                  className="list-group-item list-group-item-action"
                  onClick={() => setCity(item)}
                  style={{cursor: 'pointer'}}
                  >
                    {item}
                  </li> 
                   
            ))}
          </ul>
          <button 
          className="btn btn-danger mt-3"
          onClick={() => {
            setSearchHistory([]);
            localStorage.removeItem("searchHistory");
          }}
          >
            Clear history
          </button>
        </div>
        </div>
      )}
        <WeatherForecast city={city} apiKey={apiKey} />
    </div>
  );
};
export default App;
