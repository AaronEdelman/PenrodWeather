//Travel Directions

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
function getDestination(){
    var office = document.getElementById('offices').value;
    var destinationLatLng;
    switch(office){
        case 'milwaukee':
        destinationLatLng = '(43.0332535, -87.9061252)';
        break;
        case 'minneapolis':
        destinationLatLng = '(44.9762798, -93.2687264)';
        break;
        case 'dallas':
        destinationLatLng = '(32.8090935, -96.8079239)';
        break;
        case 'chicago':
        destinationLatLng = '(41.8925451, -87.6367606)';
        break;
        return destinationLatLng;
    }
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
function calculateAndDisplayRoute(directionsService, directionsDisplay, originLatLng) {
    var origin = originLatLng;
    var destination = document.getElementById('offices').value;
    var destLatLng = destination.split(",");
    directionsService.route({
        origin: origin,
        destination: new google.maps.LatLng(destLatLng[0], destLatLng[1]),
        travelMode: 'DRIVING'
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
      orientation: "vertical",
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
      orientation: "vertical",
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
      orientation: "vertical",
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
