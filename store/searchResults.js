import {
  Formatter
} from "sarala-json-api-data-formatter"
let formatter = new Formatter()

export const state = () => ({
  homeData: []

})

export const mutations = {

}

export const actions = {
  async getSearchByKeyword(state, data) {
    let res = await this.$api.get(`policies/search`, {
      params: data.query
    })
    return formatter.deserialize(res.data);
  },
  async filterPolicySubCategory(state, filtersData) {
    let agenciesQuery = '';
    let beneficiaryQuery = '';
    let subcategoryQuery = '';
    let datesQuery = '';

    if (filtersData.filters.agencies.length) {
      agenciesQuery += '&agency_id='
      filtersData.filters.agencies.forEach(el => {
        agenciesQuery += `${el},`
      })
    }
    if (filtersData.filters.beneficiaries.length) {
      beneficiaryQuery += '&beneficiary_id='
      filtersData.filters.beneficiaries.forEach(el => {
        beneficiaryQuery += `${el},`
      })
    }
    if (filtersData.filters.subcategories.length) {
      subcategoryQuery += '&subCategory_id='
      filtersData.filters.subcategories.forEach(el => {
        subcategoryQuery += `${el},`
      })
    }
    if (filtersData.filters.date_from && filtersData.filters.date_to) {
      datesQuery += `&date_from=${filtersData.filters.date_from}&date_to=${filtersData.filters.date_to}`
    }

    let res = await this.$api.get(`policies/search?keyword=${filtersData.keyword}${agenciesQuery+beneficiaryQuery+subcategoryQuery+datesQuery}`)
    return formatter.deserialize(res.data);
  }
}
