// import colors from 'vuetify/es5/util/colors'
// import webpack from 'webpack'
import shrinkRay from 'shrink-ray-current'
const env = require('dotenv').config()
export default {
  mode: 'universal',
  server: {
    port: process.env.port, // default: 3000
    host: process.env.host // default: localhost
  },
  router: {
    // base: '/ar'
  },
  /*
   ** Headers of the page
   */
  head: {
    // titleTemplate: 'وزارة التخطيط والتنمية الاقتصادية | مرصد إجراءات كوفيد 19',
    // title: 'وزارة التخطيط والتنمية الاقتصادية | مرصد إجراءات كوفيد 19' || '',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      // {
      //   hid: 'description',
      //   name: 'description',
      //   content: 'كثفت الحكومة المصرية جهودها باتخاذ العديد من القرارات والإجراءات التي تستهدف مواجهة أزمة انتشار فيروس كورونا المستجد وتداعياتها الاقتصادية والاجتماعية، وقد تنوعت حزمة الإجراءات التي اتخذتها الدولة لتشمل الجوانب المالية والنقدية، فضلاً عن مساندة القطاعات المتضررة؛ وفي مقدمتها قطاعات الصحة والسياحة والطيران والسفر، كما حرصت الدولة على أن تكون هذه الإجراءات وفقاً لمنظور شامل يأخذ بعين الاعتبار كافة فئات المجتمع من المواطنين، والعمالة المنتظمة وغير المنتظمة، ومجتمع الأعمال إلى جانب أبناء مصر في الخارج.' || ''
      // },
      // {
      //   property: 'og:image',
      //   content: "/MoP-Logo-04.jpg" || ''
      // }
    ],
    link: [{
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      // {
      //   rel: 'stylesheet',
      //   href: 'https://fonts.googleapis.com/css?family=Material+Icons',
      // },
    ],
    script: [{
        // rel: 'preload',
        src: 'https://code.highcharts.com/highcharts.js'
      },
      {
        // rel: 'preload',
        // src: 'https://code.highcharts.com/modules/variable-pie.js'
      },
      {
        // rel: 'preload',
        src: 'https://code.highcharts.com/highcharts-3d.js'
      },
      {
        // rel: 'preload',
        src: 'https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js'
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: '~/components/loading.vue',
  /*
   ** Global CSS
   */
  css: [
    '~/assets/helpers.scss',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/i18n.js",
    '~/plugins/axios',
    {
      src: '~/plugins/vue-calendar',
      ssr: false
    },
    {
      src: "@/plugins/aos",
      ssr: false
    }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/vuetify',
    // 'nuxt-purgecss',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    ['@nuxtjs/component-cache', {
      maxAge: 1000 * 60 * 60 * 24
    }],
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    optionsPath: '~/options/vuetify.options.js',
    customVariables: ['~/assets/variables.scss'],
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
    // productionSourceMap: false
  },
  serverMiddleware: [
    // '~/middleware/locale'
  ],
  render: {
    compressor: shrinkRay(),
    static: {
      maxAge: 1000 * 60 * 60 * 24
    }
  }
}
