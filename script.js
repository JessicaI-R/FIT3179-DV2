// Chart 1: National workforce growth
const chart1 = "js/workforce_growth.vg.json";

vegaEmbed("#chart1", chart1, {
  actions: false
}).catch(console.error);


const chart2 = "js/workforce_profession_slopegraph.vg.json";

vegaEmbed("#chart2", chart2, {
  actions: false
}).catch(console.error);
