mapboxgl.accessToken = 'pk.eyJ1IjoiYWNhbm5pc3RyYSIsImEiOiJLWVM2RWhJIn0.TputXxRYBUPh-vjDg6_TFA';

	var dangerColors = {}
	dangerColors["no-data"] = "#808080";
   dangerColors["no-rating"] = "#808080";
	dangerColors.low = "#4db848";
	dangerColors.moderate = "#fcf200";
	dangerColors.considerable = "#f7941e";
	dangerColors.high = "#cd1c24";
	dangerColors.extreme = "#231f20";

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v10',
  center: [-122, 47],
  zoom: 6
});
dataurl = "https://1v7t29ppce.execute-api.us-west-2.amazonaws.com/dev/danger"
map.on('load', function () {
    map.addSource('nwac-danger', { type: 'geojson', data: dataurl });
    map.addLayer({
        "id": "nwac-danger",
        "type": "fill",
        "source": "nwac-danger",
        'paint': {
          'fill-color': {
                  property: 'danger_elev_high',
                  type: 'categorical',
                  stops: [
                      ['Low', dangerColors.low],
                      ['Moderate', dangercolors.moderate],
                      ['Considerable', dangercolors.considerable]]},
          'fill-opacity' : 0.6,
          'fill-outline-color' : 'black'
        }
    });
  map.addLayer({
    "id": "attribution-layer",
    "type": "circle",
    "source": {
        "type": "geojson",
        "data": {
            "type": "Feature",
            "properties": {},
            "geometry": null
        }
    }
});
map.style.sourceCaches['attribution-layer']._source.attribution = "Avalanche data from <a target='_blank' href='https://www.nwac.us'>NWAC</a>";
});