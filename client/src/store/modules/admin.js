import axios from 'axios';

const types = {
	ADMIN_POST_ANNOUNCEMENT_REQUEST: 'ADMIN_POST_ANNOUNCEMENT_REQUEST'
};

export default {
	state: {
		announcement: {}
	},
	mutations: {
		ADMIN_POST_ANNOUNCEMENT_REQUEST(state, data) {
			state.announcement = data.data;
		}
	},
	actions: {
		async postAnnouncement({commit}, {expiresAt, message}) {
			commit(types.ADMIN_POST_ANNOUNCEMENT_REQUEST, await axios.post(`/api/admin/announcement/add`, {
				expiresAt,
				message
			}));
		}
	},
	getters: {}
};
