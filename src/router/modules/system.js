import Layout from '@/layout'

const systemRouter = {
  path: '/charts',
  component: Layout,
  redirect: 'noRedirect',
  name: '系统管理',
  meta: {
    title: '系统管理',
    icon: 'chart',
    roles: ['admin']
  },
  children: [
    {
      path: 'sysUser',
      component: () => import('@/views/system/sysUser'),
      name: 'sysUser',
      meta: { title: '用户管理', noCache: true, roles: ['admin'] }
    },
    {
      path: 'line',
      component: () => import('@/views/charts/line'),
      name: 'LineChart',
      meta: { title: '角色管理', noCache: true }
    },
    {
      path: 'mix-chart',
      component: () => import('@/views/charts/mix-chart'),
      name: 'MixChart',
      meta: { title: 'Mix Chart', noCache: true }
    }
  ]
}

export default systemRouter
