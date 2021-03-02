import Vue from "vue";
import VueI18n from "vue-i18n";

// Tell Vue to use our plugin
Vue.use(VueI18n);

export default ({ app }) => {
  // Set the i18n instance on app
  // This way we can use it globally in our components through this.$i18n
  app.i18n = new VueI18n({
    // Set the initial locale
    locale: "ar",
    // Set the fallback locale in case the current locale can't be found
    fallbackLocale: "ar",

    // Associate each locale to a content file    
    messages: {
      en: require("~/assets/locales/content-en.json"),
      ar: require("~/assets/locales/content-ar.json")
    }
  });
};