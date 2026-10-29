const charts = [
  {
    id: "chart1",
    path: "js/workforce_growth.vg.json",
    axisAllowance: 90
  },
  {
    id: "chart2",
    path: "js/workforce_profession_slopegraph.vg.json",
    axisAllowance: 100
  },
  {
    id: "chart3",
    path: "js/workforce_growth_ranking.vg.json",
    axisAllowance: 190
  },
  {
    id: "chart13",
    path: "js/workforce_rankings.vg.json",
    axisAllowance: 100
  },
  {
    id: "chart4",
    path: "js/workforce_composition.vg.json",
    axisAllowance: 100
  },
  {
    id: "chart5",
    path: "js/workforce_average_age.vl.json",
    axisAllowance: 260
  },
  {
    id: "chart6",
    path: "js/workforce_density_map.vg.json",
    axisAllowance: 100
  }
];

const specs = {};

let resizeTimer;


// Load each chart independently
async function loadSpecs() {

  await Promise.all(
    charts.map(async ({ id, path }) => {

      try {

        const response = await fetch(path);

        if (!response.ok) {
          throw new Error(
            `Could not load ${path}: ${response.status}`
          );
        }

        specs[id] = await response.json();

      } catch (error) {

        console.error(
          `Failed to load ${id} from ${path}:`,
          error
        );

        const element = document.getElementById(id);

        if (element) {
          element.textContent =
            "Chart could not load. Check the browser console.";
        }

      }

    })
  );

}


// Render all successfully loaded charts
async function renderCharts() {

  for (const { id, axisAllowance } of charts) {

    const element = document.getElementById(id);

    if (!element || !specs[id]) {
      continue;
    }

    const availableWidth = element.clientWidth;

    const plotWidth = Math.max(
      120,
      Math.floor(availableWidth - axisAllowance)
    );

    const spec = structuredClone(specs[id]);

    if (id === "chart2") {

      spec.vconcat.forEach(panel => {
        panel.width = plotWidth;
      });

    } else {

      spec.width = plotWidth;

    }

    try {

      await vegaEmbed(`#${id}`, spec, {
        actions: false,
        renderer: "svg"
      });

    } catch (error) {

      console.error(
        `Failed to render ${id}:`,
        error
      );

      element.textContent =
        "Chart could not load. Check the browser console.";

    }

  }

}


// Initialise charts
async function initialise() {

  try {

    await loadSpecs();

    await renderCharts();

    window.addEventListener("resize", () => {

      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(
        renderCharts,
        250
      );

    });

  } catch (error) {

    console.error(
      "Could not initialise charts:",
      error
    );

  }

}

initialise();
