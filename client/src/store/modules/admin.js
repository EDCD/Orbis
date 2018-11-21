import axios from 'axios';

const types = {
  ADMIN_POST_ANNOUNCEMENT_REQUEST: 'ADMIN_POST_ANNOUNCEMENT_REQUEST',
  ADMIN_DELETE_ANNOUNCEMENT_REQUEST: 'ADMIN_DELETE_ANNOUNCEMENT_REQUEST'
};

export default {
  state: {
    announcement: {}
  },
  mutations: {
    ADMIN_POST_ANNOUNCEMENT_REQUEST(state, data) {
      state.announcement = data.data;
    },
    ADMIN_DELETE_ANNOUNCEMENT_REQUEST(state, data) { }
  },
  actions: {
    async postAnnouncement({ commit }, { expiresAt, message, showInCoriolis }) {
      commit(types.ADMIN_POST_ANNOUNCEMENT_REQUEST, await axios.post(`/api/admin/announcement/add`, {
        expiresAt,
        showInCoriolis,
        message
      }, {
          withCredentials: true
        }));
    },
    async deleteAnnouncement({ commit }, { id }) {
      try {
        await axios.post(`/api/admin/announcement/delete`, {
          id
        }, {
            withCredentials: true
          })
      } catch (e) {
        if (e.response.status !== 401) {
          console.log(e);
        }
      }
      commit(types.ADMIN_DELETE_ANNOUNCEMENT_REQUEST, id);
    }
  },
  getters: {}
};
