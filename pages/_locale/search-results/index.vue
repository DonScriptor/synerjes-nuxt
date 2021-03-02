<template>
  <v-container fluid class="pa-0 search-results-page" v-if="isPageRendered">
    <v-container>
      <div class="back-breadcrumbs">
        <div v-if="currentLocale=='ar'">
          <v-btn text :to="`/${currentLocale}`">الرئيسية</v-btn>/
          نتائج البحث
        </div>
        <div v-else>
          <v-btn text :to="`/${currentLocale}`">Home</v-btn>/
          <span>Search Results</span>
        </div>
      </div>
      <p class="search-title text-truncate">
        <span class="search-for">{{$t('search-results-for')}} :</span>
        {{currentKeyword}}
      </p>
      <div>
        <p
          class="search-count"
          v-if="searchResultsCount"
        >({{searchResultsCount}} {{$t('results-number')}})</p>
        <!-- <p class="in-page-count">عرض ٣ نتائج من ٨</p> -->
      </div>

      <v-row>
        <v-col cols="12" md="4" class="desktop-only">
          <side-filter
            v-if="filterAgencies.length"
            :filterData="filterAgencies"
            :filterData2="filterBeneficiaries"
            :filterData3="filterSubcategories"
            v-on:filtersSelected="filterSearchResults"
            :queryData="$route.query"
          />
        </v-col>
        <v-col cols="12" md="8">
          <div class="filter-trigger mobile-only">
            <span @click.stop="toggleFilter">إظهر التصنيفات</span>
            <v-icon flate>mdi-menu-down</v-icon>
            <div
              class="mobile-filter-wrapper"
              v-show="isFilter"
              v-clickoutside="hideModalOnClickOutside"
            >
              <side-filter
                v-if="filterAgencies.length"
                :filterData="filterAgencies"
                :filterData2="filterBeneficiaries"
                :filterData3="filterSubcategories"
                v-on:filtersSelected="filterSearchResults"
                :queryData="$route.query"
              />
            </div>
          </div>
          <!-- <div v-for="group in categoryGroup" :key="group.id"> -->
          <!-- <div class="filtered-data-title">{{group.title}}</div> -->

          <!-- <div class="filtered-token" v-for="i in categoryGroup" :key="i.id">
            <p class="filtered-token-title">{{i.goal}}</p>
            <div
              class="filtered-token-description text-truncate"
              :ref="`policy-${i.id}`"
            >{{i.description}}</div>
            <div
              class="filtered-token-see-more mt-2"
              :ref="`trigger-${i.id}`"
              @click="expandPolicy(`policy-${i.id}`,
            `trigger-${i.id}`)"
            >{{$t('read-more')}}</div>
          </div>-->
          <policies-tokens :policiesData="categoryGroup" :keyword="currentKeyword" />

          <!-- </div> -->
          <div class="no-policies-data" v-if="!categoryGroup.length">
            <img src="~/static/No-search-Result.png" alt />
          </div>
        </v-col>
      </v-row>

      <div class="text-center page-pagination">
        <v-pagination
          v-model="paginationData.current_page"
          color="#c89539"
          :length="totalPages"
          :total-visible="7"
          @input="next"
        ></v-pagination>
      </div>
    </v-container>
  </v-container>
</template>
<script>
// import SideFilter from "~/components/search-results/SideFilter";
const SideFilter = () => import("~/components/search-results/SideFilter.vue");
const PoliciesTokens = () =>
  import("~/components/search-results/PoliciesTokens.vue");
