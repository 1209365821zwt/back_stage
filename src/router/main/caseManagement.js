export default [

    {
        path: '/CaseManagement',
        name: 'CaseManagement',
        component: resolve => require(['@/views/main/CaseManagement/CaseManagement'], resolve)
    },
    {
        path: '/InjectionRecord',
        name: 'InjectionRecord',
        component: resolve => require(['@/views/main/CaseManagement/InjectionRecord'], resolve)
    }
]