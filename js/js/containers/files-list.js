import React, {Component} from 'react';
import {bindActionCreators} from 'redux';	
import {connect} from 'react-redux';
import {getFilelist} from '../actions/index';
import {getFileExported} from '../actions/index';
import {getClickedFileId} from '../actions/index';
import {getAsanaGlobalSelectedProjectPerFile} from '../actions/index';
import {getAsanaGlobalSelectedWorkspacePerFile} from '../actions/index';
import {isAsana} from '../actions/index';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import {getGapiLoggedInUser} from '../actions/index';
import {getConfigAsanaInstance} from '../actions/index';
import {getCommentsFromDataBaseFile} from '../actions/index';
import reactTable from '../containers/react-table';
import matchSorter from 'match-sorter'
/*
used to be: 
import api from '../libs/api.js';
tried but did not work: 
import api from "https://apis.google.com/js/client.js?onload=checkAuth";
*/
import {getImageCollection} from '../actions/index';

class Filelist extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			CLIENT_ID : '693461940941-fcvioeadonbn755fdo56aqkhd4ooe163.apps.googleusercontent.com', 
			DISCOVERY_DOCS : ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest", 'https://sheets.googleapis.com/$discovery/rest?version=v4'],
			SCOPES : 'https://www.googleapis.com/auth/drive', 
			filelist : null,
			configAsana: (function() {
				var config = {
					users: [],
					usersRequests: [],
					tasksRequests: [],
					offset: (function() {
						var data = 1;
						return {
							get: function() {
								return data;
							},
							set: function(value) {
								data = value;
							}
						};
					})(),
					Asana: (function() {
						// Adapted from http://www.nczonline.net/blog/2010/05/25/cross-domain-ajax-with-cross-origin-resource-sharing/
						var callbacks = [];
						function authorizationHeader(options) {
							if (options.api_key) return "Basic " + btoa(options.api_key + ":")
							if (options.token) return "Bearer " + options.token
							throw new Error("Unknown authorization type, specify api_key or token")
						}

						function AsanaApi(options) {
							options = options || {}
							this.host = options.host || "app.asana.com"
							this.root = options.root || "https://" + this.host + "/api/1.0"
							this.authorization = authorizationHeader(options)
						}

						function callbackManager() {
							if (config.offset.get() == callbacks.length) {
								config.offset.set(0);
								for (var i = 0; i < callbacks.length; i++) {
									callbacks[i]['callback'](callbacks[i]['data'], null);
								}
								callbacks.splice(0, callbacks.length);
							}
						}

						function createCORSRequest(method, url) {
							var xhr = new XMLHttpRequest();
							if ("withCredentials" in xhr) {
								xhr.open(method, url, true);
								xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
								//xhr.setRequestHeader("Content-Type", " application/json");
							} else if (typeof XDomainRequest != "undefined") {
								xhr = new XDomainRequest();
								xhr.open(method, url);
								xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
								//xhr.setRequestHeader("Content-Type", " application/json");
							} else {
								throw new Error("CORS not supported by browser")
							}
							return xhr
						}

						AsanaApi.prototype.request = function(method, path, cb, params, offset) {
							var xhr = createCORSRequest(method, [this.root || this.asana.root, path].join("/"));
							xhr.setRequestHeader("authorization", this.authorization);
							xhr.setRequestHeader('content-type', 'application/json');
							//xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
							//params ? xhr.setRequestHeader("Content-length", params.length) : '';
							xhr.onreadystatechange = function() {
								if (xhr.readyState !== 4) {
									return;
								} else {
									var response = JSON.parse(xhr.response);
									callbacks.push({
										callback: cb,
										data: response
									});
									if(offset){
										 config.offset.set(offset);
									}
									callbackManager();
									//cb(response)
								}
							}
							params ? xhr.send(params) : xhr.send();
							return this;
						}
						return AsanaApi;
					})(),

					eventManager: new(function() {
						var pool = {};
						this.on = function(event, handler) {
							if (!pool[event]) {
								pool[event] = handler;
							}
						};
						this.off = function(event) {
							if (pool[event]) {
								delete pool[event];
							}
						};
						this.trigger = function(event, args) {
							if (pool[event] && typeof pool[event] === 'function') {
								/*this = eventManager, so the reference to the component as this is passed in the arguments*/
								return pool[event].apply(this, args);
								/*we have to return the result of the fn call here instead of this, as the eventManager will return instead*/
							}
						};
					})()
				};
				return {asanaApi : new config.Asana({api_key: '0/e2139de5044c43d9aa22f4c24735fe25'}), 
				        eventManager : config.eventManager, 
						offset : config.offset
					} ;
			})()
			
		};
	};
	componentDidMount() {
		/*google api code begins here: 
			https://console.developers.google.com/flows/enableapi?apiid=drive&authuser=1
			When gapi failes to load with 404: double-check and verify you locally have the latest script 
			from https://apis.google.com/js/client.js?onload=checkAuth
			and also: when the 'this' object is referred to, from the locally saved file, need to change the this to 'window' to avoid the error : 'this.navigator' is undefined.
		*/
		let _configAsanaClonedObject = Object.assign({}, this.state.configAsana);
		this.props.getConfigAsanaInstance(_configAsanaClonedObject);
		console.log('gapiScript component did mount');
		const gapiScript = document.createElement('script');
		gapiScript.src = 'https://apis.google.com/js/api.js?onload=onGapiLoad';
		var onGapiLoad = function () {
			gapi.load('client:auth2', this.initClient.bind(this));
		}
		window.onGapiLoad = onGapiLoad.bind(this);
		document.body.appendChild(gapiScript);
		this.state.configAsana.eventManager.on('header-component-triggered-click-on-projects-status-update', function(){
			var projectStatusUpdateFile = this.props.filelist.filter(function(i, j){
			   if(i['name'] == 'Projects Status Update'){
				 return i['index'] = j;
			   }
			})[0];
			  
			this.props.getClickedFileId({clickedFileName : projectStatusUpdateFile['name'], fileId : projectStatusUpdateFile['id']});
			this.onClickHandler(projectStatusUpdateFile['index'], null);
			
		}.bind(this));
		this.state.configAsana.eventManager.on('header-component-pre-fetch-projects-comments', function() {
			var projectCommentsFile = this.props.filelist.filter(function(i, j){
			   if(i['name'] == 'Projects Status Update'){
				 return i['index'] = j;
			   }
			})[0];
			/* this.onClickHandler(projectStatusUpdateFile['index'], null); */
			let fileId = projectCommentsFile['id'];
			/* let clickedFileName = this.refs[key].innerHTML; */
			let clickedFileName = projectCommentsFile['name'];
			//params to fetch comments from Projects Status Update file: 
			let params = {
			'fileId' : fileId, 
			'fields' : "comments"
			};
			let request = gapi.client.drive.comments.list(params);
			request.then(function(response) {
				console.log(response.result, 'gapi.client.drive.comments.list(params)');
				this.props.getCommentsFromDataBaseFile(response.result);
			}.bind(this), function(reason) {
				console.error('error: ' + reason.result.error.message);
			});
			
			this.props.getClickedFileId({clickedFileName : clickedFileName, fileId : fileId});
			this.exportFile(fileId);
			
			
		}.bind(this));
		
	}
	
	componentWillReceiveProps(nextProps) {
		this.setState({filelist : nextProps.filelist})
		/* console.log(this.props.configAsanaInstanceReducer.eventManager, "this.props.configAsanaInstanceReducer.eventManager"); */
	}
	
	componentWillUnmount () {
		var self = this;
		React.Children.forEach(this.props.children, function (child, index) {
			child.props.store.onChange(() => {});
		});
	}	
	
	initClient() {
		var self = this;
			gapi.client.init({
			  discoveryDocs: self.state.DISCOVERY_DOCS,
			  clientId: self.state.CLIENT_ID,
			  scope: self.state.SCOPES,
			  fetch_basic_profile : true,
			  immediate : false/* , 
			  prompt : 'select_account' 
			  this does not belong: 
			  read more -> https://github.com/google/google-api-javascript-client/issues/299
			  */
			}).then(function () {
			  // Handle the initial sign-in state.
			  self.handleAuthentication();
			  // Listen for sign-in state changes.
			  gapi.auth2.getAuthInstance().isSignedIn.listen(self.updateSigninStatus.bind(self));
			  self.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get()); 
			  //signoutButton.onclick = handleSignoutClick;
			}.bind(self)).then(function() {
				 var user = gapi.auth2.getAuthInstance().currentUser.get();
				 var profile = user.getBasicProfile();
				 var userExportable = {};
				 userExportable['email'] = profile.getEmail();
				 userExportable['fullName'] = profile.getName();
				 userExportable['imageURL'] = profile.getImageUrl();
				 self.props.getGapiLoggedInUser(userExportable);
			}.bind(self), function(err){console.log(err)});
	}
	
	handleAuthentication() {
		console.log('handleAuthentication');
		gapi.auth2.getAuthInstance().signIn({prompt : 'select_account'});        
	}
	
	updateSigninStatus(isSignedIn) {
		console.log("updateSigninStatus(isSignedIn)");
			if (isSignedIn) {
				console.log('SignedIn');
				this.listFiles.call(this);
			} else {
			  console.log('SignedOut');
			}
	}
	
	listFiles() {
		var self = this;
			gapi.client.drive.files.list({
			  q: "mimeType='application/vnd.google-apps.spreadsheet'",	
			  'pageSize': 1000,
			  'fields': "nextPageToken, files(id, name)",
			  'orderBy' : 'createdTime'
			}).then(function(response) {
			  var files = response.result.files;
			  this.props.getFilelist(files);
			}.bind(this));
	}
	
	getQueryStringForMultipleSheets (sheetsTitlesArray) {
		let query = [], 
				queryString = '';
				queryString += sheetsTitlesArray[0] + "!" + 'A1:Z';
				query.push(queryString);
			/*obtaining the query string across multiple sheets in a file*/
			sheetsTitlesArray.splice(0, 1);
			sheetsTitlesArray.forEach(function(sheet, i) {
				queryString = sheet + "!" + 'A1:Z';
				query.push(queryString);
			});	
			console.log(query, 'query');
			return query;
	}
	
	queryFileForValues (fileId, sheetsTitlesArray) {
		gapi.client.sheets.spreadsheets.values.batchGet({
				spreadsheetId: fileId,
				majorDimension : 'ROWS',
				valueRenderOption : 'FORMATTED_VALUE',
				ranges : this.getQueryStringForMultipleSheets(sheetsTitlesArray)
			}).then(function(response) {
				console.log(response, '->getFileExported');
				this.props.getFileExported(response.result.valueRanges);
			}.bind(this), function(fail) {
				console.log('Error: ' + fail.result.error.message);
			});
	}
	
	breakdownFileIntoSheets(response) {
			let sheetsTitlesArray = [];
			response.result.sheets.forEach(function(sheet) {
			   sheetsTitlesArray.push(sheet['properties']['title']);
			});
			return sheetsTitlesArray;
			/* this.setState({sheetsTitle : sheetsTitlesArray}); */
	}
	
	exportFile(fileId) {
			 /*GET for files with binary data: 
			 gapi.client.request({
				  path: '/drive/v3/files/' + files[0].id + "/export",
				  method: 'GET',
				  params: {
					 alt: 'media',
					mimeType : 'application/vnd.google-apps.spreadsheet'
				  }
				}).then(function(success) {
					console.log(success.result)
				}, function(fail) {
					console.log(fail);
					console.log('Error '+ fail.result.error.message);
				});*/
				/* 
				This API call works for google type files: 
				gapi.client.drive.files.export({
					'fileId' : fileId,
					'mimeType' : 'text/csv'
				}).then(function(success) {
					console.log(success['body']);
				}, function(fail) {
						console.log('Error '+ fail.result.error.message);
				}); */
		gapi.client.sheets.spreadsheets.get({
			spreadsheetId: fileId
		}).then(function(response) {
			/* this.breakdownFileIntoSheets(response); */
			console.log(response);
			this.queryFileForValues(fileId, this.breakdownFileIntoSheets(response));
        }.bind(this), function(fail) {
          console.log('Error: ' + fail.result.error.message);
        }).then(function(){
			/* this.queryFileForValues(fileId); */
		}.bind(this));
		
		/* gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: fileId,
			range: 'tasks breakdown!B4:E',
        }).then(function(response) {
          var range = response.result;
          if (range.values.length > 0) {
            for (var i = 0; i < range.values.length; i++) {
              var row = range.values[i];
              // Print columns B and E, which correspond to indices 0 and 4.
			  console.log(row[0] + ', ' + row[4]);
            }
          }
        }, function(response) {
          console.log('Error: ' + response.result.error.message);
        }); */
	}
	
	onClickHandler(key, e) {
			/*
			When a new file is clicked, must make isAsana false, 
			else the td will be rendered as asana-processed task, i.e., with the div classed as 'asana'
			*/
			
			this.props.isAsana(false);
			let fileId = this.state.filelist[key]['id'];
			/* let clickedFileName = this.refs[key].innerHTML; */
			let clickedFileName = this.state.filelist[key].name;
			   
			this.props.getClickedFileId({clickedFileName : clickedFileName, fileId : fileId});
			this.exportFile(fileId);
			if(this.props.asanaGlobalSelectedProjectPerFileReducer) {
				this.props.getAsanaGlobalSelectedProjectPerFile(null);
			}
			if(this.props.asanaGlobalSelectedWorkspacePerFileReducer) {
				this.props.getAsanaGlobalSelectedWorkspacePerFile(null);
			}
			var baseStyle = "linear-gradient(to bottom, rgba(255,255,255,0.7) 5%,rgba(255,255,255,0.7) 100%),", 
			urlStyle = "url('" + (this.props.imageCol[key/10|0] ? this.props.imageCol[key/10|0][key%10] : this.props.imageCol[0][key%10]) + "')" + "top left / cover repeat repeat",
			style = baseStyle + urlStyle;
			document.body.style.background = style;
			document.body.className = 'background-position-interim';
			var timeout = setTimeout(function() {
				document.body.className = '';
				clearTimeout(timeout);
			}, 4e3);
		}
	
	createFileList() {
		if(this.state.filelist) {
			self = this;
		return self.state.filelist.map(function(i, j) {
			if(self.state.filelist[j]['name']) {
				return React.createElement(
					'li', 
					{key : j,
					 ref : j,
					 className : self.state.filelist[j]['name']
					}, React.createElement(Link, {
						to : '', /* '/asana-gapi/?' + self.state.filelist[j]['name'] */
						onClick : function(key, e) {
							self.onClickHandler(key, e);
						}.bind(self, j)
					}, self.state.filelist[j]['name']));
			}
		});
		} else {
			return (
					<li>
						{'Loading'}
					</li>
				)
		}
	}
	render() {
		var columnsArr = [{Header: 'File', accessor: 'file', 
						filterMethod: function(filter, row) {
							return row[filter.id].startsWith(filter.value);
						},
					},
					{Header: 'Link', accessor: 'link', 
						filterMethod: (filter, rows)=> 
						matchSorter(rows, filter.value, { keys: ["file"]}),
						filterAll: true
					}];
		return <Switch>		
			<Route path = '/' render={()=> {
					return (
						<div className ="file-list-wrapper">
							<h3>The names of the Accessible Files:</h3>
							<h6>Pls., click on the file name to view and edit:</h6>
							{
								React.createElement(reactTable, {"data-file-list" : this.createFileList(), "data-columns" : columnsArr
								})
							}
						</div>
					)
			}} /> 
			<Route path = '/:${this.state.fileName}' render={()=> {
					return (
						<div className ="file-list-wrapper">
							<h3>The names of the Accessible Files:</h3>
							<h6>Pls., click on the file name to view and edit:</h6>
							{
								React.createElement(ReactTable, 
									{"data-file-list" : this.createFileList(), 
									 "data-columns" :columnsArr }
								)
							}
						</div>
					)
			}} /> 
			</Switch>
	}
}


