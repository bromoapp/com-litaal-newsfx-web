
const routes = [
  {
    path: '/',
    component: () => import('src/layouts/DashboardLayout.vue'),
    children: [
      { path: '/search', name: 'search', component: () => import('src/pages/SearchPage.vue') },
      { path: '/onepair', name: 'onepair', component: () => import('src/pages/ImpactOnPairPage.vue') },
      { path: '/manypairs', name: 'manypairs', component: () => import('src/pages/ImpactOnPairsPage.vue') },
      { path: '/profile', name: 'profile', component: () => import('src/pages/ProfilePage.vue') },
      { path: '/payment', name: 'payment', component: () => import('src/pages/PaymentPage.vue') },
      { path: '/tutorial', name: 'tutorial', component: () => import('src/pages/TutorialPage.vue') },
      { path: '/about', name: 'about', component: () => import('src/pages/AboutPage.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('src/layouts/IndexLayout.vue'),
    children: [
      { path: '/login', name: 'login', component: () => import('src/pages/LoginPage.vue') },
      { path: '/register', name: 'register', component: () => import('src/pages/RegisterPage.vue') },
      { path: '/forget', name: 'forget', component: () => import('src/pages/ForgetPage.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
