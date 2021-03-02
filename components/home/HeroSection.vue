<template>
  <!-- hero section -->
  <v-container fluid class="pa-0 hero-container">
    <v-row no-gutters class="ht-100">
      <v-col cols="12" lg="6" class="hero-bg-img">
        <!-- :style="{ 'background-image': 'url(' + bg + ')' }" -->
        <h1 class="hero-title ml2 desktop-only">{{title}}</h1>
        <h1 class="hero-title mobile-only">{{title}}</h1>
      </v-col>
      <v-col cols="12" lg="6" class="hero-description">
        <p v-html="description" data-aos="zoom-in">
          <!-- {{description}} -->
        </p>
        <!-- <p
            class="font-weight-medium"
          >
        </p>-->
      </v-col>

      <div class="img-skew">
        <img src="~/static/Asset-02.svg" alt />
      </div>
    </v-row>
  </v-container>
  <!-- hero section -->
</template>
<script>
export default {
  props: ["title", "description", "bg"],
  created() {},
  mounted() {
    var textWrapper = document.querySelector(".ml2");
    textWrapper.innerHTML = textWrapper.textContent.replace(
      /\S/g,
      "<span class='letter'>$&</span>"
    );

    anime
      .timeline({ loop: true })
      .add({
        targets: ".ml2 .letter",
        scale: [4, 1],
        opacity: [0, 1],
        translateZ: 0,
        easing: "easeOutExpo",
        duration: 950,
        delay: (el, i) => 70 * i
      })
      .add({
        targets: ".ml2",
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      });
  }
};
</script>
<style lang="scss" scoped>
.hero-container {
  // height: calc(100vh - 100px);
  margin-bottom: 125px;
  position: relative;
  // overflow: hidden;
}
.img-skew {
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  // height: 93px;
  img {
    width: 100%;
  }
}
.hero-bg-img {
  background-image: url("~assets/hero.png") !important;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
}
.hero-title {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -40%);
  font-size: 33px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  max-width: 500px;
  width: 90%;
  // font-family: "GESSTwoBold" !important;
}
.hero-description {
  background-color: #28a4a2;
  p {
    font-size: 20px;
    padding: 50px 25px 100px;
    color: #ffffff;
    min-height: 800px;
    line-height: 2;

    // margin-bottom: 70px;
  }
}
@media only screen and (max-width: 1265px) {
  .hero-container {
    height: auto;
    margin-bottom: 40px;
  }
  .img-skew {
    display: none;
  }
  .hero-bg-img {
    height: 230px;
  }
  .hero-title {
    font-size: 18px;
  }
  .hero-description {
    p {
      font-size: 12px;
      padding: 15px 15px 10px;
      min-height: 230px;
    }

    position: relative;
    z-index: 1;
    &:before,
    &:after {
      background: inherit;
      content: "";
      display: block;
      height: 50%;
      left: 0;
      position: absolute;
      right: 0;
      z-index: -1;
      -webkit-backface-visibility: hidden; // for Chrome Windows
    }

    &:before {
      top: 0;
      transform: skewY(-1.5deg);
      transform-origin: 0 100%;
    }

    &:after {
      bottom: 0;
      transform: skewY(3deg);
      transform-origin: 0 100%;
    }
  }
}
///////////////////
.ml2 {
  // font-weight: 900;
  // font-size: 3.5em;
}

.ml2 .letter {
  display: inline-block;
  line-height: 1em;
}
</style>
