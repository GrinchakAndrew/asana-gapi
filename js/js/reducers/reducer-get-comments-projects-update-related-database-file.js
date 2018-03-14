export default function(state=null, action) {
	switch(action.type){
		case "GET_COMMENTS_FROM_DATABASE_FILE_ON_PROJECTS_UPDATE": {
			return action.payload;
		}
	}
	return state;
}