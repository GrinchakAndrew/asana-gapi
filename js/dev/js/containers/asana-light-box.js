import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getFileExported} from '../actions/index';
import {getImageCollection} from '../actions/index';
import axios from '../libs/axios.min.js';
import {getFilelist} from '../actions/index';
import {getClickedFileId} from '../actions/index';
import {getAsanaTaskText} from '../actions/index';
import {isAsana} from '../actions/index';
import {getAsanaProjects} from '../actions/index';
import {getConfigAsanaInstance} from '../actions/index';
import {getAsanaGlobalSelectedProjectPerFile} from '../actions/index';
import {getAsanaGlobalSelectedWorkspacePerFile} from '../actions/index';
import {getAsanaWorkspaces} from '../actions/index';
import {getInputMetaDataForAsanaPopup} from '../actions/index';
import PropTypes from 'prop-types';

class AsanaLightBox extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
	}; 
	/*componentWillReceiveProps does not fire if props are the same!*/
	componentWillMount() {
		this.state = {
				asanaTaskText : this.props.asanaReducer, 
				isAsana  : this.props.isAsanaBoolean,
				asanaProjects : this.props.asanaProjectsReducer, 
				asanaWorkspaces : this.props.asanaWorkspacesReducer
			}
		 	
		this.setState({selectedOption : this.props.asanaGlobalSelectedProjectPerFileReducer ? 
		this.props.asanaGlobalSelectedProjectPerFileReducer : this.props.asanaProjectsReducer[0]['name']});
		this.setState({selectedWorkspaceOption : this.props.asanaGlobalSelectedWorkspacePerFileReducer ? 
		this.props.asanaGlobalSelectedWorkspacePerFileReducer : this.props.asanaWorkspacesReducer['data'][0]['name']});
		
		this.props.configAsanaInstanceReducer.eventManager.on('projectName', function(projects, fn) {
			return fn.call(this, projects);
		});
		this.props.configAsanaInstanceReducer.eventManager.on('workspaceName', function(workspaces, fn) {
			return fn.call(this, workspaces['data']);
		});
		
		this.props.configAsanaInstanceReducer.eventManager.on('sendThisTaskToAsana', function() {
					/*this here is the reference to eventManager!*/
					console.log('sendThisTaskToAsana', arguments);
					let projectName = arguments[0];
					let requestFn = arguments[1];
					let asanaApi = arguments[2];
					let selectedWorkspaceOption = arguments[3];
					let asanaTaskText = arguments[4];
					let allProjects = arguments[5];
					let allWorkspaces = arguments[6];
					let assignee = "andrewgrinchak@gmail.com";
					let workspaceId = allWorkspaces.data.filter(function(i, j){
								if(i.name == selectedWorkspaceOption){
								   return true;
								}
								})[0]['id'];
					let projectId = allProjects.filter(function(i, j){
					   if(i.name == projectName){
						 return true;
						}
					})[0]['id'];
					var obj = {};
					obj.data = {};
					obj.data["workspace"] = workspaceId;
					obj.data["projects"] = [projectId];
					obj.data["name"] = asanaTaskText;
					obj.data["assignee"] = assignee;
					requestFn.apply(asanaApi, ["POST", "tasks", function(response) {
					  if (response.errors) {
						  alert("Error:" + response.errors[0].message);
					  } else {
						 console.log(response, 'successful adding of the task to asana');
					  }
					}, JSON.stringify(obj)]);	
				});
	}
	
	createOptionsForProjects(projects) {
		return React.createElement('select', {value : this.props.asanaGlobalSelectedProjectPerFileReducer ? 
		this.props.asanaGlobalSelectedProjectPerFileReducer : this.state.selectedOption,
										   onChange : function(e) {
											  this.setState({selectedOption : e.target.value});
										    }.bind(this)
										  },
									projects.map(function(obj, j) {
										return React.createElement(
											'option', 
											{key : j,
											 onChange : function(e){
											 }.bind(this),
											 value : obj.name
											}, 
											 obj.name);
								}, this));
	}
	
	createOptionsForWorkspaces(workspaces) {
		 
		return React.createElement('select', {value : this.props.asanaGlobalSelectedWorkspacePerFileReducer ? 
		this.props.asanaGlobalSelectedWorkspacePerFileReducer : this.state.selectWorkspace,
										   onChange : function(e) {
											    
											  this.setState({selectedWorkspaceOption : e.target.value});
										    }.bind(this)
										  },
									workspaces.map(function(obj, j) {
										return React.createElement(
											'option', 
											{key : j,
											 onChange : function(e){
											 }.bind(this),
											 value : obj.name
											}, 
											 obj.name);
								}, this));
	}
	
	render() {
		var selectProject = this.props.configAsanaInstanceReducer.eventManager.trigger('projectName', [this.props.asanaProjectsReducer, this.createOptionsForProjects.bind(this)]);
		var selectWorkspace = this.props.configAsanaInstanceReducer.eventManager.trigger('workspaceName', [this.props.asanaWorkspacesReducer, this.createOptionsForWorkspaces.bind(this)]);
		
		return React.createElement('div', {
			className : 'asana-light-box'
		}, 
			React.createElement('div', {className : 'asana-form-exit', 
				onClick : function(e) {
					/*this code will cause the table view to re-render from asana lightbox to the original tableview*/
					this.props.isAsana(false);
					this.setState({
						isAsana  : this.props.isAsanaBoolean
					});
				!this.props.asanaGlobalSelectedProjectPerFileReducer ? 
				this.props.getAsanaGlobalSelectedProjectPerFile(this.state.selectedOption) : '';
				 
				!this.props.asanaGlobalSelectedWorkspacePerFileReducer ? 
				this.props.getAsanaGlobalSelectedWorkspacePerFile(this.state.selectedWorkspaceOption) : '';
				
				/*flow to send the task to asana actually: comment it out for debugging mode*/
				this.props.configAsanaInstanceReducer.offset.set(1);
				this.props.configAsanaInstanceReducer.eventManager.trigger('sendThisTaskToAsana', [this.state.selectedOption, this.props.configAsanaInstanceReducer.asanaApi.request, this.props.configAsanaInstanceReducer.asanaApi, this.state.selectedWorkspaceOption, this.state.asanaTaskText, this.props.asanaProjectsReducer, this.props.asanaWorkspacesReducer]);
				
				/*update the excel cell to the newly edited value here: */
				if(this.state.changed) {
					var newValue = this.state.asanaTaskText;
					this.props.configAsanaInstanceReducer.eventManager.trigger('updateTargetedExcelCellWithNewValues', [newValue, 
					this.props.inputMetaDataForAsanaPopup.dataRowIndex,
					this.props.inputMetaDataForAsanaPopup.dataCellIndex,
					this.props.inputMetaDataForAsanaPopup.dataSheetName,
					this.state.oldValue,
					true
					]);
				}
				
			}.bind(this)}, null), 
			React.createElement('div', {className : 'asana-form'},
					React.createElement('textarea', {className : 'asana-taskInput', 
					ref: (task) => {
						this.asanaTaskInput = task;
					},
					value : this.state.asanaTaskText, 
					onChange : function(e) {
						if(this.asanaTaskInput.value !== this.state.asanaTaskText){
							this.setState({oldValue : this.state.asanaTaskText});
							this.setState({asanaTaskText : this.asanaTaskInput.value});
							this.setState({changed : true});
						}else {
							this.setState({changed : false});
						}
					}.bind(this),
					}, null), 
					React.createElement('div', {className : 'asana-projectInput',
						ref: (project) => {
								this.asanaProjectInput = project;
							},
							value : '', 
							onChange : function(e){
							}.bind(this),
						}, selectProject), 
					React.createElement('div', {className : 'asana-workspaceInput',
						ref: (workspace) => {
								this.asanaProjectInput = workspace;
							},
							value : '', 
							onChange : function(e){
							}.bind(this),
						}, selectWorkspace)
			)
		);
	}
}

