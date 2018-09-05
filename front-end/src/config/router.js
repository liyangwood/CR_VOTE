
import ResetPasswordPage from '@/module/page/reset_password/Container'
import LoginPage from '@/module/page/login/Container';


import CVoteCreatePage from '@/module/page/CVote/create/Container';
import CVoteListPage from '@/module/page/CVote/list/Container';
import CVoteEditPage from '@/module/page/CVote/edit/Container';




export default [
    {
        path: '/login',
        page: LoginPage
    },
    {
        path : '/',
        page : CVoteListPage
    },
    {
        path : '/cvote/create',
        page : CVoteCreatePage
    },
    {
        path : '/cvote/list',
        page : CVoteListPage
    },
    {
        path : '/cvote/edit/:id',
        page : CVoteEditPage
    },

    {
        path: '/user/reset-password',
        page: ResetPasswordPage
    }
]
