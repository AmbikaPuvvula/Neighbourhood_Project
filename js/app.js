/** The model for app. These are the coworking spaces listings that will
be shown to the user.*/

var initialSpaces = [
{
  "name": "PVP Square",
  "location": {"lat": 16.5025566, "lng": 80.6403823},
  "fs_id": "525c0126498e205d5a3279fb"
},
{
  "name": "Trendset Mall",
  "location": {"lat": 16.4984547, "lng": 80.651595},
  "fs_id": "562e3b2d498eab12f75a319d"
}, 
{
  "name": "Great India Place Noida",
  "location": {"lat": 28.5675497, "lng": 77.3239723},
  "fs_id": "4cab04a614c33704cb89e63b"
},
{
  "name": "Shoppers Stop",
  "location": {"lat": 16.502682, "lng": 80.6574173},
  "fs_id": "4e2148bfaeb70263952e69e6"
},
{
  "name": "Mantri Square Mall",
  "location": {"lat": 12.9916354, "lng": 77.5689832},
  "fs_id": "4b8d02aff964a52035e432e3"
},
{
  "name": "Phoenix Market City ",
  "location": {"lat": 12.9915494, "lng": 80.2147014},
  "fs_id": "4fe16257e4b0e4cc311bb9ab" 
},
{
  "name": "Inorbit Mall",
  "location": {"lat": 17.4343744, "lng": 78.38442},
  "fs_id": "4ba0debcf964a520768337e3"
},
{
  "name": "Central Plaza",
  "location": {"lat": 16.2978236, "lng": 80.4438244},
  "fs_id": "519a3a3b498ec7ed19b68cf9"
},
{
  "name": "City Center Mall",
  "location": {"lat": 17.4151161, "lng": 78.4468153},
  "fs_id": "4b645c79f964a52048ad2ae3"
},
{
  "name": "CMR Central Mall",
  "location": {"lat": 17.7340781, "lng": 83.315904},
  "fs_id": "4c23551434faef3b70d3586d"
},

{
  "name": "Phoenix Marketcity",
  "location": {"lat": 19.0862817, "lng": 72.8866136},
  "fs_id": "4fdc371de4b0d263e76875e6"
},
{
  "name": "Lulu International Shopping Mall",
  "location": {"lat": 10.0261258, "lng": 76.3048764},
  "fs_id": "4c892ca2a0ffb60ce24b28c5"
},

]

// Foursquare API Url parameters in global scope
var BaseUrl = "https://api.foursquare.com/v2/venues/",
    fsClient_id = "client_id=FYVKDRW0BZBT041LAQ3KGKKXPINGTP0OSSYTXVCBXNYHVIX1",
    fsClient_secret = "&client_secret=MNQD53EW42NWLHMIF20CZLVSER21H1DPZQMTIC2MCGUG2ZUF",
    fsVersion = "&v=20193001";


// Create global variables to use in google maps
var map,
  infowindow,
  bounds;

