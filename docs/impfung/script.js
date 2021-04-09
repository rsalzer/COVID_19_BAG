// var data = [];
var initialized = false;

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("nav");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("url");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.insertAdjacentHTML("afterbegin", this.responseText);}
          if (this.status == 404) {elmnt.insertAdjacentHTML("afterbegin", "Page not found.");}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("url");
          document.getElementById("pagenav_impfung").className = "here";
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}
includeHTML();

const cantons = ['AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR', 'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH', 'FL', 'CH'];
const population = {
  "CH": 8606033,
  "AG": 685845,
  "AI": 16128,
  "AR": 55445,
  "BE": 1039474,
  "BL": 289468,
  "BS": 195844,
  "FR": 321783,
  "GE": 504128,
  "GL": 40590,
  "GR": 199021,
  "JU": 73584,
  "LU": 413120,
  "NE": 176496,
  "NW": 43087,
  "OW": 37930,
  "SG": 510734,
  "SH": 82348,
  "SO": 275247,
  "SZ": 160480,
  "TG": 279547,
  "TI": 351491,
  "UR": 36703,
  "VD": 805098,
  "VS": 345525,
  "ZG": 127642,
  "ZH": 1539275,
  "FL": 38747
};
const names = {
  "CH": "Ganze Schweiz",
  "CHFL": "Schweiz + Liechtenstein",
  "AG": "Kanton Aargau",
  "AI": "Kanton Appenzell Innerrhoden",
  "AR": "Kanton Appenzell Ausserrhoden",
  "BE": "Kanton Bern",
  "BL": "Kanton Basel Land",
  "BS": "Kanton Basel Stadt",
  "FR": "Kanton Freiburg",
  "GE": "Kanton Genf",
  "GL": "Kanton Glarus",
  "GR": "Kanton Graubünden",
  "JU": "Kanton Jura",
  "LU": "Kanton Luzern",
  "NE": "Kanton Neuenburg",
  "NW": "Kanton Nidwalden",
  "OW": "Kanton Obwalden",
  "SG": "Kanton St. Gallen",
  "SH": "Kanton Schaffhausen",
  "SO": "Kanton Solothurn",
  "SZ": "Kanton Schwyz",
  "TG": "Kanton Thurgau",
  "TI": "Kanton Tessin",
  "UR": "Kanton Uri",
  "VD": "Kanton Waadt",
  "VS": "Kanton Wallis",
  "ZG": "Kanton Zug",
  "ZH": "Kanton Zürich",
  "FL": "Fürstentum Liechtenstein"
};
var ageLabels = ["0-9","10-19","20-29","30-39","40-49","50-59","60-69","70-79","80+"];

Chart.defaults.global.defaultFontFamily = "IBM Plex Sans";

document.getElementById("loaded").style.display = 'none';

// getData();
//
// function getData() {
//   var url = 'https://raw.githubusercontent.com/rsalzer/COVID_19_VACC/main/data.csv';
//   d3.csv(url, function(error, csvdata) {
//     data = csvdata;
//     processData();
//     getBAGMetaData();
//   });
// }

getBAGMetaData();

function processData() {
  processActualData(null, null);
  var angularDiv = document.getElementById("interactive2");
  var scope = angular.element(angularDiv).scope()
  scope.update();
  scope.$apply();
  //console.log(verlaufData);
  document.getElementById("loadingspinner").style.display = 'none';
  document.getElementById("loaded").style.display = 'block';
}

var ageData = {};
var verlaufData = {};
function getBAGMetaData() {
  var url = 'https://www.covid19.admin.ch/api/data/context';
  d3.json(url, function(error, jsondata) {
    var fullVaccUrlAge = jsondata.sources.individual.csv.weeklyVacc.byAge.fullyVaccPersons;
    var administeredUrlAge = jsondata.sources.individual.csv.weeklyVacc.byAge.vaccDosesAdministered;
    var fullVaccUrl = jsondata.sources.individual.csv.fullyVaccPersons;
    var administeredUrl = jsondata.sources.individual.csv.vaccDosesAdministered;
    var deliveredUrl = jsondata.sources.individual.csv.vaccDosesDelivered;
    getBAGData('full', fullVaccUrl, verlaufData);
    getBAGData('administered', administeredUrl, verlaufData);
    getBAGData('full', fullVaccUrlAge, ageData);
    getBAGData('administered', administeredUrlAge, ageData);
    //getBAGData('delivered', deliveredUrl, verlaufData);
  });
}

