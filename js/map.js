var markers = [];
  var map;

  function initMap() {
  // Create a map object and specify the DOM element for display.
    var myLatLng = {lat: 45.3122301, lng: -84.320539};
    var image = 'img/club_GPS_icon.png';
    var options={
      center: myLatLng,
      zoom: 6,
      scrollwheel: false,
      zoomControl: false,
      streetViewControl: false,
      panControl: false,
      draggable: false,
      disableDoubleClickZoom:true,
      mapTypeControl:false,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
    };
    map = new google.maps.Map($("#map")[0],options);

    var markers = {
      chicago: {
        center: {lat: 47.3122301, lng: -87.320539},
        GDD: 1, type:1,
      },
      newyork: {
        center: {lat: 46.3122301, lng: -81.320539},
        GDD: 2, type:3,
      },
      losangeles: {
        center: {lat: 42.3122301, lng: -86.320539},
        GDD: 2, type:2,
      },
      vancouver: {
        center: {lat: 44.3122301, lng: -82.320539},
        GDD: 3, type:4,
      },
      vancouvDer: {
        center: {lat: 43.3122301, lng: -87.320539},
        GDD: 4, type:5,
      }
    };
    clearMarkers();
    var infowindow = new google.maps.InfoWindow();
    // Construct the circle for each value in citymap.
    // Note: We scale the area of the circle based on the population.
    for (var index in markers) {
      // Add the circle for this city to the map.
      switch(markers[index].GDD){
        case 1:
          var population=60350; break;
        case 2:
          var population=271485;  break;
        case 3:
          var population=840583;  break;
        case 4:
          var population=50583;  break;
      }

      switch(markers[index].type){
        case 1:
          var color='#FF0000';  break;
        case 2:
          var color='#335C67';  break;
        case 3:
          var color='#F6AE2D';  break;
        case 4:
          var color='#00B9AE';  break;
        case 5:
          var color='#F26419';  break;
      }
      var cityCircle = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35,
        map: map,
        center: markers[index].center,
        position:markers[index].center,
        radius: Math.sqrt(population) * 100,
      });
      cityCircle.setValues({
        temp:35.5*Math.random()
      })
      google.maps.event.addListener(cityCircle, 'click', function () {
          var contentString = $('<div class="detail">'+this.temp+'</div>');
          infowindow.setContent(contentString[0]);
          infowindow.setPosition(markers[index].center);
          infowindow.open(map, this);
      });
    }
    
    // var neighborhoods = [
    //   {lat: 46.3122301, lng: -87.320539},
    //   {lat: 43.3122301, lng: -81.320539},
    //   {lat: 42.3122301, lng: -85.320539},
    //   {lat: 48.3122301, lng: -79.320539}
    // ];

    //  // To add the marker to the map, call setMap();
    // for (var i = 0; i < neighborhoods.length; i++) {
    //   markers.push(new google.maps.Marker({
    //     position: neighborhoods[i],
    //     map: map,
    //     animation: google.maps.Animation.DROP
    //   }));
    // }
   
  }//initMap

  function clearMarkers() {
    for (var index in markers)
      markers[index].setMap(null);
    markers = [];
  }