1. create reducer-active-user: 

export default function(state={}, action) {
	switch(action.type){
		case 'USER_SELECTED': {
			return action.payload;
			break;
		}
		
	}
	return state;
}

2. add the reducer to index all reducers: 'activeUser : ActiveUserReducer'

import PhotoReducer from './reducer-photo';
const allReducers = combineReducers({
	users : UserReducer, 
	activeUser : ActiveUserReducer, 
	photo : PhotoReducer
});

3. create container that will have mapStateToProps added returning  state.activeUser
   and connect the container via 'connect function':
   
import React, {Component} from 'react';
import {connect} from 'react-redux';

class UserDetail extends Component {
	render() {
		return (
			<div>
				<img src={this.props.user.thumbnail}/>
				<h2>{this.props.user.first} {this.props.user.last}</h2>
				<h3>{this.props.user.age}</h3>
				<h3>{this.props.user.description}</h3>
			</div>
		);
	} 
}

function mapStateToProps(state) {
	return {
		user: state.activeUser
	};
}

export default connect(mapStateToProps)(UserDetail);

4. create an action selectUser: 

 export const selectUser = (user) => {
	return {
		type : "USER_SELECTED", 
		payload : user
	}
};

5. bind the action to the user list in the container user-list: 

function matchDispatchToProps(dispatch){
	return bindActionCreators({selectUser : selectUser}, dispatch);
}





