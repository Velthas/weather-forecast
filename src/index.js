import './style.css';
import clearSky from './images/ryan-unsplash.jpg';
import snow from './images/aaron-burden-unsplash.jpg';
import drizzle from './images/roman-synkevych-unsplash.jpg';
import rain from './images/valentin-muller-unsplash.jpg';
import thunderstorm from './images/max-saeling-unsplash.jpg';
import scatteredClouds from './images/janis-rozenfelds-unsplash.jpg';
import overcastClouds from './images/anandu-vinod-unsplash.jpg';

// Module that handles everything concerning DOM Manipulation
const domElements = (function () {
    function getUserQuery() {
      return document.querySelector('input').value;
    }
    // Currently enables the search functionality
    // Might use it for more event listeners down the line
    function addEventListeners() {
      const searchButton = document.querySelector('button');
      searchButton.addEventListener('click', () => {
        applicationFlow.getWeatherInfo();
      });
    }
  
    // Function to insert data inside the appropriate slot
    function insertData() {
      // Get the container to avoid repeatedly calling querySelector on document
      const infoContainer = document.querySelector('.info-container');
  
      // Header portion
      // Brief description of the weather (sunny, cloudy ecc.)
      const weatherDescription = infoContainer.querySelector('.grid-top p');
      weatherDescription.textContent = this.description;
      // City and country name for long
      const cityAndCountryName = infoContainer.querySelector('.grid-top h1');
      cityAndCountryName.textContent = `${this.city}, ${this.country}`;
  
      // Bottom-left portion
      const temperatureContainer = infoContainer.querySelector('.temperature');
      temperatureContainer.textContent = this.temperature;
  
      // Bottom-right portion
      const allSideInfoParagraphs = Array.from(
        document.querySelectorAll('.side-info')
      );
      allSideInfoParagraphs[0].textContent =
        'Feels like: ' + this.tempfeelslike + '°';
      allSideInfoParagraphs[1].textContent = 'Wind: ' + this.windspeed + 'km/h';
      allSideInfoParagraphs[2].textContent = 'Humidity: ' + this.humidity + '%';
    }

    // Appends an error div with a message under the search bar
    function createErrorDiv(message) {
      const errorDiv = document.createElement("div");
      errorDiv.classList.add("error", "visible");
      errorDiv.textContent = message;
      document
        .querySelector(".header")
        .insertBefore(errorDiv, document.querySelector("button"));
    }
  
    // Deletes the error div
    function deleteErrorDiv() {
      const errorDiv = document.querySelector(".error");
      if (errorDiv) errorDiv.remove();
    }

  // Looks at the "code" property inside the weather object
  // This is something that returns from the API Call
  // and would normally be used to determine which weather icon to use
  // We are going to use it to set a custom background
  // This is built to be a method of the weather object
  function setBackground() {
 
    const htmlNode = document.querySelector('html');
 
    switch(true) {
      case this.code === 800: // Codes for clear sky
        htmlNode.style.backgroundImage = "url('" + clearSky + "')"
        break;
      case (this.code === 801 || this.code === 802): // Codes for few clouds and scattered clouds
        htmlNode.style.backgroundImage = "url('" + scatteredClouds + "')"
        break;
      case (this.code === 803 || this.code === 804): // Codes for broken clouds and overcast clouds
        htmlNode.style.backgroundImage = "url('" + overcastClouds + "')"
        break;
      case (this.code >= 600 && this.code <= 622): // Codes for all sorts of snow
      htmlNode.style.backgroundImage = "url('" + snow + "')"
        break;
      case (this.code >= 500 && this.code <= 531): // Codes for all sorts of rain
        htmlNode.style.backgroundImage = "url('" + rain + "')"
        break;
      case (this.code >= 300 && this.code <= 321): // Codes for all sorts of drizzle
        htmlNode.style.backgroundImage = "url('" + drizzle + "')"
        break;
      case (this.code >= 200 && this.code <= 232): // Codes for all sorts of thunderstorms
        htmlNode.style.backgroundImage = "url('" + thunderstorm + "')"
    }
 
  }
  
    addEventListeners();
  
    return { getUserQuery, insertData, createErrorDiv, deleteErrorDiv, setBackground };
  })();

const WeatherApiInteraction = (function () {
  // Use this to give methods to a weather object
  const weatherMethods = {
    insertData: domElements.insertData,
    setBackground: domElements.setBackground,
  };

  async function fetchApiData(userQuery) {
    try {
      // Base URL for the query
      // Specified units=metric because I can understand those
      // I plop in my user's query to make the search dynamic
      const apiQueryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userQuery}&APPID=481dab978a20a42998a631eff7d4f8f4&units=metric`;
 
      // Using the fetch method we query the server, and we get back a response object.
      const response = await fetch(apiQueryUrl, { mode: "cors" });
      // We need to extract the information we need, and for that we call the .json method.
      const weatherData = await response.json();
      // Check for errors
      if (weatherData.cod === "404") {
        throw weatherData;
      }
      // Return the data at last
      return weatherData;
    } catch (error) {
      // If anything is wrong, knock upstairs.
      return { isError: true, message: error.message };
    }
  }

  // This takes the JSON data returned by the API
  // and extracts only the things we will display
  // Technically unnecessary, but improved readibility
  function extractRelevantData(weatherObject) {
    // Object literal declaration
    const weather = Object.create(weatherMethods);

    // Information about the weather itself
    weather.temperature = Number(weatherObject.main.temp).toFixed(0);
    weather.tempfeelslike = Number(weatherObject.main.feels_like).toFixed(0);
    weather.humidity = weatherObject.main.humidity;
    weather.windspeed = Number(weatherObject.wind.speed).toFixed(1);

    // A wordy description of how the sky is like
    // This code returns a capitalized description property
    // By default it is all lowercase
    weather.description =
      weatherObject.weather[0].description.slice(0, 1).toUpperCase() +
      weatherObject.weather[0].description.slice(1);

    // Extract weather condition code
    // Will be used to change the background dinamically
    weather.code = weatherObject.weather[0].id;

    // Country's name and city's name;
    weather.city = weatherObject.name;
    const regionNamesConverter = new Intl.DisplayNames(['en'], {
      type: 'region',
    });
    weather.country = regionNamesConverter.of(weatherObject.sys.country);

    // Check the result
    console.log(weather);
    // Return the result
    return weather;
  }

  return { extractRelevantData, fetchApiData };
})();

const applicationFlow = (function () {
  // This async function allows me organize code in a way
  // that makes it seem synchronous, so executing top to bottom.
  // We cannot call our second function before the first
  // promise resolves: luckily async functions can help us
  // solve that problem in an elegant and readable way.
    async function getWeatherInfo() {
    // If there is an error div, delete it
    domElements.deleteErrorDiv();
 
    try {
      // Stores what is in the search bar
      const userInput = domElements.getUserQuery();
      // We get a promise from fetchApiData, wait until it's resolved
      const apiData = await WeatherApiInteraction.fetchApiData(userInput);
      // If there was a mistake, the apiData object will
      // have an isError property with a value of true
      if (apiData.isError) throw new Error(apiData.message);
 
      // If there is no mistake return the object with condensed info
      let elaboratedData = WeatherApiInteraction.extractRelevantData(apiData);
      // Display it for now
      elaboratedData.insertData();
      // Dinamically set the background based on code
      elaboratedData.setBackground();
    } catch (error) {
      domElements.createErrorDiv(error.message);
      return;
    }
  }

  return { getWeatherInfo };
})();

