// Global Variables
var map, clientID, clientSecret;

// Knockout ViewModel
function AppViewModel() {
	var self = this;
	// Set Markers
	this.markers = [];
	// Set search bar to empty
	this.searchItem = ko.observable('');

	// Get data to InfoWindow
	this.populateInfoWindow = function(marker, infowindow) {
		if (infowindow != marker) {
			infowindow.setContent('');
			// get Marker
			infowindow.marker = marker;

			// Foursquare API data
			clientID = '3OYPLDHQ0EOQMDOLMYU4DH41AYGMD1E5DMUISJXXSTHDEJ1L';
			clientSecret = 'C4ELZ3T1V0IALPREYALOB1GLWV2EXIBYGTSMKS13YVVCX3BF';
			var url = 'https://api.foursquare.com/v2/venues/search?ll=' + marker.lat + ',' + marker.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&query=' + marker.title + '&v=20170708' + '&m=foursquare';

			// Get JSON result from url and put on variables
			$.getJSON(url).done(function(marker) {
				var response = marker.response.venues[0];
				self.street = response.location.formattedAddress[0];
				self.city = response.location.formattedAddress[1];
				self.cep = response.location.formattedAddress[2];
				self.country = response.location.formattedAddress[3];
				self.category = response.categories[0].shortName;
				console.log(response.location.formattedAddress);

				// Set the html content of the variables
				self.htmlContentAPI = 
				'<h5 class="info-subtitle">(' + self.category + ')</h5>' + '<div>' + 
				'<p class="info-address">' + (self.street ? self.street : '') + '</p>' +
				'<p class="info-address">' + (self.city ? self.city : '') + '</p>' +
				'<p class="info-address">' + (self.cep ? self.cep : '') + '</p>' +
				'<p class="info-address">' + (self.country ? self.country : '') + 
				'</p>' + '</div>' + '</div>';

				// Set content on infowindow
				infowindow.setContent(self.htmlContent + self.htmlContentAPI);
			}).fail(function() {
				alert(' There was an issue on Foursquare API. Refresh your page');
			});
			this.htmlContent = '<div>' + '<h4 class="info-title">' + marker.title + '</h4>';

			// Set function to close infowindow
			infowindow.open(map, marker);
			infowindow.addListener('closeclick', function() {
				infowindow.marker = null;
			});
		}
	};

	// Get locations and set on InfoWindow
	this.populate = function() {
		self.populateInfoWindow(this, self.largeInfoWindow);
		// Set the animations on markers
		this.setAnimation(google.maps.Animation.kp);
		console.log(google.maps.Animation);
		// Center the marker on screen
		map.setCenter(this);

	};

	// Set initMap Function
	this.initMap = function() {
		// Get giv map
		map = new google.maps.Map(document.getElementById('map'), {
		// settings of the map
			center: {lat: -23.456759, lng: -47.483232},
			zoom: 13,
			styles: styles,
			mapTypeControl: false
		});

		// Set InfoWindow
		this.largeInfoWindow = new google.maps.InfoWindow();
		// Get the locations
		for (var i = 0; i < locations.length; i++) {
			this.markerTitle = locations[i].title;
			this.markerLat = locations[i].lat;
			this.markerLng = locations[i].lng;
			this.marker = new google.maps.Marker({
				map: map,
				position: {
					lat: this.markerLat,
					lng: this.markerLng
				},
				title: this.markerTitle,
				lat: this.markerLat,
				lng: this.markerLng,
				id: i
			});
			this.marker.setMap(map);
			// Add on markers array
			this.markers.push(this.marker);
			// add click event to populate info windows
			this.marker.addListener('click', self.populate);
		}
	};

	// run the function initMap
	this.initMap();

	// Set the search function	
	this.myLocationsSearch = ko.computed(function() {
		var result = [];
		for (var i = 0; i < this.markers.length; i++) {
			var marker = this.markers[i];
			// compare if search item == any marker
			if (marker.title.toLowerCase().includes(this.searchItem().toLowerCase())) {
				result.push(marker);
				// if true, show it
				this.markers[i].setVisible(true);
			}
			else {
				this.markers[i].setVisible(false);
			}
		}
		return result;
	}, this);
}

// Start App
function startApp() {
	ko.applyBindings(new AppViewModel());
}