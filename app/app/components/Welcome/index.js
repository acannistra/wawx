import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components'
import {Row, Col} from 'elemental';
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

			<div style={{'display' : 'inline-block'}} class="align-bottom">USE AT YOUR OWN RISK.</div>
			<div>
				<small><a target="_blank" href={"https://github.com/acannistra/wawx/tree/" + CODE_VERSION}>
						 v.{CODE_VERSION}</a></small>
			</div>
		</WelcomeContainer>)
	}
}