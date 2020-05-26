export default [
    {
        path: '/OfficeManagement',
        name: 'OfficeManagement',
        component: resolve => require(['@/views/main/DoctorManagement/OfficeManagement'], resolve)
    },
    {
        path: '/HosManagement',
        name: 'HosManagement',
        component: resolve => require(['@/views/main/DoctorManagement/HosManagement'], resolve)
    },
    {
        path: '/DoctorManagement',
        name: 'DoctorManagement',
        component: resolve => require(['@/views/main/DoctorManagement/DoctorManagement'], resolve)
    }
]