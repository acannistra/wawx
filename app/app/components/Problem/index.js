import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl'
import styled from 'styled-components'
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl/dist/svg/mapboxgl-ctrl-compass.svg';
import 'mapbox-gl/dist/svg/mapboxgl-ctrl-geolocate.svg';
import 'mapbox-gl/dist/svg/mapboxgl-ctrl-zoom-in.svg';
import 'mapbox-gl/dist/svg/mapboxgl-ctrl-zoom-out.svg';
import {Row, Col} from 'elemental';

export default class Problem extends React.Component {
	name;
	rose_url;
	prob_url;
	size_url;


	render(){
		console.log('rendering');


		return(<div>
			<span style={{'width' : '100%', 'text-align' : 'center'}}>{this.props.name}</span>
			<Row>
				<Col sm="1/3">
					<img width="100%" src={this.props.rose_url}/>
				</Col>
				<Col sm="1/3">
					<img width="100%" src={this.props.prob_url}/>
				</Col>
				<Col sm="1/3">
					<img width="100%" src={this.props.size_url}/>
				</Col>
			</Row>
		</div>);
	}
}