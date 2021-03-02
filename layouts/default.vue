<template>
  <v-app>
    <!-- app wide nav bar -->
    <!-- :height="isMobile? 200:120" -->
    <v-app-bar app scroll-off-screen absolute  color="#28a4a2" class="custom-app-bar">
      <v-toolbar-title>
        <!-- <nuxt-link :to="`/${$store.getters.getLocale}`">
          <img class="logo-img" src="../static/MoP-Logo-03.png" alt />
        </nuxt-link> -->
        <a href="https://www.mped.gov.eg/" target="_blank">
          <img class="logo-img" src="../static/MoP-Logo-03.png" alt />
        </a>
      </v-toolbar-title>
      <v-spacer :class="isMobile? 'd-none':null"></v-spacer>
      <!-- @blur="select = '';items=[];search=''" -->
      <v-autocomplete
        ref="globalSearch"
        v-model="select"
        :loading="loading"
        :items="items"
        :search-input.sync="search"
        item-text="displayText"
        item-value="id"
        return-object
        dense
        flat
        hide-no-data
        hide-details
        solo-inverted
        color="#fff"
        background-color="rgba(255, 255, 255, 0.3)"
        append-icon="mdi-magnify"
        class="header-search mx-8"
        @change="applyAutocompleteSearch"
        @keydown.enter.stop="freeSearch"
        @click:append.stop="freeSearch"
        @blur="select = '';items=[];search=''"
      ></v-autocomplete>

      <div class="header-actions-wrapper">
        <v-btn icon href="https://www.facebook.com/MPEDEGYPT/" target="_blank">
          <img src="../static/ic_facebook.svg" alt />
        </v-btn>

        <v-btn icon href="https://www.instagram.com/mpmaregypt/" target="_blank">
          <img src="../static/ic_instagram.svg" alt />
        </v-btn>
        <v-btn icon href="https://www.youtube.com/user/msadegypt1" target="_blank">
          <img src="../static/ic_youtube.svg" alt />
        </v-btn>
        <v-btn icon href="https://twitter.com/mpedegypt" target="_blank">
          <img src="../static/ic_twitter.svg" alt />
        </v-btn>
        <v-btn
          icon
          target="_blank"
          href="https://www.linkedin.com/in/وزارة-التخطيط-والتنمية-الاقتصادية-587b87197"
        >
          <img src="../static/ic_linkedin.svg" alt />
        </v-btn>
        <div>
          <v-btn text color="white" @click="changeLocale">
            {{$i18n.locale == 'en'?'عربي' :'English'}}
            <img
              class="mx-2"
              src="../static/ic_language.svg"
              alt
            />
          </v-btn>
        </div>
      </div>
    </v-app-bar>
    <!-- app wide nav bar -->
    <v-content>
      <nuxt />
    </v-content>
    <!-- app footer -->
    <v-footer absolute app color="#28a4a2" height="100px">
      <v-col class="text-center white--text" cols="12">
        <strong class="footer-text-content">{{ $t('app-footer') }}</strong>
      </v-col>
    </v-footer>
    <!-- spinner -->
    <!-- <div class="sk-wrapper" v-if="showLoader">
      <div class="sk-chase">
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
      </div>
    </div>-->
  </v-app>
</template>

