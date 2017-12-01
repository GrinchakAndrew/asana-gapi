import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';


class QuestionDetail extends Component {
	constructor(props, context) {
		super(props, context);
	}; 
	
	render() {
		
		return (<div><h6>Please, click-select file to fetch...</h6></div>);
	}
}

function mapStateToProps(state) {

	return {};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators(
	{}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(QuestionDetail);