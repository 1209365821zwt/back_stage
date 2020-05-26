import home from './home'
import caseManagement from './caseManagement'
import doctorManagement from './doctorManagement'
import feedBack from './feedBack'
import systyemManagement from './systyemManagement'
export default [
    {
        path: '/home',
        redirect: '/home',
        component: resolve => require(['@/views/main'], resolve),
        children: [
            ...home,
            ...caseManagement,
            ...doctorManagement,
            ...feedBack,
            ...systyemManagement
        ]
    }
]