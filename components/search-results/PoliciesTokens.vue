<template>
  <div class="filtered-token-wrapper">
    <div
      class="filtered-token"
      v-for="n in policiesData"
      :key="n.id"
      data-aos="fade-in"
      data-aos-duration="500"
      data-aos-once="true"
    >
      <p class="filtered-token-procedure">{{$t('policy')}}</p>
      <!-- <div class="filtered-token-description" v-html="n.goal"> -->
      <div class="filtered-token-description" v-html="n.goal">
        <!-- <text-highlight :queries="keyword" highlightClass="custom-highlight-style">{{ n.goal }}</text-highlight> -->
      </div>
      <p class="filtered-token-procedure">{{$t('purpose')}}</p>
      <div class="filtered-token-description" v-html="n.description">
        <!-- <text-highlight
          :queries="keyword"
          highlightClass="custom-highlight-style"
        >{{ n.description }}</text-highlight> -->
      </div>
      <div class="horizontal-spacer"></div>
      <div class="filtered-token-meta-data">
        <div class="meta-token">
          <img src="~/static/meta/ic_people.svg" alt />
          <p>{{$t('beneficiaries')}}</p>
          <p>{{n.beneficiary_title}}</p>
        </div>
        <div class="meta-token">
          <img src="~/static/meta/ic_calendar.svg" alt />
          <p>{{$t('date-of-announcement')}}</p>
          <p>{{n.date}}</p>
        </div>
        <div class="meta-token">
          <img src="~/static/meta/ic_authority.svg" alt />
          <p>{{$t('responsible-entity')}}</p>
          <p>
            <span
              v-for="(x, index) in n.agencies.data"
              :key="x.id"
            >{{x.title}} {{n.agencies.data.length>1&&index !=n.agencies.data.length-1 ?'-':null}}&nbsp;</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TextHighlight from "vue-text-highlight";
export default {
  props: ["policiesData", "keyword"],
  components: { TextHighlight },
  data() {
    return {};
  },
  created() {
    // console.log(this.keyword, "currentKeyword");
  }
};
</script>

<style lang="scss" scoped>
.filtered-token {
  backdrop-filter: blur(30px);
  box-shadow: 0 3px 26px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 30px;
  margin-bottom: 30px;

  &-procedure {
    font-size: 20px;
    line-height: 2;
    letter-spacing: 0.65px;
    color: #28a4a2;
    margin-bottom: 5px;
    font-weight: bold;
  }

  &-description {
    font-size: 19px;
    margin-bottom: 20px;
    font-weight: 500;
    line-height: 2;
    letter-spacing: 0.5px;
    // font-family: "GESSTwoBold" !important;
  }

  &-see-more {
    color: #c89539;
    font-weight: bold;
    text-decoration: underline;
    display: flex;
    justify-content: flex-end;
    cursor: pointer;
  }
}

.horizontal-spacer {
  border: solid 0.5px rgba(40, 164, 162, 0.48);
  border-top-width: inherit;
}
.filtered-token-meta-data {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem 1rem;
  .meta-token {
    max-width: 33%;
    p {
      font-weight: bold;
    }
  }
  p {
    margin-bottom: 0px;
    &:first-of-type {
      color: #28a4a2;
      font-size: 20px;
    }
    &:last-of-type {
      font-size: 18px;
      font-weight: 500;
    }
  }
}

@media only screen and (max-width: 960px) {
  .filtered-token {
    border-radius: 10px;
    padding: 10px 1rem;

    &-procedure,
    &-description,
    &-see-more {
      font-size: 12px;
      line-height: 1.4rem;
    }
  }

  .filtered-token-meta-data {
    padding: 10px 0rem;
    img {
      width: 20px;
      height: 20px;
    }
    p {
      margin-bottom: 0px;
      &:first-of-type {
        font-size: 10px;
      }
      &:last-of-type {
        font-size: 10px;
      }
    }
  }
}
</style>