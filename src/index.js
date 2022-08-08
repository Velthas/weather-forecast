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
    }

    fetchApiData();

})();