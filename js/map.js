  var markers = [];
  var map;
  var riverLength;
  var unsuitable=[];
  function loadJson(){
    $.getJSON('./data/unimpounded.json',function(data){
      riverLength=data;
    }).done(function(){
      $.getJSON('../data/test.json',function(data){
        var place=data['place_name'],total=data['temperature_sum'];
        for(var key in data['place_data'])
          var today=data['place_data'][key];
        var temp=today.avg_temperature,veloc=today.avg_veloc,d=today.d_value;
        markers.push({
          place:place,
          total:total,
          temp:temp,
          veloc:veloc,
          d:d,
          center:{lat:0,lng:0},
          GDD:1,
          type:3
        });
      }).done(function(){
        check();
        initMap();
      })
    });
  }
  function check(){
    for(var key in markers){
      for(var item in markers[key].d){
        for(var index in riverLength){
          switch(item){
            case 'C_idella': type=1;break;
            case 'C_idella2': type=2;break;
            case 'H.molitrix': type=3;break;
            case 'H.molitrix2': type=4;break;
            case 'M.piceus': type=5;break;
          }
          if(markers[key][item]<riverLength && markers[key].temp>17 && markers[key].total>=650 && markers[key].total<900){
            if(markers[key].veloc<0.7) size=1;
            else size = 2;
          }
          else if(markers[key][item]<riverLength && markers[key].temp>17 && markers[key].total>=900){
            if(markers[key].veloc<0.7) size=3;
            else size=4;
          }
        }
      }
    }
  }
  function clearMarkers() {
    for (var index in markers)
      markers[index].setMap(null);
    markers = [];
  }

  function initMap() {
    console.log(riverLength);
  // Create a map object and specify the DOM element for display.
    var myLatLng = {lat: 45.3122301, lng: -84.320539};
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
      styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]
    };
    map = new google.maps.Map($("#map")[0],options);
    // var markers = {
    //   chicago: {
    //     center: {lat: 47.3122301, lng: -87.320539},
    //     GDD: 1, type:1,
    //   },
    //   newyork: {
    //     center: {lat: 46.3122301, lng: -81.320539},
    //     GDD: 2, type:3,
    //   },
    //   losangeles: {
    //     center: {lat: 42.3122301, lng: -86.320539},
    //     GDD: 2, type:2,
    //   },
    //   vancouver: {
    //     center: {lat: 44.3122301, lng: -82.320539},
    //     GDD: 3, type:4,
    //   },
    //   vancouvDer: {
    //     center: {lat: 43.3122301, lng: -87.320539},
    //     GDD: 4, type:5,
    //   }
    // };
    //clearMarkers();
    var infowindow = new google.maps.InfoWindow();
    // Construct the circle for each value in citymap.
    // Note: We scale the area of the circle based on the population.
    for (var index in markers) {
      console.log(markers[index]);
      // Add the circle for this city to the map.
      switch(markers[index].GDD){
        case 1:
          var population=50583;  break;
        case 2:
          var population=60350; break;
        case 3:
          var population=271485;  break;
        case 4:
          var population=840583;  break;
      }

      switch(markers[index].type){
        case 1:
          var color='#FF0000';  break;
        case 2:
          var color='#84C318';  break;
        case 3:
          var color='#F6AE2D';  break;
        case 4:
          var color='#BA2C73';  break;
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
      google.maps.event.addListener(cityCircle, 'mouseover', function () {
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
