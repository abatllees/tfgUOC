import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import AboutView from "@/views/AboutView.vue"
import CollectionsView from "@/views/CollectionsView.vue"
import SubCollectionView from "@/views/SubCollectionView.vue"
import UsersView from "@/views/UsersView.vue"
import LliuramentView from "@/views/LliuramentView.vue"
import NotFound from "@/views/NotFound.vue"
import LlistatElements from "@/views/LlistatElements.vue"
import MovimentsView from "@/views/MovimentsView.vue"

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
  },
  {
    path: "/lliurament",
    name: "lliurament",
    component: LliuramentView
  },
  {
    path: "/collections/llistatElements/:id",
    name: "LlistatElements",
    component: LlistatElements,
    params: true
  },
  {
    path: "/:pathMatch(.*)",
    name: "404",
    component: NotFound
  },
  {
    path: "/moviments",
    name: "Moviments",
    component: MovimentsView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router