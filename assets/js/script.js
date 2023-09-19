var APIkey = "d9870c22d2eeb8fb71f680ed08effa1b"
const date = new Date().toLocaleDateString();

var searchFormEl = document.querySelector('#search-form');
var cityListEl = document.querySelector('.city-list');
var historyList = [];

function init() {
    var storedHistory = JSON.parse(localStorage.getItem("historyObj"));

    if (storedHistory !== null) {
        historyList = storedHistory;
    }

    renderHistory();
}

function renderHistory() {
    cityListEl.innerHTML = "";
    for (var i = 0; i < historyList.length; i++) {
        var city = historyList[i];

        var listEl = document.createElement('li');
        listEl.classList.add('city-item');
        listEl.textContent = city;

        listEl.addEventListener('click', handleHistorySubmit);

        cityListEl.append(listEl);
    }
}

function storeHistoryObj() {
    localStorage.setItem("historyObj", JSON.stringify(historyList));
}

function printCurrentResults(resultObj) {
    var cityNameEl = document.querySelector('.city-name');
    var currentTempEl = document.querySelector('#current-temp');
    var currentWindEl = document.querySelector('#current-wind');
    var currentHumEl = document.querySelector('#current-humidity');
    var currentIconEl = document.querySelector("#current-icon");
    var icon = resultObj.weather[0].icon;

    currentIconEl.innerHTML = `<img src="http://openweathermap.org/img/w/${icon}.png">`;
    cityNameEl.textContent = resultObj.name + " (" + date + ")";
    currentTempEl.textContent = "Temp: " + resultObj.main.temp + "\xB0F";
    currentWindEl.textContent = "Wind: " + resultObj.wind.speed + " MPH";
    currentHumEl.textContent = "Humidity: " + resultObj.main.humidity + "%";
}

function printForecastResults(resultObj) {
    console.log(resultObj);

    var icon = resultObj.weather[0].icon;
    var forecastEl = document.querySelector('.five-day-forecast');
    var resultCard = document.createElement('div');
    resultCard.classList.add('forecast-card');
    var cardDateEl = document.createElement('h4');
    var newDate = resultObj.dt_txt.slice(5,7) + "/" + resultObj.dt_txt.slice(8,10) + "/" + resultObj.dt_txt.slice(0,4);
    var cardIconEl = document.createElement('p');
    var cardTempEl = document.createElement('p');
    var cardWindEl = document.createElement('p');
    var cardHumidityEl = document.createElement('p');

    cardDateEl.textContent = newDate;
    cardIconEl.innerHTML = `<img src="http://openweathermap.org/img/w/${icon}.png">`;
    cardTempEl.textContent = "Temp: " + resultObj.main.temp + "\xB0F";
    cardWindEl.textContent = "Wind: " + resultObj.wind.speed + " MPH";
    cardHumidityEl.textContent = "Humidity: " + resultObj.main.humidity + "%";

    resultCard.append(cardDateEl);
    resultCard.append(cardIconEl);
    resultCard.append(cardTempEl);
    resultCard.append(cardWindEl);
    resultCard.append(cardHumidityEl);
    forecastEl.append(resultCard);

}


function searchApi(query) {
  var forecastEl = document.querySelector('.five-day-forecast');
  var locCurrentQueryUrl = 'https://api.openweathermap.org/data/2.5/weather?';
  var locForecastQueryUrl = 'https://api.openweathermap.org/data/2.5/forecast?';
  
  forecastEl.innerHTML = "";

  locCurrentQueryUrl = locCurrentQueryUrl + '&q=' + query + '&appid=' + APIkey + '&units=imperial';
  locForecastQueryUrl = locForecastQueryUrl + '&q=' + query + '&appid=' + APIkey + '&units=imperial&cnt=40';


  //current Request
  fetch(locCurrentQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (locRes) {
      // write query to page so user knows what they are viewing
      console.log(locRes);

      if (!locRes) {
        console.log('No results found!');
      } else {
        printCurrentResults(locRes);
      }
    })
    .catch(function (error) {
      console.error(error);
    });

  //forecast request
  fetch(locForecastQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (locRes) {
      // write query to page so user knows what they are viewing
      console.log(locRes);

      if (!locRes) {
        console.log('No results found!');
      } else {
        for (var i = 4; i < 40; i+=8) {
            printForecastResults(locRes.list[i]);
          }
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

function handleSearchFormSubmit(event) {
  event.preventDefault();
  console.log("submit");
  var searchInputVal = document.querySelector('#search-input').value;

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }
  searchApi(searchInputVal);
  historyList.push(searchInputVal);
  searchInputVal.value = "";

  storeHistoryObj();
  renderHistory();
  
}

function handleHistorySubmit(event) {
    event.preventDefault();
    console.log("submit");
    var searchInputVal = event.target.textContent;
    
    searchApi(searchInputVal);
  }

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
searchApi("Atlanta");
init();