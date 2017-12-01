export default function(state=[], action) {
	switch(action.type){
		case "ASANA_WORKSPACES_RESPONSE_DATA": {
			return action.payload;
		}
	}
	return state;
}