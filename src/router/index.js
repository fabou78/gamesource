import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/components/home/index.vue'
import Signin from '@/components/user/SigninResgister.vue'
import { isAuthenticated, isLoggedIn } from '@/composables/auth'

//Dashboard routes
import Dashboard from '@/components/user/dashboard/DashIndex.vue'
import DashMain from '@/components/user/dashboard/DashMain.vue'
import UserProfile from '@/components/user/dashboard/pages/UserProfile.vue'
import ViewArticles from '@/components/user/dashboard/admin/ViewArticles.vue'
import AddArticle from '@/components/user/dashboard/admin/AddArticle.vue'
import EditArticle from '@/components/user/dashboard/admin/EditArticle.vue'
import NotFound from '@/components/404.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/signin', name: 'signin', component: Signin, beforeEnter: isLoggedIn },
    {
      path: '/user/dashboard',
      component: Dashboard,
      beforeEnter: isAuthenticated,
      children: [
        { path: '', component: DashMain, name: 'dashboard' },
        { path: 'profile', component: UserProfile, name: 'user_profile' },
        { path: 'articles', component: ViewArticles, name: 'view_articles' },
        { path: 'articles/add', component: AddArticle, name: 'add_article' },
        { path: 'articles/edit/:id', component: EditArticle, name: 'edit_article' },
      ],
    },
    { path: '/:notFound(.*)*', component: NotFound, name: '404' },
  ],
})

export default router