<script>
import jwtService from "~/services/jwt.service";
export default {
  data() {
    return {
      isMobile: false,
      searchKeyword: null,
      loading: false,
      items: [],
      search: null,
      select: null
    };
  },
  beforeCreate() {
    let routeParams = this.$route.params;
    if (process.browser) {
      if (routeParams.locale) {
        console.log(routeParams.locale, " default layout beforeCreate");
        this.$store.commit("changeLocale", routeParams.locale);
        jwtService.saveToken(routeParams.locale);
        if (routeParams.locale == "ar") {
          this.$vuetify.rtl = true;
          this.$i18n.locale = "ar";
        } else if (routeParams.locale == "en") {
          this.$vuetify.rtl = false;
          this.$i18n.locale = "en";
        }
        this.$router.replace({
          params: {
            locale: this.$store.getters.getLocale
          },
          query: { ...this.$route.query }
        });
      } else if (this.$route.path == "/") {
        let currentLocale = jwtService.getToken();
        if (currentLocale) {
          this.$store.commit("changeLocale", currentLocale);
          if (currentLocale == "ar") {
            this.$vuetify.rtl = true;
            this.$i18n.locale = "ar";
          } else if (currentLocale == "en") {
            this.$vuetify.rtl = false;
            this.$i18n.locale = "en";
          }
        } else {
          this.$store.commit("changeLocale", "ar");
          jwtService.saveToken("ar");
          this.$vuetify.rtl = true;
          this.$i18n.locale = "ar";
        }

        this.$router.replace(`/${this.$store.getters.getLocale}`);
      }
    }
  },
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize, { passive: true });

    const originalOnKeyDown = this.$refs.globalSearch.onKeyDown;
    this.$refs.globalSearch.onKeyDown = e =>
      e.keyCode === 13 ? this.freeSearch() : originalOnKeyDown(e);
  },
  computed: {
    currenrRouteName() {
      // // console.log(this.$route.name, ' this.$route')
      return this.$route.name;
    },
    appState() {
      return this.$state.getAppState;
    },
    showLoader() {
      return this.$store.getters.getLoaderState;
    }
  },

  methods: {
    querySelections(v) {
      this.loading = true;
      // this.items = [...[]];
      this.$store
        .dispatch("getGlobalSearch", v)
        .then(res => {
          console.log(res.data, " globalll search response from store");
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
          console.log(
            this.items,
            " this.items global search response from store"
          );
          this.loading = false;
        })
        .catch(err => {
          // // console.log(err, "   errrrr");
          // this.items = [...[]]
          this.loading = false;
        });
    },
    applySearch(keyword) {
      this.$router.push({
        path: `/${this.$store.getters.getLocale}/search-results`,
        query: { keyword: keyword }
      });
      // .catch(error => {
      //   if (error.name != "NavigationDuplicated") {
      //     throw error;
      //   }
      // });
    },
    freeSearch(ev) {
      console.log(this.search, "icon clicked clicked");
      this.applySearch(this.search);
    },
    applyAutocompleteSearch(obj) {
      console.log(obj, "applyAutocompleteSearch");
      this.$router.push({
        path: `/${this.$store.getters.getLocale}/subcategory-details`,
        query: {
          isSubCat: obj.isSubCategory,
          catId: obj.mainCategoryId,
          catTitle: obj.mainCategory,
          subCatId: obj.subCategoryId,
          date_from: null,
          date_to: null,
          agency_id: null,
          beneficiary_id: null,
          page: 1
        }
      });
      // .catch(error => {
      //   if (error.name != "NavigationDuplicated") {
      //     throw error;
      //   }
      // });
    },
    onResize() {
      this.isMobile = window.innerWidth < 600;
    },
    changeLocale() {
      this.$store.commit("setLoader", false);
      if (this.$i18n.locale == "ar") {
        this.$vuetify.rtl = false;
        this.$i18n.locale = "en";
        this.$store.commit("changeLocale", "en");
        jwtService.saveToken("en");
      } else if (this.$i18n.locale == "en") {
        this.$vuetify.rtl = true;
        this.$i18n.locale = "ar";
        this.$store.commit("changeLocale", "ar");
        jwtService.saveToken("ar");
      }
      // console.log(this.$route.query, " route");
      this.$router.replace({
        params: {
          locale: this.$i18n.locale
        },
        query: { ...this.$route.query }
      });
      // .catch(err => {});
    }
  },
  beforeDestroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.onResize, { passive: true });
    }
  },
  watch: {
    currenrRouteName(val) {
      // // console.log(val, " currenrRouteName");
    },
    search(val) {
      val && val.length > 3 && val !== this.select && this.querySelections(val);
    }
  }
};
</script>
<style lang="scss">
.v-content {
  padding-top: 120px !important;
}
.custom-app-bar {
  height: 120px !important;
  .v-toolbar__content {
    height: 100% !important;
    flex-wrap: wrap;
    justify-content: center;
    padding: 4px 50px;
  }
}
.v-app-bar.v-app-bar--fixed {
  z-index: 9 !important;
}
.header-search {
  max-width: 255px;
  align-items: center;
  .v-input__control {
    border-radius: 10px;
  }
  .v-icon.v-icon {
    color: #ffffff !important;
  }
}
.header-actions-wrapper {
  display: flex;
  align-items: center;
  img {
    max-width: 20px;
  }
}
.logo-img {
  height: 60px;
}
.v-autocomplete__content.v-menu__content {
  max-width: 600px;
}
@media only screen and (max-width: 960px) {
  .v-autocomplete__content.v-menu__content {
    max-width: 255px;
  }
}
@media only screen and (max-width: 960px) {
  .v-content {
    padding-top: 180px !important;
  }
  .custom-app-bar {
    height: 180px !important;
    .v-toolbar__content {
      padding-top: 20px;
      padding-left: 16px;
      padding-right: 16px;
      flex-direction: column;
    }
  }
  .logo-img {
    max-width: 100%;
  }
  .header-search {
    max-width: 95%;
    width: 304px;
  }
  .header-actions-wrapper {
    justify-content: space-between;
    img {
      width: 16px;
      height: 16px;
    }
  }
  .v-footer {
    height: 70px !important;
    .footer-text-content {
      font-size: 12px;
    }
  }
}

