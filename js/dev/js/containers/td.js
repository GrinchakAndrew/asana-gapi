import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {selectQuestion} from '../actions/index';
import {getFileExported} from '../actions/index';
import {getImageCollection} from '../actions/index';
import axios from '../libs/axios.min.js';
import Filelist from '../containers/files-list';
import {getFilelist} from '../actions/index';
import {getRow} from '../actions/index';
import {getRowIndex} from '../actions/index';
import {getSheetName} from '../actions/index';
import {getAsanaTaskText} from '../actions/index';
import {isAsana} from '../actions/index';
import {getAsanaTaskTextHistory} from '../actions/index';
import {getInputMetaDataForAsanaPopup} from '../actions/index';
import PropTypes from 'prop-types';
class Td extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
			asana : false
        };
    };

    componentWillMount() {
        this.setState({
            value : this.props.children
        });
    }
	
	componentWillReceiveProps(nextProps){
		if(nextProps.children.props.value !== this.state.value.props.value){
			this.state.value = nextProps.children;
		  /* 
			when you setState like so in the method, 
			react will instantiate a new instance of the component, 
			and the pre-existing methods and states will not be available in it. 
			Do not do this. What a landmine under your project. Whooeee!
			this.state = {
				asanaTaskText : nextProps.asanaReducer, 
				isAsana : nextProps.isAsanaBoolean
			} */
		}
		
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		if(this.props.children.props.value !== this.state.value.props.value){
			return true;
		}else {
			return false;
		}
	}
	_onClick(e) {
		if(( e.target.className == '_td_' || e.target.parentNode.className == '_td_') && !this.state.asana) {
			/*this will prevent from entering this condition scope if the state has once changed to true*/
			var asanaTaskText = this.td.getElementsByTagName('textarea')[0].innerHTML;
			this.setState({
				asana : true,
				taskText : asanaTaskText
			});
			this.props.getAsanaTaskText(asanaTaskText);
			this.props.isAsana(true); /*-> this little booger will cause the whole table to re-render*/
			/*we need to pass the following parameters to global scope to make edits from the asana popup into the origin-cell: 
					console.log(this.props['data-row-index']);
					console.log(this.props['data-cell-index']);
					console.log(this.props['data-sheet-name']);
			
			*/
			var historyOfAsanaValues = this.props.asanaHistoryReducer;
			if(historyOfAsanaValues.length){
				historyOfAsanaValues.push(asanaTaskText);
				this.props.getAsanaTaskTextHistory(historyOfAsanaValues);
			}else {
				historyOfAsanaValues.push(asanaTaskText);
			}
		}
	}

    render() {
		/*
		!this.state.asana -> since the table is completely and entirely re-drawn after the light-box closes down upon exit, you cannot rely on this state, and you need to store and compare against the storage of all the clicked asana items. 
		*/
		var currentTdCellValue = this.state.value; 
		var historyOfAsanaValues = this.props.asanaHistoryReducer;
		var isCellAsanaMarked = historyOfAsanaValues.some(function(i, j){
			return i == currentTdCellValue.props.value;
		});
        return (!this.state.asana && !isCellAsanaMarked) ? React.createElement('td', {
            ref : (td) => {
                this.td = td;
            }, 
			onDoubleClick : this._onClick.bind(this),
			className : this.state.hovered ? '_td_' : "",
			onMouseOver : function(e){
				if(e.target.tagName == 'TD'){
					e.target.className = "_td_";
				}else if(e.target.tagName == 'TEXTAREA'){
					e.target.parentNode.className = "_td_";
				}
			}.bind(this), //this._onMouseOver.bind(this), 
			onMouseOut : function(e){
				if(e.target.tagName == 'TD'){
					e.target.className = "";
				}else if(e.target.tagName == 'TEXTAREA'){
					e.target.parentNode.className = "";
				}
			}.bind(this),
		}, this.state.value) : React.createElement('td', {
            ref : (td) => {
                this.td = td;
            }
		}, React.createElement('div', {
				ref : (div) => { 	
					this.div = div;
				},
				className : 'asana'
			}, this.state.value));
    }
}

function mapStateToProps(state) {
    return {
		asanaHistoryReducer : state.asanaHistoryReducer, 
        fileExported: state.fileExported,
        imageCol: state.imageCollection,
        filelist: state.filelist,
        filelist: state.filelist,
		getRow: state.getRow,
        getRowIndex: state.getRowIndex,
        getSheetName: state.getSheetName,
		asanaReducer : state.asanaReducer,
		isAsanaBoolean : state.isAsana,
		inputMetaDataForAsanaPopup : state.inputMetaDataForAsanaPopup
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
		getInputMetaDataForAsanaPopup : getInputMetaDataForAsanaPopup,
		getAsanaTaskTextHistory : getAsanaTaskTextHistory, 
		isAsana : isAsana,
		getAsanaTaskText : getAsanaTaskText,
        selectQuestion: selectQuestion,
        getFileExported: getFileExported,
        getImageCollection: getImageCollection,
        getFilelist: getFilelist,
        getRow: getRow,
        getRowIndex: getRowIndex,
        getSheetName: getSheetName
    }, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps)(Td);