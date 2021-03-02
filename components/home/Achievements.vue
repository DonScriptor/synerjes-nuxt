<template>
  <!--  section one -->
  <v-container class="homeSec1-wrapper">
    <v-row data-aos="fade-up" data-aos-delay="300">
      <v-col v-for="n in Object.keys(ach_numbers_mapped)" :key="n" cols="6" md="3">
        <div class="homeSec1-token">
          <span>
            <img :src="require('~/static/sec1/'+n+'.svg')" loading="lazy" alt />
          </span>
          <!-- <p>{{ach_numbers_mapped[n]}}</p> -->
          <p v-if="ach_numbers_mapped[n].match(/\d+/g)">
            <span>{{ach_numbers_mapped[n].split(extractNumbers(ach_numbers_mapped[n]))[0]}}</span>
            <span class="custom-counter" :data-target="extractNumbers(ach_numbers_mapped[n])">0</span>
            <span>{{ach_numbers_mapped[n].split(extractNumbers(ach_numbers_mapped[n]))[1]}}</span>
          </p>
          <p v-else>
            {{ach_numbers_mapped[n]}}
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <!--  section one -->
</template>
<script>
export default {
  props: ["ach_numbers"],
  computed: {
    ach_numbers_mapped() {
      delete this.ach_numbers.id;
      delete this.ach_numbers.type;
      return this.ach_numbers;
    }
  },
  created(){
    console.log(this.ach_numbers)
  },
  mounted() {
    window.addEventListener("scroll", this.scrollListener);
  },
  methods: {
    extractNumbers(text) {
      if (text.match(/\d+/g)) {
        return text.match(/\d+/g).map(Number)[0];
      }
    },
    triggerCountAnimation() {
      const counters = document.querySelectorAll(".custom-counter");
      const speed = 500; // The lower the slower

      counters.forEach(counter => {
        const updateCount = () => {
          const target = +counter.getAttribute("data-target");
          const count = +counter.innerText;

          // Lower inc to slow and higher to slow
          const inc = target / target;

          // console.log(inc);
          // console.log(count);

          // Check if target is reached
          if (count < target) {
            // Add inc to count and output in counter
            counter.innerText = count + inc;
            // Call function every ms
            setTimeout(updateCount, 60);
          } else {
            counter.innerText = target;
          }
        };

        updateCount();
      });
    },
    scrollListener(e) {
      const el = document.querySelector(".homeSec1-wrapper");
      const position = el.getBoundingClientRect();
      this.scrollTopVisible = position.top >= 0 && position.bottom <= window.innerHeight;
      if (this.scrollTopVisible) {
        console.log(el.offsetTop, el.clientHeight);
        this.triggerCountAnimation()
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scrollListener);
  }
};
</script>

<style lang="scss" scoped>
.homeSec1-wrapper {
  margin-bottom: 70px;
}
.homeSec1-token {
  & > span {
    display: block;
    background-color: #28a4a2;
    padding: 18px;
    width: 110px;
    height: 110px;
    border-radius: 30px;
    margin-bottom: 30px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    img {
      transform: scale(0.8);
    }
  }
  & > p {
    font-size: 20px;
    font-weight: bold;
    line-height: 1.25;
    // font-family: "GESSTwoBold" !important;
    // max-width: 90%;
    text-align: center;
  }
}

.custom-counter {
  font-size: 30px;
  margin: 0 0.3rem;
}

@media only screen and (max-width: 960px) {
  .homeSec1-token {
    padding: 0 15px;
    & > span {
      padding: 10px;
      width: 60px;
      height: 60px;
      border-radius: 8px;
      margin-bottom: 10px;
      img {
        width: 100%;
      }
    }
    & > p {
      font-size: 10px;
    }
  }
  .custom-counter {
    font-size: 20px;
    margin: 0 0.3rem;
  }
}
</style>
