import axios from 'axios'

const baseURL = 'http://localhost:8888/api/private/v1/'
axios.defaults.baseURL = baseURL

// 登陆验证
export const checkUser = params => {
        return axios.post('login', params).then(res => res.data)
    }
    // 添加axios拦截器
axios.interceptors.request.use(config => {
    // 将token给到一个前后台约定好的key中，作为请求发送
    let token = localStorage.getItem('mytoken')
    if (token) {
        config.headers['Authorization'] = token
    }
    return config
}, error => {
    // Do something with request error
    return Promise.reject(error)
})
export const getUserList = params => {
        return axios.get('users', params).then(res => res.data)
    }
    // 更改用户状态
export const changeUserState = params => {
        return axios.put(`users/${params.uid}/state/${params.type}`, params).then(res => res.data)
    }
    // 添加用户
export const addUser = params => {
        return axios.post(`users`, params).then(res => res.data)
    }
    // 根据ID查询用户信息
export const queryUserId = params => {
        return axios.get(`users/${params}`, params).then(res => res.data)
    }
    // 编辑用户提交
export const editUser = params => {
        return axios.put(`users/${params.id}`, params).then(res => res.data)
    }
    // 删除单个用户
export const delUser = params => {
        return axios.delete(`users/${params}`, params).then(res => res.data)
    }
    // 获取 角色列表
export const getRoleList = params => {
        return axios.get(`roles`).then(res => res.data)
    }
    // 给用户分配角色
export const grantUserRole = params => {
        return axios.put(`users/${params.id}/role`, { id: params.id, rid: params.rid }).then(res => res.data)
    }
    // 获取权限列表
export const getRightList = params => {
        return axios.get(`rights/${params.type}`).then(res => res.data)
    }
    // 删除角色指定权限
export const deleteRoleRight = params => {
        return axios.delete(`roles/${params.roleId}/rights/${params.rightId}`).then(res => res.data)
    }
    // 授权提交
export const grantRoleRight = (roleId, rids) => {
        return axios.post(`roles/${roleId}/rights`, rids).then(res => res.data)
    }
    // 左侧 菜单权限
export const getMenus = () => {
    return axios.get(`menus`).then(res => res.data)
}