export default function(state={}, action) {
	switch(action.type){
		case 'GET_CLICKED_FILE_ID': {
			return action.payload;
		}
		
	}
	return state;
}