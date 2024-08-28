import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isvalid = token !== null;

  // Define routes that can be accessed without a token
  const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];

  if (isvalid && publicPaths.includes(to.path)) {
    // If the token is valid and the user tries to access a public route, redirect to home
    next('/');
  } else if (!isvalid && !publicPaths.includes(to.path)) {
    // If the token is invalid or missing and the route is not public, redirect to login
    next('/login');
  } else {
    // Allow access to the requested route
    next(); 
  }
});

export default router
