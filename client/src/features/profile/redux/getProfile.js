import {
	PROFILE_GET_PROFILE_BEGIN,
	PROFILE_GET_PROFILE_SUCCESS,
	PROFILE_GET_PROFILE_FAILURE,
	PROFILE_GET_PROFILE_DISMISS_ERROR
} from './constants';
import request from 'superagent';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function getProfile(args = {}) {
	return dispatch => { // Optionally you can have getState as the second argument
		dispatch({
			type: PROFILE_GET_PROFILE_BEGIN
		});

		// Return a promise so that you could control UI flow without states in the store.
		// For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
		// It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
		// e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
		const promise = new Promise((resolve, reject) => {
			// DoRequest is a placeholder Promise. You should replace it with your own logic.
			// See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
			// args.error here is only for test coverage purpose.
			return request
				.get(`/api/users/profile/${args.username}`)
				.query({
					pageSize: args.pageSize,
					offset: args.offset
				})
				.then(res => {
					dispatch({
						type: PROFILE_GET_PROFILE_SUCCESS,
						data: res.body
					});
					resolve(res.body);
				})
				.catch(err => {
					dispatch({
						type: PROFILE_GET_PROFILE_FAILURE,
						data: {error: err}
					});
					reject(err);
				});
		});
		return promise;
	};
}

// Async action saves request error by default, this method is used to dismiss the error info.
// If you don't want errors to be saved in Redux store, just ignore this method.
export function dismissGetProfileError() {
	return {
		type: PROFILE_GET_PROFILE_DISMISS_ERROR
	};
}

export function reducer(state, action) {
	switch (action.type) {
		case PROFILE_GET_PROFILE_BEGIN:
			// Just after a request is sent
			return {
				...state,
				getProfilePending: true,
				getProfileError: null
			};

		case PROFILE_GET_PROFILE_SUCCESS:
			// The request is success
			return {
				...state,
				getProfilePending: false,
				getProfileError: null
			};

		case PROFILE_GET_PROFILE_FAILURE:
			// The request is failed
			return {
				...state,
				getProfilePending: false,
				getProfileError: action.data.error
			};

		case PROFILE_GET_PROFILE_DISMISS_ERROR:
			// Dismiss the request failure error
			return {
				...state,
				getProfileError: null
			};

		default:
			return state;
	}
}
