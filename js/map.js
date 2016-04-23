  var markers = [];
  var map;
  var riverLength;
  var unsuitable=[];

  function loadJson(){
    $.getJSON('./data/unimpounded.json',function(data){
      riverLength=data;
    }).done(function(){
      var array=['Indiana_2','Michigan_3','Wisconsin_2','Wisconsin_3']; 
      for(var key in array){
        $.getJSON('./data/test/'+array[key]+'.json',function(data){
          var place=data['place_name'],total=data['temperature_sum'],latlng=data['place_location'];
          console.log("fuck");
          console.log(latlng);
          for(var key in data['place_data']){
            var today=data['place_data'][key];
          }
          var temp=today.avg_temperature,veloc=today.avg_veloc,d=today.d_value;
          markers.push({
            place:place,
            total:total,
            temp:temp,
            veloc:veloc,
            d:d,
            center:{lat:latlng.lat,lng:latlng.long},
          });
        }).done(function(){
          check();
        })
      }
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
          if(markers[key].d[item]<riverLength[index].length && markers[key].temp>16 && markers[key].total>=650 && markers[key].total<900){
            console.log(key+":"+markers[key].center);
            if(markers[key].veloc<0.7) size=1;
            else size = 2;
            unsuitable.push({
              name:item,
              size:size,
              type:type,
              center:markers[key].center,
              temp:markers[key].temp,
              total:markers[key].total,
              place:riverLength[index].name,
              veloc:markers[key].veloc
            })
          }
          else if(markers[key].d[item]<riverLength[index].length && markers[key].temp>16 && markers[key].total>=900){
            if(markers[key].veloc<0.7) size=3;
            else size=4;
            unsuitable.push({
              name:item,
              size:size,
              type:type,
              center:markers[key].center,
              temp:markers[key].temp,
              total:markers[key].total,
              place:riverLength[index].name,
              veloc:markers[key].veloc,
              d:markers[key].d[item]
            })
          }
        }
      }
    }
    initMap();
  }
  function clearMarkers() {
    for (var index in markers)
      markers[index].setMap(null);
    markers = [];
  }

  function initMap() {
  // Create a map object and specify the DOM element for display.
    var myLatLng = {lat: 45.3122301, lng: -84.320539};
    var options={
      center: myLatLng,
      zoom: 6,
      scrollwheel: true,
      zoomControl: true,
      streetViewControl: false,
      panControl: true,
      draggable: true,
      disableDoubleClickZoom:true,
      mapTypeControl:false,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]
    };
    map = new google.maps.Map($("#map")[0],options);
    //clearMarkers();
    var infowindow = new google.maps.InfoWindow();
    // Construct the circle for each value in citymap.
    // Note: We scale the area of the circle based on the population.
        console.log("un:");

    console.log(unsuitable);
    for (var index in unsuitable) {
      // Add the circle for this city to the map.
      switch(unsuitable[index].size){
        case 1:
          var population=5058;  break;
        case 2:
          var population=6030; break;
        case 3:
          var population=27485;  break;
        case 4:
          var population=80583;  break;
      }

      switch(unsuitable[index].type){
        case 1:
          var color='#FF0000'; type='Idella';  break;
        case 2:
          var color='#84C318'; type='Idella(2)'; break;
        case 3:
          var color='#F6AE2D'; type='Molitrix'; break;
        case 4:
          var color='#BA2C73'; type='Molitrix(2)'; break;
        case 5:
          var color='#F26419'; type='Piceus'; break;
      }
      var cityCircle = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35,
        map: map,
        center: unsuitable[index].center,
        position:unsuitable[index].center,
        radius: Math.sqrt(population) * 100,
      });
      cityCircle.setValues({
        temp:unsuitable[index].temp,
        place:unsuitable[index].place,
        total:unsuitable[index].total,
        veloc:unsuitable[index].veloc,
        type:type,
        d:unsuitable[index].d
      })
      google.maps.event.addListener(cityCircle, 'mouseover', function () {
          var contentString = $('<div class="detail"><a href="./view/list.html?type='+this.type+'&place='+this.place+'&veloc='+this.veloc+'&temp='+this.temp+'&total='+this.total+'&d='+this.d+'">'+this.type+'</a></div>');
          infowindow.setContent(contentString[0]);
          infowindow.setPosition(unsuitable[index].center);
          infowindow.open(map, this);
      });
    }
   
  }//initMap
