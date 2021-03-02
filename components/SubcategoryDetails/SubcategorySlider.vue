<template>
  <div class="custom-swiper-wrapper">
    <swiper
      class="swiper"
      ref="mySwiper"
      :options="swiperOption"
      :dir="currentLocale=='ar'?'rtl':'ltr'"
    >
      <swiper-slide v-for="n in filterSubCategories" :key="n.id">
        <v-card
          flat
          class="subcategories-carousel-token"
          :class="n.id==activeSlideId?'active-subcategory':null"
          @click="getSubCategoryPolicies(n.id, n.text)"
        >
          <!-- :dir="currentLocale=='ar'?'rtl':'ltr'" -->
          {{n.text}}
        </v-card>
      </swiper-slide>
    </swiper>
    <div class="swiper-button-next" slot="button-next"></div>
    <div class="swiper-button-prev" slot="button-prev"></div>
    <div class="swiper-pagination" slot="pagination"></div>
  </div>
</template>
<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.min.css";
export default {
  props: ["filterSubCategories", "activeSlideId"],
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      // slickOptions:
      activeSlideIndex: null
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
    currentLocale() {
      return this.$store.getters.getLocale;
    },
    swiperOption() {
      return {
        spaceBetween: 10,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        breakpoints: {
          300: {
            slidesPerView: 2,
            spaceBetween: 10
          },
          // when window width is >= 320px
          350: {
            slidesPerView: 2,
            spaceBetween: 10
          },
          // when window width is >= 480px
          480: {
            slidesPerView: 4,
            spaceBetween: 10
          },
          // when window width is >= 640px
          660: {
            slidesPerView: 5,
            spaceBetween: 20
          },
          960: {
            slidesPerView: 3,
            spaceBetween: 20
          },
          1270: {
            slidesPerView: 4,
            spaceBetween: 20
          },
          1400: {
            slidesPerView: 5,
            spaceBetween: 20
          }
        }
      };
    }
  },
  created() {
    // console.log(this.filterSubCategories, " filterSubCategories in slider");
    for (let index = 0; index < this.filterSubCategories.length; index++) {
      if (this.filterSubCategories[index].id == this.activeSlideId) {
        this.activeSlideIndex = index;
        // console.log(index, " activeSlideIndex");
      }
    }
  },
  mounted() {
    // this.$refs.carousel.goTo(this.activeSlideIndex);
    this.swiper.slideTo(this.activeSlideIndex, 1000, false);
  },
  updated() {},
  methods: {
    getSubCategoryPolicies(id, title) {
      this.$emit("subcategoryselected", { id: id, title: title });
      this.$nuxt.$emit('reset-all-filters')
    }
  },
  watch: {
    filterSubCategories(val) {
      // // console.log(val, ' watch filterSubCategories')
    }
  }
};
</script>
<style lang="scss" scoped>
.custom-swiper-wrapper {
  position: relative;
  .swiper-pagination {
    width: 100%;
  }
}
.subcategories-carousel-token {
  width: 210px;
  height: 100px;
  border-radius: 30px !important;
  margin: auto;
  background-color: #ffffff;
  margin-bottom: 5px;
  overflow: hidden;
  color: #c89539;
  cursor: pointer;
  font-size: 16px;
  padding: 5px 15px;
  display: flex;
  align-items: center;
  font-weight: 600;
}
.active-subcategory {
  background-color: rgba(200, 149, 57, 0.85) !important;
  color: #ffffff !important;
}
@media only screen and (max-width: 960px) {
  .subcategories-carousel-token {
    width: 110px;
    height: 60px;
    border-radius: 10px !important;
    margin: auto;
    background-color: #ffffff;
    margin-bottom: 5px;
    font-size: 12px;
  }
}
@media only screen and (max-width: 480px) {
  .subcategories-carousel-token {
    width: 140px;
    height: 60px;
  }
}
@media only screen and (max-width: 350px) {
  .subcategories-carousel-token {
    width: 110px;
    height: 50px;
  }
}
</style>