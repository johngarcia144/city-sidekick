const elemDropdown= $(".dropdown-trigger").dropdown();
  M.Dropdown.init(elemDropdown, {
  coverTrigger:false
});
$(".sidenav").sidenav();

// store the value of the input
var city = $("#input-city").val();
// store api key
const apiKey = "&appid=efa28af0867228bf8d37da8d2b1bb082";

let lat, lng;

$("#input-city").keypress(function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    $("#search-button").click();
  }
});

$("#search-button").on("click", function () {
  // get the value of the input from user
  city = $("#input-city").val();

  // clear input box
  $("#input-city").val("");

  // full url to call api
  const queryUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;

  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    console.log(response.name);
    console.log(response.weather[0].icon);

    var tempF = (response.main.temp - 273.15) * 1.8 + 32;
    console.log(Math.floor(tempF));

    console.log(response.main.humidity);

    // console.log(response.wind.speed)

    getCurrentConditions(response);
    // getCurrentForecast(response);
    // makeList();
    var long = response.coord.lon;
    console.log(long);
      var latt = response.coord.lat;
      
      lat = latt

      lng = long
    console.log(latt);
    Search(city);
  });
});

//   function makeList() {
//     let listItem = $("<li>").addClass("list-group-item").text(city);
//     $(".list").append(listItem);
//   }

function getCurrentConditions(response) {
  // get the temperature and convert to fahrenheit
  var tempF = (response.main.temp - 273.15) * 1.8 + 32;
  tempF = Math.floor(tempF);

  $("#currentCityWeather").empty();

  // get and set the content
  const card = $("<div>").addClass("card");
  const cardBody = $("<div>").addClass("card-body");
  const text = $("<h5>")
    .addClass("center white-text #6a1b9a purple darken-3")
    .text("Weather Info");
  const city = $("<h4>").addClass("center").text(response.name);
  const cityDate = $("<span>")
    .addClass("card-title")
    .text(" (" + moment().format("l") + ")");
  const tempHumid = $("<p>")
    .addClass("card-text center current-temp")
    .text(
      "Temperature: " +
        tempF +
        " °F," +
        " Humidity: " +
        response.main.humidity +
        "%"
    );
  // const humidity = $("<span>").addClass("card-text current-humidity").text(" Humidity: " + response.main.humidity + "%");
  const image = $("<img>").attr(
    "src",
    "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
  );

  // add to page
  cardBody.append(text);
  city.append(cityDate, image);
  cardBody.append(city, tempHumid);
  card.append(cardBody);
  $("#currentCityWeather").append(card);
}

/// MAP BEGINS HERE

var map, searchManager;

function GetMap() {
  map = new Microsoft.Maps.Map(".mapLocation", {
    credentials:
      "AlH3Jgw0ONrM0Etbku31o8qqPXlS-bpS_vOXhaKx5Z_bNblaBPSKcvdwrC1TRsVZ",
  });
}

var objectArray = [];

function Search(city) {
  if (!searchManager) {
    //Create an instance of the search manager and perform the search.
    Microsoft.Maps.loadModule("Microsoft.Maps.Search", function () {
      searchManager = new Microsoft.Maps.Search.SearchManager(map);
      Search(city);
    });
  } else {
    //Remove any previous results from the map.
    map.entities.clear();

    //Get the users query and geocode it.
    geocodeQuery(city);
    console.log("MAP", map, city);
    if(lat && lng) getMarkers(search, lat, lng).then(() => geocodePins(objectArray));
  }
}

function geocodePins(arr) {
  console.log("1", arr);
  var pin,
    pins = [],
    locs = [],
    output = "Results:<br/>";
  for (var i = 0; i < arr.length; i++) {
    //replaced r.results.length with "1" to stop multiple locations/pins from showing up
    //Create a pushpin for each result.
    console.log("2", arr[i]);
    pin = new Microsoft.Maps.Pushpin(arr[i], {
      text: i + 1 + "",
    });
    pins.push(pin);
    locs.push(arr[i]);
  }

  //Add the pins to the map
  map.entities.push(pins);
  var bounds;

  if (r.results.length == 1) {
    bounds = r.results[0].bestView;
  } else {
    //Use the locations from the results to calculate a bounding box.
    bounds = Microsoft.Maps.LocationRect.fromLocations(locs);
  }

  map.setView({ bounds: bounds });
}

