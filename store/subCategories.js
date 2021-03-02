import {
  Formatter
} from "sarala-json-api-data-formatter"
let formatter = new Formatter()

export const state = () => ({
  subCategoriesData: []

})

export const mutations = {

}

export const actions = {
  async getAllMainCategories(state) {
    let res = await this.$api.get(`policycategories/`)
    return formatter.deserialize(res.data);
  },
  async getPolicySubCategory(state, data) {
    // console.log(data, ' all queries in getPolicySubCategory')
    let res = await this.$api.get(`policies/policy-sub-category/${data.id}`, {
      params: data.query
      // use this in free search with sub cat exist
    })
    return formatter.deserialize(res.data);
  },
  async getPolicyCategory(state, data) {
    // console.log(data, ' all queries in policy-category data')
    let res = await this.$api.get(`policies/policy-category/${data.id}`, {
      params: data.query
       // use this in free search with no sub cat exist >> use manin cat id
    })
    return formatter.deserialize(res.data);
  },

  async getPolicySubAutocomplete(state, data) {
    let res = await this.$api.get(`policycategories/global-search?keyword=${data.keyword}&include=autoCompleteSubCategories&subCategory_id=${data.subCatId}`)
    return formatter.deserialize(res.data);
  },
  // async filterPolicySubCategory(state, filtersData) {
  //   let agenciesQuery = '';
  //   let datesQuery = '';
  //   let beneficiaryQuery = '';
  //   if (filtersData.filters.agencies.length) {
  //     agenciesQuery += '&agency_id='
  //     filtersData.filters.agencies.forEach(el => {
  //       agenciesQuery += `${el},`
  //     })
  //   }
  //   if (filtersData.filters.beneficiaries.length) {
  //     beneficiaryQuery += '&beneficiary_id='
  //     filtersData.filters.beneficiaries.forEach(el => {
  //       beneficiaryQuery += `${el},`
  //     })
  //   }
  //   if (filtersData.filters.date_from && filtersData.filters.date_to) {
  //     datesQuery += `&date_from=${filtersData.filters.date_from}&date_to=${filtersData.filters.date_to}`
  //   }
  //   console.log((agenciesQuery + datesQuery + beneficiaryQuery).slice(1), ' bcvcvcvcc')
  //   let res = await this.$api.get(`policies/policy-sub-category/${filtersData.id}?${(agenciesQuery+datesQuery+beneficiaryQuery).slice(1)}`)
  //   return formatter.deserialize(res.data);
  // }
}
