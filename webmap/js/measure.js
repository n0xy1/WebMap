var distanceContainer = document.getElementById('distance');
 
// GeoJSON object to hold our measurement features
var geoPoints = {
'type': 'FeatureCollection',
'features': []
};
 
// Used to draw a line between points
var linestring = {
'type': 'Feature',
'geometry': {
'type': 'LineString',
'coordinates': []
}
};

map.on('load', function() {
    map.addSource('geoPoints', {
    'type': 'geojson',
    'data': geoPoints
    });
     
    // Add styles to the map
    map.addLayer({
    id: 'measure-points',
    type: 'circle',
    source: 'geoPoints',
    paint: {
    'circle-radius': 5,
    'circle-color': '#ffffff'
    },
    filter: ['in', '$type', 'Point']
    });
    map.addLayer({
    id: 'measure-lines',
    type: 'line',
    source: 'geojson',
    layout: {
    'line-cap': 'round',
    'line-join': 'round'
    },
    paint: {
    'line-color': '#ffffff',
    'line-width': 2.5
    },
    filter: ['in', '$type', 'LineString']
    });
     
    map.on('click', function(e) {
    var features = map.queryRenderedFeatures(e.point, {
    layers: ['measure-points']
    });
     
    // Remove the linestring from the group
    // So we can redraw it based on the points collection
    if (geoPoints.features.length > 1) geoPoints.features.pop();
     
    // Clear the Distance container to populate it with a new value
    distanceContainer.innerHTML = '';
     
    // If a feature was clicked, remove it from the map
    if (features.length) {
    var id = features[0].properties.id;
    geoPoints.features = geoPoints.features.filter(function(point) {
    return point.properties.id !== id;
    });
    } else {
    var point = {
    'type': 'Feature',
    'geometry': {
    'type': 'Point',
    'coordinates': [e.lngLat.lng, e.lngLat.lat]
    },
    'properties': {
    'id': String(new Date().getTime())
    }
    };
     
    geoPoints.features.push(point);
    }
     
    if (geoPoints.features.length > 1) {
    linestring.geometry.coordinates = geoPoints.features.map(function(
    point
    ) {
    return point.geometry.coordinates;
    });
     
    geoPoints.features.push(linestring);
     
    // Populate the distanceContainer with total distance
    var value = document.createElement('pre');
    value.textContent =
    'Total distance: ' +
    turf.length(linestring).toLocaleString() +
    'km';
    distanceContainer.appendChild(value);
    }
     
    map.getSource('geoPoints').setData(geoPoints);
    });
    });
     
    map.on('mousemove', function(e) {
    var features = map.queryRenderedFeatures(e.point, {
    layers: ['measure-points']
    });
    // UI indicator for clicking/hovering a point on the map
    map.getCanvas().style.cursor = features.length
    ? 'pointer'
    : 'crosshair';
    });