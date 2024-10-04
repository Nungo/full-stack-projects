import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue'; // Your main dashboard or home view
import Login from '../views/Login.vue'; // Login page view
import Register from '../views/Register.vue'; // Registration page view
import NotFound from '../views/NotFound.vue'; // 404 page view

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
