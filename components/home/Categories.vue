<template>
  <v-container fluid class="categories-section">
    <v-container class="pa-0">
      <p class="font-weight-black home-section-title">{{$t('categories-title')}}</p>

      <div class="carousel-wrapper" ref="categoryModalTrigger">
        <div class="custom-swiper-wrapper">
          <swiper class="swiper" :options="swiperOption" :dir="currentLocale=='ar'?'rtl':'ltr'">
            <swiper-slide v-for="(n,index) in policyMainCategories" :key="n.id" class="img-wrapper">
              <v-card class="mx-auto category-token edge-corner" max-width="400">
                <v-card-title class="category-title">
                  <img
                    :src="isImage(n.icon)=='image'? n.icon: require('~/static/categories/ic_actions.svg')"
                    loading="lazy"
                    alt
                    data-aos-offset="0"
                    data-aos="fade-in"
                    :data-aos-delay="`${100*index}`"
                  />
                  <span class="title font-weight-black mt-2">{{n.title}}</span>
                </v-card-title>

                <v-card-text class="font-weight-black category-text">{{n.description}}</v-card-text>
                <v-card-actions class="category-action">
                  <button
                    class="ma-2 white--text modal-trigger"
                    :ref="`trigger-${index}`"
                    @click="showCategoryDescription($event, index, n.id, n.title)"
                  >
                    <span class="mx-2">{{$t('read-more')}}</span>
                    <v-icon color="#FFF" flate>mdi-menu-down</v-icon>
                  </button>
                </v-card-actions>
              </v-card>
            </swiper-slide>
          </swiper>
          <!-- <div class="swiper-button-next" slot="button-next"></div> -->
          <!-- <div class="swiper-button-prev" slot="button-prev"></div> -->
          <div class="swiper-pagination" slot="pagination"></div>
        </div>
        <div
          class="category-description custom-description-modal"
          v-show="isDescriptionModalActive"
          v-clickoutside="hideModalOnClickOutside"
          :style="currentModalPosition"
        >
          <div class="category-description-inner-wrapper" v-if="policySubcategories.length>0">
            <v-list>
              <v-list-item
                v-for="(item, index) in policySubcategories"
                :key="index"
                @click="visitSubcategoryPage(item.id)"
              >
                <v-list-item-title>{{item.title}}</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </div>
      </div>
    </v-container>
  </v-container>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.min.css";
