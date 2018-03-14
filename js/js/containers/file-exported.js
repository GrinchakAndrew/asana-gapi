import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {selectQuestion} from '../actions/index';
import {getFileExported} from '../actions/index';
import {getImageCollection} from '../actions/index';
import axios from '../libs/axios.min.js';
import Filelist from '../containers/files-list';
import TableList from '../containers/table-list';
import {getFilelist} from '../actions/index';
import {getClickedFileId} from '../actions/index';
import {getRow} from '../actions/index';
import {getRowIndex} from '../actions/index';
import {getSheetName} from '../actions/index';
import PropTypes from 'prop-types';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';

class FileExported extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			imageCol : [
				["/js/assets/1.jpeg", 
				"/js/assets/2.jpeg", 
				"/js/assets/3.jpeg", 
				"/js/assets/4.jpeg", 
				"/js/assets/5.jpeg", 
				"/js/assets/6.jpeg", 
				"/js/assets/7.jpeg",
				"/js/assets/8.jpeg", 
				"/js/assets/9.jpeg", 
				"/js/assets/10.jpeg"]
				]
		};
	}; 
	
	componentWillReceiveProps(nextProps) {
		this.setState({fileValues : nextProps['fileExported'], 
					   fileName : nextProps.clickedFileId.clickedFileName});
		this.props.getImageCollection(this.state.imageCol);
	}
	
	createListItems() {
		if(this.state.fileValues && this.state.fileValues && this.state.fileValues.length) { 
			return React.createElement('div', 
					{className: "table-container"}, 
						React.createElement(TableList, {}, null)
					);
		} 
	}
	render() {
		console.log(this.state.fileName, 'this.state.fileName');
		return (
			<Route path = '/' render={()=>{
					return (<div>
						<div style={{position : "absolute", top : "100px", left: "50px"}} >
							{<h1>{this.state.fileName ? "Your Current File: " + this.state.fileName : 'Google Spreadsheets Editable View'}</h1>}
							<Filelist/>
							{this.createListItems()}			
						</div>
					</div>)
				}} />
			);
		
		/* return this.state.fileName ? (
			<div>
				<h1>{"Your Current File: " + this.state.fileName}</h1>
				<Filelist/>
				{this.createListItems()}			
			</div>
			) : (
			<div>
				<h1>Google Spreadsheets Editable View</h1>
				<Filelist/>
				{this.createListItems()}			
			</div>
			); */
	}
}
/*  this is mapped to make the props.users from within the component possible, like so: 
	this.props.users
*/

function mapStateToProps(state) {
	return {
		fileExported : state.fileExported, 
		imageCol : state.imageCollection, 
		filelist : state.filelist, 
		getRow : state.getRow, 
		getRowIndex : state.getRowIndex, 
		getSheetName : state.getSheetName,
		clickedFileId : state.clickedFileId
		/*questions here is the selectQuestion reducer from all reducers file
		 imageCol here is the imageCollection reducer from all reducers file*/
	};
}

function matchDispatchToProps(dispatch){
	return bindActionCreators(
		{
			selectQuestion : selectQuestion,
			getFileExported : getFileExported,
			getImageCollection : getImageCollection, 
			getFilelist : getFilelist, 
			getClickedFileId : getClickedFileId,
			getRow : getRow, 
			getRowIndex : getRowIndex, 
			getSheetName : getSheetName
		}, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps)(FileExported);