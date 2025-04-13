import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/components/home/index.vue'
import Signin from '@/components/user/SigninResgister.vue'

//Dashboard routes
import Dashboard from '@/components/user/dashboard/DashIndex.vue'
import DashMain from '@/components/user/dashboard/DashMain.vue'
import UserProfile from '@/components/user/dashboard/pages/UserProfile.vue'
import ViewArticle from '@/components/user/dashboard/admin/ViewArticle.vue'
import AddArticle from '@/components/user/dashboard/admin/AddArticle.vue'
import EditArticle from '@/components/user/dashboard/admin/EditArticle.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/signin', name: 'signin', component: Signin },
    {
      path: '/user/dashboard',
      component: Dashboard,
      children: [
        { path: '', component: DashMain, name: 'dashboard' },
        { path: 'profile', component: UserProfile, name: 'user_profile' },
        { path: 'articles', component: ViewArticle, name: 'view_articles' },
        { path: 'articles/add', component: AddArticle, name: 'add_article' },
        { path: 'articles/edit/:id', component: EditArticle, name: 'edit_article' },
      ],
    },
  ],
})

export default router
