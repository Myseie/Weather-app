import React, { useState, useEffect } from "react";

const WeatherForecast = ({city, apiKey}) => {
    const [forecastData, setForecastData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchForecast = async () => {
            try{
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
                );
                if(!response.ok) {
                    throw new Error('Could not fetch forecast data.');

                }
                const data = await response.json();
                setForecastData(data.list);
                setError('');
            } catch(err) {
                setError(err.message);
            }
        };

        if(city) {
            fetchForecast();
        }
    }, [city, apiKey]);

    const getDailyForecasts = () => {
        if(!forecastData || forecastData.length === 0) return [];
        const dailyData = {};
        forecastData.forEach((entry) => {
            const date = new Date(entry.dt_txt).toLocaleDateString();
            if (!dailyData[date]) {
                dailyData[date] = entry;
            }
        });
        return Object.values(dailyData).slice(0, 5);
    };

    return (
        <div className="forecast-container">
            <h3>5-Day Weather Forecast</h3>
            {error && <p className="error">{error}</p>}
            {!error && forecastData.length === 0 && <p>Loading forecast</p>}
            <div className="forecast-list">
                {getDailyForecasts().map((day, index) => (
                  <div key={index} className="forecast-item">
                    <h4>{new Date(day.dt_txt).toLocaleDateString()}</h4>
                    <img 
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                    />
                    <p>{day.weather[0].description}</p>
                    <p>
                        <strong>{Math.round(day.main.temp)}&deg;C</strong>
                    </p>
                    </div> 
                ))}
            </div>
        </div>
    );
};

export default WeatherForecast;