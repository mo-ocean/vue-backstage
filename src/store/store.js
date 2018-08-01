import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {
    // 从本地读取
    username: localStorage.getItem('username') || ''

}
const mutations = {
    setUsername: (state, username) => {
        state.username = username
        localStorage.setItem('username', username)
    }
}
const actions = {}
const getters = {

}
export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})