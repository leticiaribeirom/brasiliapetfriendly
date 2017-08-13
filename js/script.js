var CLIENT_ID = 'OR2AOSJBF1TWD1XGBXKVJ5Y4E25JG4LMF12YM3NQYQ44EQZ0';
var CLIENT_SECRET = 'YALRHHXRLZAUMAUV0O30NRSKKPMR20GWL0RO5OXGIXWSDNNA';

var foursquareConfig = {
    apiUrl: 'https://api.foursquare.com/v2/venues/'
};

var isFoursquareReady = false;
var map;
var markers = [];
var ko;
var google;

var LocationsModel = function () {
    this.locations = ko.observableArray([{
            title: 'BFC Brasil',
            index: 0,
            location: {
                lat: -15.758548,
                lng: -47.887668
            }
        },
        {
            title: 'Ernesto Cafés Especiais',
            index: 1,
            location: {
                lat: -15.830661,
                lng: -47.924217
            }
        },
        {
            title: 'L\'amour du Pain',
            index: 2,
            location: {
                lat: -15.831072,
                lng: -47.924081
            }
        },
        {
            title: 'Mormaii Surf Bar',
            index: 3,
            location: {
                lat: -15.819287,
                lng: -47.833534
            }
        },
        {
            title: 'Clandestino Café e Música',
            index: 4,
            location: {
                lat: -15.747085,
                lng: -47.883648
            }
        },
        {
            title: 'Grenat Cafés Especiais',
            index: 5,
            location: {
                lat: -15.720788,
                lng: -47.886431
            }
        },
        {
            title: 'Objeto Encontrado',
            index: 6,
            location: {
                lat: -15.783208,
                lng: -47.8829
            }
        }
    ]);

};

var ViewModel = function () {
    var self = this;

    this.getIndex = function () {
        return this.index;
    };
    this.currentLocation = ko.observable(new LocationsModel());

    this.setLocation = function (clickedLocation) {
        google.maps.event.trigger(markers[clickedLocation.index], 'click');
    };
    this.filter = ko.observable('');

    this.filterPlaces = ko.computed(function () {
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];
            if (marker.title.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1) {
                marker.setVisible(true);
            } else {
                marker.setVisible(false);
            }
        }
        return this.currentLocation().locations().filter(function (location) {
            if (!self.filter() || location.title.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1) {
                return location;
            }
        });
    }, this);
};

ko.applyBindings(new ViewModel());

function initMap() {
    // Creates a styles array to use with the map.
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
    var largeInfowindow = new google.maps.InfoWindow();
    // this is styling the marker color
    var defaultIcon = makeMarkerIcon('525454');
    // this is a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('8bcc99');
    // The following group uses the location array to create an array of markers on initialize.
    var markerLocation = new LocationsModel();
    var onClickMarker = function () {
        populateInfoWindow(this, largeInfowindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        stopAnimation(this);
    };
    var onMouseOver = function () {
        this.setIcon(highlightedIcon);
    };
    var onMouseOut = function () {
        this.setIcon(defaultIcon);
    };
    for (var i = 0; i < markerLocation.locations().length; i++) {
        // Get the position from the location array.
        var position = markerLocation.locations()[i].location;
        var title = markerLocation.locations()[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            icon: defaultIcon,
            id: i
        });
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', onClickMarker);
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', onMouseOver);
        marker.addListener('mouseout', onMouseOut);

        markers.push(marker);
    }
    showListings();
}

function onMapError() {
    alert("Error on requesting the map from Google Maps API. We apologize for the inconvenience");
}

function stopAnimation(marker) {
    setTimeout(function () {
        marker.setAnimation(null);
    }, 700);
}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
        var foursquareVenueUrl = foursquareConfig.apiUrl + 'search?ll=' + marker.getPosition().lat() + ',' +
            marker.getPosition().lng() + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20170101&m=foursquare';

        $.ajax({
            url: foursquareVenueUrl,
            success: function (result) {
                var venueId = result.response.venues[0].id;
                var venueAddress = result.response.venues[0].location.address;
                var tipsUrl = foursquareConfig.apiUrl + venueId + '/tips?sort=popular' + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20170101&m=foursquare';
                $.ajax({
                    url: tipsUrl,
                    success: function (data) {
                        isFoursquareReady = true;
                        var tipsResponse = data.response.tips.items;
                        var content = '<div class="marker-title">' + marker.title + '</div><div id="address">' + venueAddress + '</div>';
                        for (var index = 0; index < tipsResponse.length && index < 30; index++) {
                            var tipsText = tipsResponse[index].text;
                            content += '<div id="tips">"' + tipsText + '"</div>';
                        }
                        infowindow.setContent(content);
                    },
                    error: function (result) {
                        infowindow.setContent('<div class="marker-title">' + marker.title + '</div><div id="address">' + venueAddress + '</div><div>An error has occurred while requesting Foursquare Tips.</div>');
                    }
                });
            },
            error: function (result) {
                infowindow.setContent('<div>' + marker.title + '</div>' +
                    '<div>An error has occurred while requesting Foursquare Venues.</div>');
            }
        });
        infowindow.open(map, marker);
        return false;
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
    google.maps.event.addDomListener(window, "resize", function () {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
        map.fitBounds(bounds);
    });
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

var isActive = false;

$('.js-menu').on('click', function () {
    if (isActive) {
        $(this).removeClass('active');
        $('body').removeClass('menu-open');
    } else {
        $(this).addClass('active');
        $('body').addClass('menu-open');
    }

    isActive = !isActive;
});