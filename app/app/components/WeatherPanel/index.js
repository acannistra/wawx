import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl'
import PropTypes from 'prop-types';
import styled from 'styled-components'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
var axios = require('axios')

import 'react-tabs/style/react-tabs.css';


const IFrame = styled.div`
	border:none
	width: 100%	
`;

export default class WeatherPanel extends React.Component{
	region;
	weatherdata;

	constructor(props){
		super(props);
		this.get_iframe = this.get_iframe.bind(this)

	}

	get_iframe(){
		console.log(this.props.weather)
		return({__html: this.props.weather.html})
	}

	render(){
		var iframe = this.get_iframe()
		return(
		<div>
			<Tabs>
				<TabList>
					<Tab>Forecast</Tab>
					<Tab>Graphs</Tab>
				</TabList>
			<TabPanel>
				<div dangerouslySetInnerHTML={iframe}></div>
			</TabPanel>
			<TabPanel>

			</TabPanel>
			</Tabs>
		</div>);
	}
}

