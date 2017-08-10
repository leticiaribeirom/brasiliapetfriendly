var CLIENT_ID='OR2AOSJBF1TWD1XGBXKVJ5Y4E25JG4LMF12YM3NQYQ44EQZ0';
var CLIENT_SECRET='YALRHHXRLZAUMAUV0O30NRSKKPMR20GWL0RO5OXGIXWSDNNA';

var config = {
    apiUrl: 'https://api.foursquare.com/v2/venues/'
  };

var foursquareVenueUrl = apiUrl + 'search?ll=' + cityStr + '&format=json&callback=wikiCallback';
    var foursquareVenueRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: foursquareVenueUrl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function( response ) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};