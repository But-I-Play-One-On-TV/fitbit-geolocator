import { me } from 'appbit';
import { readFileSync, writeFileSync } from 'fs';
import { configureStore } from 'reduced-state';
import reducers from '../reducers';

const SETTINGS_FILE_NAME = 'storage';
const ENCODING = 'cbor';

const tryRestore = (): any => {
	try {
		return readFileSync(SETTINGS_FILE_NAME, ENCODING);
	} catch (e) {
		return undefined;
	}
};

const store = configureStore({
	initialState: tryRestore(),
	reducer: reducers,
});

me.addEventListener('unload', () => {
	writeFileSync(SETTINGS_FILE_NAME, store.state, ENCODING);
});

const originalDispatch = store.dispatch;
store.dispatch = (action: any) => {
	// tslint:disable-next-line: no-console
	console.log(`Action: ${action.type}`);
	originalDispatch(action);
};

export default store;
