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


const NWACImage = styled(Col)`
	max-width: 200px;
`;

export default class Problem extends React.Component {
	name;
	rose_url;
	prob_url;
	size_url;


	render(){
		return(<div>
			<div style={{'width' : '100%', 'text-align' : 'center'}}><h3>{this.props.name}</h3></div>
			<Row center='xs'>
				<NWACImage sm="1/3">
					<div style={{'width' : "100%", 'text-align' : 'center'}}>Aspects</div>
					<img width="100%" src={this.props.rose_url}/>
				</NWACImage>
				<NWACImage sm="1/3">
					<div style={{'width' : "100%", 'text-align' : 'center'}}>Likelihood</div>
					<img width="100%" src={this.props.prob_url}/>
				</NWACImage>
				<NWACImage sm="1/3">
					<div style={{'width' : "100%", 'text-align' : 'center'}}>Size</div>
					<img width="100%" src={this.props.size_url}/>
				</NWACImage>
			</Row>
		</div>);
	}
}