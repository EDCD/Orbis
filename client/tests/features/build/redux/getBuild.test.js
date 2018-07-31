import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  BUILD_GET_BUILD_BEGIN,
  BUILD_GET_BUILD_SUCCESS,
  BUILD_GET_BUILD_FAILURE,
  BUILD_GET_BUILD_DISMISS_ERROR,
} from '../../../../src/features/build/redux/constants';

import {
  getBuild,
  dismissGetBuildError,
  reducer,
} from '../../../../src/features/build/redux/getBuild';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('build/redux/getBuild', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getBuild succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getBuild())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', BUILD_GET_BUILD_BEGIN);
        expect(actions[1]).toHaveProperty('type', BUILD_GET_BUILD_SUCCESS);
      });
  });

  it('dispatches failure action when getBuild fails', () => {
    const store = mockStore({});

    return store.dispatch(getBuild({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', BUILD_GET_BUILD_BEGIN);
        expect(actions[1]).toHaveProperty('type', BUILD_GET_BUILD_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetBuildError', () => {
    const expectedAction = {
      type: BUILD_GET_BUILD_DISMISS_ERROR,
    };
    expect(dismissGetBuildError()).toEqual(expectedAction);
  });

  it('handles action type BUILD_GET_BUILD_BEGIN correctly', () => {
    const prevState = { getBuildPending: false };
    const state = reducer(
      prevState,
      { type: BUILD_GET_BUILD_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getBuildPending).toBe(true);
  });

  it('handles action type BUILD_GET_BUILD_SUCCESS correctly', () => {
    const prevState = { getBuildPending: true };
    const state = reducer(
      prevState,
      { type: BUILD_GET_BUILD_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getBuildPending).toBe(false);
  });

  it('handles action type BUILD_GET_BUILD_FAILURE correctly', () => {
    const prevState = { getBuildPending: true };
    const state = reducer(
      prevState,
      { type: BUILD_GET_BUILD_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getBuildPending).toBe(false);
    expect(state.getBuildError).toEqual(expect.anything());
  });

  it('handles action type BUILD_GET_BUILD_DISMISS_ERROR correctly', () => {
    const prevState = { getBuildError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: BUILD_GET_BUILD_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getBuildError).toBe(null);
  });
});

