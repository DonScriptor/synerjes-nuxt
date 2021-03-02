import {
  Formatter
} from "sarala-json-api-data-formatter"
let formatter = new Formatter()

export const state = () => ({
  locale: '',
  isAppLoading: false,
  showLoader: false

})
export const getters = {
  getLocale(state) {
    return state.locale
  },
  getAppState(state) {
    return state.isAppLoading
  },
  getLoaderState(state) {
    return state.showLoader
  }
}

export const mutations = {
  changeLocale(state, newLocale) {
    state.locale = newLocale
  },
  changeAppState(state) {
    state.isAppLoading = !state.isAppLoading
  },
  setLoader(state, loaderState){
    state.showLoader = loaderState
  }
}

export const actions = {
  async getSearchByKeyword(state, keyword) {
    let res = await this.$api.get(`policies?keyword=${keyword}`)
    return formatter.deserialize(res.data);
  },
  async getGlobalSearch(state, keyword) {
    let res = await this.$api.get(`policycategories/global-search?keyword=${keyword}&include=autoCompleteSubCategories`)
    return formatter.deserialize(res.data);
  },
}
