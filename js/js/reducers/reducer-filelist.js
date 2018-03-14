import React from 'react';
import ReactDOM from 'react-dom'
import {Component} from 'react';

const fileListReducer = (state = null, action) => {
	switch(action.type) {
		case 'FILE_LIST': {
			return action.payload;
		}
		default : {
			return state;
		}
	}
}

export default fileListReducer;