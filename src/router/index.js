import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import AboutView from "@/views/AboutView.vue"
import CollectionsView from "@/views/CollectionsView.vue"
import SubCollectionView from "@/views/SubCollectionView.vue"
import UsersView from "@/views/UsersView.vue"

const routes = [
  {
    path: '/',
    name: 'home',
    component: DashboardView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: "/collections",
    name: "collections",
    component: CollectionsView,
  },
  {
    path: "/collections/:id",
    name: "subcollection",
    component: SubCollectionView,
    params: true
  },
  {
    path: "/users",
    name: "users",
    component: UsersView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router