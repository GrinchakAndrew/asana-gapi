export default function(state=null, action) {
	switch(action.type){
		case 'ASANA_GLOBAL_SELECTED_WORKSPACE_PER_FILE': {
			return action.payload;
		}
	}
	return state;
}