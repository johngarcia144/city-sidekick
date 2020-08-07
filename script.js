   
$(".dropdown-trigger").dropdown();

// store the value of the input
var city = $("#input-city").val();
// store api key
const apiKey = "&appid=efa28af0867228bf8d37da8d2b1bb082";

$("#input-city").keypress(function(event) { 
	
	if (event.keyCode === 13) { 
		event.preventDefault();
		$("#search-button").click(); 
	} 
});

$("#search-button").on("click", function() {
  // get the value of the input from user
  city = $("#input-city").val();
  
  // clear input box
  $("#input-city").val("");

  // full url to call api
  const queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;

  $.ajax({
    url: queryUrl,
    method: "GET"
  })
  .then(function (response){

    console.log(response)

    console.log(response.name)
    console.log(response.weather[0].icon)

    var tempF = (response.main.temp - 273.15) * 1.80 + 32;
    console.log(Math.floor(tempF))

    console.log(response.main.humidity)

    // console.log(response.wind.speed)

     getCurrentConditions(response);
    // getCurrentForecast(response);
    // makeList();

    })
  });

//   function makeList() {
//     let listItem = $("<li>").addClass("list-group-item").text(city);
//     $(".list").append(listItem);
//   }

  function getCurrentConditions (response) {

    // get the temperature and convert to fahrenheit 
    var tempF = (response.main.temp - 273.15) * 1.80 + 32;
    tempF = Math.floor(tempF);

    $('#currentCityWeather').empty();

    // get and set the content 
    const card = $("<div>").addClass("card");
    const cardBody = $("<div>").addClass("card-body");
    const text= $("<h5>").addClass("center white-text #6a1b9a purple darken-3").text("Weather Info")
    const city = $("<h4>").addClass("center").text(response.name);
    const cityDate = $("<span>").addClass("card-title").text(" (" + moment().format('l') + ")");
    const tempHumid = $("<p>").addClass("card-text center current-temp").text("Temperature: " + tempF + " °F," + " Humidity: " + response.main.humidity + "%");
    // const humidity = $("<span>").addClass("card-text current-humidity").text(" Humidity: " + response.main.humidity + "%");
    const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")

    // add to page
    cardBody.append(text)
    city.append(cityDate, image)
    cardBody.append(city, tempHumid);
    card.append(cardBody);
    $("#currentCityWeather").append(card)
   
  }


