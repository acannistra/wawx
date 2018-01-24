import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components'
import {Row, Col} from 'elemental';
import {Alert} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-tabs/style/react-tabs.css';

const WelcomeContainer = styled.div`
	width: 100%;
	height: 100%;
	padding-left: 20px;
	padding-right: 20px;
`;

export default class Welcome extends React.Component{
	render(){	

		return(<WelcomeContainer>
			<h1> NWAC v2 <small> by <a href="http://www.anthonycannistra.com/about">Tony Cannistra</a></small></h1>
			<p>Click a region on the map. </p>

			<Alert color='danger'>Not afflilated in any way with the Northwest Avalanche Center. USE AT YOUR OWN RISK. Active development ongoing. Information is possibly incorrect. Always consult with <a href="http://nwac.us">NWAC.us</a> before going outside. Leave feedback <a href="https://www.github.com/acannistra/wawx/issues/new">here</a>.</Alert>
			<div>
				<small><a target="_blank" href={"https://github.com/acannistra/wawx/tree/" + CODE_VERSION}>
						 v.{CODE_VERSION}</a></small>
			</div>
		</WelcomeContainer>)
	}
}