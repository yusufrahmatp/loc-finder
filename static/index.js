// 
// MAP
//

// Initialize Map
var map;
var index = 0;
var curr_marker = null;
var markers = [];
var paths = [];
var adjacencyMatrix = [];
var distanceMatrix = [];
var markerList = $("#markerList");
var pathList = $("#pathList");
var startSelect = $("#startSelect");
var endSelect = $("#endSelect");

function initMap() {
	var itb = {lat: -6.890369, lng: 107.610368};

    map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: itb,
          styles: [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
]
        }); 

	map.addListener('click', function(event) {
		addMarker(event.latLng, map)
	});
}



//
// MARKER & PATH
//

//Label for marker
function getUniqueLabel() {
	return (index++);		
}

// Add marker
function addMarker(location, map) {

	var marker_label = getUniqueLabel();

	var marker = new google.maps.Marker({
		position: location,
		label: marker_label.toString(),
		map: map
		});
	markers.push({
		marker: marker,
		data: {
			position: marker['position'],
			label: marker_label
		}
	});

	//Update marker list
	updateMarkerList();
	updateSelect();

	//Listener for path creation
	marker.addListener('click', function() {
		addPath(marker);
	});
}

//Remove all marker
function removeMarkers() {
	for (var i = 0; i < markers.length; i++) {
	  markers[i]['marker'].setMap(null);
	}
	markers = [];
	index = 0;
}

//Add path
function addPath(marker) {
	if (curr_marker == null) {
		curr_marker = marker;
		toggleBounce(marker);
	}
	else if (curr_marker == marker) {
		curr_marker = null;
		disableAnimation();
	}
	else {
		disableAnimation();

		if (!checkPath(curr_marker, marker)) {
			var path = new google.maps.Polyline({
	          path: [curr_marker['position'], marker['position']],
	          strokeColor: '#FF0000',
	          strokeOpacity: 1.0,
	          strokeWeight: 2
	        });
	        path.setMap(map);

	        paths.push({
	        	path: path,
	        	data: {
	        		first: curr_marker['label'],
	        		second: marker['label']
	        	}
	        });

	        //Update path list
	        updatePathList();
	    }
	    else {
	    	alert("Path already selected!");
	    }

        curr_marker = null;
	}
}

//Check if path exist
function checkPath(first, second) {
	for (var i = 0; i < paths.length; i++) {
		if (((paths[i]['data']['first'] == first['label'] && paths[i]['data']['second'] == second['label'])) ||
			((paths[i]['data']['first'] == second['label'] && paths[i]['data']['second'] == first['label']))) {
				return true;
		}
	}
	return false;
}

//Remove all paths
function removePaths() {
	for (var i = 0; i < paths.length; i++) {
		paths[i]['path'].setMap(null);
	}
  paths = [];
  curr_marker = null;
}

//
// LISTENER
//

//Reset all
$('#resetButton').on('click', function() {
  removeMarkers();
  removePaths();
  removeMarkerList();
  removePathList();
  removeSelect();
});

// Submit data
$('#submitButton').on('click', function() {
  createMatrix();
  createJSON();

  $.ajax ({
    url: '/submit',
    data: createJSON(),
    type: 'POST',
    success: function(result) {

    },
    error: function(error) {
      alert("Error "+error);
    }
  });
});

//
// DISTANCE AND POST
//

//Calculate distance
function getDistance(latLng_1, latLng_2) {
  return google.maps.geometry.spherical.computeDistanceBetween(latLng_1,latLng_2);
}

//Create matrix for transport
function createMatrix() {
  distanceMatrix = [];
  adjacencyMatrix = [];
  //Distance Matrix and initialize Adjacency Matrix
  for (var i = 0; i < markers.length; i++) {
    var row = [];
    var row_init = [];
    for (var j = 0; j < markers.length; j++) {
      row.push(getDistance(markers[i]['data']['position'], markers[j]['data']['position']));
      row_init.push(0);
    }
    distanceMatrix.push(row);
    adjacencyMatrix.push(row_init);
  }

  //Adjacency matrix
  for (var i = 0; i < paths.length; i++) {
    adjacencyMatrix[parseInt(paths[i]['data']['first'])][parseInt(paths[i]['data']['second'])] = 1;
    adjacencyMatrix[parseInt(paths[i]['data']['second'])][parseInt(paths[i]['data']['first'])] = 1;

    console.log(adjacencyMatrix);
    console.log(distanceMatrix);
  }
}

function createJSON() {
  return JSON.stringify ({
    adjacency: adjacencyMatrix,
    distance: distanceMatrix,
    start: $(startSelect).val(),
    end: $(endSelect).val()
  });
}

//
// MISC
//

//Animation
function toggleBounce(marker) {
	marker.setAnimation(google.maps.Animation.BOUNCE);
}

function disableAnimation() {
	for (var i = 0; i < markers.length; i++) {
		markers[i]['marker'].setAnimation(null);
	}
}

//Select start and end points
function updateSelect() {
	startSelect.empty();
	endSelect.empty();

	for (var i = 0; i < markers.length; i++) {
		$(startSelect).append($("<option></option>")
                    .attr("value", markers[i]['data']['label'])
                    .text(markers[i]['data']['label'].toString()));
		$(endSelect).append($("<option></option>")
                    .attr("value", markers[i]['data']['label'])
                    .text(markers[i]['data']['label'].toString()));
	}
}

function removeSelect() {
  startSelect.empty();
  endSelect.empty();
}

//Print path & marker (update & remove)
function updateMarkerList() {
	markerList.empty();
	for(var i = 0; i < markers.length; i++) {
		$( "<li>"+markers[i]['data']['label']+": ("+markers[i]['marker'].getPosition().lat().toFixed(5)+", "
			+markers[i]['marker'].getPosition().lng().toFixed(5)+")"+"</li>" ).appendTo(markerList);
	}
}

function removeMarkerList() {
  markerList.empty();
}

function updatePathList() {
	pathList.empty();
	for(var i = 0; i < paths.length; i++) {
		$( "<li>"+paths[i]['data']['first']+" <--> "+paths[i]['data']['second']+"</li>" ).appendTo(pathList);
	}
}

function removePathList() {
  pathList.empty();
}

