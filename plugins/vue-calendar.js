import Vue from 'vue';
import VCalendar from 'v-calendar';

// Use v-calendar & v-date-picker components
Vue.use(VCalendar, {
  componentPrefix: 'vc',
  screens: {
    tablet: '576px',
    laptop: '992px',
    desktop: '1200px',
  },
});
