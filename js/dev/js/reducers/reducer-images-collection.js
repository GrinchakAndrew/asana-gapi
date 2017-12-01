export default function(state={}, action) {
	switch(action.type){
		case 'IMAGE_COLLECTION': {
			return action.payload;
		}
	}
	return state;
}