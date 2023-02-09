import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import CollectionsView from "@/views/CollectionsView.vue"
import SubCollectionView from "@/views/SubCollectionView.vue"
import UsersView from "@/views/UsersView.vue"
import LliuramentView from "@/views/LliuramentView.vue"
import NotFound from "@/views/NotFound.vue"
import LlistatElements from "@/views/LlistatElements.vue"
import MovimentsView from "@/views/MovimentsView.vue"
import DelegacioView from "@/views/DelegacioView.vue"
import Fitxa from "@/views/FitxaElement.vue"
import RetornView from "@/views/RetornView.vue"
import MeuInventari from "@/views/MeuInventari.vue"
import CrearElement from "@/views/CrearElement.vue"
import BrandView from "@/views/BrandView.vue"

const routes = [
  {
    path: '/',
    name: 'home',
    component: DashboardView
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
    path: "/retorn",
    name: "Retorn",
    component: RetornView
  },
  {
    path: "/llistatElements/:id?:category?:model?:brand?",
    name: "LlistatElements",
    component: LlistatElements,
    params: true,
    props: true
  },
  {
    path: "/resultatCerca/:query?",
    name: "ResultatCerca",
    component: LlistatElements,
    props: true
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
  },
  {
    path: "/DelegacioView/:id",
    name: "DelegacioView",
    component: DelegacioView,
    params: true
  },
  {
    path: "/fitxaElement/:SerialNum",
    name: "Fitxa",
    component: Fitxa,
    params: true
  },
  {
    path: "/meuInventari",
    name: "MeuInventari",
    component: MeuInventari,
    params: true
  },
  {
    path: "/CrearElement",
    name: "CrearElement",
    component: CrearElement,
    params: true
  },
  {
    path: "/brand",
    name: "Brand",
    component: BrandView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router