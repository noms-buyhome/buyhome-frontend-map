import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import KakaoMap from "@/views/KakaoMap.vue"
import HomeSample from "@/components/home/HomeSample"
import HomeSpring from "@/components/home/HomeSpring"
import HomePin from "@/components/home/HomePin"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/home',
    name: "KakaoMap",
    component: KakaoMap,
    redirect: "/home/sample",
    children: [
      {
        path: "sample",
        name: "HomeSample",
        component: HomeSample,
      },
      {
        path: "spring",
        name: "HomeSpring",
        component: HomeSpring,
      },
      {
        path: "pin",
        name: "HomePin",
        component: HomePin,
      }
    ],
  },
]

const router = new VueRouter({
  //routes
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
