<template>
  <v-container fluid class="pa-0 subcategories-page" v-show="isPageRendered">
    <v-container>
      <!-- page routing breadcrumbs -->
      <div class="back-breadcrumbs">
        <div v-if="currentLocale=='ar'">
          <v-btn text :to="`/${currentLocale}`">الرئيسية</v-btn>/
          إجراءات
        </div>
        <div v-else>
          <v-btn text :to="`/${currentLocale}`">Home</v-btn>/
          Policies
        </div>
      </div>
      <!-- page routing breadcrumbs -->
      <!-- main categories filter in mobile -->
      <div class="filter-trigger mobile-only">
        <span @click.stop="toggleFilter2">{{$t("show-remaining")}}</span>
        <v-icon flate>mdi-menu-down</v-icon>
        <div
          class="mobile-filter-wrapper"
          v-show="isFilter2"
          v-clickoutside="hideModalTwoOnClickOutside"
        >
          <div class="all-main-categories">
            <div class="fitler-main-title">{{$t('categories-title')}}</div>
            <p
              v-for="n in allMainCategories"
              :key="n.id"
              :class="n.title==categoryTitle?'active-main-category':null"
              @click="changeMainCategory(n.id, n.title)"
            >{{n.title}}</p>
          </div>
        </div>
      </div>
      <!-- main categories filter in mobile -->
      <div class="new-search-layout-wrapper">
        <div>
          <!-- <p
            class="search-title"
            v-if="currentSearchKeyword"
          >{{$t('search-results-for')}} {{currentSearchKeyword}}</p>-->
          <p class="search-title text-truncate" v-if="categoryTitle">{{categoryTitle}}</p>
        </div>
        <div class="search-input mobile-only" v-if="!showOnDesktop">
          <v-autocomplete
            ref="field"
            v-model="select"
            :loading="loading"
            :items="items"
            :search-input.sync="search"
            item-text="displayText"
            item-value="id"
            return-object
            flat
            dense
            outlined
            background-color="#fff"
            hide-no-data
            hide-details
            :label="$t('what-r-u-looking-for')"
            @change="applyAutocompleteSearch"
            @keydown.enter.stop.prevent="freeSearch"
          ></v-autocomplete>
          <v-btn class="mx-4" color="c89539" @click="freeSearch">{{$t('search')}}</v-btn>
        </div>
      </div>

      <div class="subcategories-carousel" v-if="filterSubCategories.length">
        <!-- carousel custom component goes here -->
        <subcategory-slider
          :filterSubCategories="filterSubCategories"
          :activeSlideId="activeSlideId"
          v-on:subcategoryselected="getSubCategoryPolicies"
        />
      </div>

      <v-row>
        <v-col cols="12" md="4" class="desktop-only" v-if="showOnDesktop">
          <!-- new  side search ui -->
          <section class="side-search">
            <div class="side-search-title pointer" @click="freeSearch">
              <!-- @click="freeSearch" -->
              <i class="icons mdi mdi-magnify pointer"></i>
              <span>{{$t('search_for')}}</span>
            </div>
            <v-autocomplete
              ref="field"
              v-model="select"
              :loading="loading"
              :items="items"
              :search-input.sync="search"
              item-text="displayText"
              item-value="id"
              return-object
              flat
              outlined
              background-color="#fff"
              hide-no-data
              hide-details
              append-icon="mdi-magnify"
              class="side-search-input"
              :label="$t('what-r-u-looking-for')"
              @change="applyAutocompleteSearch"
              @keydown.enter.stop="freeSearch"
            ></v-autocomplete>

            <!-- @blur="select = '';items=[];search=''" -->
          </section>
          <!-- new  side search ui -->
          <div class="all-main-categories">
            <div class="fitler-main-title">{{$t('categories-title')}}</div>
            <p
              v-for="n in allMainCategories"
              :key="n.id"
              :class="n.title==categoryTitle?'active-main-category':null"
              @click="changeMainCategory(n.id, n.title)"
            >{{n.title}}</p>
          </div>
          <side-filter
            v-if="filterAgencies.length"
            :filterData="filterAgencies"
            :filterData2="filterBeneficiaries"
            v-on:filtersSelected="filterSubCategoryPolicies"
            :queryData="$route.query"
          />
        </v-col>
        <v-col cols="12" md="8">
          <div class="filtered-data-title" v-if="activeSlideTitle">{{activeSlideTitle}}</div>
          <div class="filter-trigger mobile-only">
            <span @click.stop="toggleFilter">{{$t("show-filters")}}</span>
            <v-icon flate>mdi-menu-down</v-icon>
            <div
              class="mobile-filter-wrapper"
              v-show="isFilter"
              v-clickoutside="hideModalOneOnClickOutside"
            >
              <side-filter
                v-if="filterAgencies.length"
                :filterData="filterAgencies"
                :filterData2="filterBeneficiaries"
                v-on:filtersSelected="filterSubCategoryPolicies"
                :queryData="$route.query"
              />
            </div>
          </div>

          <!-- policies data breakdowns -->
          <policies-tokens :policiesData="policiesData" :keyword="currentKeyword" />

          <div class="no-policies-data" v-if="!policiesData.length">
            <img src="~/static/No-search-Result.png" alt />
          </div>
        </v-col>
      </v-row>

      <div class="text-center page-pagination">
        <v-pagination
          v-model="paginationData.current_page"
          :length="totalPages"
          :total-visible="7"
          @input="next"
          color="#c89539"
        ></v-pagination>
      </div>
    </v-container>
    <!-- spinner -->
    <div class="sk-wrapper" v-if="showLoader">
      <div class="sk-chase">
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
      </div>
    </div>
  </v-container>
