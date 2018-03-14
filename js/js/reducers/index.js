import {combineReducers} from 'redux';
import fileExportedReducer from './reducer-file-exported';
import ActiveQuestionReducer from './reducer-active-question';
import DetailReducer from './reducer-detail';
import textAreaReducer from './reducer-textarea-update';
import imageCollectionReducer from './reducer-images-collection';
import fileListReducer from './reducer-filelist';
import getClickedFileIdReducer from './reducer-file-id';
import asanaReducer from './reducer-asana';
import isAsana from './reducer-is-asana';
import asanaHistoryReducer from './reducer-asana-text-history';
import asanaProjectsReducer from './reducer-asana-projects';
import asanaWorkspacesReducer from './reducer-asana-workspaces';
import configAsanaInstanceReducer from './reducer-config-asana-instance';
import asanaGlobalSelectedProjectPerFileReducer from './reducer-global-selected-project-per-file';
import asanaGlobalSelectedWorkspacePerFileReducer from './reducer-global-selected-workspace-per-file';
import inputMetaDataForAsanaPopup from './reducer-input-meta-data-for-asana-popup';
import gapiLoggedInUserReducer from './reducer-global-gapi-user-logged-in';
import getCommentsProjectsUpdateRelatedDatabaseFileReducer from './reducer-get-comments-projects-update-related-database-file.js';

const allReducers = combineReducers({
	getCommentsProjectsUpdateRelatedDatabaseFileReducer : getCommentsProjectsUpdateRelatedDatabaseFileReducer,
	gapiLoggedInUserReducer : gapiLoggedInUserReducer,
	inputMetaDataForAsanaPopup : inputMetaDataForAsanaPopup,
	asanaWorkspacesReducer : asanaWorkspacesReducer, 
	asanaGlobalSelectedProjectPerFileReducer : asanaGlobalSelectedProjectPerFileReducer,
	asanaGlobalSelectedWorkspacePerFileReducer : asanaGlobalSelectedWorkspacePerFileReducer,
	configAsanaInstanceReducer : configAsanaInstanceReducer,
	asanaProjectsReducer : asanaProjectsReducer, 
	asanaHistoryReducer : asanaHistoryReducer, 
	isAsana  : isAsana,
	asanaReducer : asanaReducer,
	fileExported : fileExportedReducer, 
	activeQuestion : ActiveQuestionReducer, 
	detail : DetailReducer, 
	textarea : textAreaReducer, 
	imageCollection	: imageCollectionReducer, 
	filelist : fileListReducer, 
	clickedFileId : getClickedFileIdReducer
});
export default allReducers;