import {
  inquirerMenu,
  pause,
  readInput,
  listPlaces,
} from "./helpers/inquirer.js";
import { Searches } from "./models/searches.js";

async function main() {
  let opt = 0;
  const searches = new Searches();
  do {
    opt = await inquirerMenu();
    switch (opt) {
      case 1:
        const city = await readInput("City: ");
        const foundedCities = await searches.searchCity(city);
        if (foundedCities.length === 0) {
          console.log("\nNo results found");
          await pause();
          continue;
        }

        const id = await listPlaces(foundedCities);
        if (id === "0") continue;

        const selectedCity = foundedCities.find((city) => city.id === id);
        const { name, lat, lng } = selectedCity;

        searches.addHistory(selectedCity.name);

        const weather = await searches.findWeather(lat, lng);
        const { temp, min, max, desc } = weather;

        console.log("\nCity Information:\n".yellow);
        console.log("Name: ".green, name.toString().white);
        console.log("Temperature: ".green, temp.toString().white);
        console.log("Temp. Max: ".green, min.toString().white);
        console.log("Temp. Min: ".green, max.toString().white);
        console.log(
          "Description: ".green,
          (desc.charAt(0).toUpperCase() + desc.slice(1)).white
        );
        console.log("Latitude: ".green, lat.toString().white);
        console.log("Longitude: ".green, lng.toString().white);
        break;
      case 2:
        searches.historialCapitalized.forEach((city, index) => {
          const idx = `${index + 1}.`.green;
          console.log(`${idx} ${city}`);
        });

        break;
    }

    if (opt !== 0) await pause();
  } while (opt !== 0);
}

main();