function mapStateToProps(state) {
	/*
		detail : state.detail
			is the magic part from the reducers -> index.js, which makes the 
			reducer-detail.js available as state.detail here: 
			
		question: state.activeQuestion	
		
	*/
	return {
		getCommentsProjectsUpdateRelatedDatabaseFileReducer : state.getCommentsProjectsUpdateRelatedDatabaseFileReducer,
		gapiLoggedInUserReducer : state.gapiLoggedInUserReducer,
		filelist : state.filelist,
		fileExported : state.fileExported, 
		clickedFileId : state.clickedFileId,
		imageCol : state.imageCollection,
		asanaGlobalSelectedProjectPerFileReducer : state.asanaGlobalSelectedProjectPerFileReducer,
		asanaGlobalSelectedWorkspacePerFileReducer : state.asanaGlobalSelectedWorkspacePerFileReducer,
		isAsanaBoolean : state.isAsana, 
		configAsanaInstanceReducer : state.configAsanaInstanceReducer
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators(
	{
	  getCommentsFromDataBaseFile : getCommentsFromDataBaseFile,
	  getGapiLoggedInUser : getGapiLoggedInUser,
	  getAsanaGlobalSelectedProjectPerFile : getAsanaGlobalSelectedProjectPerFile,
	  getAsanaGlobalSelectedWorkspacePerFile : getAsanaGlobalSelectedWorkspacePerFile,
	  getFilelist : getFilelist, 
	  /* getFileExported : function(data){getFileExported(dispatch, data)} => produces an error from react : actions must be plain objects!*/
	  getFileExported : getFileExported, 
	  getClickedFileId : getClickedFileId,
	  getImageCollection : getImageCollection,
	  isAsana : isAsana,
	  getConfigAsanaInstance : getConfigAsanaInstance
	}, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps)(Filelist);