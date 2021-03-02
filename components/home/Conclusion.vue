<template>
  <v-container fluid class="final-section">
    <v-container>
      <div class="custom-width">
        <v-row>
          <v-col v-for="n in homeFinalSec" :key="n.description" cols="4" sm >
            <div class="final-section-token edge-corner">
            <span>
              <img :src="require('~/static/final-sec/'+n.icon)" loading="lazy" :alt="n.description" />
            </span>
              <p>
                <span class="en-number" v-if="n.icon=='ic_2.svg'">
                  {{currentLocale=='ar'?'100': 'EGP 100'}}
                  
                  </span>
                {{n.description}}
              </p>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-container>
</template>
<script>
export default {
  computed: {
    homeFinalSec() {
      return [
        {
          icon: "ic_2.svg",
          description: this.$t("home-finalsec-1")
        },
        {
          icon: "ic_hand.svg",
          description: this.$t("home-finalsec-2")
        },
        {
          icon: "ic_1.svg",
          description: this.$t("home-finalsec-3")
        }
      ];
    },
    currentLocale() {
      // console.log(this.$store.getters.getLocale);
      return this.$store.getters.getLocale;
    }
  }
};
</script>
<style lang="scss" scoped>
  .custom-width{
    max-width: 1000px;
    margin: 0 auto;
  }
.final-section {
  background-color: #f3f4f9;
  padding: 70px 0;
  background-image: url("../../static/ic_pattern.svg");
  background-position: 700px 150px;
  background-size: contain;
}
.final-section-token {
  margin: auto;
  /*width: 350px;*/
  height: 350px;
  backdrop-filter: blur(30px);
  background-color: #28a4a2;
  padding: 80px 30px 0;
  border-radius: 30px;
  max-width: 100%;
  span {
  }
  p {
    margin-top: 15px;
    font-size: 19px;
    color: #ffffff;
    // font-family: "GESSTwoMediumMeduim" !important;
    max-width: 90%;
    line-height: 2;
  }
}

.en-number {
  // font-family: "Roboto", sans-serif !important;
  font-weight: bold !important;
  font-size: 26px;
  letter-spacing: -1;
}

@media only screen and (max-width: 960px) {
  .final-section {
    background-color: #f3f4f9;
    padding: 25px 0;
  }
  .final-section-token {
    margin: auto;
    width: 115px;
    height: 120px;
    padding: 10px;
    border-radius: 10px;
    span {
      img {
        width: 24px;
        height: 24px;
      }
    }
    p {
      margin-top: 5px;
      font-size: 10px;
      line-height: 1.4;
    }
  }
  .en-number {
    font-size: 11px;
  }

  .final-section {
    background-position: 50px 50px;
  }
}

@media only screen and (max-width: 350px) {
  .final-section-token {
    p {
      margin-top: 0px;
      font-size: 8px;
    }
  }
}
</style>
