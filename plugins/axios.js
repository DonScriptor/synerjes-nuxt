export default function ({
  $axios,
  store,
  redirect
}, inject) {
  //get locale from vuex here and append to base  url
  let currentLocale = store.getters.getLocale;
  // Create a custom axios instance
  const api = $axios.create({
    // baseURL: `http://192.241.234.75:7977/api/${currentLocale}`,
    baseURL: `https://policytracker.mped.gov.eg:8443/api/${currentLocale}`,
    // baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
      common: {
        Accept: 'application/json;charset=utf-8',
        "Accept-Language": 'ar'
      }
    }
  })


  // Inject to context as $api


  api.onRequest(config => {
    // config.baseURL = `http://192.241.234.75:7977/api/${store.getters.getLocale}`
    config.baseURL = `https://policytracker.mped.gov.eg:8443/api/${store.getters.getLocale}`

  })
  // api.interceptors.request.use(config => {
    
  //   return config
  // })
  // api.interceptors.response.use(
  //   response => {
  //     // if (response.status === 200) {
  //     //   if (response.request.responseURL && response.request.responseURL.includes('login')) {
  //     //     store.dispatch("setUser", response);
  //     //   }
  //     // }
  //     return response
  //   }
  // )
  // api.onError(error => {
  //   if (error.response && error.response.status === 500) {
  //     // redirect('/login')
  //   }
  // })
  inject('api', api)

}
