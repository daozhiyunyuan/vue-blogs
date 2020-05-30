import { axios } from '@/utils/request'

const api = {
  roles: '/system/role/list/',
  permission: '/system/menu/getList',
  addMenu: '/system/menu/add',
  modifyMenu: '/system/menu/update',
  addRole: '/system/role/authorization',
  modifyRole: '/system/role/update',
  authRole: '/system/role/auth',
  verification: '/system/menu/check',
  deleteMenu: '/system/menu/delete',
  authTree: '/system/role/authTree',
  deleteRole: '/system/role/delete'
}

export function getRoles () {
  return axios({
    url: api.roles,
    method: 'get'
  })
}

export function deleteRole (parameter) {
  return axios({
    url: api.deleteRole,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    data: parameter
  })
}

export function permissionList () {
  return axios({
    url: api.permission,
    method: 'get'
  })
}

export function addMenu (parameter) {
  return axios({
    url: api.addMenu,
    method: 'post',
    data: parameter
  })
}

export function modifyMenu (parameter) {
  return axios({
    url: api.modifyMenu,
    method: 'post',
    data: parameter
  })
}

export function addRole (parameter) {
  return axios({
    url: api.addRole,
    method: 'post',
    data: parameter
  })
}

export function modifyRole (parameter) {
  return axios({
    url: api.modifyRole,
    method: 'post',
    data: parameter
  })
}

export function authRole (parameter) {
  return axios({
    url: api.authRole,
    method: 'post',
    data: parameter
  })
}

export function verification (checkName,checkValue){
  return axios({
    url: api.verification,
    method: 'get',
    params: {
      checkName: checkName,
      checkValue: checkValue
    }
  })
}

export function deleteMenu (params) {
  return axios({
    url: api.deleteMenu,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: params
  })
}

export function getAuthTree (parameter) {
  return axios({
    url: api.authTree,
    method: 'get',
    params: parameter
  })
}