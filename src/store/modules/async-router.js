/**
 * 向后端请求用户的菜单，动态生成路由
 */
import { constantRouterMap } from '@/config/router.config'
import { generatorDynamicRouter } from '@/router/generator-routers'
import { addMenu, modifyMenu, permissionList,verification,deleteMenu } from '@/api/manage'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }) {
      return new Promise(resolve => {
        generatorDynamicRouter().then(routers => {
          commit('SET_ROUTERS', routers)
          resolve()
        })
      })
    },
    Permission ({ commit }) {
      return new Promise((resolve, reject) => {
        permissionList().then(response => {
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    AddMenu ({ commit }, menu) {
      return new Promise((resolve, reject) => {
        addMenu(menu).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    ModifyMenu ({ commit }, menu) {
      return new Promise(((resolve, reject) => {
        modifyMenu(menu).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      }))
    },
    Verification ({ commit }, obj) {
      return new Promise(((resolve, reject) => {
        console.log(obj)
        verification(obj.checkName,obj.checkValue).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      }))
    },
    DeleteMenu({commit},params){
      return new Promise((resolve, reject) => {
        deleteMenu(params).then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
        })
      })
    }
  }
}

export default permission
