import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import FileExported from '../containers/file-exported';
import QuestionDetail from '../containers/question-detail';
import HeaderStrip from '../containers/header-strip';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
require('../../scss/style.scss');
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';

import PropTypes from 'prop-types';
/* 
class App extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
		}
	}
	
	componentWillReceiveProps(nextProps) {
	}
	
	componentDidMount() {
	}
	
	componentWillMount() {
	}

	render(){
		return (<Router>
			<div className = "main-wrapper">		
			<Route path="/" render={()=>{
					return (<div>
							<FileExported/>
						</div>) 
				}}/>
			</div>
		</Router>)
	}
}
 */
 
 const App = () => (
	<Router>
	<div className = "main-wrapper">
	<Switch>
		<Route path="/asana-gapi/:fileName" render={({match})=>{
			console.log(' path="/" render-1', match, match.params.fileName, 'match.params.fileName');
			return (<div>
				<HeaderStrip/>
				<FileExported/>
				</div>)
		}}/>
		<Route path="/" render={()=>{
			console.log(' path="/" render-2')
			return (<div>
					<HeaderStrip/>
					<FileExported/>
					</div>)
		}}/>
	</Switch>
	</div>
	</Router>
);

export default App;


/*<FileExported/>*/