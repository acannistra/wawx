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
import WeatherPanel from 'components/WeatherPanel'
import {Badge,Table, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

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
	detailedForecast;
	detailedSummary;
	weather;
	danger;

	constructor(props){
		super(props);
		this.toggle_details = this.toggle_details.bind(this);
		this.toggle_summary = this.toggle_summary.bind(this);
		var url_slugs = this.props.url.split("/")
		var region_slug = url_slugs[url_slugs.length - 1];
		this.state = { 
			details_open : false,
			summary_open : false,
			region_slug : region_slug
		}
	}

	toggle_details() {
		this.setState({ details_open : !this.state.details_open })
	}
	toggle_summary(){
		this.setState(
		{
			summary_open : !this.state.summary_open
		})
	}


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
				<Row>
					<Col sm="1/2">
						<Row>
							<Col sm="1">
								<h2 style={{'margin-bottom' : '1px'}}>
									{topImg}
									<a target={'_blank'} href={this.props.url}>{this.props.region}</a>
								</h2>
							</Col>
						</Row>
						<Row>
							<Col sm="1">
								<small>{this.props.time} (Forecast Day: {today})</small>

							</Col>
						</Row>
						<Row style={{'margin-top' : '5px', 'margin-bottom' : '5px'}}>
							<Col xs="1/2">
								<Button color='info' onClick={this.toggle_summary}>Detailed Summary</Button>
				 		        <Modal isOpen={this.state.summary_open} toggle={this.toggle_summary} style={{'max-width': '1000px'}}>
				 		          <ModalHeader toggle={this.toggle_summary}>Detailed Summary for {today}</ModalHeader>
				 		          <ModalBody>
				 		          	{this.props.detailedSummary}
				 		          </ModalBody>
				 		          <ModalFooter>
				 		            <Button color="primary" onClick={this.toggle_summary}>Close ⎋</Button>{' '}

				 		          </ModalFooter>
				 		       	</Modal>
			 		       	</Col>

			 		       	<Col xs="1/2">
						 		<Button color='info' onClick={this.toggle_details}>{this.props.detailedForecast.forecast_title}</Button>
				 		        <Modal isOpen={this.state.details_open} toggle={this.toggle_details} style={{'max-width': '1000px'}}>
				 		          <ModalHeader toggle={this.toggle_details}>{this.props.detailedForecast.forecast_title}</ModalHeader>
				 		          <ModalBody>
				 		          	{this.props.detailedForecast.forecast}
				 		          </ModalBody>
				 		          <ModalFooter>
				 		            <Button color="primary" onClick={this.toggle_details}>Close ⎋</Button>{' '}
				 		          </ModalFooter>
				 		       	</Modal>
			 		       	</Col>
		 		       	</Row>
					</Col>
					<Col sm="1/2">
						<b>Summary: </b> {this.props.summary}
					</Col>
				</Row>
				<Row>
					<Col xs="1">
						<Tabs>
							<TabList>
								<Tab><b>Avalanche Conditions</b></Tab>
								<Tab><b>Weather Conditions</b></Tab>
							</TabList>

							<TabPanel>
								
				 		       	<Row style={{'margin-top' : '10px', 'margin-bottom' : '5px', 'border-top' : '1px'}}>
				 		       		<Col xs="1/2">
				 		       			<div style={{"width" : "100%"}}><h5 style={{"text-align" : 'center'}}>Elevation Danger</h5></div>
				 		       		</Col>
				 		       		<Col xs="1/2">
				 		       			<div style={{"width" : "100%"}}><h5 style={{"text-align" : 'center'}}>Avalanche Problems Present	</h5></div>
				 		       		</Col>
				 		       	</Row>
						 		<Row>
							 		<Col xs="1/2">
							 			{dangerTable}
							 		</Col>
						 			<Col xs="1/2">
										{dangerTabs}
									</Col>

						 		</Row>
							</TabPanel>
							<TabPanel>
								<WeatherPanel region={this.state.region_slug} weather={this.props.weather}>
								</WeatherPanel>
							</TabPanel>
						</Tabs>
					</Col>
				</Row>
			   </Container>)
	}
};