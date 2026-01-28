import React, { useEffect, useState } from "react";
import { MapPin, Sun, CloudRain, Search, Heart, FileHeart } from "lucide-react";
import { BsCloudDrizzle } from "react-icons/bs";
import Favorite from "./Favorite";

function getWeatherFromLS() {
  try {
    return JSON.parse(localStorage.getItem("weather"));
  } catch {
    localStorage.removeItem("weather");
    return null;
  }
}

function getFavoriteFromLS() {
  try {
    const data = JSON.parse(localStorage.getItem("favorite"));
    return Array.isArray(data) ? data : [];
  } catch {
    localStorage.removeItem("favorite");
    return [];
  }
}

const App = () => {
  const APIKEY = "6be79f10d814d7b3a45a00c9d08c5324";

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(getWeatherFromLS);
  const [click, setClick] = useState(true);
  const [favorite, setFavorite] = useState(getFavoriteFromLS);
  const [fill, setFill] = useState(false);
  const [error, setError] = useState("");

  const date = new Date().toLocaleDateString();

  async function weatherDeatails() {
    if (!city) return;
    setError("");

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=metric`,
      );

      const res = await response.json();
      if (res.cod === "404") {
        setError("City not found.Please try again!");
      }
      setWeather(res);
      setClick(false);
    } catch (e) {
      setError("Network error. Please try again");
      console.log("Server error", e);
    }
  }

  function addFav() {
    setFavorite((prev) => {
      if (prev.includes(city)) {
        return prev.filter((c) => c !== city);
      }
      return [...prev, city];
    });
  }

  useEffect(() => {
    setFill(favorite.includes(city));
  }, [city, favorite]);

  useEffect(() => {
    if (weather) {
      localStorage.setItem("weather", JSON.stringify(weather));
    }
  }, [weather]);

  useEffect(() => {
    localStorage.setItem("favorite", JSON.stringify(favorite));
  }, [favorite]);

  const condition = weather?.weather?.[0]?.description?.split(" ")[1] || "";

  return (
    <div className="container">
      <div
        className="card"
        style={{
          backgroundImage:
            condition === "sky"
              ? "url('/src/assets/1.png')"
              : condition === "rain"
                ? "url('/src/assets/4.png')"
                : "url('/src/assets/3.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "400px",
          height: "600px",
        }}
      >
        <div className="searchSection">
          {click ? (
            <div className="searchButton">
              <button className="search" onClick={weatherDeatails}>
                <Search />
              </button>
              <input
                className="input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Search City"
              />
            </div>
          ) : (
            <div className="cityDate">
              <p>
                <MapPin size={15} /> {city}
              </p>
              <p className="date">Today, {date}</p>
            </div>
          )}

          {error && click && (
            <div
              style={{
                color: "red",
                backgroundColor: "rgba(255,255,255,0.8)",
                padding: "5px",
                borderRadius: "5px",
                marginTop: "10px",
                fontSize: "14px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <div className="favorite">
            <button onClick={() => setClick(!click)}>
              <img src="/src/assets/menu.png" width={30} height={30} alt="" />
            </button>
            <button>
              <FileHeart />
            </button>

            {!click && (
              <button onClick={addFav}>
                <Heart fill={fill ? "black" : "transparent"} />
              </button>
            )}
          </div>
        </div>

        <div className="weatherInfo">
          <div className="weatherText">
            {condition === "sky" ? (
              <Sun />
            ) : condition === "rain" ? (
              <CloudRain />
            ) : (
              <BsCloudDrizzle />
            )}
            <p>It's {weather?.weather?.[0]?.description}</p>
          </div>

          <p className="tempText">{weather?.main?.temp}℃</p>
        </div>
        {favorite.map((fav) => (
          <p>{fav}</p>
        ))}
      </div>
    </div>
  );
};

export default App;
