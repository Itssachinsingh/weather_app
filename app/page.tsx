'use client'
import axios from "axios";
import { useState, useEffect } from "react";
import Clouds from '../public/cloudy.gif';
import Sunny from '../public/sunny.gif';
import Haze from '../public/haze.gif';
import Rain from '../public/rainy.gif';
import Clear from '../public/clear.gif';
import Clear_bg from '../public/clear_bg.jpg';
import Rain_bg from '../public/rain_bg.jpg';
import Haze_bg from '../public/haze_bg.jpg';
import Sunny_bg from '../public/sunny_bg.jpg';
import Clouds_bg from '../public/cloudy_bg.jpeg';


export default function Home() {
  const time = new Date();
  const api = process.env.NEXT_PUBLIC_API_KEY;

  interface WeatherData {
    name: string;
    country: string;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      feels_like: number;
      humidity: number;
      pressure: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
    timezone: number;

  }

  const [inputValue, setInputValue] = useState<string>(""); 
  const [city, setCity] = useState<string>("New York")
  const [country, setCountry] = useState<string>("US");  
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [bgImage, setBgImage] = useState<string>("");
  const [localTime, setLocalTime] = useState<string>("");
  const [localDate, setLocalDate] = useState<string>("");  
  const [weatherType, setWeatherType] = useState<string>("Clear");
  const [weatherImage, setWeatherImage] = useState<string>('');




  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

const selectCity = () => {
  setCity(inputValue);

}

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api}`
        );
        console.log(res.data);
        console.log(res.data.sys.country);
        setCountry(res.data.sys.country);
        setWeatherData(res.data);
  
        // Pass the timezone offset to updateLocalTime
        updateLocalTime(res.data.timezone);
  
        setWeatherType(res.data.weather[0].main);
        console.log(res.data.weather[0].main);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchWeather();
  }, [city]); // Ensure the useEffect runs whenever the `city` changes
  
  const updateLocalTime = (timezoneOffset:number) => {
    // Get the current UTC time (pure UTC)
    const currentUTC = new Date();
  
    // Calculate the target location's time
    const localTimeInMs = currentUTC.getTime() + timezoneOffset * 1000;
    const localTime = new Date(localTimeInMs);
  
    // Format the time (override system timezone for display)
    const formattedTime = localTime.toLocaleTimeString("en-GB", {
      timeZone: "UTC", 
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  
    // Format the date (override system timezone for display)
    const formattedDate = localTime.toLocaleString("en-US", {
      timeZone: "UTC", 
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  
    // Update state
    setLocalTime(formattedTime);
    setLocalDate(formattedDate);
  };


      // Map weather types to background images
  useEffect(() => {
    const weatherBackgrounds: { [key: string]: string } = {
      Clear: Clear_bg.src,
      Rain: Rain_bg.src,
      Haze: Haze_bg.src,
      Sunny: Sunny_bg.src,
      Clouds: Clouds_bg.src,
      Fog:Haze_bg.src
    };

    setBgImage(weatherBackgrounds[weatherType] || Clear_bg.src); 
  }, [weatherType]);


  useEffect(() => {
    if (weatherType) {
      switch (weatherType) {
        case 'Clear':
          setWeatherImage(Clear.src);
          break;
        case 'Rain':
          setWeatherImage(Rain.src);
          break;
        case 'Clouds':
          setWeatherImage(Clouds.src);
          break;
          case 'Sunny':
            setWeatherImage(Sunny.src);
            break;
          case 'Haze':
            setWeatherImage(Haze.src);
            break;
        default:
          setWeatherImage(Clear.src);
          break;
      }
    }
  }, [weatherType]);

  return (
    <div className="container"      
    style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      // height: "100vh",
      // width: "100%",
    }}>
      <div className="search_container">
        <input type="search"  onChange={handleChange}/>
        <button onClick={selectCity}>🔍</button>
      </div>
      <div className="suggest hidden">
        <li></li>
      </div>
      <div className="top_container">
        <div className="top_left_container">
          <h2>{weatherData?.name}, {country}</h2>
          <div className="time">{localTime}</div>
          <div className="date">{localDate}</div>
          
        </div>
        <div className="top_right_container">

            {weatherImage && <img src={weatherImage} alt={weatherType} />}
          <p className="main">Weather:  {weatherData?.weather[0].main}</p>
          <p className="desc">Description:  {weatherData?.weather[0].description}</p>
          <h2>Temp. :  <span>{weatherData?.main?.temp}</span> °C</h2>
          <p>min temp. <span>{weatherData?.main?.temp_min}</span>     &emsp; &emsp;  max temp. <span>{weatherData?.main?.temp_max}</span></p>
        </div>
      </div>
    </div>
  );
}
