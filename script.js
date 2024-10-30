// Initialize the map and set the view to a world scale without Antarctica
var map = L.map('map').setView([20, 0], 2);

// Add a blank base layer with a light grey background for the map
L.tileLayer('', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Country style: All countries in black
function style(feature) {
    return {
        fillColor: '#000000', // Black color for landmass
        weight: 1,
        opacity: 1,
        color: 'white', // White border
        fillOpacity: 1
    };
}

// Define custom icons for AWS (yellow) and Azure (blue) using SVG
var awsIcon = L.divIcon({
    className: 'aws-marker',
    html: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 25 25"><circle cx="12.5" cy="12.5" r="10" fill="yellow" /></svg>',    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28]
});

var azureIcon = L.divIcon({
    className: 'azure-marker',
    html: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 25 25"><circle cx="12.5" cy="12.5" r="10" fill="blue" /></svg>',    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28]
});

// Define AWS and Azure data centre coordinates with location names
var awsDataCentres = [
    { coords: [37.7749, -122.4194], name: "San Francisco, USA" },  // Example
    { coords: [52.5200, 13.4050], name: "Berlin, Germany" },        // Example
    { coords: [38.0336, -78.5079], name: "Virginia, USA" },
    { coords: [45.5231, -122.6765], name: "Oregon, USA" },
    { coords: [34.0522, -118.2437], name: "Ohio, USA" },
    { coords: [35.6895, 139.6917], name: "Tokyo, Japan" },
    { coords: [-33.8688, 151.2093], name: "Sydney, Australia" },
    { coords: [50.1109, 8.6821], name: "Frankfurt, Germany" },
    { coords: [-23.5505, -46.6333], name: "São Paulo, Brazil" }
];

var azureDataCentres = [
    { coords: [37.4316, -78.6569], name: "Virginia, USA" },
    { coords: [34.0522, -118.2437], name: "California, USA" },
    { coords: [51.5074, -0.1278], name: "London, UK" },
    { coords: [48.8566, 2.3522], name: "Paris, France" },
    { coords: [1.3521, 103.8198], name: "Singapore" },
    { coords: [37.5665, 126.9780], name: "Seoul, South Korea" },
    { coords: [19.0760, 72.8777], name: "Mumbai, India" }
];

// Layer groups to hold markers for AWS and Azure
var awsLayerGroup = L.layerGroup();
var azureLayerGroup = L.layerGroup();

// Function to toggle AWS Data Centres with yellow markers
function toggleAWSDataCentres() {
    if (awsLayerGroup.getLayers().length === 0) {
        awsDataCentres.forEach(function(dc) {
            var marker = L.marker(dc.coords, { icon: awsIcon }).bindTooltip(dc.name, {permanent: false, direction: 'top'});
            awsLayerGroup.addLayer(marker).addTo(map);
        });
    } else {
        map.removeLayer(awsLayerGroup);
        awsLayerGroup.clearLayers();
    }
}

// Function to toggle Azure Data Centres with blue markers
function toggleAzureDataCentres() {
    if (azureLayerGroup.getLayers().length === 0) {
        azureDataCentres.forEach(function(dc) {
            var marker = L.marker(dc.coords, { icon: azureIcon }).bindTooltip(dc.name, {permanent: false, direction: 'top'});
            azureLayerGroup.addLayer(marker).addTo(map);
        });
    } else {
        map.removeLayer(azureLayerGroup);
        azureLayerGroup.clearLayers();
    }
}


// Function to toggle menu visibility
function toggleMenu(menuId) {
    const submenu = document.getElementById(menuId);
    if (submenu.style.display === 'block') {
        submenu.style.display = 'none';
    } else {
        submenu.style.display = 'block';
    }
}

// Load GeoJSON for the world countries, excluding Antarctica
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
    .then(response => response.json())
    .then(data => {

        const filteredData = {
            ...data,
            features: data.features.filter(feature => feature.id !== 'ATA') // Removes Antarctica
        };
        
        // Add the filtered GeoJSON data to the map
        geojson = L.geoJson(filteredData, {
            style: function(feature) {
                return {
                    fillColor: '#000000', // Black color for landmass
                    weight: 1,
                    opacity: 1,
                    color: 'white', // White border
                    fillOpacity: 1
                };
            },
            onEachFeature: function(feature, layer) {
                layer.on({
                    mouseover: function(e) {
                        var layer = e.target;
                        layer.setStyle({
                            weight: 2,
                            color: '#666',
                            fillOpacity: 0.7,
                            fillColor: '#0fe5b2' // Highlight color
                        });
                        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                            layer.bringToFront();
                        }
                    },
                    mouseout: function(e) {
                        geojson.resetStyle(e.target);
                    },
                    click: function(e) {
                        map.fitBounds(e.target.getBounds());
                    }
                });
            }
        }).addTo(map);

        // Zoom the map to fit the remaining countries
        map.fitBounds(geojson.getBounds());
    });

