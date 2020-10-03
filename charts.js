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

// Switching charts NEED TO IMPROOVE BECAUSE IT DOES NOT WORK SO FAR
const switchCharts = () => {
  var dropdownItem1 = document.querySelectorAll(".dropdown-item")[0].innerHTML;
  var dropdownItem2 = document.querySelectorAll(".dropdown-item")[1].innerHTML;
  var linearChart = document.getElementsByClassName("linear-chart")[0];
  var pieChart = document.getElementsByClassName("pie-chart")[0];
  $(function () {
    $(document.getElementsByClassName("dropdown-item")[0]).on(
      "click",
      function () {
        document.querySelector(".btn-light").innerHTML = dropdownItem1;
        linearChart.classList.toggle("hide");
      }
    );
    $(document.getElementsByClassName("dropdown-item")[1]).on(
      "click",
      function () {
        document.querySelector(".btn-light").innerHTML = dropdownItem2;
        pieChart.classList.toggle("hide");
      }
    );
  });
};
