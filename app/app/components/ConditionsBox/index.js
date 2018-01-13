import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl'
import styled from 'styled-components'
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl/dist/svg/mapboxgl-ctrl-compass.svg';
import 'mapbox-gl/dist/svg/mapboxgl-ctrl-geolocate.svg';
import 'mapbox-gl/dist/svg/mapboxgl-ctrl-zoom-in.svg';
import 'mapbox-gl/dist/svg/mapboxgl-ctrl-zoom-out.svg';
import Tooltip from 'components/Tooltip';
import Problem from 'components/Problem';

const Container  = styled.div`
	padding: 1em;
`;

export default class ConditionsBox extends React.Component{
	region;
	summary;
	url;
	time;
	problems;
	danger;


	render() {
		var style = {
			'overflow-y' : 'scroll',
			'height' : '100%'
		}
		if (this.props.problems !== "None"){

			var _probs = Array.from(this.props.problems).map(function(x){
				return(<Problem name={x.name} rose_url={x.rose_img_url} prob_url={x.likelihood_img_url} size_url={x.size_img_url}></Problem>)
			})
		} else {
			console.log('returning null')
			var _probs = null;
		}
		console.log('nextprobs')
		console.log(_probs)

		return(<Container style={style}>
				<a target={'_blank'} href={this.props.url}> <h1>{this.props.region}</h1></a>
				<small>{this.props.time}</small>
			 	<div>
			 		<h2>Summary: </h2>
			 		{this.props.summary}
			 		<h2>Problems:</h2>	
			 			<div>{_probs}</div>
			 		<h2>Danger:</h2>
			 		{this.props.danger}
			 	</div>
			   </Container>)
	}
};