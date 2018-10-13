import axios from 'axios';

const types = {
	VOTE_GET_REQUEST: 'VOTE_GET_REQUEST',
	VOTE_POST_REQUEST: 'VOTE_POST_REQUEST'
};

export default {
	state: {
		votes: {},
		counts: {}
	},
	mutations: {
		VOTE_GET_REQUEST(state, {id, data}) {
			if (!data || !id) {
				return;
			}
			state.votes[id] = data.data;
		},
		VOTE_POST_REQUEST(state, {id, data}) {
			if (!data || !id) {
				return;
			}
			state.votes[id] = data.data;
			state.counts[id] = data.data.count;
		}
	},
	actions: {
		async getVote({commit}, id) {
			let data;
			try {
				data = await axios.get(`/api/builds/liked/${id}`, {
					withCredentials: true
				});
			} catch (e) {
				if (e.response.status !== 403 && e.response.status !== 401) {
					console.log(e);
				}
			}
			commit(types.VOTE_GET_REQUEST, {data, id});
		},
		async postVote({commit}, {id, vote}) {
			commit(types.VOTE_POST_REQUEST, {
				data: await axios.post(`/api/likes`, {vote, shipId: id}, {
					withCredentials: true
				}), id
			});
		}
	},
	getters: {}
};
