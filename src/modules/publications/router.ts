const Module = () => import('./Module.vue')

const Cars = () => import('./pages/Cars.vue')
const CarDetail = () => import('./pages/CarDetail.vue')
const Motorcycles = () => import('./pages/Motorcycles.vue')
const Trucks = () => import('./pages/Trucks.vue')
const MotorcycleDetail = () => import('./pages/MotorcycleDetail.vue')
const TruckDetail = () => import('./pages/TruckDetail.vue')

const moduleRoute = {
  path: '/publications',
  component: Module,
  redirect: '/publications/cars',
  children: [
    {
      path: 'cars',
      component: Cars
    },
    {
      path: 'cars/:id',
      component: CarDetail
    },
    {
      path: 'motorcycles',
      component: Motorcycles
    },
    {
      path: 'motorcycles/:id',
      component: MotorcycleDetail
    },
    {
      path: 'trucks',
      component: Trucks
    },
    {
      path: 'trucks/:id',
      component: TruckDetail
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
