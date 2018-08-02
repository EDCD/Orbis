import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
	BUILD_UPDATE_BUILD_BEGIN,
	BUILD_UPDATE_BUILD_SUCCESS,
	BUILD_UPDATE_BUILD_FAILURE,
	BUILD_UPDATE_BUILD_DISMISS_ERROR
} from '../../../../src/features/build/redux/constants';

import {
	updateBuild,
	dismissUpdateBuildError,
	reducer
} from '../../../../src/features/build/redux/updateBuild';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('build/redux/updateBuild', () => {
	afterEach(() => {
		nock.cleanAll();
	});

	it('dispatches success action when updateBuild succeeds', () => {
		const store = mockStore({});

		return store.dispatch(updateBuild())
			.then(() => {
				const actions = store.getActions();
				expect(actions[0]).toHaveProperty('type', BUILD_UPDATE_BUILD_BEGIN);
				expect(actions[1]).toHaveProperty('type', BUILD_UPDATE_BUILD_SUCCESS);
			});
	});

	it('dispatches failure action when updateBuild fails', () => {
		const store = mockStore({});

		return store.dispatch(updateBuild({error: true}))
			.catch(() => {
				const actions = store.getActions();
				expect(actions[0]).toHaveProperty('type', BUILD_UPDATE_BUILD_BEGIN);
				expect(actions[1]).toHaveProperty('type', BUILD_UPDATE_BUILD_FAILURE);
				expect(actions[1]).toHaveProperty('data.error', expect.anything());
			});
	});

	it('returns correct action by dismissUpdateBuildError', () => {
		const expectedAction = {
			type: BUILD_UPDATE_BUILD_DISMISS_ERROR
		};
		expect(dismissUpdateBuildError()).toEqual(expectedAction);
	});

	it('handles action type BUILD_UPDATE_BUILD_BEGIN correctly', () => {
		const prevState = {updateBuildPending: false};
		const state = reducer(
			prevState,
			{type: BUILD_UPDATE_BUILD_BEGIN}
		);
		expect(state).not.toBe(prevState); // Should be immutable
		expect(state.updateBuildPending).toBe(true);
	});

	it('handles action type BUILD_UPDATE_BUILD_SUCCESS correctly', () => {
		const prevState = {updateBuildPending: true};
		const state = reducer(
			prevState,
			{type: BUILD_UPDATE_BUILD_SUCCESS, data: {}}
		);
		expect(state).not.toBe(prevState); // Should be immutable
		expect(state.updateBuildPending).toBe(false);
	});

	it('handles action type BUILD_UPDATE_BUILD_FAILURE correctly', () => {
		const prevState = {updateBuildPending: true};
		const state = reducer(
			prevState,
			{type: BUILD_UPDATE_BUILD_FAILURE, data: {error: new Error('some error')}}
		);
		expect(state).not.toBe(prevState); // Should be immutable
		expect(state.updateBuildPending).toBe(false);
		expect(state.updateBuildError).toEqual(expect.anything());
	});

	it('handles action type BUILD_UPDATE_BUILD_DISMISS_ERROR correctly', () => {
		const prevState = {updateBuildError: new Error('some error')};
		const state = reducer(
			prevState,
			{type: BUILD_UPDATE_BUILD_DISMISS_ERROR}
		);
		expect(state).not.toBe(prevState); // Should be immutable
		expect(state.updateBuildError).toBe(null);
	});
});

