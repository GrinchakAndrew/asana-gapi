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
import {getClickedFileId} from '../actions/index';
import {getInputMetaDataForAsanaPopup} from '../actions/index';
import {getConfigAsanaInstance} from '../actions/index';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import {getGapiLoggedInUser} from '../actions/index';
import {getCommentsFromDataBaseFile} from '../actions/index';

class SideMenu extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
			commentsLength : 0, 
			commentsValues : null,
			clickedComment : null, 
			addingNewCommentValue : null, 
			addingNewCommentReplyValue : null, 
			replyButtonDisabledState : true, 
			commentCreateValue : "Pls., input text for a new comment",
			commentCreateReplyButtonOpacityState : true, 
			borderLeftColor : "#ffc107"
		};
    };
	componentWillMount() {
		this.setState({commentsValues : this.props.getCommentsProjectsUpdateRelatedDatabaseFileReducer});
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.getCommentsProjectsUpdateRelatedDatabaseFileReducer) {
			this.setState({commentsValues : this.props.getCommentsProjectsUpdateRelatedDatabaseFileReducer});
			var newClickedComment = this.state.clickedComment ? nextProps.getCommentsProjectsUpdateRelatedDatabaseFileReducer.comments.filter(function(i, j) {
				return i.id === this.state.clickedComment.id
				}, this)[0] : null;
			if(newClickedComment){
				this.setState({clickedComment : newClickedComment});
			}
		}
	}
	addingNewCommentTabPane() {
		return (<div className="tab-pane">
			{
				React.createElement('div', { className : "callout callout-warning m-0 py-3", 
					style : {borderLeftColor : this.state.borderLeftColor}},
						React.createElement('div', {className : "avatar float-right"}, 
							React.createElement('img', {style : {width : "24px", height : "24px"}, src : this.props.gapiLoggedInUserReducer.imageURL}, null)
						),
						React.createElement('div', {}, 
							React.createElement('textarea', {
								ref: (textarea) => {
									this.commentCreate = textarea;
								},
								style : {backgroundColor : "#fff", border : "1px solid #c9d4ec", color : "grey", fontSize : "11px", width : "88%"},
								onFocus : function(e){
									this.commentCreate.value = "";
									this.setState({commentCreateValue : ""});
									this.setState({borderLeftColor : "#ffc107"});
								}.bind(this),
								onBlur : function(e) {
									if(!this.state.commentCreateValue){
										this.setState({ commentCreateReplyButtonOpacityState : true});
										this.setState({commentCreateValue : "Pls., input text for a new comment"});
										this.commentCreate.value = "Pls., input text for a new comment";
									}
								}.bind(this),
								onChange : function(e) {
									this.setState({commentCreateValue : this.commentCreate.value})
									if(this.state.commentCreateValue){
										this.setState({ commentCreateReplyButtonOpacityState : false});
									}else {
										this.setState({ commentCreateReplyButtonOpacityState : true});
									}
								}.bind(this), 
								defaultValue : this.state.commentCreateValue
							}, null),
							React.createElement('div', {
									style : {backgroundColor : "#4d90fe", opacity : this.state.commentCreateReplyButtonOpacityState ? "0.5" : "1", margin : "8px 7px 0 0", border : "1px solid #c9d4ec", fontWeight : "bold", color : "#fff", width : "50px", textAlign : "center", float : "left", height : "23px", paddingTop : "3px", fontSize : "11px"}, 
									onClick : function(e) {
										/*handling creation of a new comment*/
										if(this.state.commentCreateValue){
											var body = {"content" : this.state.commentCreateValue};
											var request = gapi.client.drive.comments.create({
												'fileId': "15D_Nga_6x_oEJ_yUca9jeF4Zje5_EwtXRry-R70Ceq4",
												'resource': body, 
												'fields' : "content"
											});
											request.then(function(response) {
												this.props.configAsanaInstanceReducer.eventManager.trigger('header-component-pre-fetch-projects-comments', []);
												this.commentCreate.style.border = "1px solid green";
												this.commentCreate.style.color = "green";
												this.setState({ commentCreateReplyButtonOpacityState : true});
												this.setState({borderLeftColor : "darkseagreen"});
											}.bind(this), function(reason) {
												console.error('error: ' + reason.result.error.message);
										  });
										}
									}.bind(this)
								}, 'Reply'),
							React.createElement('div', {style : {clear : "both"}}, null)
						)
			)}
			</div>)
	}
	
	commentRepliesHTMLised() {
		if(this.state.clickedComment) {
			return (
			<div className="active tab-pane p-3">
				<h6>Replies:</h6>
				{
					React.createElement('div', {className : "aside-options"}, 
							React.createElement('div', {className : "clearfix mt-4"}, 
								React.createElement('small', {}, 
									React.createElement('b', {}, this.state.clickedComment.author.displayName + ' replied on ' + this.state.clickedComment.createdTime + ' regarding: ' + (this.state.clickedComment['quotedFileContent'] ? this.state.clickedComment['quotedFileContent']['value'] : ' ') + ' ' + this.state.clickedComment['content'])
								)
							),
							React.createElement('div', {}, 
									React.createElement('small', {className : "text-muted"}, 
										React.createElement('hr', {}, null), 
										this.state.clickedComment.replies.map(function(i, j ) {
											return React.createElement('small', {
											    'data-index' : j,
												key : i['author']['displayName'] + j, className : "text-muted"}, [
												React.createElement('button', {
												  className : "delete-reply-button",
												  'data-index' : j,
												  key : i['author']['displayName'] + i,	
												  style : {fontSize : "12px", backgroundColor : "white", border : "0"},
												  onMouseEnter : (e)=>{
													  e.target.style.fontSize = "14px"
												  },
												  onMouseLeave : (e)=>{
													  e.target.style.fontSize = "12px";
												  },
												  onClick : function(e){
													  var config = {
														 closest : function (el,  elClass) {
															while(el !== document.body) {
															   if(el.className == elClass) {
																	  return el;
															   }
																el = el.parentNode;
															}
														  }
													};
														var btnEl = config.closest(e.target, 'delete-reply-button'); 
														var index = btnEl ? btnEl.getAttribute('data-index') : null;
														var replyId = this.state.clickedComment.replies[index] ? this.state.clickedComment.replies[index].id : null;
														if(index && replyId) {
														    var request = gapi.client.drive.replies.delete({
															'fileId': "15D_Nga_6x_oEJ_yUca9jeF4Zje5_EwtXRry-R70Ceq4",
															'commentId': this.state.clickedComment.id,
															'replyId': replyId
														  });
														  request.then(function(response) {
															this.state.clickedComment.replies.splice(index, 1); 
															this.setState({'clickedComment' : this.state.clickedComment});
															var deleteMe = config.closest(btnEl, 'text-muted');
														  }.bind(this), function(reason) {
															console.error('error: ' + reason.result.error.message);
														  });
														}
													 }.bind(this)
												  }, React.createElement('i', { key : i['author']['displayName'] + i + j,
													  className : "fa fa-trash-o"}, null)
												 ), 
											    '(' + (j+1) + '). ' + i['author']['displayName'] + ' ' + i['createdTime'] + ' wrote: ' + i['content'] + ' ', 
												React.createElement('br', {key : i['author']['displayName'] + i['createdTime']}, null), 
												React.createElement('hr', {key : i['author']['displayName'] + i['createdTime']+ i['author']['displayName'] + i['createdTime']}, null)
											]);
										}, this)
									), 
									React.createElement('div', {className : "callout callout-warning m-0 py-3", style : {borderLeftColor : this.state.borderLeftColor}}, 
										React.createElement('div', {className : "avatar float-right"}, 
											React.createElement('img', {style : {width : "24px", height : "24px"}, src : this.props.gapiLoggedInUserReducer.imageURL}, null)), 
										React.createElement('div', {}, 
											React.createElement('textarea', {
												style: {color: "grey", 
														fontSize: "11px", 
														backgroundColor: "#fff", 
														border : "1px solid #c9d4ec", 
														color : "grey",
														width : "90%"
														},
												defaultValue : this.state.commentCreateValue,
												ref: (textarea) => {
													this.textarea = textarea;
												},
											onFocus : function(e) {
													this.textarea.value = "";
													this.setState({commentCreateValue : ""});
													this.state.replyButtonDisabledState = true;
													this.state.borderLeftColor = "#ffc107";
													this.setState({borderLeftColor : "#ffc107"});
												}.bind(this),
											onBlur : function(e) {
												if(!this.state.commentCreateValue){
													this.setState({ commentCreateReplyButtonOpacityState : true});
													this.setState({commentCreateValue : "Pls., input text for a new comment"});
													this.textarea.value = "Pls., input text for a new comment";
												}
											}.bind(this),
												onChange : function(e) {
													this.setState({addingNewCommentReplyValue : this.textarea.value});
													if(this.state.addingNewCommentReplyValue) {
														this.setState({replyButtonDisabledState : false});
													}else {
														this.setState({replyButtonDisabledState : true});
													}
												}.bind(this)
										}, null), 
											React.createElement('button', {
										disabled : this.state.replyButtonDisabledState,
										style : {
											backgroundColor : "#4d90fe", 
											opacity : this.state.replyButtonDisabledState ? "0.5" : "1", 
											color : "white", 
											border : "0", 
											fontWeight : "bold", 
											fontSize : "11px"
										},
										onClick : function(e) {
										   /*inserting a new reply to a comment */
											var body = {'content': this.state.addingNewCommentReplyValue};
											var request = gapi.client.drive.replies.create({
												'fileId': "15D_Nga_6x_oEJ_yUca9jeF4Zje5_EwtXRry-R70Ceq4",
												  'commentId': this.state.clickedComment.id,
												  'resource': body, 
												  'fields' : "content"
											  });
											  request.then(function(response) {
												this.textarea.style.border = "1px solid green";
												this.commentCreate.style.color = "green";
												this.setState({addingNewCommentReplyValue : ""});
												this.setState({ commentCreateReplyButtonOpacityState : true});
												this.setState({borderLeftColor : "darkseagreen"});
											  }.bind(this), 
											  function(reason) {
												console.error('error: ' + reason.result.error.message);
											  }).then(function() {
												  this.props.configAsanaInstanceReducer.eventManager.trigger('header-component-pre-fetch-projects-comments', []);
											  }.bind(this), function(err){console.log(err, "something must have gone terribly wrong")});
										}.bind(this)
									}, 'Reply')
										)
									)
							)
						)
				}
			<hr/>
		  </div>);
		}else {
			return (
			<div className="active tab-pane p-3">
				Click on Comment to see the Replies in detail... 
				<hr/>
			</div>);
		}
	}
	
	commentsHTMLized(){
		if(this.props.getCommentsProjectsUpdateRelatedDatabaseFileReducer && this.props.getCommentsProjectsUpdateRelatedDatabaseFileReducer.comments) {
			return (
			<div className="active tab-pane p-3">
				{this.props.getCommentsProjectsUpdateRelatedDatabaseFileReducer.comments.map(function(i, j) {
					var content2show = (i['quotedFileContent'] ? i['quotedFileContent']['value'] : '') + i['content']; 
					return React.createElement('div', {key : content2show +i['createdTime'], className : "message", 
						'data-index-in-comments-values-file' : j,
						onClick : function(e){
									var config = {
									 closest : function (el,  elClass) {
										while(el !== document.body) {
										   if(el.className == elClass) {
												  return el;
										   }
											el = el.parentNode;
										}
									}
								  };
									var divMessage = config.closest(e.target, 'message'); 
									var commentsIndex = divMessage ? divMessage.getAttribute('data-index-in-comments-values-file') : null;
									if(commentsIndex) {
										var commentObject = this.state.commentsValues.comments ? this.state.commentsValues.comments[commentsIndex] : 
										this.state.commentsValues[commentsIndex];
										console.log(commentObject['replies']);
										this.setState({'clickedComment' : commentObject});
										/*replacing active class for current element:*/
										var activeEl = document.querySelector('li a.nav-link.active'); 
										if(activeEl) {
												activeEl.className = activeEl.className.replace('active', '');
										 }
										/*setting a new active element now:*/
										var active2beEl = document.querySelectorAll('.aside-menu ul li a.nav-link')[2];
											active2beEl.click();
									}
								}.bind(this)
					},
							React.createElement('div', {key : content2show + i + i['createdTime']}, 
									React.createElement('small', {className : "text-muted"}, null),
									React.createElement('small', {className : "text-muted float-right mt-1"}, null)
							), 
							React.createElement('div', {key : content2show +i +j + i['createdTime'], className : "text-truncate font-weight-bold"}, 
									i['content']
							),
							React.createElement('small', {
								className : "text-muted", 
								'data-index-in-comments-values-file' : j
								}, 
								[React.createElement('div', {key : i+ content2show +j + i['createdTime'], style: {marginTop : "7px"}}, content2show), 
								 React.createElement('small', {key : j+content2show + i + i['createdTime']}, this.state.commentsValues.comments ? this.state.commentsValues.comments[j]['replies'].map(function(i, j){ return i['createdTime'] + ' ' + i['content']}) : 
								this.state.commentsValues[j]['replies'].map(function(i, j){ return i['createdTime'] + ' ' + i['content']}))]
							), 
							React.createElement('div', {key : j + i['createdTime'], style : {float : "right"}}, 
								React.createElement('div', {key : content2show + j + i['createdTime'], className : "avatar"}, 
									React.createElement('img', {className : "img-avatar", 
									src : i['author']['photoLink']}, null), 
									React.createElement('span', {className : "avatar-status badge-success"}, null)
								)
							), 
							React.createElement('hr', {key : j+content2show + j + i + j+content2show + j + i + i['createdTime'], style : {clear : "both"}}, null)
						);
				}, this)}
			<hr/>	
			</div>);
		}else {
			return (
			<div className="active tab-pane p-3">
				...Loading Comments
			<hr/>	
			</div>);
		}
	}
	
    render() {
		return (
			<aside className="aside-menu">
		<ul className="nav nav-tabs" onClick = {(e)=>{
			var config = {
				 closest : function (el,  elClass) {
					while(el !== document.body) {
					   if(el.className == elClass) {
							  return el;
					   }
						el = el.parentNode;
					}
				}, 
				divEl : null
			  };
			  config.divEl = config.closest(e.target, 'nav nav-tabs');
			  config.liCol = config.divEl.querySelectorAll('li');
			  config.index = null;
			  config.liCol.forEach(function(i, j){
				  if(i == config.closest(e.target, 'nav-item')){
					config.index = j;  
				  }
				  });
			config.divEl.querySelectorAll('a').forEach(function(i, j){
				if(j == config.index){
						i.className = i.className.replace('active', '');   
						i.className = i.className + " active";
				}else {
					i.className = i.className.replace('active', ''); 
				}
			});
			
			  config.divEl = config.divEl.nextElementSibling;
			  if(config.divEl && config.index+1){
				  config.divEl.querySelectorAll('div.tab-pane').forEach(function(i, j){
					  if(j == config.index){
						i.className = i.className.replace('active', '');   
						i.className = i.className + " active";
					  }else {
						 i.className = i.className.replace('active', ''); 
					  }
				  });
			  }
		}}>
			<li className="nav-item" style={{display : "inline-block"}}>
					<a className="nav-link">
						<i className="fa fa-plus-square"></i>
					</a>
				</li>
			<li className="nav-item" style={{display : "inline-block"}} >
				<a className="active nav-link">
					<i className="fa fa-list"></i>
				</a>
			</li>
			<li className="nav-item" style={{display : "inline-block"}}>
				<a className="nav-link">
					<i className="fa fa-list"></i>
				</a>
			</li>
		</ul>
		<div className="tab-content">
			{this.addingNewCommentTabPane()}
			{this.commentsHTMLized()}
			{this.commentRepliesHTMLised()}
		</div>
	</aside>
			)
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
export default connect(mapStateToProps, matchDispatchToProps)(SideMenu);