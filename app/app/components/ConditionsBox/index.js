import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl'
import styled from 'styled-components'
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl/dist/svg/mapboxgl-ctrl-compass.svg';
import 'mapbox-gl/dist/svg/mapboxgl-ctrl-geolocate.svg';
import 'mapbox-gl/dist/svg/mapboxgl-ctrl-zoom-in.svg';
import 'mapbox-gl/dist/svg/mapboxgl-ctrl-zoom-out.svg';
import Tooltip from 'components/Tooltip'
import {Spinner} from 'react-spinkit'

export default class ConditionsBox extends React.Component{
	region;
	summary;
	url;


	render() {

		return(<div>
				<a target={'_blank'} href={this.props.url}> <h1>{this.props.region}</h1></a>
			 	<div>
			 		<h2>Summary:</h2>
			 		{this.props.summary}
			 	</div>
			   </div>)
	}
};