var data = {};
var initialized = false;
// var oldDate = null;
// console.logCopy = console.log.bind(console);
// console.log = function(arguments)
// {
//     if (arguments.length)
//     {
//         var d = new Date();
//         if(oldDate==null) timestamp = '';
//         else {
//           var diff = d-oldDate;
//           var msec = diff;
//           var ss = Math.floor(msec / 1000);
//           msec -= ss * 1000;
//           var timestamp = '[' + ss + ':' + msec + '] ';
//         }
//         oldDate = d;
//         this.logCopy(timestamp, arguments);
//     }
// };

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("div");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("url");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("url");
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

const cantons = ['AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR', 'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH', 'FL', 'CH', 'CHFL'];
const population = {
  "CH": 8619259,
  "AG": 687491,
  "AI": 16136,
  "AR": 55388,
  "BE": 1040412,
  "BL": 289534,
  "BS": 196386,
  "FR": 322658,
  "GE": 504205,
  "GL": 40713,
  "GR": 198787,
  "JU": 73490,
  "LU": 414364,
  "NE": 176340,
  "NW": 43039,
  "OW": 37906,
  "SG": 511811,
  "SH": 82454,
  "SO": 275661,
  "SZ": 160289,
  "TG": 280068,
  "TI": 350887,
  "UR": 36732,
  "VD": 808652,
  "VS": 345875,
  "ZG": 127387,
  "ZH": 1542594,
  "FL": 38749
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


Chart.defaults.global.defaultFontFamily = "IBM Plex Sans";

document.getElementById("loaded").style.display = 'none';

getBAGMetaData();
//getJSON();

var urls;
function getBAGMetaData() {
  var url = 'https://www.covid19.admin.ch/api/data/context';
  d3.json(url, function(error, jsondata) {
    urls = jsondata.sources.individual.csv.daily;
    getBAGData("cases");
  });
}

function getBAGData(dataset) {
  let url = urls[dataset];
  d3.csv(url, function(error, csvdata) {
      if(error!=null) {
        alert("Daten konnten nicht geladen werden");
      }
      else {
        data[dataset] = csvdata;
        if(!initialized) {
          initialized = true;
          processData();
        }
      }
  });
}

function processData() {
  var angularDiv = document.getElementById("interactive");
  var scope = angular.element(angularDiv).scope()
  scope.addChart();
  scope.selectedCanton = 'ZH';
  scope.selectedColor = scope.availableColors[3];
  scope.$apply();
  document.getElementById("loadingspinner").style.display = 'none';
  document.getElementById("loaded").style.display = 'block';
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

var app = angular.module('coronach', ['chart.js']);

app.controller('ChartCtrl', ['$scope', function ($scope) {

  //Constants:
  $scope.cantons = cantons;
  $scope.strings = {
    'cases': 'Fälle',
    'hosp': 'Hospitalisationen',
    'death': 'Todesfälle',
    'test': 'Tests'
  };
  $scope.datasets = ['cases', 'hosp', 'death', 'test'];
  $scope.availableColors = Chart.defaults.global.colors;
  // $scope.availableColors.push('#CCCC00');
  // $scope.availableColors.push('#CC0000');
  $scope.myColor = '#55ff55';

  //Chart-Configs:
  $scope.duration = 0;
  $scope.charts = [];
  $scope.showAbsolute = true;
  $scope.singleScale = false;

  //Configs of single chart
  $scope.labels = [];
  $scope.series = [];
  $scope.selectedDataset = 'cases';
  $scope.selectedCanton = 'CH';
  $scope.selectedColor = $scope.availableColors[2];

  $scope.addChart = function() {
    let newChart = {
      canton: $scope.selectedCanton,
      selectedDataset: $scope.selectedDataset,
      color: $scope.selectedColor
    };
    $scope.charts.push(newChart);
    $scope.update();
  }

  $scope.selectChart = function(index) {
    $scope.index = index;
  }

  $scope.selectColor = function(color) {
    $scope.selectedColor = color;
  }

  $scope.selectDataset = function(dataset) {
    $scope.selectedDataset = dataset;
    if(!data[dataset]) {
      getBAGData(dataset);
    }
    //console.log($scope.charts);
  }

  $scope.selectCanton = function(canton) {
    $scope.selectedCanton = canton;
    //$scope.charts[$scope.index].canton = canton;
    //$scope.update();
  }

  $scope.colorPicked = function(color) {
    //alert(color);
    $scope.availableColors.push(color);
    $scope.selectedColor = color;
  }

  $scope.deleteChart = function(index) {
    if($scope.charts.length==0) return;
    $scope.charts.splice(index,1);
    $scope.index = 0;
    $scope.update();
  }

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
      mode: 'nearest',
      axis: "x",
      intersect: false,
      caretSize: 0,
      bodyFontFamily: 'IBM Plex Mono'
    },
    elements: {
      point: { radius: 0 }
    },
    hover: {
      mode: 'nearest',
      axis: "x",
      intersect: false,
    },
    scales: {
      xAxes: [{
          type: 'time',
          time: {
            tooltipFormat: 'ddd DD.MM.YYYY',
            unit: 'month'
          },
          ticks: {
            minRotation: (getDeviceState()==2?90:0),
            maxRotation: 90,
            // min: getDateForMode(mode),
            // max: new Date()
          },
          gridLines: {
              color: inDarkMode() ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
          }
        }],
        yAxes: [{
            id: 'cases',
            type: 'linear',
            position: 'left',
            display: 'auto',
            ticks: {
              beginAtZero: true,
            },
            gridLines: {
                color: inDarkMode() ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
            }
          },
          {
            type: 'linear',
            position: 'right',
            display: 'auto',
            id: 'hosp',
            ticks: {
              beginAtZero: true
            }
          },
          {
            type: 'linear',
            position: 'right',
            display: 'auto',
            id: 'death',
            ticks: {
              beginAtZero: true
            }
          },
          {
            type: 'linear',
            position: 'right',
            display: 'auto',
            id: 'test',
            ticks: {
              beginAtZero: true
            }
          }
        ]
      },
    plugins: {
      datalabels: {
        display: false
      }
    }
  };
  $scope.datasetOverride = [{
      label: "Auslastung",
      fill: false,
      cubicInterpolationMode: 'monotone',
      spanGaps: true
  }];

  $scope.update = function() {
    $scope.data = [];
    if($scope.charts.length==0) {
      $scope.data = [[{x: new Date(), y: 0}]];
      return;
    }
    $scope.datasetOverride = [];
    $scope.colors = [];
    for(var i=0; i<$scope.charts.length; i++) {
      var singleChart = $scope.charts[i];
      let dataToUse = data[singleChart.selectedDataset];
      let filteredData = dataToUse.filter(d => d.geoRegion===singleChart.canton);
      if($scope.duration!=0) {
        filteredData.splice(0, filteredData.length-$scope.duration);
        $scope.options.scales.xAxes[0].time.unit = 'day';
      }
      else $scope.options.scales.xAxes[0].time.unit = 'month';
      // $scope.labels = filteredData.map(d => {
      //   var dateSplit = d.date.split("-");
      //   var day = parseInt(dateSplit[2]);
      //   var month = parseInt(dateSplit[1])-1;
      //   var year = parseInt(dateSplit[0]);
      //   return new Date(year,month,day);
      // });

      var colorToUse = singleChart.color;
      $scope.colors.push(colorToUse);
      $scope.options.scales.yAxes[0].ticks.suggestedMax = 0;
      $scope.datasetOverride.push({
          label: $scope.strings[singleChart.selectedDataset]+" "+singleChart.canton,
          fill: false,
          cubicInterpolationMode: 'monotone',
          spanGaps: true,
          yAxisID: $scope.singleScale?'cases':singleChart.selectedDataset
        });

        $scope.data.push(filteredData.map(d => {
          let yPoint = $scope.showAbsolute?d.mean7d:d.inzmean7d;
          let dateSplit = d.datum.split("-");
          let day = parseInt(dateSplit[2]);
          let month = parseInt(dateSplit[1])-1;
          let year = parseInt(dateSplit[0]);
          let xPoint = new Date(year,month,day);
          return {
            t: xPoint,
            y: yPoint
          };
        }));
        //console.log($scope.data);
    }
  }

}]);
