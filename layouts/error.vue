<template>
  <v-app class="fourOfour-page">
    <h1 v-if="error.statusCode === 404">
      <!-- {{ pageNotFound }} -->
      <div class="fourOfour-img-wrapper">
        <img src="~/static/404.png" alt class="fourOfour-img" />
      </div>
    </h1>
    <h1 v-else>{{ otherError }}</h1>
    <v-btn
      :to="`/${$store.getters.getLocale}`"
      width="190px"
      class="my-8 mx-auto"
      tile
      color="#c89539"
      dark
    >إذهب للصفحة الرئيسية</v-btn>
  </v-app>
</template>

<script>
export default {
  layout: "empty",
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: "404 Not Found",
      otherError: "An error occurred"
    };
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title
    };
  }
};
</script>

<style scoped lang="scss">
.fourOfour-page {
  background-color: #f3f4f9 !important;
  text-align: center;
}
.fourOfour-img-wrapper {
  margin-top: 100px;
  .fourOfour-img {
    width: 100%;
    // height: 280px;
  }
  /* height: 280px;
  background-position: 0% 0%;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url("../static/404.png"); */
}
h1 {
  font-size: 20px;
}
</style>