function getBAGData(name, url, dataobject) {
  d3.csv(url, function(error, csvdata) {
      if(error!=null) {
        alert("Daten konnten nicht geladen werden");
      }
      else {
        dataobject[name] = csvdata;
        if(Object.keys(verlaufData).length==2 && Object.keys(ageData).length==2) {
           processData();
           processAgeData();
         }
       }
  });
}

function processAgeData() {
  var angularDiv = document.getElementById("interactive");
  var scope = angular.element(angularDiv).scope()
  scope.update();
  scope.$apply();
}


var total;
var activeMode = "ncumul_conf";
var activeDay = 0; //0 = today; -1 = yesterday; -2 = two days ago;
function processActualData(mode, chosenDay) {
  var data = verlaufData.administered;
  let latestDay = data[data.length-1].date;
  let dateSpan = document.getElementById("dateSpan");
  dateSpan.innerHTML = latestDay;
  let todaysData = data.filter(d => d.date == latestDay);
  let fullData = verlaufData.full.filter(d => d.date==latestDay);
  let firstDay =  "2021-01-24"; //"2021-02-14";
  let firstDayData = data.filter(d=> d.date == firstDay);
  let table = document.getElementById("impftabelle");
  table.innerHTML = "";
  let latestDayDate = stringToDate(latestDay);
  let firstDayDate = stringToDate(firstDay);
  let daysDifference = (latestDayDate.getTime() - firstDayDate.getTime()) / (1000 * 60 * 60 * 24);
  console.log("Day difference: "+daysDifference);
  for(var i=0; i<cantons.length; i++) {
    let canton = cantons[i];
    let lastDayFilteredByCanton = todaysData.filter(d => d.geoRegion == canton)[0];
    let full = fullData.filter(d => d.geoRegion == canton)[0];
    let firstDayFilteredByCanton = firstDayData.filter(d => d.geoRegion == canton)[0];
    let vaccLast = parseFloat(lastDayFilteredByCanton.sumTotal);
    let averagePerDay = (vaccLast - parseFloat(firstDayFilteredByCanton.sumTotal)) / daysDifference;
    // let pop30 = population[canton]*0.3 * 2;
    let pop65 = population[canton]*0.65 * 2; //we need 2 doses per person ...
    let pop80 = population[canton]*0.8 * 2;//we need 2 doses per person ...
    // let days30 = Math.round((pop30 - vaccLast) / averagePerDay);
    // let milis30 = latestDayDate.getTime() + days30 * (1000 * 60 * 60 * 24);
    // let date30 = new Date(milis30);
    // let date30String = date30.toISOString().substring(0,7);
    // console.log(canton+": "+date30String);
    let days65 = Math.round((pop65 - vaccLast) / averagePerDay);
    let milis65 = latestDayDate.getTime() + days65 * (1000 * 60 * 60 * 24);
    let date65 = new Date(milis65);
    let date65String = date65.toISOString().substring(0,7);
    let days80 = Math.round((pop80 - vaccLast) / averagePerDay);
    let milis80 = latestDayDate.getTime() + days80 * (1000 * 60 * 60 * 24);
    let date80 = new Date(milis80);
    let date80String = date80.toISOString().substring(0,7);
    if(lastDayFilteredByCanton==null) return;
    //console.log(filteredForCanton);
    var tr = document.createElement("tr");
    tr.innerHTML = `
      <td><a class='flag ${canton}' href='#detail_${canton}'>${canton}</a></td>
      <td class="total">${vaccLast.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "’")}</td>
      <td class="total">${lastDayFilteredByCanton.per100PersonsTotal}</td>
      <td class="total">${Math.round(averagePerDay).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "’")}</td>
      <td class="total">${full.per100PersonsTotal}</td>
      <td class="total">${days65}</td>
      <td class="total leftalign">(${date65String})</td>
      <td class="total">${days80}</td>
      <td class="total leftalign">(${date80String})</td>
    `;

    table.appendChild(tr);
  }
}

var app = angular.module('vaccinations', ['chart.js']);

