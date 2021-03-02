<template>
  <section class="side-fitler">
    <div class="fitler-main-title">{{$t('filter-results')}}</div>
    <div>
      <div class="fitler-title">{{$t('responsible-group')}}</div>
      <div class="filter-options">
        <v-checkbox
          hide-details
          v-model="selected"
          v-for="n in filterData"
          :key="n.id"
          :label="n.text"
          :value="n.id"
          color="#28a4a2"
        ></v-checkbox>
      </div>
    </div>
    <div class="filter-by-date">
      <div class="fitler-title">{{$t('date-of-announcement')}}</div>
      <v-dialog v-model="dateDialog" max-width="1000px">
        <template v-slot:activator="{ on, attrs }">
          <div class="mt-4 pick-date-trigger-wrapper">
            <span
              class="selected-dates"
              v-if="selectedDate.start&&selectedDate.end"
            >{{new Date(selectedDate.start).toLocaleDateString(`${currentLocale=='ar'?'ar-EG':'en-US'}`)}}&nbsp; {{$t('to')}} &nbsp;{{new Date(selectedDate.end).toLocaleDateString(`${currentLocale=='ar'?'ar-EG':'en-US'}`)}}</span>
            <div>
              <v-btn
                class="pick-date-trigger"
                text
                v-if="selectedDate.start&&selectedDate.end"
                @click="resetDateFilter"
              >{{$t('reset')}}</v-btn>
              <v-btn
                class="pick-date-trigger"
                text
                v-bind="attrs"
                v-on="on"
              >{{!(selectedDate.start&&selectedDate.end)? $t('pick-date'): $t('change')}}</v-btn>
            </div>
          </div>
        </template>

        <v-card class="calendar-card">
          <h4 class="text-center calendar-card-title">{{$t('choose-date')}}</h4>
          <!-- <no-ssr> -->
          <!--
              :columns="layout.columns"
              :is-expanded="layout.isExpanded"
          -->
          <vc-date-picker
            mode="range"
            v-model="selectedDate"
            :columns="layout.columns"
            :is-expanded="layout.isExpanded"
            :min-date="new Date(2019, 11, 1)"
            :locale="currentLocale"
            is-inline
          />
          <!-- </no-ssr> -->
          <v-card-actions>
            <v-btn
              class="px-8"
              style="color:#FFF"
              color="#c89539"
              @click="applyFilterByDate"
            >{{$t('confirm')}}</v-btn>
            <v-btn class="px-8" outlined @click="dateDialog = false">{{$t('cancel')}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div>
      <div class="fitler-title">{{$t('beneficiaries')}}</div>
      <div class="filter-options">
        <v-checkbox
          hide-details
          v-model="selected2"
          v-for="n in filterData2"
          :key="n.id"
          :label="n.text"
          :value="n.id"
          color="#28a4a2"
        ></v-checkbox>
      </div>
    </div>
  </section>
</template>
<script>
import { f } from "vue-slick-carousel";
export default {
  props: ["filterData", "filterData2", "queryData"],
  data() {
    return {
      selected: [],
      selected2: [],
      dateDialog: false,
      selectedDate: {
        start: null,
        end: null
      },
      allFiltersSelected: {
        agencies: [],
        beneficiaries: [],
        date_from: null,
        date_to: null
      },
      isReseting: true
    };
  },
  computed: {
    layout() {
      return this.$screens({
        // Default layout for mobile
        default: {
          columns: 1,
          isExpanded: false
        },
        // Override for large screens
        lg: {
          columns: 2,
          isExpanded: true
        }
      });
    },
    currentLocale() {
      return this.$store.getters.getLocale;
    }
  },
  created() {
    if (this.queryData.agency_id) {
      this.selected = [...this.queryData.agency_id.split(",")].filter(
        item => item
      );
    }
    if (this.queryData.beneficiary_id) {
      this.selected2 = [...this.queryData.beneficiary_id.split(",")].filter(
        item => item
      );
    }
    if (this.queryData.date_from && this.queryData.date_to) {
      this.selectedDate.start = this.queryData.date_from;
      this.selectedDate.end = this.queryData.date_to;
    }
    /////////////////////////
    this.$nuxt.$on("reset-all-filters", () => {
      console.log("reset-all-filters");
      this.isReseting = false;
      this.selected = [...[]];
      this.selected2 = [...[]];
      this.selectedDate.start = null;
      this.selectedDate.end = null;
      setTimeout(_=>{
        this.isReseting = true;
      })
    });
  },
  methods: {
    appendLeadingZeroes(n) {
      if (n <= 9) {
        return "0" + n;
      }
      return n;
    },
    formateDateForFilter(date) {
      let current_datetime = new Date(date);
      let formatted_date =
        current_datetime.getFullYear() +
        "-" +
        this.appendLeadingZeroes(current_datetime.getMonth() + 1) +
        "-" +
        this.appendLeadingZeroes(current_datetime.getDate());
      return formatted_date;
    },
    applyFilterByDate() {
      console.log(this.selectedDate, " selectedDate");
      this.allFiltersSelected = {
        ...this.allFiltersSelected,
        date_from: this.formateDateForFilter(this.selectedDate.start),
        date_to: this.formateDateForFilter(this.selectedDate.end)
      };
      this.$emit("filtersSelected", this.allFiltersSelected);
      this.dateDialog = false;
    },
    resetDateFilter() {
      this.selectedDate = { ...{} };
      this.allFiltersSelected = {
        ...this.allFiltersSelected,
        date_from: null,
        date_to: null
      };
      this.$emit("filtersSelected", this.allFiltersSelected);
    }
  },
  watch: {
    selected(val) {
      if (this.isReseting) {
        console.log("watcher one");
        this.allFiltersSelected = { ...this.allFiltersSelected, agencies: val };
        this.$emit("filtersSelected", this.allFiltersSelected);
      }
    },
    selected2(val) {
      if (this.isReseting) {
        this.allFiltersSelected = {
          ...this.allFiltersSelected,
          beneficiaries: val
        };
        this.$emit("filtersSelected", this.allFiltersSelected);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.side-fitler {
  background-color: #ffffff;
  padding: 2rem 2rem 3rem;
  border-radius: 30px;
  box-shadow: 0 3px 26px 0 rgba(0, 0, 0, 0.1);
  max-width: 95%;
}
.fitler-main-title {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #000000;
}
.fitler-title {
  font-size: 20px;
  font-weight: bold;
  color: #28a4a2;
  margin-bottom: 1rem;
}
.filter-by-date {
  margin: 1rem 0;
}
.pick-date-trigger-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.pick-date-trigger {
  .v-btn__content {
    text-decoration: underline !important;
    text-transform: capitalize;
  }
}
.filter-options {
  max-height: 500px;
  overflow-y: auto;
}

.calendar-card {
  padding: 70px 30px;
  .calendar-card-title {
    margin-bottom: 40px;
  }
  .v-card__actions {
    margin-top: 40px;
    justify-content: center;
  }
}
.selected-dates {
  font-weight: bold;
  letter-spacing: 1px;
}

@media only screen and (max-width: 960px) {
  .v-input--selection-controls {
    margin-top: 0;
  }
  .pick-date-trigger-wrapper {
    justify-content: flex-start;
  }
  .selected-dates {
    font-size: 14px;
    color: #000000;
  }
  .side-fitler {
    padding: 1.5rem 1.5rem 2rem;
    border-radius: 10px;
    max-width: 255px;
  }
  .fitler-main-title {
    font-size: 18px;
    margin-bottom: 1rem;
  }
  .fitler-title {
    font-size: 12px;
  }
  .filter-by-date {
    margin: 1rem 0;
  }
  .filter-options {
    max-height: 300px;
  }
}
</style>
