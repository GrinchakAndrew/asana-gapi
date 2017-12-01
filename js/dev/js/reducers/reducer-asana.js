export default function(state=null, action) {
	//
	switch(action.type){
		case 'ASANA': {
			return action.payload;
		}
	}
	return state;
}