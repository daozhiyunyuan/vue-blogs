import {axios} from '@/utils/request'

const api = {
  manager : '/api/manager/getList',
  init: '/api/manager/init',
  log: '/api/manager/getLog',
  delete: '/api/manager/delLog'
}

export function manager (params) {
  return axios({
    url: api.manager,
    method: 'post',
    data: params
  })
}

export function init () {
  return axios({
    url: api.init,
    method: 'get'
  })
}

export function deleteLog () {
  return axios({
    url: api.delete,
    method: 'get'
  })
}

export function logList (params) {
  return axios({
    url: api.log,
    method: 'post',
    data: params
  })
}