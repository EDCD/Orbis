import {
	BUILD_GET_BUILD_BEGIN,
	BUILD_GET_BUILD_SUCCESS,
	BUILD_GET_BUILD_FAILURE,
	BUILD_GET_BUILD_DISMISS_ERROR
} from './constants';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function getBuild(args = {}) {
	return dispatch => { // Optionally you can have getState as the second argument
		dispatch({
			type: BUILD_GET_BUILD_BEGIN
		});

		// Return a promise so that you could control UI flow without states in the store.
		// For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
		// It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
		// e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
		const promise = new Promise((resolve, reject) => {
			// DoRequest is a placeholder Promise. You should replace it with your own logic.
			// See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
			// args.error here is only for test coverage purpose.
			fetch(`/api/builds/${args.id}`)
				.then(res => res.json())
				.then(res => {
					dispatch({
						type: BUILD_GET_BUILD_SUCCESS,
						data: res
					});
					resolve(res);
				})
				.catch(err => {
					dispatch({
						type: BUILD_GET_BUILD_FAILURE,
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
export function dismissGetBuildError() {
	return {
		type: BUILD_GET_BUILD_DISMISS_ERROR
	};
}

export function reducer(state, action) {
	switch (action.type) {
		case BUILD_GET_BUILD_BEGIN:
			// Just after a request is sent
			return {
				...state,
				getBuildPending: true,
				getBuildError: null
			};

		case BUILD_GET_BUILD_SUCCESS:
			// The request is success
			return {
				...state,
				getBuildPending: false,
				getBuildError: null
			};

		case BUILD_GET_BUILD_FAILURE:
			// The request is failed
			return {
				...state,
				getBuildPending: false,
				getBuildError: action.data.error
			};

		case BUILD_GET_BUILD_DISMISS_ERROR:
			// Dismiss the request failure error
			return {
				...state,
				getBuildError: null
			};

		default:
			return state;
	}
}