@media only screen and (max-width: 350px) {
  .v-toolbar__content .v-btn.v-btn--icon.v-size--default {
    height: 36px !important;
    width: 36px !important;
  }
}

/************************ */
.sk-wrapper {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999999;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}
.sk-chase {
  width: 50px;
  height: 50px;
  position: relative;
  animation: sk-chase 2.5s infinite linear both;
}

.sk-chase-dot {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  animation: sk-chase-dot 2s infinite ease-in-out both;
}

.sk-chase-dot:before {
  content: "";
  display: block;
  width: 25%;
  height: 25%;
  background-color: #c89539;
  border-radius: 100%;
  animation: sk-chase-dot-before 2s infinite ease-in-out both;
}

.sk-chase-dot:nth-child(1) {
  animation-delay: -1.1s;
}
.sk-chase-dot:nth-child(2) {
  animation-delay: -1s;
}
.sk-chase-dot:nth-child(3) {
  animation-delay: -0.9s;
}
.sk-chase-dot:nth-child(4) {
  animation-delay: -0.8s;
}
.sk-chase-dot:nth-child(5) {
  animation-delay: -0.7s;
}
.sk-chase-dot:nth-child(6) {
  animation-delay: -0.6s;
}
.sk-chase-dot:nth-child(1):before {
  animation-delay: -1.1s;
}
.sk-chase-dot:nth-child(2):before {
  animation-delay: -1s;
}
.sk-chase-dot:nth-child(3):before {
  animation-delay: -0.9s;
}
.sk-chase-dot:nth-child(4):before {
  animation-delay: -0.8s;
}
.sk-chase-dot:nth-child(5):before {
  animation-delay: -0.7s;
}
.sk-chase-dot:nth-child(6):before {
  animation-delay: -0.6s;
}

@keyframes sk-chase {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes sk-chase-dot {
  80%,
  100% {
    transform: rotate(360deg);
  }
}

@keyframes sk-chase-dot-before {
  50% {
    transform: scale(0.4);
  }
  100%,
  0% {
    transform: scale(1);
  }
}
</style>
