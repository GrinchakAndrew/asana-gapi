export default function(state=null, action) {
	switch(action.type){
		case 'IS_ASANA': {
			return action.payload;
		}
	}
	return state;
}