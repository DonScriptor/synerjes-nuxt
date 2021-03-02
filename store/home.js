import {Formatter} from "sarala-json-api-data-formatter"
let  formatter = new Formatter()

export const state = () => ({
  homeData: []

})

export const mutations = {
 
}

export const actions = {
  async getHomeData() {
    let res = await this.$api.get('homepage')
    return formatter.deserialize(res.data);
  },
  async getPolicysubcategories(state, policyId) {
    let res = await this.$api.get(`policysubcategories/${policyId}`)
    return formatter.deserialize(res.data);
  }
}


// this.$store.dispatch("home/getPolicysubcategories", id).then(res => {
//   this.policySubcategories = [...res.data];
// });

// <v-list-item v-if="policySubcategories.length==0">
//                 <v-list-item-title>no avialable subcategories</v-list-item-title>
//               </v-list-item>