//  Build Chart Data
const buildChartData = (data) => {
  let chartData = [];
  for (let date in data.cases) {
    let newDataPoint = {
      x: date,
      y: data.cases[date],
    };
    chartData.push(newDataPoint);
  }
  return chartData;
};

// Build Pie Chart
const buildPieChart = (data) => {
  var ctx = document.getElementById("myPieChart").getContext("2d");
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "pie",
    // The data for our dataset
    data: {
      datasets: [
        {
          data: [data.active, data.recovered, data.deaths],
          backgroundColor: ["#cc1034", "#7fd922", "#fa5575"],
        },
      ],
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: ["Active", "Recovered", "Deaths"],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
    },
  });
};

// Build Line Chart
const buildChart = (chartData) => {
  var timeFormat = "MM/DD/YYYY";
  var ctx = document.getElementById("myChart").getContext("2d");
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: {
      datasets: [
        {
          label: "Total Cases",
          backgroundColor: "rgba(204, 16, 52, 0.5)",
          borderColor: "#CC1034",
          data: chartData,
        },
      ],
    },

    // Configuration options go here
    options: {
      maintainAspectRatio: true,
      tooltips: {
        mode: "index",
        intersect: false,
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              format: timeFormat,
              tooltipFormat: "ll",
            },
          },
        ],
        yAxes: [
          {
            gridLines: { display: false },
            ticks: {
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
                return numeral(value).format("0a");
              },
            },
          },
        ],
      },
    },
  });
};

// Switching charts function NEED TO FIX
const switchCharts = () => {
  // Get charts
  var linearChart = document.getElementsByClassName("linear-chart")[0];
  var pieChart = document.getElementsByClassName("pie-chart")[0];

  $(function () {
    $(document.getElementsByClassName("dropdown-item")).on(
      "click",
      function () {
        // Get dropdown value
        var dropdownItem = document.querySelectorAll(".dropdown-item")[0]
          .innerHTML;
        switch (dropdownItem) {
          case "Line chart":
            document.querySelectorAll(".dropdown-item")[0].innerHTML =
              "Pie Chart";
            document.querySelector(".btn-light").innerHTML = "Line chart";
            dropdownItem = "Pie Chart";
            break;
          case "Pie chart":
            document.querySelectorAll(".dropdown-item")[0].innerHTML =
              "Line chart";
            document.querySelector(".btn-light").innerHTML = "Pie chart";
            dropdownItem = "Line chart";
            break;
        }
        linearChart.classList.toggle("hide");
        pieChart.classList.toggle("hide");
      }
    );
  });
};