//googleSuccess() is called when page is loaded
function googleSuccess() {
  "use strict";

  //Google map elements - set custom map marker
  var image = {
    "url": "img/32x32.png",
    // This marker is 32 pixels wide by 32 pixels high.
    "size": new google.maps.Size(32, 32),
    // The origin for this image is (0, 0).
    "origin": new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    "anchor": new google.maps.Point(0, 32)
  };

  //Google map elements - set map options
  var mapOptions = { 
    "center": {
      "lat": 16.440409,
      "lng": 76.2384302
    },
    zoom: 6,
    styles: [
    {
      "featureType": "landscape",
      "stylers": [ 
        { "hue": "#FFBB00"},
        {"saturation": 43.400000000000006},
        {"lightness": 37.599999999999994},
        {"gamma": 1}
      ]
    },{
      "featureType": "road.highway",
      "stylers": [
        {"hue": "#FFC200"},
        {"saturation": -61.8},
        {"lightness": 45.599999999999994},
        {"gamma": 1}
      ]
    },{
      "featureType": "road.arterial",
      "stylers": [
        {"hue": "#FF0300"},
        {"saturation": -100},
        {"lightness": 51.19999999999999},
        {"gamma": 1}
      ]
    },{
      "featureType": "road.local",
      "stylers": [
        {"hue": "#FF0300"},
        {"saturation": -100},
        {"lightness": 52},
        {"gamma": 1}
      ]
    },{
      "featureType": "water",
      "stylers": [
        {"hue": "#0078FF"},
        {"saturation": -13.200000000000003},
        {"lightness": 2.4000000000000057},
        {"gamma": 1}
      ]
    },{
      "featureType": "poi",
      "stylers": [
        {"visibility": "off"}
      ]
    }],
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    mapTypeControlOptions: {
    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    }
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  infowindow = new google.maps.InfoWindow({
    maxWidth: 150,
    content: ""
  });
  bounds = new google.maps.LatLngBounds(); 

  // Close infowindow when clicked elsewhere on the map
  map.addListener("click", function(){
    infowindow.close(infowindow);
  }); 

  // Recenter map upon window resize
  window.onresize = function () {
    map.fitBounds(bounds);
  };


  //Creating Space object
  var Space = function (data, id, map) {
    var self = this;
    this.name = ko.observable(data.name);
    this.location = data.location;
    this.marker = "";
    this.markerId = id;
    this.fs_id = data.fs_id;
    this.shortUrl = "";
    this.photoUrl = "";
  }

  // Get contect infowindows
  function getContent(space) {
    var contentString = "<h3>" + space.name +
      "</h3><br><div style='width:200px;min-height:120px'><img src=" + '"' +
      space.photoUrl + '"></div><div><a href="' + space.shortUrl +
      '" target="_blank">More info in Foursquare</a><img src="img/Foursquare_150.png">';
    var errorString = "Oops, Foursquare content not available."
    if (space.name.length > 0) {
      return contentString;
      } else {
      return errorString;
      }
  }

  // Bounce effect on marker
  function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
        marker.setAnimation(null);
      }, 700);
    }
  };

 function ViewModel() {
    var self = this;

    // Nav button control
    this.isNavClosed = ko.observable(false);
    this.navClick = function () {
      this.isNavClosed(!this.isNavClosed());
    };

    // Creating list elements from the spaceList
    this.spaceList = ko.observableArray();
    initialSpaces.forEach(function(item){
      self.spaceList.push(new Space(item));
    });

    // Create a marker per space item
    this.spaceList().forEach(function(space) {
      var marker = new google.maps.Marker({
        map: map,
        position: space.location,
        icon: image,
        animation: google.maps.Animation.DROP
      });
      space.marker = marker;
      // Extend the boundaries of the map for each marker
      bounds.extend(marker.position);
      // Create an onclick event to open an infowindow and bounce the marker at each marker
      marker.addListener("click", function(e) {
        map.panTo(this.position);
        //pan down infowindow by 200px to keep whole infowindow on screen
        map.panBy(0, -200)
        infowindow.setContent(getContent(space));
        infowindow.open(map, marker);
        toggleBounce(marker);
    });
  });

    // Foursquare API request
    self.getFoursquareData = ko.computed(function(){
      self.spaceList().forEach(function(space) {

        // Set initail variables to build the correct URL for each space
        var  venueId = space.fs_id + "/?";
        var foursquareUrl = BaseUrl + venueId + fsClient_id + fsClient_secret + fsVersion;

        // AJAX call to Foursquare
        $.ajax({
          type: "GET",
          url: foursquareUrl,
          dataType: "json",
          cache: false,
          success: function(data) {
            var response = data.response ? data.response : "";
            var venue = response.venue ? data.venue : "";
                space.name = response.venue["name"];
                space.shortUrl = response.venue["shortUrl"];
                space.photoUrl = response.venue.bestPhoto["prefix"] + "height150" +
                response.venue.bestPhoto["suffix"];
          }
        });
      });
    });

    // Creating click for the list item
    this.itemClick = function (space) {
      var markerId = space.markerId;
      google.maps.event.trigger(space.marker, "click");
    }

    // Filtering the Space list
    self.filter = ko.observable("");

    this.filteredSpaceList = ko.dependentObservable(function() {
      var q = this.filter().toLowerCase();
      //var self = this;
      if (!q) {
      // Return self.spaceList() the original array;
      return ko.utils.arrayFilter(self.spaceList(), function(item) {
        item.marker.setVisible(true);
        return true;
      });
      } else {
        return ko.utils.arrayFilter(this.spaceList(), function(item) {
          if (item.name.toLowerCase().indexOf(q) >= 0) {
          return true;
          } else {
            item.marker.setVisible(false);
          return false;
          }
        });
      }
    }, this);
  };

 // Activates knockout.js
ko.applyBindings(new ViewModel());
}