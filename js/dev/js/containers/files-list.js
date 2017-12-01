import React, {Component} from 'react';
import {bindActionCreators} from 'redux';	
import {connect} from 'react-redux';
import {getFilelist} from '../actions/index';
import {getFileExported} from '../actions/index';
import {getClickedFileId} from '../actions/index';
import {getAsanaGlobalSelectedProjectPerFile} from '../actions/index';
import {getAsanaGlobalSelectedWorkspacePerFile} from '../actions/index';
import {isAsana} from '../actions/index';

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
			filelist : null
		};
	};
	componentDidMount() {
		/*google api code begins here: 
			https://console.developers.google.com/flows/enableapi?apiid=drive&authuser=1
			When gapi failes to load with 404: double-check and verify you locally have the latest script 
			from https://apis.google.com/js/client.js?onload=checkAuth
			and also: when the 'this' object is referred to, from the locally saved file, need to change the this to 'window' to avoid the error : 'this.navigator' is undefined.
		*/
		const gapiScript = document.createElement('script');
		gapiScript.src = 'https://apis.google.com/js/api.js?onload=onGapiLoad';
		var onGapiLoad = function () {
			gapi.load('client:auth2', this.initClient.bind(this));
		}
		window.onGapiLoad = onGapiLoad.bind(this);
		document.body.appendChild(gapiScript);
	}
	
	componentWillReceiveProps(nextProps) {
		this.setState({filelist : nextProps.filelist})
	}
	
	initClient() {
		var self = this;
			gapi.client.init({
			  discoveryDocs: self.state.DISCOVERY_DOCS,
			  clientId: self.state.CLIENT_ID,
			  scope: self.state.SCOPES,
			  immediate : false/* , 
			  prompt : 'select_account' 
			  this does not belong: 
			  read more -> https://github.com/google/google-api-javascript-client/issues/299
			  */
			}).then(function (authResult) {
			  // Listen for sign-in state changes.
			  gapi.auth2.getAuthInstance().isSignedIn.listen(self.updateSigninStatus.bind(self));
			  // Handle the initial sign-in state.
			  self.handleAuthentication();
			  self.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get()); 
			  //signoutButton.onclick = handleSignoutClick;
			});	
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
	
	getQueryStringForMultipleSheets () {
		let query = [], 
				queryString = '';
				queryString += this.state.sheetsTitle[0] + "!" + 'A1:Z';
				query.push(queryString);
			/*obtaining the query string across multiple sheets in a file*/
			this.state.sheetsTitle.splice(0, 1);
			this.state.sheetsTitle.forEach(function(sheet, i) {
				queryString = sheet + "!" + 'A1:Z';
				query.push(queryString);
			});	
			return query;
	}
	
	queryFileForValues (fileId) {
		gapi.client.sheets.spreadsheets.values.batchGet({
				spreadsheetId: fileId,
				majorDimension : 'ROWS',
				valueRenderOption : 'FORMATTED_VALUE',
				ranges : this.getQueryStringForMultipleSheets()
			}).then(function(response) {
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
			this.setState({sheetsTitle : sheetsTitlesArray});
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
			this.breakdownFileIntoSheets(response);
        }.bind(this), function(fail) {
          console.log('Error: ' + fail.result.error.message);
        }).then(function(){
			this.queryFileForValues(fileId);
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
	
	createFileList() {
		if(this.state.filelist) {
			let arr = [],
			self = this;
		self.state.filelist.map(function(i, j, fl){
			if(self.state.filelist[j]['name']) {
				arr.push(
				React.createElement(
					'li', 
					{key : j,
					 ref : j,
					 className : self.state.filelist[j]['name'],
					 onClick : function(key, e) {
						 /*
							When a new file is clicked, must make isAsana false, 
							else the td will be rendered as asana-processed task, i.e., with the div classed as 'asana'
						 */
						   
						     this.props.isAsana(false);
							 let fileId = self.state.filelist[key]['id'];
							 let clickedFileName = this.refs[key].innerHTML;
							 this.props.getClickedFileId({clickedFileName : clickedFileName, fileId : fileId});
							 self.exportFile(fileId);
							 if(this.props.asanaGlobalSelectedProjectPerFileReducer) {
								 this.props.getAsanaGlobalSelectedProjectPerFile(null);
							 }
							 if(this.props.asanaGlobalSelectedWorkspacePerFileReducer) {
								 this.props.getAsanaGlobalSelectedWorkspacePerFile(null);
							 }
							var baseStyle = "linear-gradient(to bottom, rgba(255,255,255,0.7) 5%,rgba(255,255,255,0.7) 100%),", 
							urlStyle = "url('" + (this.props.imageCol[j/10|0] ? this.props.imageCol[j/10|0][j%10] : this.props.imageCol[0][j%10]) + "')" + "top left / cover repeat repeat",
							style = baseStyle + urlStyle;
							document.body.style.background = style;
							document.body.className = 'background-position-interim';
							var timeout = setTimeout(function() {
								document.body.className = '';
								clearTimeout(timeout);
							}, 4e3);
					 }.bind(self, j)
					}, self.state.filelist[j]['name'])
				);
			}
			
		})
			return arr;
		}else {
			return (
					<li>
						{'Loading'}
					</li>
				)
		}
	}
	render() {
		return (
		<div className ="file-list-wrapper">
			<h3>The names of the Accessible Files:</h3>
			<h6>Pls., click on the file name to view and edit:</h6>
		<ul className = "file_list">
			{this.createFileList()}
		</ul>
		</div>
		);
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
		filelist : state.filelist,
		fileExported : state.fileExported, 
		clickedFileId : state.clickedFileId,
		imageCol : state.imageCollection,
		asanaGlobalSelectedProjectPerFileReducer : state.asanaGlobalSelectedProjectPerFileReducer,
		asanaGlobalSelectedWorkspacePerFileReducer : state.asanaGlobalSelectedWorkspacePerFileReducer,
		isAsanaBoolean : state.isAsana
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators(
	{
	  getAsanaGlobalSelectedProjectPerFile : getAsanaGlobalSelectedProjectPerFile,
	  getAsanaGlobalSelectedWorkspacePerFile : getAsanaGlobalSelectedWorkspacePerFile,
	  getFilelist : getFilelist, 
	  /* getFileExported : function(data){getFileExported(dispatch, data)} => produces an error from react : actions must be plain objects!*/
	  getFileExported : getFileExported, 
	  getClickedFileId : getClickedFileId,
	  getImageCollection : getImageCollection,
	  isAsana : isAsana
	}, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps)(Filelist);