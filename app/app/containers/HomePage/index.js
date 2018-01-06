/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import Map from 'components/Map';
import ConditionsBox from 'components/ConditionsBox';
import styled from 'styled-components';
import messages from './messages';
import {Row, Col} from 'elemental'
import '!!style-loader!css-loader!../../root.css';
//var axios = require('axios');

export default class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
	constructor(props){
		super(props);
		this.state = {
			'clickedForecast': '',
			'clickedRegion' : 'None Selected',
			'clickedURL' : '',
			'issuedTime' : '',
			'problems' : '',
			'danger' : ''
		}; 
		this.handler = this.handler.bind(this)
		this.conditionClickHandler = this.conditionClickHandler.bind(this)
	};

	handler (features){
		var api_url = "https://h0g1asmd41.execute-api.us-west-2.amazonaws.com/dev/region?name="
		var zone_name = features.url.split('/')[3]
		var updateFromAPI = function(data){
			this.setState({
				'issuedTime' : data.data.updateTime,
				'problems'   : JSON.stringify(data.data.problems),
				'danger'     : JSON.stringify(data.data.danger)

			})
			console.log(this.state)
		}
		var updateFromAPI = updateFromAPI.bind(this);
		axios.get(api_url + zone_name).then(updateFromAPI);
		this.setState({
			'clickedForecast' : decodeURIComponent(features.bottom_line_summary.replace(/&nbsp;/g, " ")), 
			'clickedRegion' : features.zone_abbreviated_name,
			'clickedURL' : features.zone_url
		})
	}


	conditionClickHandler(e) {
		e.preventDefault();
		this.setState({
			'clickedForecast' : event
		})
		return(true);
	}

	render() {
		const topStyle = {
			'position' : 'absolute',
			'top' : '0px',
			'left': '0px',
			'right' : '0px',
			'bottom': '0px'
		};
		return (
		  <Row style={{'height' : '100%'}}>
			<Col xs="33%" sm="75%" lg="80.333%">
		    	<Map forecastText={this.forecastText} conditionClickHandler={this.conditionClickHandler} handler = {this.handler}/>
		    </Col>
		    <Col xs="66%" sm="25%" lg='19.666%'>
		    	<ConditionsBox summary={this.state.clickedForecast} region={this.state.clickedRegion} url={this.state.clickedURL} time={this.state.issuedTime} problems={this.state.problems} danger={this.state.danger}/>
		    </Col>
		    
		  </Row>
		);
	}



}



