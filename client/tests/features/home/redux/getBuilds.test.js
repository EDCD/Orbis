import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_GET_BUILDS_BEGIN,
  HOME_GET_BUILDS_SUCCESS,
  HOME_GET_BUILDS_FAILURE,
  HOME_GET_BUILDS_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  getBuilds,
  dismissGetBuildsError,
  reducer,
} from '../../../../src/features/home/redux/getBuilds';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/getBuilds', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getBuilds succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getBuilds())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_BUILDS_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_BUILDS_SUCCESS);
      });
  });

  it('dispatches failure action when getBuilds fails', () => {
    const store = mockStore({});

    return store.dispatch(getBuilds({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_BUILDS_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_BUILDS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetBuildsError', () => {
    const expectedAction = {
      type: HOME_GET_BUILDS_DISMISS_ERROR,
    };
    expect(dismissGetBuildsError()).toEqual(expectedAction);
  });

  it('handles action type HOME_GET_BUILDS_BEGIN correctly', () => {
    const prevState = { getBuildsPending: false };
    const state = reducer(
      prevState,
      { type: HOME_GET_BUILDS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getBuildsPending).toBe(true);
  });

  it('handles action type HOME_GET_BUILDS_SUCCESS correctly', () => {
    const prevState = { getBuildsPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_BUILDS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getBuildsPending).toBe(false);
  });

  it('handles action type HOME_GET_BUILDS_FAILURE correctly', () => {
    const prevState = { getBuildsPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_BUILDS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getBuildsPending).toBe(false);
    expect(state.getBuildsError).toEqual(expect.anything());
  });

  it('handles action type HOME_GET_BUILDS_DISMISS_ERROR correctly', () => {
    const prevState = { getBuildsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_GET_BUILDS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getBuildsError).toBe(null);
  });
});

