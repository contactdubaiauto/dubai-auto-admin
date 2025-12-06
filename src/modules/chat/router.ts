const Module = () => import('./Module.vue')
const ChatList = () => import('./pages/ChatList.vue')
const ChatRoom = () => import('./pages/ChatRoom.vue')

const moduleRoute = {
  path: '/chat',
  component: Module,
  meta: { permission: 'chat' },
  children: [
    {
      path: '',
      component: ChatList,
      meta: { permission: 'chat' },
      children: [
        {
          path: ':id',
          component: ChatRoom,
          meta: { permission: 'chat' }
        }
      ]
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
