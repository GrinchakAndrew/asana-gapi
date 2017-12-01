export default function(state=[], action) {
	switch(action.type){
		case 'ASANA_TASK_TEXT_HISTORY': {
			return action.payload;
		}
	}
	return state;
}