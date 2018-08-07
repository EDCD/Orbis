import request from 'superagent';
import {
	HOME_GET_BUILDS_BEGIN,
	HOME_GET_BUILDS_SUCCESS,
	HOME_GET_BUILDS_FAILURE,
	HOME_GET_BUILDS_DISMISS_ERROR
} from './constants';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function getBuilds(args = {}) {
	return dispatch => { // Optionally you can have getState as the second argument
		dispatch({
			type: HOME_GET_BUILDS_BEGIN
		});

		// Return a promise so that you could control UI flow without states in the store.
		// For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
		// It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
		// e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
		const promise = new Promise((resolve, reject) => {
			// DoRequest is a placeholder Promise. You should replace it with your own logic.
			// See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
			// args.error here is only for test coverage purpose.

			request.post(`/api/builds`)
				.send({
					offset: args.offset,
					pageSize: args.pageSize,
					search: args.search
				})
				.then(res => {
					dispatch({
						type: HOME_GET_BUILDS_SUCCESS,
						data: res.body
					});
					resolve(res.body);
				})
				.catch(err => {
					dispatch({
						type: HOME_GET_BUILDS_FAILURE,
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
export function dismissGetBuildsError() {
	return {
		type: HOME_GET_BUILDS_DISMISS_ERROR
	};
}

export function reducer(state, action) {
	switch (action.type) {
		case HOME_GET_BUILDS_BEGIN:
			// Just after a request is sent
			return {
				...state,
				getBuildsPending: true,
				getBuildsError: null
			};

		case HOME_GET_BUILDS_SUCCESS:
			// The request is success
			return {
				...state,
				getBuildsPending: false,
				getBuildsError: null
			};

		case HOME_GET_BUILDS_FAILURE:
			// The request is failed
			return {
				...state,
				getBuildsPending: false,
				getBuildsError: action.data.error
			};

		case HOME_GET_BUILDS_DISMISS_ERROR:
			// Dismiss the request failure error
			return {
				...state,
				getBuildsError: null
			};

		default:
			return state;
	}
}
