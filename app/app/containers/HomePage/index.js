import React from 'react';
import { FormattedMessage } from 'react-intl';
import Map from 'components/Map';
import ConditionsBox from 'components/ConditionsBox';
import styled from 'styled-components';
import messages from './messages';
import {Row, Col, Glyph} from 'elemental'
import '!!style-loader!css-loader!../../root.css';
var axios = require('axios');
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Welcome from 'components/Welcome';
import 'react-tabs/style/react-tabs.css';



export default class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
	constructor(props){
		super(props);
		this.state = {
			'clickedForecast': '',
			'currentZone' : "",
			'interaction' : false,
			'clickedRegion' : "None",
			'clickedURL' : '',
			'issuedTime' : '',
			'problems' : 'None',
			'danger' : 'None'
		}; 
		this.handler = this.handler.bind(this)
		this.conditionClickHandler = this.conditionClickHandler.bind(this)
	};


	handler (features){
		var api_url = "https://h0g1asmd41.execute-api.us-west-2.amazonaws.com/dev/region?name="
		var zone_name = features.url.split('/')[3]
		if(zone_name === this.state.currentZone) {
			return;
		} else {
			this.setState({'currentZone' : zone_name})
		}
		this.setState({
				'issuedTime' : "Loading...",
				'danger'     : "Loading..."

			})
		var updateFromAPI = function(data){
 			this.setState({
				'issuedTime' : data.data.updateTime,
				'problems'   : data.data.problems,
				'danger'     : data.data.danger

			})
			console.log(this.state)
		}
		var updateFromAPI = updateFromAPI.bind(this);
		axios.get(api_url + zone_name).then(updateFromAPI);
		this.setState({
			'clickedForecast' : decodeURIComponent(features.bottom_line_summary.replace(/&nbsp;/g, " ")), 
			'clickedRegion' : features.zone_abbreviated_name,
			'clickedURL' : features.zone_url, 
			'interaction' : true
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

		const wx_plots = [
			{
				name:"12km SLP",
				src:"https://atmos.washington.edu/wrfrt/data/timeindep/images_d2/slp.00.0000.gif",
				url:"https://atmos.washington.edu/~ovens/wxloop.cgi?wrfd2_slp+///3"
			},
			{
				name:"36km SLP",
				src:"https://atmos.washington.edu/wrfrt/data/timeindep/images_d1/slp.00.0000.gif",
				url:"https://atmos.washington.edu/~ovens/wxloop.cgi?wrfd1_slp+///3"
			},
			{
				name:"12km Temperature",
				src:"https://atmos.washington.edu/wrfrt/data/timeindep/images_d2/tsfc.00.0000.gif",
				url:"https://atmos.washington.edu/~ovens/wxloop.cgi?wrfd2_tsfc+///3"
			},
			{
				name:"12km (WA) 24-hour Precip",
				url:"https://atmos.washington.edu/~ovens/wxloop.cgi?wrfd2_wa_pcp24+///3",
				src:"https://atmos.washington.edu/wrfrt/data/timeindep/images_d2/wa_pcp24.24.0000.gif"
			}

		]

		const _wx_plots = wx_plots.map(function(x){
			var img_style = {  
				"display": 'block',
				"max-width":'100%',
				'max-height':'100%',
				'width': 'auto',
				'height': 'auto',
			};

			return(<Col sm="25%" height="100%">
				   	<a href={x.url} target="_blank" style={{'height' : "100%"}}>
				   		<img src={x.src} style={img_style} />
				   	</a>
				   </Col>)
		})

		return (
		  <Row style={{'height' : '100%'}}>
		    <Col xs="2/3">
		    	{!this.state.interaction ? <Welcome></Welcome> : 
		    	<ConditionsBox summary={this.state.clickedForecast} region={this.state.clickedRegion} url={this.state.clickedURL} time={this.state.issuedTime} problems={this.state.problems} danger={this.state.danger}/>
		    	}
		    </Col>
		    <Col xs="1/3">
				<Row width="100%" style={{'height' : "80%"}}>
					<Col width="100%" height="100%">
						<Map forecastText={this.forecastText} conditionClickHandler={this.conditionClickHandler} handler = {this.handler}/>
					</Col>

				</Row>
				<Row style={{"height" : "20%"}}>
					<Col height="100%">
						<Row height="100%">
							{_wx_plots}
						</Row>
					</Col>
				</Row>

		    </Col>
		  </Row>
		);
	}



}



