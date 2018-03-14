export default function(state=null, action) {
	switch(action.type){
		case 'GLOBAL_GAPI_USER_LOGGED_IN': {
			return action.payload;
		}
	}
	return state;
}