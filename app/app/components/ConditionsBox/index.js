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
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {Row, Col} from 'elemental';
import {dangerColors} from 'components/Map'
import {Badge,Table} from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.css';
import 'react-tabs/style/react-tabs.css';

const dangerImages = {
	'no-data' : "",
	'no-rating' : "",
	'low' : 'https://www.nwac.us/static/images/danger-levels/low.png',
	'moderate' : 'https://www.nwac.us/static/images/danger-levels/moderate.png',
	'considerable' : 'https://www.nwac.us/static/images/danger-levels/considerable.png',
	'high' : 'https://www.nwac.us/static/images/danger-levels/high.png',
	'extreme' : 'https://www.nwac.us/static/images/danger-levels/extreme.png'
}


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
			var _tabs = Array.from(this.props.problems).map(function(x){
				return(<Tab><b>{x.name}</b></Tab>);
			});

			var _panels = Array.from(this.props.problems).map(function(x){
				return(<TabPanel><Problem name={x.name} rose_url={x.rose_img_url} prob_url={x.likelihood_img_url} size_url={x.size_img_url}></Problem></TabPanel>)
			})
		} else {
			console.log('returning null')
			var _probs = null;
		}

		var dangerTabs = (
			<Tabs defaultIndex={1}>
				<TabList>
					{_tabs}
				</TabList>
				{_panels}
			</Tabs>
		)

		var dangerTable = ""
		try{
			var today = this.props.danger['treeline-above'].now.day
			var topImg = (
				<img style={{'margin' : '5px'}} src={dangerImages[this.props.danger['treeline-above'].now.danger.toLowerCase()]}/>
			);
			var dangerTable = (
				<Table size='sm'>
					<thead>
						<tr>
							<th>Elevation</th>
							<th>Today</th>
							<th>Tomorrow</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope='row'><img style={{'max-height': '46px'}} src="https://www.nwac.us/static/images/treeline-above.png"/></th>
							<td><img src={dangerImages[this.props.danger['treeline-above'].now.danger.toLowerCase()]}/></td>
							<td><img src={dangerImages[this.props.danger['treeline-above'].tomorrow.danger.toLowerCase()]}/></td>
						</tr>
						<tr>
							<th scope='row'><img style={{'max-height': '46px'}} src="https://www.nwac.us/static/images/treeline-near.png"/></th>
							<td><img src={dangerImages[this.props.danger['treeline-near'].now.danger.toLowerCase()]}/></td>
							<td><img src={dangerImages[this.props.danger['treeline-near'].tomorrow.danger.toLowerCase()]}/></td>
						</tr>
						<tr>
							<th scope='row'><img style={{'max-height': '46px'}} src="https://www.nwac.us/static/images/treeline-below.png"/></th>
							<td><img src={dangerImages[this.props.danger['treeline-below'].now.danger.toLowerCase()]}/></td>
							<td><img src={dangerImages[this.props.danger['treeline-below'].tomorrow.danger.toLowerCase()]}/></td>
						</tr>
					</tbody>
				</Table>
				
			)
		} catch (err){
			console.log(err)
			var dangerTable = "";
			var topImg = ""
			var today = "..."
		}


		return(<Container style={style}>
				<h1 style={{'margin-bottom' : '1px'}}>
					{topImg}
					<a target={'_blank'} href={this.props.url}>{this.props.region}</a>
				</h1>
				<small>{this.props.time} (Forecast Day: {today})</small>
				<Tabs>
					<TabList>
						<Tab><h4>Avalanche Conditions</h4></Tab>
						<Tab><h4>Weather Conditions</h4></Tab>
					</TabList>

					<TabPanel>
					 	<div>
					 		
					 		<b>Summary: </b> {this.props.summary}
					 		<h3>Conditions:</h3>	
					 		<Row>
					 			<Col xs="1/2">
					 				<div style={{'width' : "100%", 'text-align' : 'center'}}><b>Problems</b></div>
					 			</Col>
					 			<Col xs="1/2">
					 				<div style={{'width' : "100%", 'text-align' : 'center'}}><b>Danger Levels</b></div>
					 			</Col>

					 		</Row>
					 		<Row>
					 			<Col xs="1/2">
									{dangerTabs}
								</Col>
								<Col xs="1/2">
									{dangerTable}
								</Col>
					 		</Row>

					 	</div>
					</TabPanel>
				</Tabs>
			   </Container>)
	}
};