function mapStateToProps(state) {
	return {
		fileExported : state.fileExported, 
		imageCol : state.imageCollection, 
		clickedFileId : state.clickedFileId,
		asanaReducer : state.asanaReducer, 
		isAsanaBoolean : state.isAsana, 
		asanaProjectsReducer : state.asanaProjectsReducer,
		configAsanaInstanceReducer : state.configAsanaInstanceReducer,
		asanaGlobalSelectedProjectPerFileReducer : state.asanaGlobalSelectedProjectPerFileReducer,
		asanaGlobalSelectedWorkspacePerFileReducer : state.asanaGlobalSelectedWorkspacePerFileReducer,
		asanaWorkspacesReducer : state.asanaWorkspacesReducer, 
		inputMetaDataForAsanaPopup : state.inputMetaDataForAsanaPopup
	};
}
	
function matchDispatchToProps(dispatch){
	return bindActionCreators(
		{
			getInputMetaDataForAsanaPopup : getInputMetaDataForAsanaPopup,
			getAsanaGlobalSelectedProjectPerFile : getAsanaGlobalSelectedProjectPerFile,
			getAsanaGlobalSelectedWorkspacePerFile : getAsanaGlobalSelectedWorkspacePerFile,
			getConfigAsanaInstance : getConfigAsanaInstance,
			isAsana : isAsana,
			getAsanaTaskText : getAsanaTaskText, 
			getFileExported : getFileExported,
			getImageCollection : getImageCollection, 
			getClickedFileId : getClickedFileId,
			getAsanaProjects : getAsanaProjects,
			getAsanaWorkspaces : getAsanaWorkspaces
		}, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps)(AsanaLightBox);