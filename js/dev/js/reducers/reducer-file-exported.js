import React from 'react';
import ReactDOM from 'react-dom'
import {Component} from 'react';

/*
	***Remember, in redux you only use pure function in reducer. Don't make ajax call inside reducer.***
*/

const fileExportedReducer = (state = [], action) => {
  switch (action.type) {
    case 'RESOLVED_GET_FILE_EXPORTED': {
		return action.payload;
	}
    default : {
		return state;
	}
  }
};

export default fileExportedReducer;

