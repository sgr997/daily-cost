import axios from 'axios'
import { Toast } from 'vant'
import router from '../router'

// axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? '/api' : '//47.99.134.126:7008/api'
axios.defaults.baseURL =  process.env.VUE_APP_BASE_API + '/api'
console.log(axios.defaults.baseURL)
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['token'] = `${localStorage.getItem('token') || null}`
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    Toast.fail('服务端异常！')
    return Promise.reject(res)
  }
  console.log(res.data)
  if (res.data.code != 0) {
    if (res.data.msg) Toast.fail(res.data.msg)
    if (res.data.code == 200) {
      router.push({ path: '/login' })
    }
    return Promise.reject(res.data)
  }

  return res.data
})

export default axios
