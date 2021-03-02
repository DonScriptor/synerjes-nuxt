<template>
  <section>
    <!-- hero section -->
    <hero-section
      :title="homeData.home_page_title"
      :description="homeData.home_page_description"
      :bg="homeData.home_page_bg"
    />
    <!-- hero section -->
    <!--  achievements -->
    <achievements v-if="homeData.homePageNumbers" :ach_numbers="homeData.homePageNumbers.data[0]" />
    <!--  achievements -->
    <!--  Beneficiaries-->
    <beneficiaries
      :beneficiariesGraph="homeData.beneficiariesGraph.data"
      v-if="homeData.beneficiariesGraph"
    />
    <!--  Beneficiaries -->
    <!--  section three -->
    <support-graph :goalsGraph="homeData.goalsGraph.data" v-if="homeData.goalsGraph" />
    <!--  section three -->
    <!--  section four -->
    <categories
      :policyMainCategories="homeData.policyMainCategories.data"
      v-if="homeData.policyMainCategories"
    />
    <!--  final four -->
    <Conclusion />
    <!--  final four -->

    <div class="scroll-to-top">
      <a @click="scrollTop" v-show="scrollTopVisible">
        <img src="~/static/UP.svg" loading="lazy" alt="go up" />
      </a>
    </div>
  </section>
</template>

<script>
// import HeroSection from "~/components/home/HeroSection";
// import Achievements from "~/components/home/Achievements";
// import Beneficiaries from "~/components/home/Beneficiaries";
// import SupportGraph from "~/components/home/SupportGraph";
// import Categories from "~/components/home/Categories";
// import Conclusion from "~/components/home/Conclusion";
const HeroSection = () => import("~/components/home/HeroSection.vue");
const Achievements = () => import("~/components/home/Achievements.vue");
const Beneficiaries = () => import("~/components/home/Beneficiaries.vue");
const SupportGraph = () => import("~/components/home/SupportGraph.vue");
const Categories = () => import("~/components/home/Categories.vue");
const Conclusion = () => import("~/components/home/Conclusion.vue");
import axios from "axios";
export default {
  // layout: 'home',
  validate(data) {
    return data.params.locale == "ar" || data.params.locale == "en";
  },
  components: {
    HeroSection,
    Achievements,
    Beneficiaries,
    SupportGraph,
    Categories,
    Conclusion
  },
  data() {
    return {
      isHomeRendered: false,
      homeData: {},
      scrollTopVisible: false

      // formatter: new Formatter()
    };
  },
  computed: {
    currentModalPosition() {
      // return {
      //   top: this.$refs["categoryModalTrigger"]
      //     ? this.$refs["categoryModalTrigger"].offsetTop
      //     : null
      // };
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.isHomeRendered = false;
    this.$store.dispatch("home/getHomeData").then(res => {
      this.homeData = { ...res };
      // this.meta_title = res.home_page_title;
      // this.meta_description = res.home_page_description;
      this.isHomeRendered = true;
      this.$store.commit("changeAppState");
      next();
    });
  },
  created() {
    console.log(this, "asyncData asyncData created");
    // this.$store.dispatch("home/getHomeData").then(res => {
    //   this.homeData = { ...res };
    //   // this.meta_title = res.home_page_title;
    //   // this.meta_description = res.home_page_description;
    //   this.isHomeRendered = true;
    //   this.$store.commit("changeAppState");
    // });
  },
  methods: {
    scrollTop() {
      this.intervalId = setInterval(() => {
        if (window.pageYOffset === 0) {
          clearInterval(this.intervalId);
        }
        window.scroll(0, window.pageYOffset - 50);
      }, 10);
    },
    scrollListener(e) {
      this.scrollTopVisible = window.scrollY > 250;
    }
  },
  mounted() {
    window.addEventListener("scroll", this.scrollListener);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scrollListener);
  },
  async asyncData(context) {
    // try {
    console.log(context, " context");
    let locale = context.params.locale;
    return axios
      .get(`https://policytracker.mped.gov.eg:8443/api/${locale}/homepage`).then(res => {
      console.log(res, " lllllll");
      context.store.commit("changeAppState");
      // let meta_title = res.data.data.attributes.home_page_title;
      // let meta_description = res.data.data.attributes.home_page_description;
      // let extraMeta = [
      //   { name: "twitter:card", content: "summary" },
      //   { name: "twitter:site", content: "@nuxt_js" },
      //   { name: "twitter:title", content: "Nuxt.js Twitter Card" },
      //   {
      //     name: "twitter:description",
      //     content:
      //       "Nuxt.js lets you handle custom headers for your app with vue-meta"
      //   },
      //   {
      //     name: "twitter:image",
      //     content: "https://avatars0.githubusercontent.com/u/23360933?v=3"
      //   },
      //   { name: "twitter:image:alt", content: "Nuxt.js logo" }
      // ];
      return {
        // meta_title,
        // meta_description,
        // extraMeta,
        // homeData: { ...res },
        // isHomeRendered: true
      };
    });
    // return axios
    //   .get(`https://policytracker.mped.gov.eg:8443/api/${locale}/homepage`)
    //   .then(res => {
    //     console.log("asyncData asyncData", res.data.data.attributes);
    //     let meta_title = res.data.data.attributes.home_page_title;
    //     let meta_description = res.data.data.attributes.home_page_description;
    //     let extraMeta = [
    //       { name: "twitter:card", content: "summary" },
    //       { name: "twitter:site", content: "@nuxt_js" },
    //       { name: "twitter:title", content: "Nuxt.js Twitter Card" },
    //       {
    //         name: "twitter:description",
    //         content:
    //           "Nuxt.js lets you handle custom headers for your app with vue-meta"
    //       },
    //       {
    //         name: "twitter:image",
    //         content: "https://avatars0.githubusercontent.com/u/23360933?v=3"
    //       },
    //       { name: "twitter:image:alt", content: "Nuxt.js logo" }
    //     ];
    //     return {
    //       meta_title,
    //       meta_description,
    //       extraMeta
    //     };
    //   });
    // } catch (error) {
    //   // Redirect to error page or 404 depending on server response
    // }
  },
  // head() {
  //   console.log("asyncData asyncData head");
  //   return {
  //     title: this.meta_title,
  //     meta: [
  //       {
  //         hid: "description",
  //         name: "description",
  //         content: this.meta_description
  //       },
  //       {
  //         property: "og:image",
  //         content: "/MoP-Logo-04.jpg" || ""
  //       },
  //       ...this.extraMeta
  //     ]
  //   };
  // }
};
</script>
<style lang="scss" scoped>
.scroll-to-top {
  position: fixed;
  bottom: 100px;
  cursor: pointer;
  img {
    width: 80px;
    width: 80px;
  }
}
@media only screen and (max-width: 960px) {
  .scroll-to-top {
    display: none;
  }
}
</style>