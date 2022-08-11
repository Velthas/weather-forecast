const WeatherApiInteraction = (function () {

    // Use this to give methods to a weather object
    const weatherMethods = {
        insertData: domElements.insertData,
    };

    async function fetchApiData(userQuery) {

        // Base URL for the query
        // Specified units=metric because I can understand those
        // I plop in my user's query to make the search dynamic
        const apiQueryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userQuery}&APPID=481dab978a20a42998a631eff7d4f8f4&units=metric`;

        // Using the fetch method we query the server, and we get back a response object.
        const response = await fetch(apiQueryUrl, { mode: 'cors' });
        // We need to extract the information we need, and for that we call the .json method.
        const weatherData = await response.json();
        // Console log to see if it's working.
        console.log(weatherData);
        // Return the data at last
        return weatherData;
    }

    // This takes the JSON data returned by the API
    // and extracts only the things we will display
    // Technically unnecessary, but improved readibility
    function extractRelevantData(weatherObject) {

        // Object literal declaration
        const weather = Object.create(weatherMethods);
        
        // Information about the weather itself
        weather.temperature = weatherObject.main.temp;
        weather.tempfeelslike = weatherObject.main.feels_like;
        weather.humidity = weatherObject.main.humidity;
        weather.windspeed = weatherObject.wind.speed;
        
        // A wordy description of how the sky is like
        // This code returns a capitalized description property
        // By default it is all lowercase
        weather.description = weatherObject.weather[0].description.slice(0, 1).toUpperCase() + weatherObject.weather[0].description.slice(1);
        
        // Country's name and city's name;
        weather.city = weatherObject.name;
        weather.country = weatherObject.sys.country;
        
        // Check the result
        console.log(weather);
        // Return the result
        return weather;
    }
 
    return {extractRelevantData, fetchApiData}
    
})();

const applicationFlow = (function() {
 
    // This async function allows me organize code in a way
    // that makes it seem synchronous, so executing top to bottom.
    // We cannot call our second function before the first
    // promise resolves: luckily async functions can help us
    // solve that problem in an elegant and readable way.
    async function getWeatherInfo() {
        // Stores what is in the search bar
        const userInput = domElements.getUserQuery();
        // We get a promise from fetchApiData, wait until it's resolved
        let apiData = await WeatherApiInteraction.fetchApiData(userInput);
        // Then use this to return the object with condensed info
        let elaboratedData = WeatherApiInteraction.extractRelevantData(apiData);
        // Display it for now
        console.log(elaboratedData);
    }
 
    return {getWeatherInfo}
 
})();

// Module that handles everything concerning DOM Manipulation
const domElements = (function() {
    
    function getUserQuery() {
      return document.querySelector('input').value;
    }
    // Currently enables the search functionality
    // Might use it for more event listeners down the line
    function addEventListeners() {
        const searchButton = document.querySelector('button');
        searchButton.addEventListener('click', () => {applicationFlow.getWeatherInfo()})
    }

    // Function to insert data inside the appropriate slot
    function insertData() {
        // Get the container to avoid repeatedly calling querySelector on document
        const infoContainer = document.querySelector(".info-container");
    
        // Header portion
        // Brief description of the weather (sunny, cloudy ecc.)
        const weatherDescription = infoContainer.querySelector(".grid-top p");
        weatherDescription.textContent = this.description;
        // City and country name for long
        const cityAndCountryName = infoContainer.querySelector(".grid-top h1");
        cityAndCountryName.textContent = `${this.city}, ${this.country}`;
    
        // Bottom-left portion
        const temperatureContainer = infoContainer.querySelector(".temperature");
        temperatureContainer.textContent = this.temperature;
    
        // Bottom-right portion
        const allSideInfoParagraphs = Array.from(
        document.querySelectorAll(".side-info")
        );
        allSideInfoParagraphs[0].textContent =
        "Feels like: " + this.tempfeelslike + "°";
        allSideInfoParagraphs[1].textContent = "Wind: " + this.windspeed + "km/h";
        allSideInfoParagraphs[2].textContent = "Humidity: " + this.humidity + "%";
    }

    addEventListeners();
   
    return {getUserQuery, insertData}

  })();
  
