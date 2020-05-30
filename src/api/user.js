import { axios } from '@/utils/request'

const api = {
  getUserList: '/system/user/list',
  addUser: '/system/user/add',
  modifyUser: '/system/user/update',
  deleteUser: '/system/user/delete',
  selectRoles: '/system/role/selectList',
  lockAccount: '/system/user/lockAccount'
}

export function getUserList (parameter) {
  return axios({
    url: api.getUserList,
    method: 'post',
    data: parameter
  })
}

export function selectRoles () {
  return axios({
    url: api.selectRoles,
    method: 'get'
  })
}

export function addUser (parameter) {
  return axios({
    url: api.addUser,
    method: 'post',
    data: parameter
  })
}

export function deleteUser (parameter) {
  return axios({
    url: api.deleteUser + '/' + parameter,
    method: 'delete'
  })
}

export function modifyUser (parameter) {
  return axios({
    url: api.modifyUser,
    method: 'post',
    data: parameter
  })
}

export function lockAccount (parameter) {
  return axios({
    url: api.lockAccount,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    data: parameter
  })
}