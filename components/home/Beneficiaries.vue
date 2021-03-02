<template>
  <v-container fluid class="first-graph-section">
    <v-container>
      <p class="font-weight-black home-section-title px-3">{{$t('home-sec2-title')}}</p>
      <v-row>
        <v-col cols="12" sm="12" md="6">
          <v-row>
            <div
              v-for="(n, index) in homeSec2"
              :key="n.description"
              data-aos="fade-up"
              data-aos-offset="0"
              data-aos-duration="500"
              :data-aos-delay="`${100*index}`"
              class="custom-col"
              @click="toSubcategoriesPage(n.id, n.catId, n.description)"
            >
              <div class="homeSec2-token text-center">
                <span class="edge-corner">
                  <img :src="require('~/static/sec2/'+n.icon)" loading="lazy" :alt="n.description" />
                </span>
                <p>{{n.description}}</p>
              </div>
            </div>
          </v-row>
        </v-col>
        <v-col class="pa-0" cols="12" sm="12" md="6" v-if="graphMapped.length>0">
          <h2 class="text-center" data-aos="fade-down" data-aos-delay="300">{{$t('steps-taken')}}</h2>
          <figure class="highcharts-figure">
            <div id="beneficiariesGraph"></div>
          </figure>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
<script>
export default {
  props: ["beneficiariesGraph"],
  data() {
    return {};
  },
  computed: {
    homeSec2() {
      return [
        {
          icon: "ic_needs.svg",
          description: this.$t("home-sec2-1"),
          id: 3,
          catId: 3
        },
        {
          icon: "wheelbarrow.svg",
          description: this.$t("home-sec2-2"),
          id: 4,
          catId: 3
        },
        {
          icon: "ic_elders.svg",
          description: this.$t("home-sec2-3"),
          id: 5,
          catId: 3
        },
        {
          icon: "ic_woman.svg",
          description: this.$t("home-sec2-4"),
          id: 6,
          catId: 3
        },
        {
          icon: "ic_small_project.svg",
          description: this.$t("home-sec2-9"),
          id: 14,
          catId: 4
        },
        {
          icon: "ic_family.svg",
          description: this.$t("home-sec2-5"),
          id: 7,
          catId: 3
        },
        {
          icon: "ic_youth.svg",
          description: this.$t("home-sec2-6"),
          id: 8,
          catId: 3
        },
        {
          icon: "ic_employee.svg",
          description: this.$t("home-sec2-7"),
          id: 9,
          catId: 3
        },
        {
          icon: "ic_students.svg",
          description: this.$t("home-sec2-8"),
          id: 10,
          catId: 3
        },
        {
          icon: "ic_travel.svg",
          description: this.$t("home-sec2-10"),
          id: 13,
          catId: 3
        }
      ];
    },
    graphMapped() {
      let rawGraphData = JSON.parse(this.beneficiariesGraph.graph_data);
      let mappedData = rawGraphData.map(el => {
        return {
          name: el.beneficiary_name,
          y: el.number,
          z: el.number,
          dataLabels: {
            // distance: 20
          }
        };
      });
      return mappedData;
    },
    graphColors() {
      let rawGraphData = JSON.parse(this.beneficiariesGraph.graph_data);
      let mappedColors = rawGraphData.map(el => {
        return el.color;
      });
      return mappedColors;
    },
    currentLocale() {
      // console.log(this.$store.getters.getLocale);
      return this.$store.getters.getLocale;
    }
  },
  created() {},
  methods: {
    initGraph() {
      const data = this.graphMapped;
      const colors = this.graphColors;

      let chart = Highcharts.chart("beneficiariesGraph", {
        colors: [...colors],
        chart: {
          type: "pie",
          options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
          },
          backgroundColor: "transparent",
          // panning: true,
          // width: 700,
          style: {
            fontFamily: "Roboto"
          }
        },
        plotOptions: {
          pie: {
            center: ["50%", "50%"],
            depth: 45,
            allowPointSelect: true,
            cursor: "pointer",
            showInLegend: true
          }
        },
        legend: {
          rtl: this.currentLocale == "ar" ? true : false,
          // align: "center",
          useHTML: true,
          labelFormatter: function() {
            return (
              "<span style='font-size:15px; font-weight:500'>" +
              this.name +
              "<b style='margin:0 5px'>" +
              this.y +
              "</b>" +
              "</span>"
            );
          }
        },
        title: {
          text: ""
        },
        tooltip: {
          followTouchMove: false,
          useHTML: true,
          headerFormat: "",
          pointFormat:
            '<span style="color:{point.color};font-Size: 15px">\u25CF</span> <b style="font-Size: 15px"> {point.name}</b><br/>' +
            '<br/><div style="color:{point.color};font-Size: 20px; text-align:center; margin:auto;font-Weight: "bold"">{point.y}</div>',
          style: {
            fontSize: 20,
            fontWeight: "bold"
          }
        },
        series: [
          {
            minPointSize: 10,
            innerSize: "20%",
            zMin: 0,
            dataLabels: {
              format: '\u202B' + '{point.name}',
              useHTML: true,
              style: {
                fontSize: "16px",
                width:"150px"
                // fontWeight: "bold"
              }
            },
            name: "countries",
            data: [...data]
          }
        ],
        responsive: {
          rules: [
            {
              condition: {
                minWidth: 300
              },
              chartOptions: {
                chart: {
                },
                plotOptions: {
                  pie: {
                    center: ["50%", "50%"],
                    depth: 45,
                    dataLabels: {
                      enabled: false
                    }
                  }
                },
                legend: {
                  rtl: this.currentLocale == "ar" ? true : false,
                  // align: "center",
                  useHTML: true,
                  labelFormatter: function() {
                    return (
                      "<span style='font-size:14px;font-weight:500'>" +
                      this.name +
                      "<b style='margin:0 5px'>" +
                      this.y +
                      "</b>" +
                      "</span>"
                    );
                  }
                },
                tooltip: {
                  style: {
                    fontSize: 12
                  }
                }
              }
            },
            {
              condition: {
                minWidth: 600
              },
              chartOptions: {
                chart: {
                },
                plotOptions: {
                  pie: {
                    center: ["50%", "50%"],
                    depth: 45,
                    dataLabels: {
                      enabled: true
                    }
                  }
                },
                legend: {
                  rtl: this.currentLocale == "ar" ? true : false,
                  // align: "center",
                  useHTML: true,
                  labelFormatter: function() {
                    return (
                      "<span style='font-size:14px;font-weight:500'>" +
                      this.name +
                      "<b style='margin:0 5px'>" +
                      this.y +
                      "</b>" +
                      "</span>"
                    );
                  }
                },
                tooltip: {
                  style: {
                    fontSize: 12
                  }
                }
              }
            }
          ]
        }
      });
    },
    toSubcategoriesPage(subCatId, catId, catTitle) {
      this.$router.push({
        path: `/${this.$store.getters.getLocale}/subcategory-details`,
        query: {
          isSubCat: true,
          catId: catId,
          catTitle: catTitle,
          subCatId: subCatId,
          agency_id: null,
          beneficiary_id: null,
          date_from: null,
          date_to: null,
          page: 1
        }
      });
    }
  },
  mounted() {
    this.initGraph();
  }
};
</script>

