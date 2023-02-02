import { boot } from 'quasar/wrappers';
import feathersClient from '../api/feathers-client';

export default boot(({ app }) => {
  app.config.globalProperties.$feathersClient = feathersClient;
  app.provide('$feathersClient', feathersClient);
});
