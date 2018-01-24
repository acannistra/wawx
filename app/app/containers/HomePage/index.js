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
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';
var screenshot = require("../../images/screenshot_1.png")
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
			'danger' : 'None', 
			'detailedForecast': 'Loading...',
			'detailedSummary' : 'Loading...', 
			'weather' : "none",
			'isMobile': window.innerWidth <= 500

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
				'danger'     : data.data.danger, 
				'detailedForecast' : data.data.detailed_forecast,
				'detailedSummary' : data.data.detailed_summary, 
				'weather' : data.data.weather
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

		const mobileSplash = 
			(<div>
		      <Card>
		        <CardImg top width="100%" src={screenshot} alt="Card image cap" />
		        <CardBody>
		          <CardTitle>NWAC v2</CardTitle>
		          <CardSubtitle>by <a href="http://www.anthonycannistra.com/about">Tony Cannistra</a></CardSubtitle>
		          <CardText>Apologies, but currently NWAC v2 cannot be viewed on a mobile device. Check it out on your computer!</CardText>
		          <a href="//www.github.com/acannistra/wawx"><Button>View The Code</Button></a>
		        </CardBody>
		      </Card>
		    </div>);

		const mainBody = 
		  (<Row style={{'height' : '100%'}}>
			<Col xs="1/3">
				<Row width="100%" style={{'height' : "100%"}}>
					<Col width="100%" height="100%">
						<Map forecastText={this.forecastText} conditionClickHandler={this.conditionClickHandler} handler = {this.handler}/>
					</Col>

				</Row>
			</Col>
		    <Col xs="2/3">
		    	{!this.state.interaction ? <Welcome></Welcome> : 
		    	<ConditionsBox summary={this.state.clickedForecast}
		    				   region={this.state.clickedRegion} 
		    				   url={this.state.clickedURL} 
		    				   time={this.state.issuedTime} 
		    				   problems={this.state.problems} 
		    				   danger={this.state.danger}
		    				   detailedForecast = {this.state.detailedForecast}
		    				   detailedSummary = {this.state.detailedSummary} 
		    				   weather = {this.state.weather}/>
		    	}
		    </Col>
		  </Row>);

		if(this.state.isMobile){
			return(mobileSplash)
		} else {
			return(mainBody)
		};

	}



}



