//Travel Directions
var weatherObj;

function getCityIds(){
  var cityIds=[
  {city:'milwaukee', cityId: 5263045}, //milwaukee
  {city:'minneapolis', cityId: 4275586}, //minneapolis
  {city:'dallas', cityId: 4462896}, //dallas
  {city:'chicago', cityId: 4887398} //chicago
  ];
  return cityIds;
}

function getWeatherAPICallString(){
  var APIkey = '74bd7bb4aeb708042caefaaaec71be6b';
  var cityIds = getCityIds();
  var APIcall = 'http://api.openweathermap.org/data/2.5/group?id=';
  for(var i=0; i<cityIds.length; i++){
    if(i < cityIds.length-1){
    APIcall += cityIds[i].cityId + ',';
    }
    else{
      APIcall += cityIds[i].cityId;
    }
  }
  APIcall += '&APPID=' + APIkey + '&units=imperial';
  return APIcall
}

(function getWeather(){
  var APIcall = getWeatherAPICallString();
  //console.log(APIcall)
  fetch(APIcall)
    .then(
      function(response){
        if(response.status !== 200){
          alert('Weather failed due to error:' + response.status);
        }
        else{
          response.json().then(function(data) {
          parseWeatherJSON(data);
          storeWeatherJSON(data);
        });
      }
      });
})();

function parseWeatherJSON(data){
  var slides = document.getElementsByClassName("weather");
  for(var i = 0; i<slides.length; i++)
  {
    var slide = slides[i].id;
    for(var k = 0; k<data.cnt; k++)
    {
      if(slide.includes(data.list[k].name.toLowerCase())){
      document.getElementById(slide).innerHTML = data.list[k].main.temp.toFixed(1) + "&deg"+"F <br>" + data.list[k].weather[0].description;//sets visible text on slide
      document.getElementById(slide).value = data.list[k];
      }
    }
  }
}

function storeWeatherJSON(data){
  weatherObj = data;
}


function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: {lat: 41.85, lng: -87.65}
    });
    var origin;
    var geocoder = new google.maps.Geocoder();
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directionsPanel'));
    document.getElementById('submit').addEventListener('click', function() {
        geocodeAddress(directionsService, directionsDisplay, geocoder, calculateAndDisplayRoute);
    });
    calculateAndDisplayRoute(directionsService, directionsDisplay);
}

function getDestination(office){
    var destinationLatLng;
    switch(office){
        case 'milwaukee':
        destinationLatLng = '43.0332535,-87.9061252';
        break;
        case 'minneapolis':
        destinationLatLng = '44.9762798,-93.2687264';
        break;
        case 'dallas':
        destinationLatLng = '32.8090935,-96.8079239';
        break;
        case 'chicago':
        destinationLatLng = '41.8925451,-87.6367606';
        break;
    }
    return destinationLatLng;
}
//calculateAndDisplayRoute entered as a callback, as this function would finish before geocoding finishes.
function geocodeAddress(directionsService, directionsDisplay, geocoder, callback){
    var address = document.getElementById('address').value;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            callback(directionsService, directionsDisplay, results[0].geometry.location);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });

}
function calculateTravelMode(destination){
  var cityWeatherObj = refineWeatherObj(destination);
  var bikePoints = Number(document.getElementById('bike').value);
  var busPoints = Number(document.getElementById('bus').value);
  var drivePoints = Number(document.getElementById('drive').value);
  var travelMethod;
  //temp controls
  switch(true){
    case (cityWeatherObj.main.temp < 0):
    bikePoints -= 100;
    busPoints -= 20;
    break;
    case (cityWeatherObj.main.temp >= 0 && cityWeatherObj.main.temp <= 50):
    bikePoints -= 30;
    break;
    case(cityWeatherObj.main.temp > 50 && cityWeatherObj.main.temp <=85 ):
    bikePoints += 30;
    break;
    case(cityWeatherObj.main.temp >=85):
    bikePoints -=20;
    break;
    default:
    break;
  }
  //element controls
  var element = cityWeatherObj.weather[0].id.toString();
  switch(true){
    case (element.startsWith('2')): //thunderstorm
    bikePoints -= 80;
    busPoints -= 10;
    break;
    case (element.startsWith('3')): //drizzle
    bikePoints -=10;
    break;
    case (element.startsWith('5')): //rain
    bikePoints -=30;
    busPoints -= 20;
    break;
    case (element.startsWith('6')): //snow
    bikePoints -= 100;
    drivePoints -= 20;
    busPoints += 20;
    break;
    case (element.startsWith('8')): //clear & cloudy
    bikePoints += 30;
    break;
    default: //includes weird weather events
    break;
  }

  console.log(bikePoints);
  console.log(busPoints);
  console.log(drivePoints);
  switch(true){
    case (bikePoints >= busPoints && bikePoints >= drivePoints):
    return 'BICYCLING';
    case (busPoints > bikePoints && busPoints >= drivePoints):
    return 'TRANSIT';
    case (drivePoints > bikePoints && drivePoints > busPoints):
    return 'DRIVING';
    default:
    return 'DRIVING';
  }
  
}

function refineWeatherObj(destination){
  console.log(weatherObj);
  for(var i=0; i<weatherObj.cnt; i++)
  {
    if(weatherObj.list[i].name.toLowerCase() === destination){
      return weatherObj.list[i];
    }
  }
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, originLatLng) {
    var origin = originLatLng;
    var office = document.getElementById('offices').value;
    var destination = getDestination(office)
    var destLatLng = destination.split(",");
    var travelMode = calculateTravelMode(office);
    directionsService.route({
        origin: origin,
        destination: new google.maps.LatLng(destLatLng[0], destLatLng[1]),
        travelMode: travelMode
    }, function(response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}
//travel preference sliders
$( function() {
    $( "#slider-bike" ).slider({
      orientation: "horizontal",
      range: "min",
      min: 0,
      max: 100,
      value: 60,
      slide: function( event, ui ) {
        $( "#bike" ).val( ui.value );
      }
    });
    $( "#bike" ).val( $( "#slider-bike" ).slider( "value" ) );
  } );

$( function() {
    $( "#slider-bus" ).slider({
      orientation: "horizontal",
      range: "min",
      min: 0,
      max: 100,
      value: 60,
      slide: function( event, ui ) {
        $( "#bus" ).val( ui.value );
      }
    });
    $( "#bus" ).val( $( "#slider-bus" ).slider( "value" ) );
  } );

$( function() {
    $( "#slider-drive" ).slider({
      orientation: "horizontal",
      range: "min",
      min: 0,
      max: 100,
      value: 60,
      slide: function( event, ui ) {
        $( "#drive" ).val( ui.value );
      }
    });
    $( "#drive" ).val( $( "#slider-drive" ).slider( "value" ) );
  } );


//Weather slideshow

var slideIndex = 0;
showSlides();

function showSlides() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) {
       slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";  
    dots[slideIndex-1].className += " active";
    setTimeout(showSlides, 7000); // Change image every 2 seconds
}


function test(){
var value = document.getElementById('milwaukeeWeather').value;
console.log(value);
}

