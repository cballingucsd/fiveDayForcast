//establish global variables
var userFormEl = document.querySelector('#user-form');
var pastSearchButtonsEl = document.querySelector('#past-search-buttons');
var nameInputEl = document.querySelector('#citySearch');
var repoContainerEl = document.querySelector('#repos-container');
var repoSearchTerm = document.querySelector('#repo-search-term');
var latSearch = '';
var lonSearch = '';

//get user input for search
var formSubmitHandler = function (event) {
  event.preventDefault();
  var citySearch = nameInputEl.value.trim();

//validate search input
  if (citySearch) {
    //run search for valid input
    getCityLocation(citySearch);

    repoContainerEl.textContent = '';
    nameInputEl.value = '';
  } 
  else {
    //set alert for invalid user input
    alert('Please enter a valid city name');
  }
};

var getCityLocation = function (citySearch) {
  //get lat and long from GeoCoding API
  var apiGeoUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + citySearch + '&limit=1&appid=cf259c950032d53080fc7de622b6f5d3';

  fetch(apiGeoUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          latSearch = data[0].lat;
          lonSearch = data[0].lon;
          //input lat and long into WeatherMap API
          //invoke Weather API function
          getCityWeather (latSearch, lonSearch);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
  
//get weather data from Weather API
 var getCityWeather = function (latSearch, lonSearch){ 
  var apiWeatherUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + latSearch + '&lon=' + lonSearch + '&units=imperial&appid=cf259c950032d53080fc7de622b6f5d3';
  fetch(apiWeatherUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayRepos(data, citySearch);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to OpenWeatherMap.org');
    });
};
};

//display weather data
var displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    repoContainerEl.textContent = 'No repositories found.';
    return;
  }
//set the city name as the search parameter
  repoSearchTerm.textContent = searchTerm +", "+ repos.city.country;

  for (var i = 0; i < repos.list.length; i++) {
  //Weather API return arrays of 5 days of weather data at 3 hour interval
  //identify each index of the array to collect date, time, temp, humidity, and wind speed
    var unixTimeStamp = repos.list[i].dt;
    var dateObject = new Date(unixTimeStamp*1000);
    var date = dateObject.toLocaleDateString('en-us', {weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'});
    var time = dateObject.toLocaleTimeString('en-us');

    var temp = repos.list[i].main.temp;
    var humidity = repos.list[i].main.humidity;
    var windSpeed = repos.list[i].wind.speed;

    //create new division for each data index in the array 
    var repoEl = document.createElement('div');
    repoEl.classList = 'list-item flex-column justify-space-between align-center';

    //create data as text for html display
    var titleEl = document.createElement('span');
    titleEl.textContent = date;
    var titleE2 = document.createElement('span');
    titleE2.textContent = time;
    var titleE3 = document.createElement('span');
    titleE3.textContent = "Temperature: " + temp + "°F";
    var titleE4 = document.createElement('span');
    titleE4.textContent = "Humidity: " + humidity + "%";
    var titleE5 = document.createElement('span');
    titleE5.textContent = "Wind Speed: " + windSpeed + "mph";

    //add data as text onto each division 
    repoEl.appendChild(titleEl);
    repoEl.appendChild(titleE2);
    repoEl.appendChild(titleE3);
    repoEl.appendChild(titleE4);
    repoEl.appendChild(titleE5);

    //create icon of weather data
    var statusEl = document.createElement('img');
    statusEl.classList = 'flex-row align-center';
    var statusIcon = repos.list[i].weather[0].icon;
    //set conditions for weather icon
    statusEl.src = "http://openweathermap.org/img/wn/"+statusIcon+"@2x.png";
    
    repoEl.appendChild(statusEl);

    repoContainerEl.appendChild(repoEl);
  }
};

userFormEl.addEventListener('submit', formSubmitHandler);
