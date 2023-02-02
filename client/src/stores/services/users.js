import feathersClient from '../../api/feathers-client';
import { defineStore, BaseModel } from 'feathers-pinia';


export class Users extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }

  // Define default properties here
  static instanceDefaults(/*data, {models, store}*/) {
    return {
      email: undefined,
      password: undefined,
    };
  }

  static setupInstance(data/*, { models }*/) {
    let createdAt = data?.createdAt;
    if (typeof createdAt === 'string') {
      data.createdAt = new Date(createdAt);
    }
    let updatedAt = data?.updatedAt;
    if (typeof updatedAt === 'string') {
      data.updatedAt = new Date(updatedAt);
    }
    return data;
  }
}

const servicePath = 'users';
const useStore = defineStore({
  Model: Users,
  servicePath,
  clients: { api: feathersClient },
  idField: '_id',
  state() {
    return {};
  },
  getters: {},
  actions: {},
});

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
});

export default useStore;
