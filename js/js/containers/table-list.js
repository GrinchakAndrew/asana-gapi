import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {selectQuestion} from '../actions/index';
import {getFileExported} from '../actions/index';
import {getImageCollection} from '../actions/index';
import axios from '../libs/axios.min.js';
import Filelist from '../containers/files-list';
import Th from '../containers/th';
import Td from '../containers/td';
import Input from '../containers/input';
import {getFilelist} from '../actions/index';
import {getClickedFileId} from '../actions/index';
import AsanaLightBox from '../containers/asana-light-box';
import {isAsana} from '../actions/index';
import {getAsanaTaskText} from '../actions/index';
import {getAsanaProjects} from '../actions/index';
import {getConfigAsanaInstance} from '../actions/index';
import {getAsanaWorkspaces} from '../actions/index';
import {getInputMetaDataForAsanaPopup} from '../actions/index';
import {getAsanaTaskTextHistory} from '../actions/index';

class TableList extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			regExp : new RegExp( /[/\s0-9'.&,-_!\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]+(?=!)/),
			isAsana : false,
			clickedFileId : this.props.clickedFileId
		};
	}; 
	componentDidMount() {
		if(this.props.clickedFileId.clickedFileName !== this.state.clickedFileId.clickedFileName){
			this.state.clickedFileId = this.props.clickedFileId;
		}
	}
	componentWillMount() {
		//this.state.configAsana.eventManager
		this.props.configAsanaInstanceReducer.eventManager.on('updateTargetedExcelCellWithNewValues', function() {
			var newValue = arguments[0];
			var dataCellIndex = arguments[1];
			var dataRowIndex = arguments[2];
			var dataSheetName = arguments[3];
			var oldValue = arguments[4];
			var isEditMadeThroughAsanaForm = arguments[5];
			if(isEditMadeThroughAsanaForm) {
				var historyOfAsanaValues = this.props.asanaHistoryReducer;
				if(historyOfAsanaValues.length){
					historyOfAsanaValues = historyOfAsanaValues.filter(function(i, j){
						return i !== oldValue && i !== newValue;
					});
					historyOfAsanaValues.push(newValue);
					 
					this.props.getAsanaTaskTextHistory(historyOfAsanaValues);
				}else {
					historyOfAsanaValues.push(newValue);
				}
			}
			 
			this.props.fileExported.map(function(obj, j) {
					if(this.props.fileExported[j]['range'].indexOf(dataSheetName) !== -1) {
					obj['values'][dataCellIndex][dataRowIndex] = newValue; 
var alphabet = ['A','B','C','D','E','E','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']; 
							var letter = alphabet[dataRowIndex]; 
							var number = dataCellIndex+1;
							var rangeString = dataSheetName + '!' + letter + number;
							console.log(this.props.clickedFileId.fileId);
						gapi.client.sheets.spreadsheets.values.update({
							spreadsheetId : this.props.clickedFileId.fileId,
							range: rangeString,
							majorDimension: "ROWS",
							valueInputOption: 'USER_ENTERED',
							values: [[newValue]]
					  }).then(function(response) {
							console.log(response);
					  }, function(fail){
						  console.log('Error: ' + fail.result.error.message);
					  });
					  /*
					   set comments to cells with batchUpdate function call gapi:  https://stackoverflow.com/questions/12913874/is-it-possible-to-use-the-google-spreadsheet-api-to-add-a-comment-in-a-cell
					  */
					}
				}.bind(this));
			/*this is critical to pull the fileExported through the global state to update the view!*/
			this.props.getFileExported(this.props.fileExported);
		}.bind(this));
		 
		//this.state.configAsana.eventManager
		this.props.configAsanaInstanceReducer.eventManager.on('workspaces', function() {
					/*this here is the reference to eventManager!*/
					let requestFn = arguments[0];
					let asanaApi = arguments[1];
					let tableListThis = arguments[2];
					requestFn.apply(asanaApi, ["GET", "workspaces", function(response, err){
						if (err) {
							console.error("Error:", err.message)  
						} else {
						 tableListThis.setState({asanaWorkspaces : response});
						  
						 tableListThis.props.getAsanaWorkspaces(response);
						}
					  }, this]);
		});
		
		//this.state.configAsana.eventManager
		this.props.configAsanaInstanceReducer.eventManager.on('getAsanaProjects', function() {
			/*this here is the reference to eventManager!*/
			let _this = arguments[0];
			let AsanaProjectsNames = arguments[1];
			let asanaRequestFn = arguments[2];
			let asanaApi = arguments[3];
			_this.props.getAsanaProjects(AsanaProjectsNames);
			/* making the workspaces fetch after the projects are fetched already:*/
			_this.props.configAsanaInstanceReducer.offset.set(1)
			_this.props.configAsanaInstanceReducer.eventManager.trigger('workspaces', [asanaRequestFn, asanaApi, _this]);
		});
		 
		//this.state.configAsana.
		this.props.configAsanaInstanceReducer.offset.set(1);
		//this.state.configAsana
		this.props.configAsanaInstanceReducer.asanaApi.request("GET", "projects?opt_fields=name, members, workspaces", function(response, err) {
		  if (err) {
			console.error("Error:", err.message)  
		  } else {
			  /*passing this as reference to the component TableList, because in the asana constructor it is lost => [this, ...]
			  Accessing the configAsanaInstanceReducer.eventManager through the props, because it's not 
			  accessible from the request function passed as param
			  */
			  this.props.configAsanaInstanceReducer.eventManager.trigger('getAsanaProjects', [this, response, this.props.configAsanaInstanceReducer.asanaApi.request,  this.props.configAsanaInstanceReducer.asanaApi]);
		  }
		}.bind(this));
	}
	
	componentWillReceiveProps(nextProps) {
		if(nextProps.isAsanaBoolean || nextProps.asanaReducer) {
			this.state.asanaTaskText = nextProps.asanaReducer;
			this.state.isAsana = nextProps.isAsanaBoolean;
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
	/* shouldComponentUpdate(nextProps, nextState) {
		 if(nextProps.clickedFileId.fileId == "1igGW_48RYfTV-WNLk-rjGkSI6pVRqTHKt7qzLx_TfAY"){
			 return false;
		 }else {
			 return true;
		 }
	} */

	createTheadRow(sheetName, row, maxRowLength, sheetNumber, uniqueKeyGenerator) {
		maxRowLength = row.length > maxRowLength ? row.length : maxRowLength; 
						if(maxRowLength > row.length) {
							var diff = maxRowLength - row.length; 
							for (var i = 0; i < diff; i++) {
								row.push("");
							}
						}
				return React.createElement('thead', {}, 
								React.createElement('tr', {key : 0}, 
									row.map(function(cell, j) {
										uniqueKeyGenerator+=j;
											return React.createElement(
											Th, 
											{key : uniqueKeyGenerator, 
											'data-row-index' : 0, 
											'data-cell-index' : j, 
											'data-sheet-name' : sheetName
											}, cell)}, this)));	
    }
	
	createTbodyRow(sheetName, row, index, sheetNumber, uniqueKeyGenerator) {
		return React.createElement('tr', {key : uniqueKeyGenerator+1},
								row.map(function(cell, j) {
									uniqueKeyGenerator+=j;
										return React.createElement(
										Td, 
										{key : uniqueKeyGenerator},
										React.createElement(Input, {
											value : cell,
											'data-row-index' : index, 
											'data-cell-index' : j, 
											'data-sheet-name' : sheetName
										}, null));
								}, this)
								);
		}
	
	createRows() {
		if(this.props.fileExported && this.props.fileExported.length) {
			var maxRowLength = 0; 
			return this.props.fileExported.map(function(sheet, sheetNumber) {
				var sheetName = sheet.range.match(this.state.regExp)[0];
				var returnable = [];
				var uniqueKeyGenerator = 0;
				if(sheet['values'] && sheetName) {
				var tBody =	React.createElement('tbody', {},
								sheet['values'].map(function(row, index) {
									maxRowLength = row.length > maxRowLength ? row.length : maxRowLength; 
									if(maxRowLength > row.length) {
										var diff = maxRowLength - row.length; 
										for (var i = 0; i < diff; i++) {
											row.push("");
										}
									}
									if(index !== 0) {
										var returnable = this.createTbodyRow(sheetName, row, index, sheetNumber, uniqueKeyGenerator);
										uniqueKeyGenerator+= maxRowLength;
										return returnable;
									}
								}.bind(this)));
				tBody.props.children.splice(0, 1);
				var theadRow = this.createTheadRow(sheetName, sheet['values'][0], maxRowLength, sheetNumber, uniqueKeyGenerator);
					returnable.push(theadRow);
					returnable.push(tBody);
					return returnable;
				}
			}.bind(this));
		}
	}
	/*
		if the user clicked on asana-marked td, 
	    the rendering should change to asana-light-box here: 
		(1) how do we get the state asana : true here? 
		
	*/
	render() {
		
		/*var columnsArr = [{Header: 'File', accessor: 'file'}, {Header: 'Link', accessor: 'link'}];
		React.createElement(reactTable, {"data-file-list" : this.createFileList(), "data-columns" : columnsArr})*/
		
		console.log(this.state.isAsana, 'this.state.isAsana');
		return !this.state.isAsana ? (<div>{React.createElement('table', {}, this.createRows())}</div>) : React.createElement(AsanaLightBox, {}, this.state.asanaTaskText); 
	}
}

function mapStateToProps(state) {
	return {
		asanaHistoryReducer : state.asanaHistoryReducer, 
		asanaProjectsReducer : state.asanaProjectsReducer,
		fileExported : state.fileExported, 
		imageCol : state.imageCollection, 
		filelist : state.filelist, 
		clickedFileId : state.clickedFileId,
		isAsanaBoolean : state.isAsana, 
		asanaReducer : state.asanaReducer,
		configAsanaInstanceReducer : state.configAsanaInstanceReducer, 
		asanaWorkspacesReducer : state.asanaWorkspacesReducer,
		inputMetaDataForAsanaPopup : state.inputMetaDataForAsanaPopup
	};
}

function matchDispatchToProps(dispatch){
	return bindActionCreators(
		{
			getAsanaTaskTextHistory : getAsanaTaskTextHistory, 
			getInputMetaDataForAsanaPopup : getInputMetaDataForAsanaPopup,
			getConfigAsanaInstance : getConfigAsanaInstance,
			getAsanaProjects : getAsanaProjects, 
			selectQuestion : selectQuestion,
			getFileExported : getFileExported,
			getImageCollection : getImageCollection, 
			getFilelist : getFilelist, 
			getClickedFileId : getClickedFileId, 
			getAsanaTaskText : getAsanaTaskText, 
			isAsana : isAsana, 
			getAsanaWorkspaces : getAsanaWorkspaces
		}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(TableList);