// --- KOHTA A: Perusrunko ja muuttujat --- 
const kurssi = "Johdatus sovelluskehitykseen"; 
let osallistujat = 25; 
console.log("Hei maailma! Kurssi:", kurssi); 
console.log("Osallistujamäärä:", osallistujat);

const asia = prompt("Millä asialla? (vinkki: hyvällä tai pahalla)");
const viesti = document.getElementById("viesti");
if (asia ==="hyvällä") {
    alert ("Olet tervetullut sivulleni.");
 } else if (asia === "pahalla" ) {
    alert ("Mee pois.");
 } else {
    alert ("Et taida osata lukea ohjeita.");
 }


 function anitanAlennuslaskuri(hinta) {
  return hinta * 0.9;   // vähennetään 10 %
}

console.log(anitanAlennuslaskuri(120));

const juomat = ["Coffee", "Tea", "Milk"];

for (let i = 0; i < juomat.length; i++) {
  console.log(juomat[i]);
}

function tulostaViesti() {
  console.log("Anita osaa!!!");
}


const haeNappi = document.getElementById("haeNappi"); 
const tulosTeksti = document.getElementById("tulosTeksti"); 
 
haeNappi.addEventListener("click", () => { 
    tulosTeksti.innerText = "Haetaan neuvoa rajapinnasta..."; 
 
    fetch("https://api.adviceslip.com/advice", { cache: "no-cache" }) 
        .then(response => response.json()) 
        .then(data => { 
            console.log("Rajapinnan vastaus:", data); 
            tulosTeksti.innerText = data.slip.advice; 
        }) 
        .catch(error => { 
            console.error("Virhe haussa:", error); 
            tulosTeksti.innerText = "Tiedon hakeminen epäonnistui!"; 
        }); 
});

  const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

const cityInput = document.getElementById("cityInput");
const suggestions = document.getElementById("suggestions");
const errorBox = document.getElementById("error");
const weatherBox = document.getElementById("weather");

const locationNameEl = document.getElementById("locationName");
const temperatureEl = document.getElementById("temperature");
const windEl = document.getElementById("wind");
const humidityEl = document.getElementById("humidity");

let debounceTimer = null;

// -----------------------------
// 1) Dynaaminen autocomplete
// -----------------------------
cityInput.addEventListener("input", () => {
    const query = cityInput.value.trim();
    clearTimeout(debounceTimer);

    if (query.length < 2) {
        suggestions.innerHTML = "";
        return;
    }

    debounceTimer = setTimeout(() => fetchSuggestions(query), 300);
});

async function fetchSuggestions(query) {
    const params = new URLSearchParams({
        name: query,
        count: 5,
        language: "fi",
        format: "json"
    });

    try {
        const res = await fetch(`${GEO_URL}?${params}`);
        const data = await res.json();

        suggestions.innerHTML = "";

        if (!data.results) return;

        data.results.forEach(place => {
            const li = document.createElement("li");
            li.textContent = `${place.name}, ${place.country}`;

            li.addEventListener("click", () => {
                cityInput.value = place.name;
                suggestions.innerHTML = "";
                fetchWeather(place);   // <-- automaattinen säänhaku
            });

            suggestions.appendChild(li);
        });
    } catch (err) {
        console.error("Autocomplete error:", err);
    }
}

// -----------------------------
// 2) Sään haku valitulle paikalle
// -----------------------------
async function fetchWeather(place) {
    errorBox.textContent = "";
    weatherBox.style.display = "none";

    const params = new URLSearchParams({
        latitude: place.latitude,
        longitude: place.longitude,
        current: "temperature_2m,relative_humidity_2m,wind_speed_10m",
        timezone: "auto"
    });

    try {
        const res = await fetch(`${WEATHER_URL}?${params}`);
        const data = await res.json();

        const current = data.current;

        locationNameEl.textContent = `${place.name}, ${place.country}`;
        temperatureEl.textContent = `${current.temperature_2m} ${data.current_units.temperature_2m}`;
        windEl.textContent = `${current.wind_speed_10m} ${data.current_units.wind_speed_10m}`;
        humidityEl.textContent = `${current.relative_humidity_2m} %`;

        weatherBox.style.display = "block";

    } catch (err) {
        console.error("Weather error:", err);
        errorBox.textContent = "Säätietojen hakeminen epäonnistui.";
    }
}