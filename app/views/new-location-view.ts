import { me } from 'appbit';
import { geolocation } from 'geolocation';
import { gettext } from 'i18n';
import { setLocationSlot } from '../actions/location-slots';
import { LOCATION_SLOTS_VIEW, NEW_LOCATION_VIEW } from '../constants/views';
import store from '../data-sources/state';
import { getElementById } from '../utils/document';
import { positionToString } from '../utils/position';
import { createView, INavigation } from '../utils/views';

export const createNewLocationView = (navigation: INavigation) => {
	const view = createView(NEW_LOCATION_VIEW);
	const currentLocationText = getElementById(
		view.root,
		'current-location',
	) as TextElement;
	let position: Position | null = null;
	const update = () => {
		currentLocationText.text = position
			? positionToString(position)
			: gettext('wating-gps');
	};
	const watchId = geolocation.watchPosition(newPosition => {
		position = newPosition;
		update();
	});
	me.addEventListener('unload', () => {
		geolocation.clearWatch(watchId);
	});
	view.onKeyBack = () => {
		if (position) {
			store.dispatch(
				setLocationSlot({
					details: '',
					name: positionToString(position),
					position: {
						...position,
						timestamp: Date.now(),
					},
				}),
			);
		}

		navigation.navigate(LOCATION_SLOTS_VIEW);
	};
	view.onShow = update;

	update();

	return view;
};
