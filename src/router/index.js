import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Welcome from '@/views/Welcome/Welcome'
import User from '@/views/user/User'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/Login',
            name: 'Login',
            component: Login
        },
        {
            path: '/',
            name: 'Home',
            component: Home,
            redirect: { path: 'welcome' },
            children: [{
                name: 'Welcome',
                path: 'Welcome',
                component: Welcome
            }, {
                name: 'User',
                path: 'user',
                component: User
            }]
        }
    ]
})