</template>
<script>
// import SideFilter from "~/components/SubcategoryDetails/SideFilter";
const SideFilter = () =>
  import("~/components/SubcategoryDetails/SideFilter.vue");
const SubcategorySlider = () =>
  import("~/components/SubcategoryDetails/SubcategorySlider.vue");
const PoliciesTokens = () =>
  import("~/components/SubcategoryDetails/PoliciesTokens.vue");
// import { Formatter } from "sarala-json-api-data-formatter";

export default {
  components: { SideFilter, SubcategorySlider, PoliciesTokens },
  data() {
    return {
      search_keyword: "",
      // formatter: new Formatter(),
      isPageRendered: true,
      currentSearchKeyword: null,
      categoryTitle: null,
      loading: false,
      items: [],
      search: null,
      select: null,
      pagination: {
        page: 1
      },
      isFilter: false,
      isFilter2: false,
      filterAgencies: [],
      filterBeneficiaries: [],
      filterSubCategories: [],
      activeSlideIndex: null,
      activeSlideId: null,
      activeSlideTitle: null,
      policiesData: [],
      paginationData: {
        current_page: 1
      },
      allMainCategories: [],
      selectedCategoryId: null,
      currentDateRange: {
        start: null,
        end: null
      },
      agency_id: "",
      beneficiary_id: "",
      currentKeyword: null,
      showOnDesktop: null
    };
  },
  directives: {
    clickoutside: {
      bind: function(el, binding, vnode) {
        el.clickOutsideEvent = function(event) {
          // here I check that click was outside the el and his childrens
          if (
            !(
              el == event.target ||
              event.target.classList.contains("modal-trigger") ||
              el.contains(event.target)
            )
          ) {
            // and if it did, call method provided in attribute value
            vnode.context[binding.expression](event);
          }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unbind: function(el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      }
    }
  },
  computed: {
    totalPages() {
      return this.paginationData.total_pages;
    },
    currentPage() {
      this.paginationData.current_page;
    },
    currentLocale() {
      return this.$store.getters.getLocale;
    },

    showLoader() {
      return this.$store.getters.getLoaderState;
    }
  },
  beforeRouteUpdate(to, from, next) {
    const queryData = to.query;
    this.selectedCategoryId = queryData.catId;
    this.currentKeyword = queryData.keyword || "";
    this.initPageData(queryData);
    this.getAllMainCategories();
    next();
  },
  created() {
    const queryData = this.$route.query;
    this.selectedCategoryId = queryData.catId;
    this.currentKeyword = queryData.keyword || "";
    this.initPageData(queryData);
    this.getAllMainCategories();
  },
  mounted() {
    // console.log(this.$refs.field, ' this.$refs.field')
    const originalOnKeyDown = this.$refs.field.onKeyDown;
    this.$refs.field.onKeyDown = e =>
      e.keyCode === 13 ? this.freeSearch() : originalOnKeyDown(e);

    if (process.browser) {
      this.showOnDesktop = window.innerWidth > 960;
    }
  },
  updated() {},
  methods: {
    // page data methods
    initPageData(queryData) {
      // console.log(queryData, " init");
      this.$store.commit("setLoader", true);
      this.currentDateRange.start = queryData.date_from;
      this.currentDateRange.end = queryData.date_to;
      this.$store
        .dispatch("home/getPolicysubcategories", queryData.catId)
        .then(res => {
          // ----------------------------
          if (res.data.length) {
            // >> main cat with subCats
            this.activeSlideId = queryData.subCatId
              ? queryData.subCatId
              : res.data[0].id;

            for (let index = 0; index < res.data.length; index++) {
              if (res.data[index].id == this.activeSlideId) {
                this.setActiveSlideTitle(res.data[index].title);
              }
            }

            this.setSubCategoriesData(res.data);
            // -------------------------- ******xx
            this.$store
              .dispatch("subCategories/getPolicySubCategory", {
                id: queryData.subCatId ? queryData.subCatId : res.data[0].id,
                // page: this.paginationData.current_page,
                query: queryData
              })
              .then(res => {
                // this.categoryTitle = res.data[0].policy_category_title; // ???? maybe passed with query >> needed at ****
                // set policies data
                this.setPoliciesData(res.data);
                //set pagination
                this.setPaginationData(res.meta.pagination);
                // set page filters
                this.setFiltersData({
                  agencies: res.meta.filters.agencies,
                  beneficiaries: res.meta.filters.beneficiaries
                });
              });
          } else {
            // >> main cat with  no  subCats
            this.setActiveSlideTitle("");
            this.filterSubCategories = [...[]];
            this.$store
              .dispatch("subCategories/getPolicyCategory", {
                id: queryData.catId,
                // page: this.paginationData.current_page,
                query: queryData
              })
              .then(res => {
                // this.categoryTitle = res.data[0].policy_category_title; // ???? maybe passed with query
                // set policies data
                this.setPoliciesData(res.data);
                //set pagination
                this.setPaginationData(res.meta.pagination);
                //set page filters
                this.setFiltersData({
                  agencies: res.meta.filters.agencies,
                  beneficiaries: res.meta.filters.beneficiaries
                });
              });
          }
          this.$store.commit("setLoader", false);
          // fn end
        });
    },
    getSubCategoryPolicies(data) {
      // // console.log(data, " emmited data");
      this.setActiveSlideTitle(data.title);
      this.$router.push({
        path: `/${this.$store.getters.getLocale}/subcategory-details`,
        query: {
          isSubCat: true,
          catId: this.selectedCategoryId,
          catTitle: this.categoryTitle,
          subCatId: data.id,
          agency_id: null,
          beneficiary_id: null,
          date_from: null,
          date_to: null
        }
      });
      // .catch(error => {
      //   if (error.name != "NavigationDuplicated") {
      //     throw error;
      //   }
      // });
    },
    filterSubCategoryPolicies(filters) {
      this.agency_id = "";
      this.beneficiary_id = "";

      if (filters.agencies.length) {
        filters.agencies.forEach(el => {
          this.agency_id += `${el},`;
        });
      }
      if (filters.beneficiaries.length) {
        filters.beneficiaries.forEach(el => {
          this.beneficiary_id += `${el},`;
        });
      }

      this.$router.push({
        path: `/${this.$store.getters.getLocale}/subcategory-details`,
        query: {
          isSubCat: this.activeSlideId ? true : false,
          catId: this.selectedCategoryId,
          catTitle: this.categoryTitle,
          subCatId: this.activeSlideId,
          agency_id: this.agency_id,
          beneficiary_id: this.beneficiary_id,
          date_from: filters.date_from,
          date_to: filters.date_to,
          keyword: this.currentKeyword
        }
      });
      // .catch(error => {
      //   if (error.name != "NavigationDuplicated") {
      //     throw error;
      //   }
      // });
    },
    getAllMainCategories() {
      this.$store.dispatch("subCategories/getAllMainCategories").then(res => {
        // // console.log(res, this.selectedCategoryId, " getAllMainCategories");
        for (let index = 0; index < res.data.length; index++) {
          if (res.data[index].id == this.selectedCategoryId) {
            this.categoryTitle = res.data[index].title;
          }
        }
        this.allMainCategories = [...res.data];
        // set catgegory title after filter here with id
      });
    },
    changeMainCategory(catId, catTitle) {
      this.$nuxt.$emit("reset-all-filters");
      this.$router.push({
        path: `/${this.$store.getters.getLocale}/subcategory-details`,
        query: {
          isSubCat: false,
          catId: catId,
          catTitle: catTitle,
          subCatId: null,
          agency_id: null,
          beneficiary_id: null,
          date_from: null,
          date_to: null
        }
      });
      // .catch(error => {
      //   if (error.name != "NavigationDuplicated") {
      //     throw error;
      //   }
      // });
      this.isFilter2 = false;
    },
    setPoliciesData(data) {
      this.policiesData = [...data];
    },
    setSubCategoriesData(data) {
      const queryData = this.$route.query;
      this.filterSubCategories = data.map(i => {
        // set active Slide Title
        // i.id == queryData.subCatId ? this.setActiveSlideTitle(i.title) : null;
        return {
          id: i.id,
          text: i.title
        };
      });
    },
    setActiveSlideTitle(title) {
      this.activeSlideTitle = title;
    },
    setPaginationData(pagination) {
      this.paginationData = { ...pagination };
    },
    setFiltersData(filters) {
      this.filterAgencies = Object.keys(filters.agencies).map(i => {
        return {
          id: i,
          text: filters.agencies[i]
        };
      });
      this.filterBeneficiaries = Object.keys(filters.beneficiaries).map(i => {
        return {
          id: i,
          text: filters.beneficiaries[i]
        };
      });
    },
    // pagination methods
    next(page) {
      // this.paginationData.current_page = page
      // // console.log(this.paginationData.current_page);
      this.$router.push({
        path: `/${this.$store.getters.getLocale}/subcategory-details`,
        query: {
          isSubCat: this.activeSlideId ? true : false,
          catId: this.selectedCategoryId,
          catTitle: this.categoryTitle,
          subCatId: this.activeSlideId,
          agency_id: this.agency_id, //////////////////////////////////////??
          beneficiary_id: this.beneficiary_id, //////////////////////////////////??
          date_from: this.currentDateRange.start,
          date_to: this.currentDateRange.end,
          page: page,
          keyword: this.currentKeyword
        }
      });
      // .catch(error => {
      //   if (error.name != "NavigationDuplicated") {
      //     throw error;
      //   }
      // });

      // page need to be sent in queries
      let intervalId;
      intervalId = setInterval(() => {
        if (window.pageYOffset === 0) {
          clearInterval(intervalId);
        }
        window.scroll(0, window.pageYOffset - 100);
      }, 0);
    },
    //search related methods
    querySelections(v) {
      const queryData = this.$route.query;
      this.loading = true;
      // this.items = [...[]];
      this.$store
        .dispatch("subCategories/getPolicySubAutocomplete", {
          keyword: v,
          subCatId: queryData.subCatId || this.activeSlideId
        })
        .then(res => {
          console.log(res.data, " querySelections res");
          res.data.forEach(cat => {
            if (cat.autoCompleteSubCategories.data.length) {
              cat.autoCompleteSubCategories.data.forEach(subCat => {
                this.items.push({
                  mainCategory: cat.title,
                  mainCategoryId: cat.id,
                  subCategory: subCat.title,
                  subCategoryId: subCat.id,
                  isSubCategory: true,
                  id: subCat.id,
                  displayText: cat.title + "/" + subCat.title
                });
              });
            } else {
              this.items.push({
                mainCategory: cat.title,
                mainCategoryId: cat.id,
                subCategoryId: null,
                subCategory: null,
                isSubCategory: false,
                id: cat.id,
                displayText: cat.title
              });
            }
          });
          this.loading = false;
        })
        .catch(err => {
          // // console.log(err, "   errrrr");
          this.loading = false;
        });
    },
    applySearch(keyword) {
      // console.log({
      //   main: this.selectedCategoryId,
      //   sub: this.activeSlideId,
      //   keyword: keyword
      // })

      this.$router.push({
        path: `/${this.$store.getters.getLocale}/subcategory-details`,
        query: {
          isSubCat: this.activeSlideId ? true : false,
          catId: this.selectedCategoryId,
          catTitle: this.activeSlideId,
          subCatId: this.activeSlideId,
          keyword: keyword
        }
      });
      // .catch(error => {
      //   if (error.name != "NavigationDuplicated") {
      //     throw error;
      //   }
      // });
    },
    freeSearch() {
      console.log(this.search, "icon clicked clicked");
      if (this.search) {
        this.applySearch(this.search);
      }
    },
    applyAutocompleteSearch(obj) {
      console.log(obj, "applyAutocompleteSearch");
      this.$router.push({
        path: `/${this.$store.getters.getLocale}/subcategory-details`,
        query: {
          isSubCat: obj.isSubCategory,
          catId: obj.mainCategoryId,
          catTitle: obj.mainCategory,
          subCatId: obj.subCategoryId
        }
      });
      // .catch(error => {
      //   if (error.name != "NavigationDuplicated") {
      //     throw error;
      //   }
      // });
    },
    // UI related methods
    toggleFilter() {
      this.isFilter = !this.isFilter;
    },
    toggleFilter2() {
      this.isFilter2 = !this.isFilter2;
    },
    hideModalOneOnClickOutside() {
      if (this.isFilter) {
        this.isFilter = !this.isFilter;
      }
    },
    hideModalTwoOnClickOutside() {
      if (this.isFilter2) {
        this.isFilter2 = !this.isFilter2;
      }
    }
  },
  watch: {
    search(val) {
      val && val.length > 3 && val !== this.select && this.querySelections(val);
    },
    paginationData(val) {
      // // // console.log(val, " paginationData paginationData");
    }
  },
  async asyncData({ params }) {
    try {
      console.log("asyncData asyncData in search", params);
      let locale = params.locale;
      let meta_title;
      let meta_description;
      locale == "en"
        ? (meta_title = "Egypt’s COVID-19 Policy Tracker")
        : (meta_title =
            "مرصد إجراءات الحكومة لمواجهة تداعيات فيروس كورونا المستجد");
      locale == "en"
        ? (meta_description =
            "The Government of Egypt (GOE) has intensified its efforts by taking several decisions and measures aimed at addressing the crisis of the novel coronavirus outbreak and its economic and social impacts. The set of measures taken by the GOE has varied to include the financial and monetary aspects, as well as supporting the affected sectors, especially the health, tourism, aviation and travel sectors. The GOE has made sure that these measures are taken in line with a comprehensive perspective that considers all society groups of citizens, regular and irregular labor, business community and Egyptian expatriates.")
        : (meta_description =
            "كثفت الحكومة المصرية جهودها باتخاذ العديد من القرارات والإجراءات التي تستهدف مواجهة أزمة انتشار فيروس كورونا المستجد وتداعياتها الاقتصادية والاجتماعية، وقد تنوعت حزمة الإجراءات التي اتخذتها الدولة لتشمل الجوانب المالية والنقدية، فضلاً عن مساندة القطاعات المتضررة؛ وفي مقدمتها قطاعات الصحة والسياحة والطيران والسفر، كما حرصت الدولة على أن تكون هذه الإجراءات وفقاً لمنظور شامل يأخذ بعين الاعتبار كافة فئات المجتمع من المواطنين، والعمالة المنتظمة وغير المنتظمة، ومجتمع الأعمال إلى جانب أبناء مصر في الخارج.");

      return {
        meta_title,
        meta_description
      };
    } catch (error) {
      // Redirect to error page or 404 depending on server response
    }
  },
  head() {
    console.log("asyncData asyncData head");
    return {
      title: this.meta_title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.meta_description
        },
        {
          property: "og:image",
          content: "/MoP-Logo-04.jpg" || ""
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.subcategories-page {
  background-color: #f3f4f9;
  min-height: calc(100vh - 185px);
}
.back-breadcrumbs {
  margin-top: 20px;
  word-spacing: 10px;
  & * {
    font-size: 19px;
    color: #c89539;
  }
  .v-btn {
    padding: 0;
    &::before {
      opacity: 0;
    }
  }
}
.new-search-layout-wrapper {
  // display: flex;
  // justify-content: space-between;
  // align-items: center;
  // flex-wrap: wrap;
}

.search-title {
  font-size: 25px;
  font-weight: 900;
  line-height: 2.5rem;
  letter-spacing: 0.0073529412em;
  margin: 30px 0;
  // max-width: 600px;
}

.subcategories-carousel {
  margin-bottom: 100px;
}

.filtered-data-title {
  font-size: 25px;
  font-weight: bold;
  line-height: 1.23;
  color: #c89539;
  height: 110px;
  border-radius: 30px;
  backdrop-filter: blur(30px);
  box-shadow: 0 3px 26px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  // font-family: "GESSTwoBold" !important;
}

.filter-trigger {
  color: #28a4a2;
  margin-bottom: 1rem;
  cursor: pointer;
  font-weight: bold;
  span {
    text-decoration: underline;
  }
  i {
    color: #28a4a2;
  }
}
.mobile-filter-wrapper {
  position: absolute;
  z-index: 4;
}
.mobile-only {
  display: none;
}

.no-policies-data {
  text-align: center;
  img {
    margin-top: 50px;
    max-width: 70%;
  }
}

.all-main-categories {
  background-color: #ffffff;
  padding: 2rem 2rem 3rem;
  border-radius: 30px;
  box-shadow: 0 3px 26px 0 rgba(0, 0, 0, 0.1);
  max-width: 95%;
  margin-bottom: 2rem;
  p {
    font-size: 20px;
    cursor: pointer;
  }
}

@media only screen and (max-width: 960px) {
  .back-breadcrumbs {
    margin-top: 10px;
    margin-bottom: 10px;
    & * {
      font-size: 12px;
    }
    .v-btn {
      padding: 0;
      background-color: transparent;
    }
  }
  .filter-trigger {
    font-size: 12px;
  }
  .new-search-layout-wrapper {
    margin-top: 10px;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // flex-wrap: wrap;
    // flex-direction: column;
    & > div:first-child {
      // order: 2;
    }
  }
  .desktop-only {
    display: none;
  }
  .mobile-only {
    display: block;
  }

  .search-title {
    font-size: 14px;
    line-height: 1.5rem;
  }
  .subcategories-carousel {
    margin-bottom: 30px;
  }

  .filtered-data-title {
    font-size: 12px;
    height: 56px;
    border-radius: 10px;
    margin-bottom: 20px;
  }

  .search-input {
    flex: 1;
    display: flex;
    align-items: center;
    // justify-content: center;
    margin: 16px 0;
    .v-input {
      max-width: 400px;
      border-radius: 10px;
    }
    button {
      height: 38px !important;
      width: 70px;
      font-size: 10px;
      background-color: #c89539 !important;
      color: #ffffff;
    }
  }

  .search-title {
    margin: 16px 0;
  }

  .all-main-categories {
    padding: 1.5rem 1.5rem 2rem;
    border-radius: 10px;
    max-width: 255px;
    .fitler-main-title {
      font-size: 15px;
      font-weight: bold;
      color: #000000;
    }
    p {
      font-size: 12px;
      color: #000000;
      font-weight: 300;
    }
  }
}

.fitler-main-title {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 1rem;
}
.active-main-category {
  color: #c89539 !important;
  font-weight: bold !important;
}
/////////////// new search ui
.side-search {
  text-align: center;
  background-color: #ffffff;
  padding: 1.4rem 1.2rem 1.7rem 1.2rem;
  border-radius: 30px;
  box-shadow: 0 3px 26px 0 rgba(0, 0, 0, 0.1);
  max-width: 95%;
  margin-bottom: 1.9rem;
  .side-search-title {
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    .icons {
      color: #c89539;
      font-size: 30px;
      margin: 0 6px;
      font-weight: bold;
    }
  }
  .side-search-input {
    // width: 100%;
    max-width: 70%;
    margin: 0 auto;
    .theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state)
      > .v-input__control
      > .v-input__slot
      fieldset {
      color: #e0e0e0;
      border-radius: 10px;
    }
  }
}
</style>
