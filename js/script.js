'use strict';

var Locations = function () {
    this.locations = ko.observableArray([{
            title: 'BFC Brasil',
            index: 1,
            location: {
                lat: -15.758548,
                lng: -47.887668
            } 
        },
        {
            title: 'Ernesto Cafés Especiais',
            index: 2,
            location: {
                lat: -15.830661,
                lng: -47.924217
            }
        },
        {
            title: 'L\'amour du Pain',
            index: 3,
            location: {
                lat: -15.831072,
                lng: -47.924081
            }
        },
        {
            title: 'Mormaii Surf Bar',
            index: 4,
            location: {
                lat: -15.819287,
                lng: -47.833534
            }
        },
        {
            title: 'Clandestino Café e Música',
            index: 5,
            location: {
                lat: -15.747085,
                lng: -47.883648
            }
        },
        {
            title: 'Grenat Cafés Especiais',
            index: 6,
            location: {
                lat: -15.720788,
                lng: -47.886431
            }
        },
        {
            title: 'Objeto Encontrado',
            index: 7,
            location: {
                lat: -15.783208,
                lng: -47.8829
            } 
        }
    ]);
}

var ViewModel = function () {
    var self = this;

    this.getIndex = function() {
        return this.index;
    }
    this.currentLocation = ko.observable(new Locations());
    
    this.setLocation = function(clickedLocation) {
        google.maps.event.trigger(map.mapMarkers[clickedLocation.getIndex()], 'click');
    };
    
}
ko.applyBindings(new ViewModel());

var map;
// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
    // Create a styles array to use with the map.
    var styles = [{
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{
            "color": "#3f3f43"
          }]
        }, {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [{
            "color": "#8bcc99"
          }]
        }, {
          "featureType": "poi",
          "stylers": [{
            "color": "#8bcc99"
          }, {
            "lightness": -7
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{
            "color": "#8bcc99"
          }, {
            "lightness": -28
          }]
        }, {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [{
            "color": "#8bcc99"
          }, {
            "visibility": "on"
          }, {
            "lightness": -15
          }]
        }, {
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [{
            "color": "#8bcc99"
          }, {
            "lightness": -18
          }]
        }, {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#ffffff"
          }]
        }, {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [{
            "color": "#8bcc99"
          }, {
            "lightness": -34
          }]
        }, {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [{
            "visibility": "on"
          }, {
            "color": "#333739"
          }, {
            "weight": 0.8
          }]
        }, {
          "featureType": "poi.park",
          "stylers": [{
            "color": "#2ecc71"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#333739"
          }, {
            "weight": 0.3
          }, {
            "lightness": 10
          }]
    }];
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -15.794229,
            lng: -47.882166
        },
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });
    var locations = [{
            title: 'BFC Brasil',
            location: {
                lat: -15.758548,
                lng: -47.887668
            } 
        },
        {
            title: 'Ernesto Cafés Especiais',
            location: {
                lat: -15.830661,
                lng: -47.924217
            }
        },
        {
            title: 'L\'amour du Pain',
            location: {
                lat: -15.831072,
                lng: -47.924081
            }
        },
        {
            title: 'Mormaii Surf Bar',
            location: {
                lat: -15.819287,
                lng: -47.833534
            }
        },
        {
            title: 'Clandestino Café e Música',
            location: {
                lat: -15.747085,
                lng: -47.883648
            }
        },
        {
            title: 'Grenat Cafés Especiais',
            location: {
                lat: -15.720788,
                lng: -47.886431
            }
        },
        {
            title: 'Objeto Encontrado',
            location: {
                lat: -15.783208,
                lng: -47.8829
            } 
        }
    ];
    var largeInfowindow = new google.maps.InfoWindow();
    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('525454');
    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('8bcc99');
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function () {
            populateInfoWindow(this, largeInfowindow);
        });

        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function () {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function () {
            this.setIcon(defaultIcon);
        });
    }
    showListings();
}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.title + '</div>' +
                    '<div>No Street View Found</div>');
            }
        }
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}
// This function will loop through the markers array and display them all.
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}
