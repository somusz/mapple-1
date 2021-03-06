//----------------------------------------------------------------------------
// these functions compile the maps on the main page that have the most favors

// helper function for sorting maps from the database by the number of favors

function sortByFavor (maps) {
  return maps.sort( function (a, b) {
    return b.fav_count - a.fav_count;
  })
};

// appending linked image files to the pre-set container
function addFavoriteMap(map, index) {
  $(`#map${index}`).append(
    `<a href="https://localhost:8080/map/${map.map_id}"><img src="${map.map_image}" alt="${map.map_name}"></a>`
    )
}

// sorts data by favors, gets the top 3, loops over them
function compileFavoredMaps (data) {
  sortByFavor(data.mapData).slice(0,2).forEach( function (map, index) {
    addFavoriteMap(map, index);
  })
}

//-------------------------------------------------------------------------------
// these functions compile the maps ordered by time of the last update

// helper function for sorting maps from the database by the time of last update
function sortByLastUpdate (maps) {
  return maps.sort( function (a, b) {
    return b.map_last_updated - a.map_last_updated;
  })
}

function addRecentMap(map) {
  $('#recent-maps-container').append(
    `<div class="col-md-4">
      <div>
        <a href="https://localhost:8080/map/${map.map_id}"><img src="${map.map_image}" alt="${map.map_name}"></a>
      </div>
    </div>`
    )
}

function compileRecentMaps (data) {
  sortByLastUpdate(data.mapData).forEach( function (map) {
    addRecentMap(map);
  })
}

//-------------------------------------------------------------------------------
// these functions compile a map with markers/pins

//adds markers to the map, and infowindows to the markers
var addMarkersToMap = function(newMap, pins) {

  pins.forEach( function(pin) {

    var marker = {
        coords: { lat: pin.pin_latitude,
                  lng: pin.pin_longitude },
        name:          pin.pin_name,
        description:   pin.pin_description,
        image:         pin.pin_image
      }

    var newMarker = new google.maps.Marker({
      position: marker.coords,
      map: newMap
    })

    var infowindow = new google.maps.InfoWindow({
      content:
        `<h3>${marker.name || 'Missing pin name'}</h3><br>
        <p>${marker.description || 'Missing pin description'}</p><br>
        <img src="${marker.image}">`
    })

    marker.addListener('click', function () {
      infowindow.open(newMap, newMarker);
    })
  })
}

//creates a new google map instance
function createNewMap(map, callback, pins) {
  var newMap = new google.maps.Map(document.getElementById("single-map"), {
    center: {
      lat: Number(map.map_latitude),
      lng: Number(map.map_longitude)
    },
    zoom: 8 //arbitrarily selected default value based on Google's zoom level options
  })

  callback(newMap, pins);
}

//separates the pins data from the maps data
//and calls the map generator function
function compileSingleMap (data) {
  var map = data.mapData;
  var pins = data.pinData;
  createNewMap(map, addMarkersToMap, pins);
}



//-------------------------------------------------------------------------------
//defines the initMap callback function that is called by the google api
//applies different ajax requests to each route to collect applicable data
function initMap() {

  var path = location.pathname;

  if (path.match('/maps/')) {
        console.log('we got here /maps/')
    $(function () {
      $.ajax({
        method: "GET",
        url: "/maps/:map_id"
      }).done( function (mapData) {
        compileSingleMap(mapData);
      })
    })
  }

  else if (path.match('/maps/$')) {
    $(function () {
      $.ajax({
        method: "GET",
        url: "/maps/"
      }).done( function (maps) {
        console.log(maps);
      })
    })
  }

  else if (path.match('/users/')) {
    $(function () {
      $.ajax({
        method: "GET",
        url: "/users/:id"
      }).done( function (maps) {
        console.log(maps);
      })
    })
  }
}