function geocodeQuery(query) {
  var searchRequest = {
    where: query,
    callback: function (r) {
      console.log("BYE", r.results);
      if (r && r.results && r.results.length > 0) {
        var pin,
          pins = [],
          locs = [],
          output = "Results:<br/>";

        for (var i = 0; i < 1; i++) {
          //replaced r.results.length with "1" to stop multiple locations/pins from showing up
          //Create a pushpin for each result.

          console.log("Does this work?", r.results[i].location);
          pin = new Microsoft.Maps.Pushpin(r.results[i].location, {
            text: i + "",
          });

          locs.push(r.results[i].location);

          output += i + ") " + r.results[i].name + "<br/>";
        }

        //Add the pins to the map
        map.entities.push(pins);

        //Display list of results
        // document.getElementById('output').innerHTML = output;

        //Determine a bounding box to best view the results.
        var bounds;

        if (r.results.length == 1) {
          bounds = r.results[0].bestView;
        } else {
          //Use the locations from the results to calculate a bounding box.
          bounds = Microsoft.Maps.LocationRect.fromLocations(locs);
        }

        map.setView({ bounds: bounds });
      }
    },
  };

  //Make the geocode request.
  searchManager.geocode(searchRequest);
}

var search = "";

function getMarkers(search, lat, lng) {
  console.log(search);
  $(".titleInfo").empty(); //this will empty the list so it doesn't stack

  function clearObject() {
    //empty your array
    objectArray.length = 0;
  }
  clearObject();

  testArray = [];
  //this ajax query will need to take in a restaurant/hotel, the users location(lat and long) and radius
  console.log(search); //example search input to test, will need to attach the dropdown menu to this
  geoLocation = `${lat},${lng},5000`; //example geo location for denver to test with a radius of 5000...not sure of the measurement...
  bingKey = "AlH3Jgw0ONrM0Etbku31o8qqPXlS-bpS_vOXhaKx5Z_bNblaBPSKcvdwrC1TRsVZ";
  const queryURL =
    "https://dev.virtualearth.net/REST/v1/LocalSearch/?query=" +
    search +
    "&userCircularMapView=" +
    geoLocation +
    "&key=" +
    bingKey;

  return $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    for (var i = 0; i < 10; i++) {
      locationsObject = response.resourceSets[0].resources[i].name; //this will display 10 restaurants
      console.log("3", locationsObject);

      var obj = {
        latitude: response.resourceSets[0].resources[i].point.coordinates[0],
        longitude: response.resourceSets[0].resources[i].point.coordinates[1],
      };
      var nameRestaurant = response.resourceSets[0].resources[i].name;
      objectArray.push(obj);

      //make an array of objects that mimics r.results[i].location

      testArray.push(JSON.stringify(locationsObject)); //this will push each restaurant into an array so that we can display them
      $(".titleInfo").append(`<li id=${i}>${locationsObject}`);
    }
  });
}

$(".list").click(function () {
  search = $(this).html();
  
    if(lat && lng) getMarkers(search, lat, lng);
});

// may not need this 2nd ajax call...
// this url link will take an address using zipcode/city/street and show the coordinates
// const queryURL2 =
//   "http://dev.virtualearth.net/REST/v1/Locations/US/{adminDistrict}/80224/Denver/1200SOneidaSt?&maxResults=1&key=AlH3Jgw0ONrM0Etbku31o8qqPXlS-bpS_vOXhaKx5Z_bNblaBPSKcvdwrC1TRsVZ";
// $.ajax({
//   url: queryURL2,
//   method: "GET",
// }).then(function (response) {
//   console.log(response);
//   coordinates =
//     response.resourceSets[0].resources[0].geocodePoints[0].coordinates;
//   console.log(coordinates);
//   $(".coordinates").append("<ul>").text(coordinates);
// });
