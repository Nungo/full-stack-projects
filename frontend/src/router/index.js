import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import About from '../components/About.vue';

// Define routes
const routes = [
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/', redirect: '/login' },
  { path: '/about', component: About },

  {
    path: '/:catchAll(.*)',
    redirect: '/login',  // Redirect to login for all unmatched routes
  }
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
