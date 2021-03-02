<template>
  <v-container class="pa-10" v-if="graphMapped.length>0">
    <h2 class="text-center mb-8" data-aos="fade-down" data-aos-delay="300">{{$t('supporting-affected')}}</h2>
    <figure class="highcharts-figure">
      <div id="goalsGraph"></div>
    </figure>
  </v-container>
</template>
<script>
export default {
  props: ["goalsGraph"],
  data() {
    return {};
  },
  computed: {
    graphMapped() {
      let rawGraphData = JSON.parse(this.goalsGraph.graph_data);
      // console.log(rawGraphData, " goalsGraph()goalsGraph()");
      let mappedData = rawGraphData.map(el => {
        return {
          name: el.goal_title,
          y: el.number,
          dataLabels: {
            distance: 20
          }
        };
      });
      return mappedData;
    },
    graphColors() {
      let rawGraphData = JSON.parse(this.goalsGraph.graph_data);
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

      let chart = Highcharts.chart("goalsGraph", {
        colors: [...colors],
        chart: {
          type: "pie",
          options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
          },
          backgroundColor: "transparent",
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
              style: {
                fontSize: 15,
                fontWeight: "bold"
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
                  // width: 370
                },
                plotOptions: {
                  pie: {
                    center: ["50%", "50%"],
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
                      "<span style='font-size:12px; font-weight:500'>" +
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
                },
              }
            },
            {
              condition: {
                minWidth: 600
              },
              chartOptions: {
                chart: {
                  // width: 370
                },
                plotOptions: {
                  pie: {
                    center: ["50%", "50%"],
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
                      "<span style='font-size:12px; font-weight:500'>" +
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
                },
                series: [
                  {
                    dataLabels: {
                      style: {
                        fontSize: 12,
                        fontWeight: "bold"
                        // width: 60
                      }
                    }
                  }
                ]
              }
            },
            {
              condition: {
                minWidth: 900
              },
              chartOptions: {
                chart: {
                  // width: 370
                },
                plotOptions: {
                  pie: {
                    center: ["50%", "50%"],
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
                      "<span style='font-size:14px; font-weight:bold'>" +
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
                    fontSize: 14
                  }
                },
                series: [
                  {
                    dataLabels: {
                      style: {
                        fontSize: 18,
                        fontWeight: "bold"
                        // width: 60
                      }
                    }
                  }
                ]
              }
            }
          ]
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
@media only screen and (max-width: 960px) {
}
</style>