app.controller('BarCtrl', ['$scope', function ($scope) {
  $scope.type = "bar";
  $scope.options = {
    legend: { display: false },
    tooltips: {
        intersect: false
    },
    title: {
        display: true,
        text: "Altersverteilung",
        padding: 15
    },
    plugins: {
      datalabels: getDataLabels(true)
    },
    scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMax: 100
          },
          gridLines: {
              color: inDarkMode() ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
          }
        }]
    }
  };
  $scope.labels = ageLabels;
  $scope.data = [
    [10,0,0,0,0,0,0,0,0]
  ];
  $scope.colors = [{
    backgroundColor: ["#2c6a69", "#369381", "#4cb286", "#68c880", "#86d475", "#a1d76c", "#b3d16d", "#b8c17f", "#b7bf82"]
  }];
  $scope.cantons = [];
  $scope.selectedCanton = "";
  $scope.set = 1;
  $scope.dataset = "full";

  $scope.selectCanton = function(canton) {
    $scope.selectedCanton = canton;
    $scope.update();
  }

  $scope.getName = function(dataset) {
    switch (dataset) {
      case "full": return "Vollständig Geimpft pro 100 Personen";
      case "doses": return "Verimpfte Dosen pro 100 Personen";
      case "rawdoses": return "Verimpfte Dosen";
      default: return "";
    }
  }

  $scope.update = function() {
    if($scope.cantons.length==0) {
      var cantons = ageData.full.map(d=>d.geoRegion);
      var unique = cantons.filter((v, i, a) => a.indexOf(v) === i);
      $scope.cantons = unique;
      if($scope.selectedCanton=="") $scope.selectedCanton = $scope.cantons[0];
    }
    let dataToUse;
    if($scope.dataset=="full") {
      dataToUse = ageData.full;
    }
    if($scope.dataset=="doses" || $scope.dataset=="rawdoses") {
      dataToUse = ageData.administered;
    }
    let filterDate = dataToUse[dataToUse.length-1].date;
    dataToUse = dataToUse.filter(d=> d.geoRegion==$scope.selectedCanton && d.date==filterDate);
    // $scope.series[0] = $scope.set==1?'Fälle':($scope.set==2?'Todesfälle':($scope.set==3?'Inzidenz':'Hospitalisierungen'));
    // let index = dataToUse.length-6;
    // if($scope.duration==2) index = dataToUse.findIndex(d=> d.date == "2020-05-31");
    // else if($scope.duration==4) index = dataToUse.length-11;
    // let firstData = dataToUse[index];
    // let latestData = dataToUse[dataToUse.length-1];
    for(var i=0; i<ageLabels.length; i++) {
      let label = ageLabels[i];
      let entry = dataToUse.filter(d => d.altersklasse_covid19.replaceAll(" ","")==label);
      let value = entry[0].per100PersonsTotal;
      if($scope.dataset=="rawdoses") value = entry[0].sumTotal;
      $scope.data[0][i] = value;
    }
    //$scope.options.scales.yAxes[0].ticks.suggestedMax = 100;
    if($scope.dataset=="rawdoses") $scope.options.plugins.datalabels = getDataLabels(false);
    else $scope.options.plugins.datalabels = getDataLabels(true);

    //var dataset = $scope.set==0?"Vollständig geimpfte Personen":$scope.set==1?"Impfdosen":"";
    //var time = $scope.duration==1?"Ganze Pandemie":$scope.duration==2?"Ab Juni":$scope.duration==3?"Letzte 7 Tage":"Letzte 14 Tage";
    var filterDateYear = parseInt(filterDate.substring(0,4));
    var filterDateWeek = parseInt(filterDate.substring(4));
    var monday = getDateOfISOWeek(filterDateWeek, filterDateYear);
    var sunday = new Date(monday);
    sunday.setDate(sunday.getDate()+6);
    $scope.options.title.text = "Altersverteilung "+$scope.getName($scope.dataset)+" bis "+formatDate(sunday); //+" "+time;
  }
}]);

