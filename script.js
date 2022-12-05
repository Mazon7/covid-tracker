// Initialize dropdown for countries
const initDropdown = (searchList) => {
  $(".ui.dropdown").dropdown({
    values: searchList,
    onChange: function (value, text) {
      // Show respective info Label in the box
      console.log(value, text);
      // Get the data for Country when it's selected
      changeCountrySelection(value);
    },
  });
};

window.onload = () => {
  getCountryData();
  getHistoricalData();
  getWorldCoronaData();
  //clickByEnter();
  switchCharts();
};

// Declare main variables
var map; // Google map
let coronaGlobalData;
let mapMarkers = []; // Markers array
let infoWindows = []; // Infowindows array
let countrySelection = "worldwide";

const worldwideSelection = {
  name: "Worldwide",
  value: "www",
  selected: true,
};

var casesTypeColors = {
  cases: {
    icon: '<i class="fa-solid fa-virus-covid"></i>',
    background: "#ffd514",
    borderColor: "#ff8300",
  },
  recovered: {
    icon: '<i class="fa-solid fa-heart"></i>',
    background: "#7fd922",
    borderColor: "#12B820",
  },
  deaths: {
    icon: '<i class="fa-solid fa-skull"></i>',
    background: "#F30936",
    borderColor: "#A20D29",
  },
};

// Initialize the Map
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 40.849121, lng: -99.680929 },
    zoom: 2.5,
    mapId: "some",
    // mapId: "80a8ed72e83eca2c",

    // Disable the zoom etc from map
    disableDefaultUI: true,
    styles: mapStyle, // using custom style
  });
  // infoWindow = new google.maps.InfoWindow();
}

// Show the data for the chosen country
const changeCountrySelection = (countryCode) => {
  if (countryCode !== countrySelection) {
    if (countryCode == worldwideSelection.value) {
      getWorldCoronaData();
    } else {
      getCountryWorldData(countryCode);
    }
    countrySelection = countryCode;
  }
};

// Clear the circles from the map
// const changeDataSelection = (casesType) => {
//   showDataOnMap(coronaGlobalData, casesType);
//   // clearTheMap(); FOR CIRCLE FUNCTIONALITY
// };

// Clear the map for CIRCLE FUNCTIONALITY
// const clearTheMap = () => {
//   for (let circle of mapCircles) {
//     circle.setMap(null);
//   }
// };

// Create a SearchList of Countries for the Dropdown
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
  fetch("https://disease.sh/v3/covid-19/countries")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showDataInTable(data);
      // var table = $("#table-data").DataTable({
      //   pagingType: "numbers",
      // }); // implementing sorting and filtering for
      coronaGlobalData = data;
      setSearchList(data);
      showDataOnMap(data);
    });
};

// Get data for Specific Counr
const getCountryWorldData = (countryData) => {
  const url = `https://disease.sh/v3/covid-19/countries/${countryData}`;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // Get the marker for chosen Country from Dropdown
      var marker = mapMarkers.find((obj) => {
        return obj.Aa === `Click to show the data for ${data.country}`;
      });

      // Get the InfoWindow for chosen Country from Dropdown
      var infoWindow = infoWindows.filter(
        ({ ["content"]: content }) => content && content.includes(data.country)
      );

      // Hide All Previously opened Windows
      hideAllInfoWindows(infoWindows);
      infoWindow[0].open({
        anchor: marker,
        map,
      });
      infoWindow[0].opened = true;

      let countryCenterNew = {
        lat: data.countryInfo.lat + 5,
        lng: data.countryInfo.long,
      };
      map.setZoom(4);
      map.panTo(countryCenterNew);

      // Show the data in the Tab for the Specific Countries
      setStatsData(data);
    });
};

const getWorldCoronaData = () => {
  fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // Build Pie Chart on the map
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
  fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=60")
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
  fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=" + period)
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

// const openInfoWindow = () => {
//   infoWindow.open(map);
// };

const showDataOnMap = (data, casesType = "cases") => {
  data.map((country) => {
    let countryCenter = {
      lat: country.countryInfo.lat,
      lng: country.countryInfo.long,
    };

    // Declare Icon for the Markers for DOM
    const casesIcon = document.createElement("div");
    casesIcon.innerHTML = casesTypeColors[casesType].icon;

    // Customizing Pins styles
    const pinView = new google.maps.marker.PinView({
      glyph: casesIcon,
      background: casesTypeColors[casesType].background,
      borderColor: casesTypeColors[casesType].borderColor,
    });

    // Declare main marker objects
    var marker = new google.maps.marker.AdvancedMarkerView({
      map,
      position: countryCenter,
      content: pinView.element,
      title: `Click to show the data for ${country.country}`,
    });

    // // Define country data from API in a html variable defined by string literals
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
      position: marker.center,
    });

    // Adding all markers to the array
    mapMarkers.push(marker);
    // Adding all infoWindows to the array
    infoWindows.push(infoWindow);

    marker.addListener("click", () => {
      hideAllInfoWindows(infoWindows);
      infoWindow.open({
        anchor: marker,
        map,
      });

      // Set Opened state for InfoWindow as true
      infoWindow.opened = true;
      // Move Center of the Map to fit info Window
      let countryCenterNew = {
        lat: countryCenter.lat + 5,
        lng: countryCenter.lng,
      };
      map.setZoom(4);
      map.panTo(countryCenterNew);
    });

    // CIRCLE
    // Google Circle
    // var countryCircle = new google.maps.Circle({
    //   strokeColor: casesTypeColors[casesType],
    //   strokeOpacity: 0.8,
    //   strokeWeight: 2,
    //   fillColor: casesTypeColors[casesType],
    //   fillOpacity: 0.35,
    //   map: map,
    //   center: countryCenter,
    //   radius: Math.sqrt(country[casesType]) * 50,
    // });

    // **** FOR CIRCLES **** //
    // Create info window on hover
    // google.maps.event.addListener(countryCircle, "mouseover", function () {
    //   infoWindow.open(map);
    // });

    // Close info window when mouse not in the circle
    // google.maps.event.addListener(countryCircle, "mouseout", function () {
    //   infoWindow.close();
    // });
    // ******** //
  });
};

// Hide all previously opened Info Windows
function hideAllInfoWindows(infoWindows) {
  infoWindows.forEach((infoWindow) => {
    if (infoWindow.opened == true) {
      infoWindow.close();
      infoWindow.opened == false;
    }
  });
}

// Store data in the table right of the map
const showDataInTable = (data) => {
  var html = "";
  data.forEach((country) => {
    html += `
            <tr>
              <td>
                <img src="${country.countryInfo.flag}" width="40">
              </td>
              <td>${country.country}</td>
              <td>${numeral(country.cases).format("0,0")}</td>
            </tr>
        `;
  });
  document.getElementById("table-data").innerHTML = html;
};
