import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('./views/Products.vue'),
      children: [
        {
          path: ':id',
          name: 'product-details',
          component: () => import('./components/ProductDetails.vue'),
        }
      ]
    },
    {
      path: '/carts',
      name: 'carts',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Cart.vue'),
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('./views/Transactions.vue'),
      children: [
        {
          path: 'address',
          name: 'transactions-address',
          component: () => import('./components/TransactionAddress.vue'),
        },
        {
          path: 'finish',
          name: 'transactions-finish',
          component: () => import('./components/TransactionFinish.vue'),
        },
        {
          path: ':id',
          name: 'transactions-details',
          component: () => import('./components/TransactionDetails.vue'),
        },
        
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('./views/AdminTransactions.vue'),
    },
    {
      path: '/myprofile',
      name: 'myprofile',
      component: () => import('./views/MyProfile.vue'),
    },
  ],
});
