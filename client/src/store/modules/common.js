import axios from 'axios';

const types = {
	ANNOUNCEMENT_REQUEST: 'ANNOUNCEMENT_REQUEST',
	AUTH_REQUEST: 'AUTH_REQUEST',
	BUILD_REQUEST: 'BUILD_REQUEST',
	PROFILE_REQUEST: 'PROFILE_REQUEST'
};

export default {
	state: {
		announcements: [],
		builds: {},
		user: {},
		admin: false,
		accessToken: ''
	},
	mutations: {
		ANNOUNCEMENT_REQUEST(state, data) {
			state.announcements = data.data;
		},
		BUILD_REQUEST(state, data) {
			state.builds = data.data;
		},
		PROFILE_REQUEST(state, data) {
			state.builds = data.data;
		},
		AUTH_REQUEST(state, data) {
			if (!data || !data.data) {
				return;
			}
			console.log(data);
			state.user = data.data.user;
			state.admin = data.data.admin;
			state.accessToken = data.data.accessToken;
		}
	},
	actions: {
		async getAnnouncements({commit}) {
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
		async checkAuth({commit}) {
			let data;
			try {
				data = await axios.get('/api/checkauth')
			} catch (e) {
				if (e.response.status !== 401) {
					console.log(e);
				}
			}
			commit(types.AUTH_REQUEST, data);
		},
		async getBuilds({commit}, query) {
			commit(types.BUILD_REQUEST, await axios.post('/api/builds', query));
		},
		async getProfile({commit}, query) {
			commit(types.PROFILE_REQUEST, await axios.post(`/api/users/profile/${query.username}`, query));
		}
	},
	getters: {}
};