export default {
  props: ["policyMainCategories"],
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      isDescriptionModalActive: false,
      activeCategoryModalId: null,
      policySubcategories: [],
      selectedCategoryId: null,
      selectedCategoryTitle: null
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
  created() {},
  computed: {
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
          // when window width is >= 320px
          320: {
            slidesPerView: 2
            // spaceBetween: 20
          },
          // when window width is >= 480px
          480: {
            slidesPerView: 3
            // spaceBetween: 30
          },
          // when window width is >= 640px
          640: {
            slidesPerView: 3
            // spaceBetween: 40
          },
          960: {
            slidesPerView: 3
            // spaceBetween: 40
          },
          1024: {
            slidesPerView: 4
            // spaceBetween: 40
          }
        }
      };
    },
    currentModalPosition() {},
    homeSec2() {
      return [
        {
          icon: "ic_elders.svg",
          description: this.$t("home-sec2-1")
        },
        {
          icon: "ic_employee.svg",
          description: this.$t("home-sec2-2")
        },
        {
          icon: "ic_family.svg",
          description: this.$t("home-sec2-3")
        },
        {
          icon: "ic_needs.svg",
          description: this.$t("home-sec2-4")
        },
        {
          icon: "ic_students.svg",
          description: this.$t("home-sec2-5")
        },
        {
          icon: "ic_woman.svg",
          description: this.$t("home-sec2-6")
        },
        {
          icon: "wheelbarrow.svg",
          description: this.$t("home-sec2-7")
        },
        {
          icon: "ic_needs.svg",
          description: this.$t("home-sec2-8")
        }
      ];
    },
    currentLocale() {
      // console.log(this.$store.getters.getLocale);
      return this.$store.getters.getLocale;
    }
  },
  methods: {
    isImage(message) {
      const imgFileTypes = [
        "jpg",
        "jpeg",
        "png",
        "svg",
        "gif",
        "JPG",
        "JPEG",
        "PNG",
        "GIF",
        "SVG"
      ];
      let msgExt = message.slice(((message.lastIndexOf(".") - 1) >>> 0) + 2);
      return imgFileTypes.includes(msgExt) ? "image" : "notValid";
    },
    showCategoryDescription(event, index, id, title) {
      this.selectedCategoryId = id;
      this.selectedCategoryTitle = title;
      !this.activeCategoryModalId ? (this.activeCategoryModalId = index) : null;
      if (this.isDescriptionModalActive) {
        if (this.activeCategoryModalId == index) {
          this.isDescriptionModalActive = false;
        } else {
          this.activeCategoryModalId = index;
        }
      } else {
        this.isDescriptionModalActive = true;
        this.activeCategoryModalId = index;
      }
      // styling stuff
      let viewportWidth = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      let carouselWrapperWidth = document
        .querySelector(".carousel-wrapper")
        .getBoundingClientRect().width;
      let marginDiff = (viewportWidth - carouselWrapperWidth) / 2;
      let triggerOffset = event.target.getBoundingClientRect().left;
      this.applyCSS(triggerOffset - marginDiff + 30);
      // styling stuff end
      this.$store.dispatch("home/getPolicysubcategories", id).then(res => {
        this.policySubcategories = [...res.data];
        // console.log(this.policySubcategories, " this.policySubcategories");
        // console.log(this.selectedCategoryId, " this.selectedCategoryId");

        if (!this.policySubcategories.length) {
          this.$router.push({
            path: `/${this.$store.getters.getLocale}/subcategory-details`,
            query: {
              isSubCat: false,
              catId: this.selectedCategoryId,
              catTitle: this.selectedCategoryTitle,
              subCatId: null,
              agency_id: null,
              beneficiary_id: null,
              date_from: null,
              date_to: null,
              page: 1
            }
          });
          // .catch(error => {
          //   if (error.name != "NavigationDuplicated") {
          //     throw error;
          //   }
          // });
        }
      });
    },
    visitSubcategoryPage(subCatId) {
      this.$router.push({
        path: `/${this.$store.getters.getLocale}/subcategory-details`,
        query: {
          isSubCat: true,
          catId: this.selectedCategoryId,
          catTitle: this.selectedCategoryTitle,
          subCatId: subCatId,
          agency_id: null,
          beneficiary_id: null,
          date_from: null,
          date_to: null,
          page: 1
        }
      });
      // .catch(error => {
      //   if (error.name != "NavigationDuplicated") {
      //     throw error;
      //   }
      // });
    },

    hideModalOnClickOutside() {
      if (this.isDescriptionModalActive) {
        this.isDescriptionModalActive = !this.isDescriptionModalActive;
        this.activeCategoryModalId = null;
      }
    },
    applyCSS(offset) {
      let cssRule = `.category-description-inner-wrapper:before {left: ${offset}px !important}`;
      let style = document.createElement("style");
      style.type = "text/css";
      //append the style node as child of current component
      this.$el.appendChild(style);
      style.innerHTML = cssRule;
    }
  },
  mounted() {
    window.addEventListener("scroll", this.scrollListener);
  },
  watch: {
    isDescriptionModalActive(val) {
      if (val) {
        // this.options.paginationEnabled = false
      } else {
        // this.options.paginationEnabled = true
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.home-section-title {
  font-size: 28px;
  // font-family: "GESSTwoBold" !important;
  margin-bottom: 60px;
}
.carousel-wrapper {
  position: relative;
  .VueCarousel-slide {
    // margin: 0 5px;
    padding: 0 5px;
  }
}

//custom-description-modal
.custom-description-modal {
  width: 90%;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  z-index: 4;
  // bottom: 0;
  // width: 100%;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
  border-radius: 23px;
  overflow: hidden;
}

.v-card:not(.v-sheet--tile):not(.v-card--shaped) {
  border-radius: 33px;
  padding: 0 1rem 1rem 1rem;
}
.category-description-inner-wrapper {
  position: relative;
  // width: 90%;
  // margin: auto;
  padding: 3rem 8rem;
  background: #fff;
  &::before {
    // layout
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    bottom: 100%;
    left: 1.5em; // offset should move with padding of parent
    border: 1.5rem solid transparent;
    border-top: none;

    // looks
    border-bottom-color: #fff;
    filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, 0.3));
  }
}

.categories-section {
  background-image: url("~assets/categories.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  padding: 70px 0;
  position: relative;
  .home-section-title {
    color: #ffffff;
  }
}

.category-title {
  // flex-direction: column;
  // align-items: flex-start;
  display: block;
  img {
    width: 79px;
    height: 79px;
    display: block;
  }
  .title {
    display: block;
    word-break: break-word;
    max-height: 57px;
    height: 46px;
    font-size: 17px !important;
    line-height: 1.3 !important;
    // font-family: "GESSTwoMediumMeduim" !important;
  }
}
.category-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  height: 107px;
  width: auto;
  padding: 16px 5px;
}
.category-action {
  justify-content: center;
}
.modal-trigger {
  width: 190px;
  height: 58px;
  border-radius: 10px;
  background-color: #c89539;
  font-size: 16px;
  color: #ffffff;
}

.category-description {
  .v-list {
    border-radius: 20px;
    text-align: center;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    .v-list-item {
      display: inline-flex;
      // width: 502px;
      margin: 16px;
      height: 80px;
      // max-width: 90%;
      border-radius: 5px;
      background-color: #c89539;
      /*margin: 15px;*/
      flex-grow: 1;
      min-width: 0;
      /* max-width: 100%; */
      flex: 0 0 30%;
      max-width: 30%;
      .v-list-item__title {
        font-size: 20px;
        text-align: center;
        color: #ffffff;
        text-overflow: unset;
        white-space: unset;
        // font-family: "GESSTwoMediumMeduim" !important;
      }
    }
  }
}
@media only screen and (max-width: 960px) {
  .custom-description-modal {
    max-height: 310px;
    overflow-y: scroll;
  }
  .v-card:not(.v-sheet--tile):not(.v-card--shaped) {
    border-radius: 15px;
  }
  .category-token {
    width: 165px;
    height: 190px;
  }
  .categories-section {
    padding: 25px 0;
  }
  .modal-trigger {
    width: 91px !important;
    height: 30px !important;
    font-size: 10px;
    border-radius: 5px;
  }

  .category-title {
    height: 60px;
    padding: 12px 5px;
    img {
      width: 24px;
      height: 24px;
    }
    .title {
      font-size: 10px !important;
      line-height: 1;
      margin-top: 5px;
      height: unset;
    }
  }
  .category-text {
    font-size: 10px !important;
    height: 45px;
    // white-space: nowrap !important;
    overflow: hidden !important;
    // text-overflow: ellipsis !important;
    line-height: 1rem;
    letter-spacing: 0;
    width: auto;
  }
  .category-action {
    padding: 0;
  }
  .home-section-title {
    font-size: 16px;
    margin-bottom: 30px;
    padding: 0 10px;
  }

  .category-description-inner-wrapper {
    padding: 1rem 1rem;
    .v-list {
      border-radius: 20px;
      text-align: center;
      .v-list-item {
        display: inline-flex;
        height: auto;
        border-radius: 5px;
        background-color: #c89539;
        margin: 7px;
        flex: unset;
        width: 45%;
        max-width: 50%;
        padding: 5px;
        .v-list-item__title {
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          color: #ffffff;
          line-height: 1.1;
          white-space: unset;
        }
      }
    }
  }
}

@media only screen and (max-width: 550px) {
  .category-token {
    width: 145px;
    padding: 0 0.5rem 1rem 0.5rem;
  }
}
</style>
