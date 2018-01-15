import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl'
import PropTypes from 'prop-types';

import styled from 'styled-components'
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl/dist/svg/mapboxgl-ctrl-compass.svg';
import 'mapbox-gl/dist/svg/mapboxgl-ctrl-geolocate.svg';
import 'mapbox-gl/dist/svg/mapboxgl-ctrl-zoom-in.svg';
import 'mapbox-gl/dist/svg/mapboxgl-ctrl-zoom-out.svg';
import Tooltip from 'components/Tooltip'
import {Spinner} from 'elemental'
var axios = require('axios')

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const MapContainer = styled.div`
  height: 100%
`;

const dangerColors = {};

dangerColors["no-data"] = "#808080";
dangerColors["no-rating"] = "#808080";
dangerColors.low = "#4db848";
dangerColors.moderate = "#fcf200";
dangerColors.considerable = "#f7941e";
dangerColors.high = "#cd1c24";
dangerColors.extreme = "#231f20";
const maxbounds = [[-127.89,44.09],[-113.88,51.06]]

class LegendItem extends React.Component{
  color;
  text;

  render() {
    const style = {
      'background-color' : this.props.color
    };
    return(<div><span style={style}></span>{this.props.text}</div>)
  }
}

class Map extends React.Component {
  tooltipContainer;

  constructor(props) {
    super(props);
    this.state = {
      'loading' : true, 
      'mapobj': '', 
      'elev_band' : "Above Treeline"
    }
    var that = this;
    this.change_elev = function(e) {
      const level = e.target.id
      e.target.style={'background-color' : 'yellow'}
      console.log()
      switch(String(level)){
        case "above":
          that.setState({'elev_band' : "Above Treeline"})
          that.state.mapobj.setPaintProperty('nwac-danger', 'fill-color', {
                                              property: 'danger_elev_high',
                                              type: 'categorical',
                                              stops: [
                                                  ['Low', dangerColors.low],
                                                  ['Moderate', dangerColors.moderate],
                                                  ['Considerable', dangerColors.considerable], 
                                              ['High', dangerColors.high], 
                                              ['Extreme', dangerColors.extreme]]})
          break;
        case 'at':
          that.state.mapobj.setPaintProperty('nwac-danger', 'fill-color', {
                                              property: 'danger_elev_middle',
                                              type: 'categorical',
                                              stops: [
                                                  ['Low', dangerColors.low],
                                                  ['Moderate', dangerColors.moderate],
                                                  ['Considerable', dangerColors.considerable], 
                                              ['High', dangerColors.high], 
                                              ['Extreme', dangerColors.extreme]]});
          that.setState({'elev_band' : "At Treeline"})
          break;
        case 'below':
          that.state.mapobj.setPaintProperty('nwac-danger', 'fill-color', {
                                              property: 'danger_elev_low',
                                              type: 'categorical',
                                              stops: [
                                                  ['Low', dangerColors.low],
                                                  ['Moderate', dangerColors.moderate],
                                                  ['Considerable', dangerColors.considerable], 
                                              ['High', dangerColors.high], 
                                              ['Extreme', dangerColors.extreme]]})
          that.setState({'elev_band' : "Below Treeline"})
          break;
        default:
          console.log(level)
      }
    }
  }

  setTooltip(features) {
    
    if (features.length) {
      const renderFeature = (feature, i) => {
        if (feature.layer['source'] == "nwac-danger"){
          this.props.handler(feature.properties)
        }
      };
      features.map(renderFeature)
    }
  }



  componentDidMount() {

    const dataurl = "https://h0g1asmd41.execute-api.us-west-2.amazonaws.com/dev/danger";



    // Container to put React generated content in.
    this.tooltipContainer = document.createElement('div');

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-streets-v9',
      center: [-122, 47],
      zoom: 6, 
      minZoom: 6,
      maxBounds: maxbounds
    });


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
                          ['Moderate', dangerColors.moderate],
                          ['Considerable', dangerColors.considerable], 
                      ['High', dangerColors.high], 
                      ['Extreme', dangerColors.extreme]]},
              'fill-opacity' : 0.8,
              'fill-outline-color' : 'black'
            }
        })
    });
    map.addControl(new mapboxgl.ScaleControl({
        maxWidth: 200 ,
        unit: 'imperial'
    }));

    const tooltip = new mapboxgl.Marker(this.tooltipContainer, {
      offset: [-120, 0]
    }).setLngLat([0,0]).addTo(map);
    
    map.on('mousedown', (e) => {
      const features = map.queryRenderedFeatures(e.point, { 'layers' : ['nwac-danger']});
      tooltip.setLngLat(e.lngLat);
      map.getCanvas().style.cursor = features.length ? 'pointer' : '';
      this.setTooltip(features);
      console.log(features)

    });

    map.on('mousedown', (e) => {
      const features = map.queryRenderedFeatures(e.point);
      console.log(features);
    })

    map.on('zoom', (e) => {
      console.log(map.getZoom())
      var min_zoom = 7
      var max_zoom = 10
      var opacity = (max_zoom - map.getZoom()) /  (max_zoom - min_zoom)
      console.log('\t' + opacity)
      map.setPaintProperty('nwac-danger', 'fill-opacity', opacity)
    });

    this.setState({'mapobj' : map})
    
  }




  render() {
    console.log(this.state.loading)
    return (
      <div style={{'min-height': "100%"}} id='map'>
        <div id='danger-legend' className='legend'>
          <h4>Danger Levels</h4>
          <LegendItem text="Low" color='#4db848'/>
          <LegendItem text="Moderate" color='#fcf200'/>
          <LegendItem text="Considerable" color='#f7941e'/>
          <LegendItem text="High" color='#cd1c24'/>
          <LegendItem text="Extreme" color='#231f20'/>
          <span>
            <button id={'above'} onClick={this.change_elev}>⬆️🌲</button>
            <button id={'at'} onClick={this.change_elev}>🌲</button>
            <button id={'below'} onClick={this.change_elev}>⬇️🌲</button>
          </span>
          <div style={{'text-align' : 'center', "width" : "100%"}}>{this.state.elev_band}</div>
         </div>

      </div>
    );
  }
}

export default Map;

Map.PropTypes = {
  conditionClickHandler: PropTypes.func
}


