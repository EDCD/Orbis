import axios from 'axios';

const types = {
	ANNOUNCEMENT_REQUEST: 'ANNOUNCEMENT_REQUEST',
	AUTH_REQUEST: 'AUTH_REQUEST',
	BUILD_REQUEST: 'BUILD_REQUEST',
	UPDATE_REQUEST: 'UPDATE_REQUEST',
	PROFILE_REQUEST: 'PROFILE_REQUEST'
};

export default {
	state: {
		announcements: [],
		builds: {},
		user: {},
		admin: false,
		updateAvailable: false,
		accessToken: ''
	},
	mutations: {
		ANNOUNCEMENT_REQUEST(state, data) {
			if (!data || !data.data) {
				return;
			}
			state.announcements = data.data;
		},
		BUILD_REQUEST(state, data) {
			if (!data || !data.data) {
				return;
			}
			state.builds = data.data;
		},
		PROFILE_REQUEST(state, data) {
			if (!data || !data.data) {
				return;
			}
			state.builds = data.data;
		},
		UPDATE_REQUEST(state) {
			state.updateAvailable = true;
		},
		AUTH_REQUEST(state, data) {
			if (!data) {
				state.user = null;
				state.admin = null;
				state.accessToken = null;
				return;
			}
			state.user = data.user;
			state.admin = data.admin;
			state.accessToken = data.accessToken;
		}
	},
	actions: {
		async getAnnouncements({ commit }) {
			let data;
			try {
				data = await axios.get('/api/announcement');
			} catch (e) {
				if (e.response.status !== 401) {
					console.log(e);
				}
			}
			commit(types.ANNOUNCEMENT_REQUEST, data);
		},
		async checkAuth({ commit }) {
			let data;
			try {
				data = await axios.get('/api/checkauth', {
					withCredentials: true
				});
			} catch (e) {
				if (e && e.response && e.response.status !== 401) {
					console.log(e);
				}
			}
			if (data && data.data) {
				return commit(types.AUTH_REQUEST, data.data);
			}
			return commit(types.AUTH_REQUEST, null);
		},
		async updateAvailable({ commit }) {
			commit(types.UPDATE_REQUEST);
		},

		async getBuilds({ commit }, query) {
			commit(
				types.BUILD_REQUEST,
				await axios.post('/api/builds', query, {
					withCredentials: true
				})
			);
		},
		async getProfile({ commit }, query) {
			commit(
				types.PROFILE_REQUEST,
				await axios.post(
					`/api/users/profile/${query.username}`,
					query,
					{
						withCredentials: true
					}
				)
			);
		}
	},
	getters: {}
};
