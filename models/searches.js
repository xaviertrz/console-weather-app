import fs from "fs";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

export class Searches {
  dbPath = "./db/database.json";
  historial = [];

  constructor() {
    this.loadDB();
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      language: "es",
      limit: 5,
    };
  }

  get paramsOpenWeatherMap() {
    return {
      appid: process.env.OPEN_WEATHER_MAP_KEY,
      units: "metric",
      lang: "es",
    };
  }

  get historialCapitalized() {
    return this.historial.map((city) => {
      let words = city.split(" ");
      words = words.map((word) => word[0].toUpperCase() + word.substring(1));

      return words.join(" ");
    });
  }

  async searchCity(city = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json`,
        params: this.paramsMapbox,
      });

      const resp = await instance.get();
      return resp.data.features.map((city) => ({
        id: city.id,
        name: city.place_name,
        lng: city.center[0],
        lat: city.center[1],
      }));
    } catch (error) {
      console.log(error);
    }
  }

  async findWeather(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsOpenWeatherMap, lat, lon },
      });

      const resp = await instance.get();
      const { weather, main } = resp.data;

      return {
        desc: weather[0].description,
        min: main.temp_min + "°C",
        max: main.temp_max + "°C",
        temp: main.temp + "°C",
      };
    } catch (error) {
      console.log(error);
    }
  }

  saveInDB() {
    const payload = {
      historial: this.historial,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  addHistory(city = "") {
    if (this.historial.includes(city.toLowerCase())) return;

    this.historial = this.historial.splice(0, 4);

    this.historial.unshift(city.toLowerCase());
    this.saveInDB();
  }

  loadDB() {
    if (!fs.existsSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);

    console.log(data.historial);
    this.historial = data.historial;
  }
}
