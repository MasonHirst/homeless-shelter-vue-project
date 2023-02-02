import {defineAuthStore} from 'feathers-pinia';
import feathersClient from '../api/feathers-client';
import useUsersStore from './services/users';

const authStore = defineAuthStore({
  feathersClient,
  state: () => ({
    userId: null,
  }),
  getters: {
    authUser() {
      const usersStore = useUsersStore();
      return this.userId ? usersStore.getFromStore(this.userId) : null;
    },
  },
  actions: {
    handleResponse(response) {
      this.payload = response || null;
      this.userId = response.user.id || response.user._id;
      const usersStore = useUsersStore();
      usersStore.addToStore(response.user);
      return response;
    },
  },
});

export default authStore;