app.controller('ChartCtrl', ['$scope', function ($scope) {

  $scope.labels = [];
  $scope.series = [];
  $scope.lineColor = inDarkMode()?'#FFFFFF':'#111111';
  $scope.barColor = '#22BB22';
  $scope.colors = [$scope.lineColor, $scope.barColor];
  $scope.cantons = cantons;

  $scope.selectedCanton = 'CH';

  $scope.selectCanton = function(canton) {
    $scope.selectedCanton = canton;
    $scope.update();
  }

  $scope.type = "bar";

  $scope.data = [0];

  $scope.options = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
            right: 0
        }
    },
    legend: {
      display: false
    },
    title: {
      display: false
    },
    tooltips: {
      mode: 'index',
      intersect: false,
      caretSize: 0,
      bodyFontFamily: 'IBM Plex Mono'
    },
    elements: {
      point: { radius: 0 }
    },
    scales: {
      xAxes: [{
          type: 'time',
          time: {
            tooltipFormat: 'ddd DD.MM.YYYY',
            unit: 'month',
            displayFormats: {
              day: 'DD.MM'
            }
          },
          ticks: {
            minRotation: (getDeviceState()==2?90:0),
            maxRotation: 90
            // min: getDateForMode(mode),
            // max: new Date(),
          },
          gridLines: {
              color: inDarkMode() ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
          }
        }],
        yAxes: [{
          type: 'linear',
          position: 'right',
          ticks: {
            beginAtZero: true,
            //suggestedMax: 100
          },
          gridLines: {
              color: inDarkMode() ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
          }
        }]
      },
    plugins: {
      datalabels: {
        display: false
      }
    }
  };
  $scope.datasetOverride = [{
      label: "Totale Impfungen",
      fill: false,
      cubicInterpolationMode: 'monotone',
      spanGaps: true
  }];

  //$scope.colors = [ 'white' ];
  $scope.update = function() {
    //console.log("Update");
    $scope.data = [];
    $scope.datasetOverride = [];
    var dataToUse = verlaufData.administered;
    let filteredData = dataToUse.filter(d => d.geoRegion===$scope.selectedCanton);
    var days = 0;
    var needsCorrection = false;
    if(filteredData[0].entries=="NA") needsCorrection = true;
    if(needsCorrection) {
      //console.log("Needs Correction");
      filteredData.forEach((element, index, array) => {
        if(element.entries=="NA") {
          if(index!=0) {
            var diff = parseInt(element.sumTotal) - parseInt(array[index-1].sumTotal);
            if(diff==0) {
              days++;
              element.entries = 0;
            }
            else {
              var diffPerDay = Math.round(diff/(days+1));
              if(diffPerDay<0) diffPerDay = 0;
              for(let i=0; i<=days; i++) {
                array[index-i].entries = diffPerDay;
              }
              days = 0;
            }
          }
          else
            element.entries = 0
        }
      });
      filteredData.forEach((element, index, array) => {
        if(index>2) { //Calculate 7d-Avg
          var total = 0;
          for(let i=0; i<7; i++) {
            if(index-i>0) total += array[index-i].entries;
          }
          var number = 7;
          if(index<7) number = index;
          element.mean7d = Math.round(total/number);
        }
      });
    }
    filteredData.shift(); //remove first element
    //console.log(filteredData);
    $scope.options.scales.xAxes[0].time.unit = 'day';
    $scope.labels = filteredData.map(d => {
      var dateSplit = d.date.split("-");
      var day = parseInt(dateSplit[2]);
      var month = parseInt(dateSplit[1])-1;
      var year = parseInt(dateSplit[0]);
      return new Date(year,month,day);
    });
    $scope.datasetOverride = [
    {
      label: "7d-Durchschnitt",
      type: 'line',
      fill: false,
    },
    {
        label: "Verimpfte Dosen",
        type: 'bar',
        backgroundColor: $scope.barColor,
        //cubicInterpolationMode: 'monotone',
        //spanGaps: true
    }
    ];
    $scope.data = [];
    $scope.data.push(filteredData.map(d => d.mean7d));
    $scope.data.push(filteredData.map((d,index) => d.entries!="NA"?d.entries:d.sumTotal)); //(index==0?d.entries:d.mean7d)
  }

}]);

function stringToDate(datestring) {
  let dateSplit = datestring.split("-");
  let day = parseInt(dateSplit[2]);
  let month = parseInt(dateSplit[1])-1;
  let year = parseInt(dateSplit[0]);
  let d = new Date(Date.UTC(year,month,day))
  return d;
}

function getDateOfISOWeek(w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

function formatDate(date) {
  var dd = date.getDate();
  var mm = date.getMonth()+1;
  var yy = date.getFullYear();
  if(dd<10) dd='0'+dd;
  if(mm<10) mm='0'+mm;
  return dd+"."+mm+"."+yy;
}

function getDataLabels(raw) {
  return {
      color: inDarkMode() ? '#ccc' : 'black',
      font: {
        weight: 'bold',
      },
      align: 'end',
      anchor: 'end',
      formatter: function(value, context) {
        var sum = context.dataset.data.reduce( (acc, val) => acc+parseInt(val), 0);
        var percentage = Math.round(value / sum * 1000) / 10;
        if(raw) return value;
        return percentage+"%";
      }
  };
}

function inDarkMode() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  }
  return false;
}

// Create the state-indicator element
var indicator = document.createElement('div');
indicator.className = 'state-indicator';
document.body.appendChild(indicator);

// Create a method which returns device state
function getDeviceState() {
    return parseInt(window.getComputedStyle(indicator).getPropertyValue('z-index'), 10);
}