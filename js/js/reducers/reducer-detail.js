export default function(state={}, action) {
	switch(action.type){
		case 'DETAIL_SELECTED': {
			return action.payload;
		}
		
	}
	return state;
}