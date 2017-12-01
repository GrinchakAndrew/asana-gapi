/*actions index, i.e. actions creators: */
export const getInputMetaDataForAsanaPopup = (inputMetaData) => {
	return {
		type : "GET_INPUT_META_DATA_FOR_ASANA_POPUP",
		payload : inputMetaData
	}
};

export const getAsanaWorkspaces = (workspaces) => {
	return {
		type : "ASANA_WORKSPACES_RESPONSE_DATA",
		payload : workspaces
	}
};

export const getAsanaGlobalSelectedWorkspacePerFile = (workspace) => {
	return {
		type : "ASANA_GLOBAL_SELECTED_WORKSPACE_PER_FILE",
		payload : workspace
	}
};

export const getAsanaGlobalSelectedProjectPerFile = (project) => {
	return {
		type : "ASANA_GLOBAL_SELECTED_PROJECT_PER_FILE", 
		payload : project
	}
};

export const getFilelist= (filelist) => {
	return {
		type : "FILE_LIST", 
		payload : filelist
	}
};

export const getConfigAsanaInstance = (instance) => {
	return {
		type : "CONFIG_ASANA_INSTANCE",
		payload : instance
	}
};

export const getAsanaProjects = (response) => {
	return {
		type : "ASANA_PROJECTS_RESPONSE_DATA",
		payload : response.data
	}
};

export const getAsanaTaskText= (text) => {
	return {
		type : "ASANA",
		payload : text
	}
};

export const getAsanaTaskTextHistory = (history) => {
	return {
		type : "ASANA_TASK_TEXT_HISTORY",
		payload : history
	}
};

export const isAsana = (state) => {
	console.log('isAsana =>', state);
	return {
		type : "IS_ASANA",
		payload : state
	}
};

export const selectQuestion = (question) => {
	return {
		type : "QUESTION_SELECTED", 
		payload : question
	}
};

export const updateTextArea = (refs) => {
	return {
		type : "TEXTAREA_UPDATED", 
		payload : refs
	}
};

export const getImageCollection = (imgCol) => {
	return {
		type : "IMAGE_COLLECTION", 
		payload : imgCol
	}
};

export const selectDetail = (el) => {
	return {
		type : "DETAIL_SELECTED",
		payload : el
	}
};

export const getClickedFileId = (Id) => {
	return {
		type : "GET_CLICKED_FILE_ID",
		payload : Id
	}
};

export const resolvedGetFileExported = (data) => {
	return {
		type : 'RESOLVED_GET_FILE_EXPORTED', 
		payload : data
	}
}

export const getFileExported = (data)=> {
	return resolvedGetFileExported(data);
	/*this part created a thrown error: 
		dispatch(resolvedGetFileExported(data));
	'actions must be plain objects'	
	*/
}