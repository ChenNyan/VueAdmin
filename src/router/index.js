import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = ()=>import('@/views/Login')
const Home = ()=>import('@/views/Home')
const Welcome = () => import("@/views/Welcome")
const Users = () => import("@/views/Users")
const Roles = () => import("@/views/Roles")
const Rights = () => import("@/views/Rights")
const Goods = () => import("@/views/Goods")
const Params = () => import("@/views/Params")
const Categories = () => import("@/views/Categories")
const Orders = () => import("@/views/Orders")
const Reports = () => import("@/views/Reports")
const Notfound = () => import("@/views/Notfound")
const Addgoods = () =>import("@/views/Addgoods")

const routes = [
  {
    path: '/',
    redirect:'/login',
  },
  {
    path: '/login',
    component:Login,
    name:'Login'
  },
  {
    path: '/home',
    component:Home,
    name: 'Home',
    redirect: '/welcome',
    children: [
      {path: '/welcome', component:Welcome, name: 'Welcome'},
      // {path: '/users', component:Users, name: 'Users'},
      // {path: '/roles', component:Roles, name:'Roles'},
      // {path: '/rights', component:Rights, name:'Rights'},
      // {path: '/goods', component:Goods, name:'Goods'},
      // {path: '/params', component:Params, name:'Params'},
      // {path: '/categories', component:Categories, name:'Categories'},
      // {path: '/orders', component:Orders, name:'Orders'},
      // {path: '/reports', component:Reports, name:'Reports'},
    ]
  },
  {
    path: '*',
    component: Notfound,
    name: 'Notfound',
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const newRouterList={
  'users':{ path: '/users', component: Users },
  'roles':{path:'/roles',component:Roles,name:'Roles'},
  'rights':{path:'/rights',component:Rights,name:'Rights'},
  'goods':{path:'/goods',component:Goods,name:'Goods'},
  'params':{path:'/params',component:Params,name:'Params'},
  'categories':{path:'/categories',component:Categories,name:'Categories'},
  'orders':{path:'/orders',component:Orders,name:'Orders'},
  'reports':{path:'/reports',component:Reports,name:'Reports'},
}

export function resetRouter(){
  let myrouter = router.options.routes
  let menus = JSON.parse(sessionStorage.getItem('menus'))
  if(!menus) return
  menus.forEach(item=>{
    item.children.forEach(citem=>{
      if (citem.path === 'goods') {
        myrouter[2].children.push({path: '/addgoods', component:Addgoods, name:'Addgoods'})
      }
      myrouter[2].children.push(newRouterList[citem.path])
    })
  })
  router.addRoutes(myrouter)
}

export default router
