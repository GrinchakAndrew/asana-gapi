export default function(state={}, action) {
	switch(action.type){
		case 'GET_INPUT_META_DATA_FOR_ASANA_POPUP': {
			return action.payload;
		}
		
	}
	return state;
}