export default [
    {
        path: '/AccountManagement',
        name: 'AccountManagement',
        component: resolve => require(['@/views/main/SystyemManagement/AccountManagement'], resolve)
    },
    {
        path: '/RoleManagement',
        name: 'RoleManagement',
        component: resolve => require(['@/views/main/SystyemManagement/RoleManagement'], resolve)
    }
]