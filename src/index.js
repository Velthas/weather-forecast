const WeatherApiInteraction = (function () {

    async function fetchApiData() {

        // This is just a momentary placeholder query for testing
        const placeholderQuery = 'Rome';
        // Base URL for the query
        // I made sure to slap on the units=metric to return values I can understand
        const apiQueryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${placeholderQuery}&APPID=481dab978a20a42998a631eff7d4f8f4&units=metric`;

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
        const weather = {};
        
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