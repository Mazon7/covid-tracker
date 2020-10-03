window.onload = () => {
  getCountryData();
  getHistoricalData();
  getWorldCoronaData();
  //clickByEnter();
  switchCharts();
};

var map;
var infoWindow;
let coronaGlobalData;
let mapCircles = [];
const worldwideSelection = {
  name: "Worldwide",
  value: "www",
  selected: true,
};
var casesTypeColors = {
  cases: "#cc1034",
  recovered: "#7fd922",
  deaths: "#fa5575",
};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 40.849121, lng: -99.680929 },
    zoom: 2.5,
    // Disable the zoom etc from map
    disableDefaultUI: true,
    styles: mapStyle, // using custom style
  });
  infoWindow = new google.maps.InfoWindow();
}

// Clear the circles from the map
const changeDataSelection = (casesType) => {
  clearTheMap();
  showDataOnMap(coronaGlobalData, casesType);
};

const clearTheMap = () => {
  for (let circle of mapCircles) {
    circle.setMap(null);
  }
};

const initDropdown = (searchList) => {
  $(".ui.dropdown").dropdown({
    values: searchList,
    onChange: function (value, text) {
      console.log(value);
    },
  });
};

const setSearchList = (data) => {
  let searchList = [];
  searchList.push(worldwideSelection);
  data.forEach((countryData) => {
    searchList.push({
      name: countryData.country,
      value: countryData.countryInfo.iso3,
    });
  });
  initDropdown(searchList);
};

const getCountryData = () => {
  fetch("https://corona.lmao.ninja/v2/countries")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showDataInTable(data);
      var table = $("#table").DataTable({
        pagingType: "numbers",
      }); // implementing sorting and filtering for
      coronaGlobalData = data;
      setSearchList(data);
      showDataOnMap(data);
    });
};

// const getCountryWorldData = (countryData) => {
//   const url = "https://disease.sh/v3/covid-19/countries/" + countryIso;
//   fetch(url)
//   .then((response) =>)= {
//     return response.json()
//     /// need to finish thi function
//   }
// }

const getWorldCoronaData = () => {
  fetch("https://disease.sh/v2/all")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      buildPieChart(data);
      setStatsData(data);
    });
};

const setStatsData = (data) => {
  let addedCases = numeral(data.todayCases).format("+0,0");
  let addedRecovered = numeral(data.todayRecovered).format("+0,0");
  let addedDeaths = numeral(data.todayDeaths).format("+0,0");
  let totalCases = numeral(data.cases).format("0.0a");
  let totalRecovered = numeral(data.recovered).format("0.0a");
  let totalDeaths = numeral(data.deaths).format("0.0a");
  document.querySelector(".total-number").innerHTML = addedCases;
  document.querySelector(".recovered-number").innerHTML = addedRecovered;
  document.querySelector(".deaths-number").innerHTML = addedDeaths;
  document.querySelector(".cases-total").innerHTML = `${totalCases} Total`;
  document.querySelector(
    ".recovered-total"
  ).innerHTML = `${totalRecovered} Total`;
  document.querySelector(".deaths-total").innerHTML = `${totalDeaths} Total`;
};

const getHistoricalData = () => {
  fetch("https://disease.sh/v2/historical/all?lastdays=60")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let chartData = buildChartData(data);
      buildChart(chartData);
    });
};

// Changing period basing on the user's input (Naz's advice)
const getSpecifiedData = () => {
  var period = document.getElementById("period").value;
  fetch("https://disease.sh/v2/historical/all?lastdays=" + period)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      resetChart();
      let chartData = buildChartData(data);
      buildChart(chartData);
    });
};

// Removing chart and adding this again to HTML as it was before
// const resetChart = () => {
//   $("#myChart").remove();
//   $(".chart-data").prepend('<canvas id="myChart"><canvas>');
// };

// Enabling submit-button for changing period
// const enableButton = (period) => {
//   var btn = document.getElementById("submit-period");
//   if (period.value != "") {
//     btn.disabled = false;
//   } else {
//     btn.disabled = true;
//   }
// };

// Click submit button by enter
// const clickByEnter = () => {
//   var input = document.getElementById("period");
//   input.addEventListener("keyup", function (event) {
//     if (event.keyCode === 13) {
//       event.preventDefault();
//       document.getElementById("submit-period").click();
//     }
//   });
// };

const openInfoWindow = () => {
  infoWindow.open(map);
};

const showDataOnMap = (data, casesType = "cases") => {
  data.map((country) => {
    let countryCenter = {
      lat: country.countryInfo.lat,
      lng: country.countryInfo.long,
    };

    var countryCircle = new google.maps.Circle({
      strokeColor: casesTypeColors[casesType],
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: casesTypeColors[casesType],
      fillOpacity: 0.35,
      map: map,
      center: countryCenter,
      radius: country[casesType],
    });

    // Adding all circles to the array
    mapCircles.push(countryCircle);

    // Define country data from API in a html variable defined by string literals
    var html = `
      <div class="info-container">
        <div class="info-flag" style="background-image: url(${country.countryInfo.flag});">
        </div>
        <div class="info-name">
          ${country.country}
        </div>
        <div class="info-confirmed">
          Total: ${country.cases}
        </div>
        <div class="info-active">
          Active: ${country.active}
        </div>
        <div class="info-recovered">
          Recovered: ${country.recovered}
        </div>
        <div class="info-deaths">
          Deaths: ${country.deaths}
        </div>
      </div>
      `;

    // Define pop-up info window for all countries
    var infoWindow = new google.maps.InfoWindow({
      content: html,
      position: countryCircle.center,
    });

    // Create info window on hover
    google.maps.event.addListener(countryCircle, "mouseover", function () {
      infoWindow.open(map);
    });

    // Close info window when mouse not in the circle
    google.maps.event.addListener(countryCircle, "mouseout", function () {
      infoWindow.close();
    });
  });
};

//Store data in table below map
const showDataInTable = (data) => {
  var html = "";
  data.forEach((country) => {
    html += `
            <tr>
              <td>${country.country}</td>
              <td>${numeral(country.cases).format("0,0")}</td>
            </tr>
        `;
  });
  document.getElementById("table-data").innerHTML = html;
};
