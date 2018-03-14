import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {selectQuestion} from '../actions/index';
import {getFileExported} from '../actions/index';
import {getImageCollection} from '../actions/index';
import axios from '../libs/axios.min.js';
import Filelist from '../containers/files-list';
import SideMenu from '../containers/side-menu';
import {getFilelist} from '../actions/index';
import {getClickedFileId} from '../actions/index';
import {getInputMetaDataForAsanaPopup} from '../actions/index';
import {getConfigAsanaInstance} from '../actions/index';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import {getGapiLoggedInUser} from '../actions/index';
import {getCommentsFromDataBaseFile} from '../actions/index';

class HeaderStrip extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
			commentsLength : 0, 
			commentsValues : null, 
			receivedComments : null, 
			commentsClickedUpon  : null
		};
    };

	componentWillMount(){
		this.setState({
			user : {email : '', imageURL : '', fullName : ''}
		});
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.getCommentsProjectsUpdateRelatedDatabaseFileReducer){
			this.state.receivedComments = nextProps.getCommentsProjectsUpdateRelatedDatabaseFileReducer;
		}
		if(nextProps.gapiLoggedInUserReducer){
			this.setState({user : nextProps.gapiLoggedInUserReducer});
		}
		if(nextProps.getCommentsProjectsUpdateRelatedDatabaseFileReducer && 
		nextProps.getCommentsProjectsUpdateRelatedDatabaseFileReducer['comments'] && 
		nextProps.getCommentsProjectsUpdateRelatedDatabaseFileReducer['comments'].length) {
			this.state.commentsValues = nextProps.getCommentsProjectsUpdateRelatedDatabaseFileReducer.comments; 
			this.state.commentsLength = nextProps.getCommentsProjectsUpdateRelatedDatabaseFileReducer.comments.length;
			
		}
		/* if(nextProps.fileExported && nextProps.fileExported.length && nextProps.clickedFileId['fileId'] == '1igGW_48RYfTV-WNLk-rjGkSI6pVRqTHKt7qzLx_TfAY') {
			
			15D_Nga_6x_oEJ_yUca9jeF4Zje5_EwtXRry-R70Ceq4
			
			this.state.commentsValues = nextProps.fileExported[0]['values']; 
			this.state.commentsLength = nextProps.fileExported[0]['values'].length;
			this.props.configAsanaInstanceReducer.eventManager.trigger('comments-values-ajax-success', []);
		} */
	}
	/* parseCommentsToJSON(str) {
		//splitting by objects
		var arrSplitByObjects = typeof str === 'string' ? str.split(/[=](?=\s?{)/g) : [];
		var targetObject = {};
		var router = function(entries, obj) {
			var returnable = obj  ? obj : targetObject;
			while(entries.length) {
				var entry = entries.splice(0, 1)[0];
				var key = entry.split(/[=|:]/)[0];
				var value = entry.replace(key, '').replace(/[=|:|"]/g, '').replace(/[}]/g, '');
				if(value){
					returnable[key.replace(/[{"\s]/g, '')] = value;
				}else {
					var arg = arrSplitByObjects.splice(0, 1);
					arg = arg[0] ? arg[0].split(/,\s?(?=["]?\w*[=|:|"])/) : null;
					if(arg){
						arg = arg.concat(arg.splice(arg.length-1, 1)[0].split(/,\s(?=\w*)/));
						targetObject[key.replace(/[{"\s]/g, '')] = router(arg, {});
					}
				}
			}
			return returnable;
		}
		while(arrSplitByObjects.length) {
			var entries = arrSplitByObjects.splice(0, 1)[0].split(',');
			router(entries);
		}
		return targetObject;
	} */
	
    render() {
    return (
	<header className="app-header navbar" style = { { "zIndex" : '1'} }>
		<button className="navbar-toggler mobile-sidebar-toggler d-lg-none mr-auto" type="button">
		  <span className="navbar-toggler-icon"></span>	
		</button>
		<ul className="nav navbar-nav ml-auto">
		  <li className="nav-item d-md-down-none">
			<a className="nav-link" href="#" onClick = {(e)=>{				/*this.props.configAsanaInstanceReducer.eventManager.trigger('header-component-triggered-click-on-projects-status-update', []); */
			  }}>
				<i className="fa fa-bell-o" style = { {padding : '2px'} } aria-hidden="true"></i>
			<span className="badge badge-pill badge-danger">5</span></a>
		  </li>
		  <li className="nav-item dropdown" onClick={function(e){
			  /*
				e.target => <span class="d-md-down-none">Andrew Grinchak</span>
				closest parent => <li class="nav-item dropdown">
			  */
			  var config = {
				 closest : function (el,  elClass) {
					while(el !== document.body) {
					   if(el.className == elClass) {
							  return el;
					   }
						el = el.parentNode;
					}
				}, 
				divEl : null, 
				toggle : false
			  };
					config.divEl = config.closest(e.target,  'nav-item dropdown');
					if(config.divEl){
						config.divEl.className += ' show';
						/* config.firstLi = config.divEl.parentElement.firstElementChild;
						config.firstLi.style.display = 'none'; */
						/*making the comments file nullified upon hiding the top menu*/
						this.props.getCommentsFromDataBaseFile(null);
					}else {
						config.toggle = true;
					}
					config.divEl = config.closest(e.target, 'nav-item dropdown show');
					if(config.divEl && config.toggle) {
						config.divEl.className = config.divEl.className.replace(' show', '');
						/* config.firstLi = config.divEl.parentElement.firstElementChild;
						config.firstLi.style.display = 'inline-block'; */
					}
				/*
					fetching comments through eventManager linked to 
					file-list component's entrails as user clicks on the 
					drop-down menu
				*/
				//e.target.className.indexOf('item') == -1 
				if(config.closest(e.target, 'dropdown-item') && config.closest(e.target, 'dropdown-item').firstChild.className == 'fa fa-comments'){
					this.state.commentsClickedUpon = true;
					/* this.props.configAsanaInstanceReducer.eventManager.on('comments-values-ajax-success', function() {
						if(this.state.commentsValues && this.state.commentsValues.length){
							this.state.commentsValues.forEach(function(i, j) {
							 var commentArrayStringified = i[0];
							 i[0] = this.parseCommentsToJSON(commentArrayStringified);
							}.bind(this));
						}
					  }.bind(this)); */
					this.props.configAsanaInstanceReducer.eventManager.trigger('header-component-pre-fetch-projects-comments', []);
				}else {
					this.state.commentsClickedUpon = false;
				}
			  }.bind(this)}>
			  
			<a className="nav-link dropdown-toggle nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
	<img src={this.state.user.imageURL} style = { {padding : '5px', width : '20%' } } className="img-avatar" alt={this.state.user.email}/>
			  <span className="d-md-down-none">{this.state.user.fullName}</span>
			</a>
			<div className="dropdown-menu dropdown-menu-right">
			  <div className="dropdown-header text-center">
				<strong>Project Updates and Comments</strong>
			  </div>
			  <a className="dropdown-item" href="#" onClick = {(e)=>{
				  /*this will nullify any transient state of file already exported, because 
				  comments-database file is already fetched before this file is thru ajax, 
				  so it fill flicker : prevent it so =>*/
				  this.props.getFileExported([]);
				  this.props.configAsanaInstanceReducer.eventManager.trigger('header-component-triggered-click-on-projects-status-update', []);
			  }}>
				<i className="fa fa-bell-o"></i> Updates
				<span className="badge badge-info">Projects File</span>
			  </a>
			  <a className="dropdown-item" href="#"
				  onClick = {(e)=>{
					  console.log(this.state.commentsValues, 'this.state.commentsValues');
					  this.props.getCommentsFromDataBaseFile(this.state.commentsValues);
					  /* this.props.configAsanaInstanceReducer.eventManager.off('comments-values-ajax-success'); */
				  }}>
				  <i className="fa fa-comments"></i> Comments
				  <span className="badge badge-warning">{this.state.commentsLength ? this.state.commentsLength : "N\A"}</span>
			  </a>
			</div>
		  </li>
		</ul>
		<button className="navbar-toggler aside-menu-toggler" type="button">
		  <span className="navbar-toggler-icon"></span>
		</button>
		<div style={{position : "fixed", top : "55px", right : "3px"}}>
			{this.state.receivedComments && this.state.commentsClickedUpon? <SideMenu/> : null}
		</div>
  </header>);
    }
}

function mapStateToProps(state) {
    return {
		getCommentsProjectsUpdateRelatedDatabaseFileReducer : state.getCommentsProjectsUpdateRelatedDatabaseFileReducer,
		gapiLoggedInUserReducer : state.gapiLoggedInUserReducer,
        fileExported: state.fileExported,
        imageCol: state.imageCollection,
        filelist: state.filelist,
        clickedFileId : state.clickedFileId, 
		inputMetaDataForAsanaPopup : state.inputMetaDataForAsanaPopup,
		configAsanaInstanceReducer : state.configAsanaInstanceReducer
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
		getCommentsFromDataBaseFile : getCommentsFromDataBaseFile,
		getGapiLoggedInUser : getGapiLoggedInUser,
        getInputMetaDataForAsanaPopup : getInputMetaDataForAsanaPopup,
		selectQuestion: selectQuestion,
        getFileExported: getFileExported,
        getImageCollection: getImageCollection,
        getFilelist: getFilelist,
		getClickedFileId : getClickedFileId,
		getConfigAsanaInstance : getConfigAsanaInstance
    }, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps)(HeaderStrip);