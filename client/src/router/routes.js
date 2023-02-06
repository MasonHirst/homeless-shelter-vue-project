const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
      },

      {
        path: 'login',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/RegisterPage.vue'),
      },
      {
        path: 'residents',
        name: 'residents',
        component: () => import('pages/ResidentsPage.vue'),
      },
      {
        path: 'schedule',
        name: 'schedule',
        component: () => import('pages/SchedulePage.vue'),
      },
      // {
      //   path: 'logout',
      //   name: 'logout',
      //   beforeEnter(to, from, next) {
      //     let authStore = useAuth();
      //     authStore.logout()
      //       // eslint-disable-next-line no-unused-vars
      //       .then(result => {
      //         // console.log('logout:', result);
      //         if (from.path === '/') {
      //           next({name: 'login'});
      //         } else {
      //           next('/');
      //         }
      //       })
      //       .catch(error => {
      //         console.error('error logout:', error);
      //         next(from);
      //       });
      //   },
      // },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
