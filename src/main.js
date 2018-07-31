// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './styles/reset.css'
import './styles/element.css'
import './styles/index.css'
import './styles/icon.css'


Vue.config.productionTip = false
Vue.use(ElementUI);
// 设置全局守卫
router.beforeEach((to, from, next) => {
    let token = localStorage.getItem('mytoken')
        // 已登陆，随便访问，不干涉
    if (token) {
        next()
    } else {
        // 未登录，想去其他页面，没门，滚去登陆
        if (to.path !== '/login') {
            next({ path: '/login' })
        } else {
            // 未登录，想去登陆，去吧，不管你喽
            next()
        }
    }
})


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})