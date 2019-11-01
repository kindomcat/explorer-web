import axios from 'axios'
import Cookie from 'js-cookie'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import qs from 'qs'

const service = axios.create({
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    // 设置token
    config.headers['Authorization'] = getToken()
    return config
  },
  error => {
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    if (!response.data.rel && response.data.status === 40101) {
      Message.warning('登陆失效，请重新登录！')
      setTimeout(() => {
        Cookie.set('Admin-Token', '')
        location.reload()
      }, 1000)
    } else if (!response.data.rel && response.data.status === 40102) {
      // 没有权限
      this.$router.push('/401')
    } else if (!response.data.rel && response.data.status === 40100) {
      // 远程token异常
      this.$router.push('/401')
    } else if (!response.data.rel && response.data.status === 50002) {
      Message.error('系统异常！')
    } else {
      // this.$router.push('/401')
      return response
    }
  },
  error => {
    console.log('err' + error) // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

const prefix = '/admin-api'

// GET请求,将url和请求参数传入，通过Promise，将成功和失败的数据派发出去
export function getHttp(uri, params) {
  uri = prefix + uri
  return getHttpCommon(uri, params)
}

export function getHttpCommon(uri, params) {
  return new Promise((resolve, reject) => {
    service.get(uri, { 'params': params }).then(response => {
      resolve(response.data)
    }).catch(response => {
      resolve(response.message)
    })
  })
}

export function postHttpCommon(uri, params, body) {
  return new Promise((resolve, reject) => {
    service.post(`${uri}?${qs.stringify(params)}`, body).then(response => {
      resolve(response.data)
    }).catch(response => {
      resolve(response.message)
    })
  })
}

export function deleteHttpCommon(uri, params) {
  return new Promise((resolve, reject) => {
    service.delete(uri, { 'params': params }).then(response => {
      resolve(response.data)
    }).catch(response => {
      resolve(response.message)
    })
  })
}

export function putHttpCommon(uri, params, body) {
  return new Promise((resolve, reject) => {
    service.put(`${uri}?${qs.stringify(params)}`, body).then(response => {
      resolve(response.data)
    }).catch(response => {
      resolve(response.message)
    })
  })
}

export default {
  getHttp: function(uri, params) {
    uri = prefix + uri
    return getHttpCommon(uri, params)
  },
  deleteHttp: function(uri, params) {
    uri = prefix + uri
    return deleteHttpCommon(uri, params)
  },

  putHttp: function(uri, params, body) {
    uri = prefix + uri
    return putHttpCommon(uri, params, body)
  },

  // POST请求，将url,请求参数和body传入，通过Promise，将成功和失败的数据派发出去
  postHttp: function(uri, params, body) {
    uri = prefix + uri
    return postHttpCommon(uri, params, body)
  }
}
