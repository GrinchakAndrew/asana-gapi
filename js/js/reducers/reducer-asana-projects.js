export default function(state=null, action) {
	switch(action.type){
		case 'ASANA_PROJECTS_RESPONSE_DATA': {
			return action.payload;
		}
	}
	return state;
}