<style lang="scss" scoped>
.custom-col {
  width: 17%;
  margin: 0 5px 1rem;
}

.homeSec2-token {
  max-width: 100%;
  cursor: pointer;
  & > span {
    display: block;
    background-color: #c89539;
    padding: 22px;
    width: 130px;
    height: 130px;
    border-radius: 30px;
    margin-bottom: 18px;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    max-width: 100%;
    transition: 0.3s ease-in-out;
    &:hover {
      box-shadow: 0 3px 12px 3px rgba(0, 0, 0, 0.5);
    }
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      max-width: 60px;
    }
  }
  & > p {
    font-size: 17px;
    font-weight: bold;
    color: #020101;
    line-height: 1.25;
  }
}

.first-graph-section {
  background-color: #f3f4f9;
  padding: 70px 0;
  background-image: url("../../static/Pattern.png");
  background-position: 50px 50px;
  // background-size: 300px 100px;
}
.home-section-title {
  font-size: 28px;
  margin-bottom: 60px;
  // font-family: "GESSTwoBold" !important;
}
@media only screen and (max-width: 1024px) {
  .homeSec2-token {
    max-width: 100%;
    cursor: pointer;
    & > span {
      padding: 10px;
      width: 100px;
      height: 90px;
      border-radius: 20px;
      img {
        max-width: 50px;
      }
    }
    & > p {
      font-size: 13px;
    }
  }
}
@media only screen and (max-width: 768px) {
  .custom-col {
    width: 17%;
    margin: 0 5px 1rem;
  }
  .homeSec2-token {
    & > span {
      width: 64px;
      height: 64px;
      border-radius: 10px;
      margin-bottom: 10px;
      img {
        width: 30px;
      }
    }
    & > p {
      font-size: 10px;
    }
  }

  .first-graph-section {
    background-color: #f3f4f9;
    padding: 25px 0;
  }
  .home-section-title {
    font-size: 16px;
    margin-bottom: 10px;
  }
}
</style>
