## Weather Forecast
### Live at: https://velthas.github.io/weather-forecast
 Weather Forecast is a project utilizing OpenWeatherMap API and asynchronous code to display real-time weather info on different cities.

### 1. Functionality
<p>The project is very simple on both surface level and under the hood. Upon loading the page, the user will be presented with weather info about Ragusa. From there, they can search whatever city they like by using the search bar on the top right side of the screen and pressing search.</p>

<p>The OpenWeatherMap API gives back a wealth of information, and I handpicked some to display to the user, namely:</p>

 - Actual temperature (no decimals)
 - Felt temperature (no decimals)
 - Wind speed (1 decimal number)
 - Humidity (percentage)
 - Weather description (rain, scattered clouds, overcast clouds ecc.)
<p>Another small addition that was greatly called for by friends who I showed the project to while I was working was dynamic picture changing: sounds fancy, but it just means the background changes based on the type of weather.</p>
<p>So far I have pictures for:</p> 
 
 - Clear Sky
 - Few and Scattered Clouds
 - Broken and Overcast Clouds
 - Rain
 - Snow
 - Thunderstorm
 <p>Catastrophic events like tornadoes and sandstorms are handled by the very generic picture for Broken and Overcast clouds. It would have been cool for sure, but I doubt my users would have seen it much anyway!</p>

### 2. Async Code
<p>This project was great to test what I had just learned on Async Code and the fetch API. While the first approach with promises was a little daunting, I was quickly won over by the much clearer async/await syntax I ended up utilizing.</p>
<p>Error catching was handled with the try catch syntax associated with async functions, a much cleaner solution than the otherwise endless string of .then and .catch</p>
