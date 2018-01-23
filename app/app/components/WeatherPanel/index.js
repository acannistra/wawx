import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl'
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


import 'react-tabs/style/react-tabs.css';

export default class WeatherPanel extends React.Component{
	region;

	render(){
		return(
		<div>
			<Tabs>
				<TabList>
					<Tab>Forecast</Tab>
					<Tab>Graphs</Tab>
				</TabList>
			</Tabs>
			<TabPanel>
				<iframe src="https://www.nwac.us/mountain-weather-forecast/mountain-weather-forecast-by-zone/1404/olympics/"/>
			</TabPanel>
		</div>);
	}
}

