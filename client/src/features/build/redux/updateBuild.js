import {
  BUILD_UPDATE_BUILD_BEGIN,
  BUILD_UPDATE_BUILD_SUCCESS,
  BUILD_UPDATE_BUILD_FAILURE,
  BUILD_UPDATE_BUILD_DISMISS_ERROR
} from './constants';
import request from 'superagent';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function updateBuild(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: BUILD_UPDATE_BUILD_BEGIN
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is a placeholder Promise. You should replace it with your own logic.
      // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
      // args.error here is only for test coverage purpose.
      request.post(`/api/builds/update`)
        .send({ updates: args.updates, id: args.shipId })
        .then(res => {
          dispatch({
            type: BUILD_UPDATE_BUILD_SUCCESS,
            data: res.body
          });
          resolve(res.body);
        })
        .catch(err => {
          dispatch({
            type: BUILD_UPDATE_BUILD_FAILURE,
            data: { error: err }
          });
          reject(err);
        });
    });
    return promise;
  };
}

// Async action saves request error by default, this method is used to dismiss the error info.
// If you don't want errors to be saved in Redux store, just ignore this method.
export function dismissUpdateBuildError() {
  return {
    type: BUILD_UPDATE_BUILD_DISMISS_ERROR
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case BUILD_UPDATE_BUILD_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateBuildPending: true,
        updateBuildError: null
      };

    case BUILD_UPDATE_BUILD_SUCCESS:
      // The request is success
      return {
        ...state,
        updateBuildPending: false,
        updateBuildError: null
      };

    case BUILD_UPDATE_BUILD_FAILURE:
      // The request is failed
      return {
        ...state,
        updateBuildPending: false,
        updateBuildError: action.data.error
      };

    case BUILD_UPDATE_BUILD_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateBuildError: null
      };

    default:
      return state;
  }
}
