import React, {Component} from 'react';	
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {selectQuestion} from '../actions/index';
import {selectDetail} from '../actions/index';
import {updateTextArea} from '../actions/index';
import PropTypes from 'prop-types';

class TextArea extends Component {
	constructor(props, context) {
		super(props, context);
			this.state = {
				Question : this.props.question.Question, 
				Response : this.props.question.Response, 
				Solution : this.props.question.Solution
			}
		};
	componentDidMount(question) {
		this.props.selectDetail(this.props.question);
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.question.Question !== this.props.question.Question){
			this.state = {
				Question : nextProps.question.Question, 
				Response : nextProps.question.Response, 
				Solution : nextProps.question.Solution
			}
		}
	}
	
	eachTextArea() {
		let arr = [],
		self = this;
		for(var _key in this.state) {
			arr.push(
			React.createElement(
			'textarea', 
			{id : _key, 
			 key : _key, 
			className : _key, 
			value : this.state[_key] ? this.state[_key] : (_key + ' has no data'), 
			ref : _key,
			disabled : true,
			onChange : function() {
				self.props.updateTextArea(self.refs);
				self.setState({
						Question : self.refs.Question.value, 
						Response : self.refs.Response.value, 
						Solution : self.refs.Solution.value
					});
					
				}
			}, null))
		}
		return arr;
	}
	render() {
		return (
			<div>
				{this.eachTextArea()}
			</div>
			)
	}
}

function mapStateToProps(state) {
	/*
		question: state.activeQuestion	is made available from import of selectQuestion
		from the actions/index.js, which contains the action makers. 
		
		Their job is to simply dispatch an event of type and payload. 
		
		The reducers will react to this event-action. and they return a state,
		which is global and connect to this component via the two functions below: 
		in the index file of reducers there is a state
		'activeQuestion : ActiveQuestionReducer', which comes from ActiveQuestionReducer, which is an
		observer to the emitter of the same type of action from the action maker.
		
		The combine reducer method is redux which knows from the store of all the states of the payload from the action, as the reducer returns the state, i.e., the payload, made available here as the active question.
		
		The action itself is the selectQuestion(question) action which is inline-d function into the element inside the component. 
		So, you have to import the emitting actions-creators and setup the corresponding reducer to update the store. 
	*/
	return {
		question : state.activeQuestion,
		detail : state.detail, 
		textarea : state.textarea
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({selectQuestion : selectQuestion, selectDetail : selectDetail, updateTextArea : updateTextArea}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(TextArea);
