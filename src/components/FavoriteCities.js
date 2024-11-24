import React from "react";

const FavoriteCities = ({ favoritesWeather, toogleFavorite, setCity }) => {
    return (
      <div className="favorites-container mt-4">
        <h3>Your Favorite Cities</h3>
        {favoritesWeather.length === 0 ? (
          <p>No favorites added yet.</p>
        ) : (
          <div className="favorit-grid">
            {favoritesWeather.map((weather, index) => (
              <div key={index} className="favorite-card">
                <div className="card mb-3">
                  <div className="card-body">
                    <h5
                      className="card-title"
                      onClick={() => setCity(weather.name)}
                      style={{ cursor: "pointer" }}
                    >
                      {weather.name} ⭐
                    </h5>
                    <p className="favorite-temp">
                      {Math.round(weather.main.temp)}&deg;C
                    </p>
                    <p className="favorite-desc">{weather.weather[0].description}</p>
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                      alt={weather.weather[0].description}
                      className="weather-icon"
                    />
                    <button
                      onClick={() => toogleFavorite(weather.name)}
                      className="btn btn-danger mt-2"
                    >
                      Remove from Favorites
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  export default FavoriteCities;