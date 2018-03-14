export default function(state=null, action) {
	//
	switch(action.type){
		case 'CONFIG_ASANA_INSTANCE': {
			return action.payload;
		}
	}
	return state;
}