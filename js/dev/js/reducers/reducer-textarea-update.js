import React from 'react';
import ReactDOM from 'react-dom'
import {Component} from 'react';

const textAreaReducer = (state = null, action) => {
	switch(action.type) {
		case 'TEXTAREA_UPDATED': {
			return action.payload;
		}
		default : {
			return state;
		}
	}
}

export default textAreaReducer;