export default {
  name: "SEARCH_RESULTS",
  components: { SideFilter, PoliciesTokens },
  data() {
    return {
      page: 1,
      isFilter: false,
      categoryGroup: [],
      currentKeyword: null,
      filterAgencies: [],
      filterBeneficiaries: [],
      filterSubcategories: [],
      activeCatId: null,
      paginationData: {
        current_page: 1
      },
      isPageRendered: false,
      currentDateRange: {
        start: null,
        end: null
      },
      agency_id: "",
      beneficiary_id: "",
      subCategory_id: "",
      searchResultsCount: null
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
    currentLocale() {
      return this.$store.getters.getLocale;
    }
  },
  beforeRouteUpdate(to, from, next) {
    const queryData = to.query;
    this.currentKeyword = queryData.keyword;
    this.getSearchByKeyword(queryData);
    next();
  },
  created() {
    const queryData = this.$route.query;
    this.getSearchByKeyword(queryData);
  },
  methods: {
    getSearchByKeyword(queryData) {
      // console.log(queryData, " queryData in search page");
      this.currentKeyword = queryData.keyword;
      this.currentDateRange.start = queryData.date_from;
      this.currentDateRange.end = queryData.date_to;
      this.$store
        .dispatch("searchResults/getSearchByKeyword", {
          query: queryData
        })
        .then(res => {
          // console.log(res.meta.pagination, " res.meta.pagination");
          this.searchResultsCount = res.meta.pagination.total;

          this.categoryGroup = [...res.data];
          this.setPaginationData(res.meta.pagination);
          // console.log(this.paginationData, " this.paginationData");

          this.filterAgencies = Object.keys(res.meta.filters.agencies).map(
            i => {
              return {
                id: i,
                text: res.meta.filters.agencies[i]
              };
            }
          );
          this.filterBeneficiaries = Object.keys(
            res.meta.filters.beneficiaries
          ).map(i => {
            return {
              id: i,
              text: res.meta.filters.beneficiaries[i]
            };
          });

          this.filterSubcategories = Object.keys(
            res.meta.filters.subcategories
          ).map(i => {
            return {
              id: i,
              text: res.meta.filters.subcategories[i]
            };
          });
          this.isPageRendered = true;
        });
    },
    expandPolicy(ref, trigger) {
      this.$refs[ref][0].classList.toggle("text-truncate");
      let isExpanded = this.$refs[ref][0].classList.contains("text-truncate");
      if (isExpanded) {
        this.$refs[trigger][0].innerText = this.$t("read-more");
      } else {
        this.$refs[trigger][0].innerText = this.$t("read-less");
      }
    },
    toggleFilter() {
      // console.log("toggleFilter");
      this.isFilter = !this.isFilter;
    },
    next(page) {
      const queryData = this.$route.query;
      this.$router.push({
        path: `/${this.$store.getters.getLocale}/search-results`,
        query: {
          agency_id: this.agency_id, //////////////////////////////////////??
          beneficiary_id: this.beneficiary_id, /////////////////////////////////??
          subCategory_id: this.subCategory_id,
          date_from: this.currentDateRange.start,
          date_to: this.currentDateRange.end,
          page: page,
          keyword: queryData.keyword
        }
      });

      let intervalId;
      intervalId = setInterval(() => {
        if (window.pageYOffset === 0) {
          clearInterval(intervalId);
        }
        window.scroll(0, window.pageYOffset - 100);
      }, 0);
    },
    hideModalOnClickOutside() {
      if (this.isFilter) {
        this.isFilter = !this.isFilter;
      }
    },
    ////////
    setPoliciesData(data) {
      this.policiesData = [...data];
    },
    filterSearchResults(filters) {
      // console.log(filters, " ///////");
      const queryData = this.$route.query;
      this.agency_id = "";
      this.beneficiary_id = "";
      this.subCategory_id = "";

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

      if (filters.subcategories.length) {
        filters.subcategories.forEach(el => {
          this.subCategory_id += `${el},`;
        });
      }

      this.$router.push({
        path: `/${this.$store.getters.getLocale}/search-results`,
        query: {
          keyword: queryData.keyword,
          agency_id: this.agency_id,
          beneficiary_id: this.beneficiary_id,
          subCategory_id: this.subCategory_id,
          date_from: filters.date_from,
          date_to: filters.date_to
        }
      });
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
    setPaginationData(pagination) {
      this.paginationData = { ...pagination };
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
.search-results-page {
  background-color: #f3f4f9;
  min-height: calc(100vh - 185px);
}

.back-breadcrumbs {
  margin-top: 30px;
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

.search-title {
  font-size: 2.125rem;
  font-weight: 900;
  line-height: 2.5rem;
  letter-spacing: 0.0073529412em;
  margin-top: 3rem;
  margin-bottom: 2rem;
  .search-for {
    color: #c89539;
  }
}
.search-count,
.in-page-count {
  color: #6d6969;
}
.filtered-data-title {
  font-size: 30px;
  font-weight: bold;
  line-height: 1.23;
  color: #c89539;
  height: 130px;
  border-radius: 30px;
  backdrop-filter: blur(30px);
  box-shadow: 0 3px 26px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  margin-bottom: 40px;
}

.filtered-token {
  backdrop-filter: blur(30px);
  box-shadow: 0 3px 26px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  padding: 1.5rem 2rem;
  border-radius: 30px;
  margin-bottom: 30px;

  &-title {
    font-size: 26px;
    font-weight: bold;
    line-height: 1.14;
    letter-spacing: 0.65px;
    color: #28a4a2;
  }

  &-description {
  }

  &-see-more {
    color: #c89539;
    font-weight: bold;
    text-decoration: underline;
    display: flex;
    justify-content: flex-end;
    cursor: pointer;
  }
}

.filter-trigger {
  color: #28a4a2;
  margin-bottom: 1rem;
  cursor: pointer;
  span {
    text-decoration: underline;
  }
  i {
    color: #28a4a2;
  }
}
.mobile-filter-wrapper {
  position: absolute;
  z-index: 1;
}
.mobile-only {
  display: none;
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
  .desktop-only {
    display: none;
  }
  .mobile-only {
    display: block;
  }

  .search-title {
    font-size: 14px;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .search-count,
  .in-page-count {
    font-size: 10px;
    color: #6d6969;
    margin-bottom: 1rem;
  }
  .filtered-data-title {
    font-size: 12px;
    height: 56px;
    border-radius: 10px;
  }
  .filtered-token {
    border-radius: 10px;

    &-title,
    &-description,
    &-see-more {
      font-size: 12px;
    }
  }
}

.no-policies-data {
  text-align: center;
  img {
    margin-top: 50px;
    max-width: 70%;
  }
}
</style>