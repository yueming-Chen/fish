var neighborhoods = [
  {lat: 52.511, lng: 13.447},
  {lat: 52.549, lng: 13.422},
  {lat: 52.497, lng: 13.396},
  {lat: 52.517, lng: 13.394}
];

var markers = [];
var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 52.520, lng: 13.410}
  });
  clearMarkers();
  for (var i = 0; i < neighborhoods.length; i++) {
    markers.push(new google.maps.Marker({
      position: neighborhoods[i],
      map: map,
      animation: google.maps.Animation.DROP
    }));
  }
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}