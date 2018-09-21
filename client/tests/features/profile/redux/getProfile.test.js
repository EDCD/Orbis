import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  PROFILE_GET_PROFILE_BEGIN,
  PROFILE_GET_PROFILE_SUCCESS,
  PROFILE_GET_PROFILE_FAILURE,
  PROFILE_GET_PROFILE_DISMISS_ERROR,
} from '../../../../src/features/profile/redux/constants';

import {
  getProfile,
  dismissGetProfileError,
  reducer,
} from '../../../../src/features/profile/redux/getProfile';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('profile/redux/getProfile', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getProfile succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getProfile())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', PROFILE_GET_PROFILE_BEGIN);
        expect(actions[1]).toHaveProperty('type', PROFILE_GET_PROFILE_SUCCESS);
      });
  });

  it('dispatches failure action when getProfile fails', () => {
    const store = mockStore({});

    return store.dispatch(getProfile({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', PROFILE_GET_PROFILE_BEGIN);
        expect(actions[1]).toHaveProperty('type', PROFILE_GET_PROFILE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetProfileError', () => {
    const expectedAction = {
      type: PROFILE_GET_PROFILE_DISMISS_ERROR,
    };
    expect(dismissGetProfileError()).toEqual(expectedAction);
  });

  it('handles action type PROFILE_GET_PROFILE_BEGIN correctly', () => {
    const prevState = { getProfilePending: false };
    const state = reducer(
      prevState,
      { type: PROFILE_GET_PROFILE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getProfilePending).toBe(true);
  });

  it('handles action type PROFILE_GET_PROFILE_SUCCESS correctly', () => {
    const prevState = { getProfilePending: true };
    const state = reducer(
      prevState,
      { type: PROFILE_GET_PROFILE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getProfilePending).toBe(false);
  });

  it('handles action type PROFILE_GET_PROFILE_FAILURE correctly', () => {
    const prevState = { getProfilePending: true };
    const state = reducer(
      prevState,
      { type: PROFILE_GET_PROFILE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getProfilePending).toBe(false);
    expect(state.getProfileError).toEqual(expect.anything());
  });

  it('handles action type PROFILE_GET_PROFILE_DISMISS_ERROR correctly', () => {
    const prevState = { getProfileError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: PROFILE_GET_PROFILE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getProfileError).toBe(null);
  });
});

