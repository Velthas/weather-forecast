import './style.css';

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
  
    addEventListeners();
  
    return { getUserQuery, insertData, createErrorDiv, deleteErrorDiv };
  })();

const WeatherApiInteraction = (function () {
  // Use this to give methods to a weather object
  const weatherMethods = {
    insertData: domElements.insertData,
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
    } catch (error) {
      domElements.createErrorDiv(error.message);
      return;
    }
  }

  return { getWeatherInfo };
})();

