import axios from 'axios';

const types = {
	BUILD_REQUEST: 'BUILD_REQUEST'
};

export default {
	state: {
		build: {
			coriolisShip: {
				costList: []
			}
		}
	},
	mutations: {
		BUILD_REQUEST(state, data) {
			state.build = data.data;
		}
	},
	actions: {
		async getBuild({ commit }, id) {
			commit(
				types.BUILD_REQUEST,
				await axios.get(`/api/builds/${id}`, {
					withCredentials: true
				})
			);
		}
	},
	getters: {}
};
