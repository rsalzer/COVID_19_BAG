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
          document.getElementById("pagenav_vergleich").className = "here";
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
const countries = [
{iso2:"AD",name:"Andorra"},
{iso2:"AE",name:"United Arab Emirates"},
{iso2:"AF",name:"Afghanistan"},
{iso2:"AG",name:"Antigua and Barbuda"},
{iso2:"AL",name:"Albania"},
{iso2:"AM",name:"Armenia"},
{iso2:"AO",name:"Angola"},
{iso2:"AR",name:"Argentina"},
{iso2:"AT",name:"Austria"},
{iso2:"AU",name:"Australia"},
{iso2:"AZ",name:"Azerbaijan"},
{iso2:"BA",name:"Bosnia and Herzegovina"},
{iso2:"BB",name:"Barbados"},
{iso2:"BD",name:"Bangladesh"},
{iso2:"BE",name:"Belgium"},
{iso2:"BF",name:"Burkina Faso"},
{iso2:"BG",name:"Bulgaria"},
{iso2:"BH",name:"Bahrain"},
{iso2:"BI",name:"Burundi"},
{iso2:"BJ",name:"Benin"},
{iso2:"BN",name:"Brunei"},
{iso2:"BO",name:"Bolivia"},
{iso2:"BR",name:"Brazil"},
{iso2:"BS",name:"Bahamas"},
{iso2:"BT",name:"Bhutan"},
{iso2:"BW",name:"Botswana"},
{iso2:"BY",name:"Belarus"},
{iso2:"BZ",name:"Belize"},
{iso2:"CA",name:"Canada"},
{iso2:"CD",name:"Democratic Republic of Congo"},
{iso2:"CF",name:"Central African Republic"},
{iso2:"CG",name:"Congo"},
{iso2:"CI",name:"Cote d'Ivoire"},
{iso2:"CL",name:"Chile"},
{iso2:"CM",name:"Cameroon"},
{iso2:"CN",name:"China"},
{iso2:"CO",name:"Colombia"},
{iso2:"CR",name:"Costa Rica"},
{iso2:"CU",name:"Cuba"},
{iso2:"CV",name:"Cape Verde"},
{iso2:"CY",name:"Cyprus"},
{iso2:"CZ",name:"Czechia"},
{iso2:"DE",name:"Germany"},
{iso2:"DJ",name:"Djibouti"},
{iso2:"DK",name:"Denmark"},
{iso2:"DM",name:"Dominica"},
{iso2:"DO",name:"Dominican Republic"},
{iso2:"DZ",name:"Algeria"},
{iso2:"EC",name:"Ecuador"},
{iso2:"EE",name:"Estonia"},
{iso2:"EG",name:"Egypt"},
{iso2:"ER",name:"Eritrea"},
{iso2:"ES",name:"Spain"},
{iso2:"ET",name:"Ethiopia"},
{iso2:"FI",name:"Finland"},
{iso2:"FJ",name:"Fiji"},
{iso2:"FR",name:"France"},
{iso2:"GA",name:"Gabon"},
{iso2:"GB",name:"United Kingdom"},
{iso2:"GD",name:"Grenada"},
{iso2:"GE",name:"Georgia"},
{iso2:"GH",name:"Ghana"},
{iso2:"GM",name:"Gambia"},
{iso2:"GN",name:"Guinea"},
{iso2:"GQ",name:"Equatorial Guinea"},
{iso2:"GR",name:"Greece"},
{iso2:"GT",name:"Guatemala"},
{iso2:"GW",name:"Guinea-Bissau"},
{iso2:"GY",name:"Guyana"},
{iso2:"HK",name:"Hong Kong"},
{iso2:"HN",name:"Honduras"},
{iso2:"HR",name:"Croatia"},
{iso2:"HT",name:"Haiti"},
{iso2:"HU",name:"Hungary"},
{iso2:"ID",name:"Indonesia"},
{iso2:"IE",name:"Ireland"},
{iso2:"IL",name:"Israel"},
{iso2:"IN",name:"India"},
{iso2:"IQ",name:"Iraq"},
{iso2:"IR",name:"Iran"},
{iso2:"IS",name:"Iceland"},
{iso2:"IT",name:"Italy"},
{iso2:"JM",name:"Jamaica"},
{iso2:"JO",name:"Jordan"},
{iso2:"JP",name:"Japan"},
{iso2:"KE",name:"Kenya"},
{iso2:"KG",name:"Kyrgyzstan"},
{iso2:"KH",name:"Cambodia"},
{iso2:"KM",name:"Comoros"},
{iso2:"KN",name:"Saint Kitts and Nevis"},
{iso2:"KR",name:"South Korea"},
{iso2:"KW",name:"Kuwait"},
{iso2:"KZ",name:"Kazakhstan"},
{iso2:"LA",name:"Laos"},
{iso2:"LB",name:"Lebanon"},
{iso2:"LC",name:"Saint Lucia"},
{iso2:"LI",name:"Liechtenstein"},
{iso2:"LK",name:"Sri Lanka"},
{iso2:"LR",name:"Liberia"},
{iso2:"LS",name:"Lesotho"},
{iso2:"LT",name:"Lithuania"},
{iso2:"LU",name:"Luxembourg"},
{iso2:"LV",name:"Latvia"},
{iso2:"LY",name:"Libya"},
{iso2:"MA",name:"Morocco"},
{iso2:"MC",name:"Monaco"},
{iso2:"MD",name:"Moldova"},
{iso2:"ME",name:"Montenegro"},
{iso2:"MG",name:"Madagascar"},
{iso2:"MH",name:"Marshall Islands"},
{iso2:"MK",name:"North Macedonia"},
{iso2:"ML",name:"Mali"},
{iso2:"MM",name:"Myanmar"},
{iso2:"MN",name:"Mongolia"},
{iso2:"MR",name:"Mauritania"},
{iso2:"MT",name:"Malta"},
{iso2:"MU",name:"Mauritius"},
{iso2:"MV",name:"Maldives"},
{iso2:"MW",name:"Malawi"},
{iso2:"MX",name:"Mexico"},
{iso2:"MY",name:"Malaysia"},
{iso2:"MZ",name:"Mozambique"},
{iso2:"NA",name:"Namibia"},
{iso2:"NE",name:"Niger"},
{iso2:"NG",name:"Nigeria"},
{iso2:"NI",name:"Nicaragua"},
{iso2:"NL",name:"Netherlands"},
{iso2:"NO",name:"Norway"},
{iso2:"NP",name:"Nepal"},
{iso2:"NZ",name:"New Zealand"},
{iso2:"OM",name:"Oman"},
{iso2:"PA",name:"Panama"},
{iso2:"PE",name:"Peru"},
{iso2:"PG",name:"Papua New Guinea"},
{iso2:"PH",name:"Philippines"},
{iso2:"PK",name:"Pakistan"},
{iso2:"PL",name:"Poland"},
{iso2:"PS",name:"Palestine"},
{iso2:"PT",name:"Portugal"},
{iso2:"PY",name:"Paraguay"},
{iso2:"QA",name:"Qatar"},
{iso2:"RO",name:"Romania"},
{iso2:"RS",name:"Serbia"},
{iso2:"RU",name:"Russia"},
{iso2:"RW",name:"Rwanda"},
{iso2:"SA",name:"Saudi Arabia"},
{iso2:"SB",name:"Solomon Islands"},
{iso2:"SC",name:"Seychelles"},
{iso2:"SD",name:"Sudan"},
{iso2:"SE",name:"Sweden"},
{iso2:"SG",name:"Singapore"},
{iso2:"SI",name:"Slovenia"},
{iso2:"SK",name:"Slovakia"},
{iso2:"SL",name:"Sierra Leone"},
{iso2:"SM",name:"San Marino"},
{iso2:"SN",name:"Senegal"},
{iso2:"SO",name:"Somalia"},
{iso2:"SR",name:"Suriname"},
{iso2:"SS",name:"South Sudan"},
{iso2:"ST",name:"Sao Tome and Principe"},
{iso2:"SV",name:"El Salvador"},
{iso2:"SY",name:"Syria"},
{iso2:"SZ",name:"Eswatini"},
{iso2:"TD",name:"Chad"},
{iso2:"TG",name:"Togo"},
{iso2:"TH",name:"Thailand"},
{iso2:"TJ",name:"Tajikistan"},
{iso2:"TL",name:"Timor"},
{iso2:"TN",name:"Tunisia"},
{iso2:"TR",name:"Turkey"},
{iso2:"TT",name:"Trinidad and Tobago"},
{iso2:"TW",name:"Taiwan"},
{iso2:"TZ",name:"Tanzania"},
{iso2:"UA",name:"Ukraine"},
{iso2:"UG",name:"Uganda"},
{iso2:"US",name:"United States"},
{iso2:"UY",name:"Uruguay"},
{iso2:"UZ",name:"Uzbekistan"},
{iso2:"VA",name:"Vatican"},
{iso2:"VC",name:"Saint Vincent and the Grenadines"},
{iso2:"VE",name:"Venezuela"},
{iso2:"VN",name:"Vietnam"},
{iso2:"VU",name:"Vanuatu"},
{iso2:"WS",name:"Samoa"},
{iso2:"XK",name:"Kosovo"},
{iso2:"YE",name:"Yemen"},
{iso2:"ZA",name:"South Africa"},
{iso2:"ZM",name:"Zambia"},
{iso2:"ZW",name:"Zimbabwe"},
{iso2:"WORLD",name:"World"}
];


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
          getBAGData('intCases');
        }
      }
  });
}

function processData() {
  var angularDiv = document.getElementById("interactive");
  var scope = angular.element(angularDiv).scope()
  scope.addChart();
  scope.selectedGeoUnit = 'CH_ZH';
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
  $scope.countries = countries;
  $scope.strings = {
    'cases': 'Fälle',
    'hosp': 'Hospitalisationen',
    'death': 'Todesfälle',
    'test': 'Tests'
  };
  $scope.datasets = ['cases', 'hosp', 'death', 'test'];
  $scope.availableColors = Chart.defaults.global.colors;
  $scope.availableCountries = [
    {iso2:"US",name:"United States"},
    {iso2:"DE",name:"Germany"},
    {iso2:"FR",name:"France"},
    {iso2:"GB",name:"United Kingdom"},
  ];
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
  $scope.selectedGeoUnit = 'CH_CH';
  $scope.selectedColor = $scope.availableColors[2];

  $scope.addChart = function() {
    let newChart = {
      geoUnit: $scope.selectedGeoUnit,
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
    if(dataset!='cases' && !$scope.selectedGeoUnit.startsWith("CH_")) $scope.selectedGeoUnit = "CH_CH";
    $scope.selectedDataset = dataset;
    if(!data[dataset]) {
      getBAGData(dataset);
    }
    //console.log($scope.charts);
  }

  $scope.selectCanton = function(canton) {
    $scope.selectedGeoUnit = "CH_"+canton;
    //$scope.charts[$scope.index].canton = canton;
    //$scope.update();
  }

  $scope.colorPicked = function(color) {
    //alert(color);
    $scope.availableColors.push(color);
    $scope.selectedColor = color;
  }

  $scope.selectCountry = function(country) {
      $scope.selectedGeoUnit = country.iso2;
  }

  $scope.countryPicked = function() {
    var country = $scope.pickedCountry;
    var iso2Codes = $scope.availableCountries.map(d=>d.iso2);
    if(!iso2Codes.includes(country.iso2)) {
      $scope.availableCountries.push(country);
    }
    $scope.selectedGeoUnit = country.iso2;
    $scope.pickedCountry = null;
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
      let international = false;
      if(!singleChart.geoUnit.startsWith("CH_")) {
        dataToUse = data['intCases'];
        international = true;
      }
      let filteredData = dataToUse.filter(d => d.geoRegion===singleChart.geoUnit.replace("CH_", ""));
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
          label: $scope.strings[singleChart.selectedDataset]+" "+singleChart.geoUnit.replace("CH_", ""),
          fill: false,
          cubicInterpolationMode: 'monotone',
          spanGaps: true,
          yAxisID: $scope.singleScale?'cases':singleChart.selectedDataset
        });

        $scope.data.push(filteredData.map((d,index,array) => {
          // let sum7d = $scope.showAbsolute?d.sum7d:d.inzsum7d;
          // let yPoint = null;
          // if(sum7d) {
          //     yPoint = Math.round(sum7d/7*100)/100;
          // }
          let yPoint;
          if(international) {
            let variable = $scope.showAbsolute?"entries":"inz_entries";
            let now = d[variable];
            if(index<8) yPoint = now;
            else {
              let sum = parseFloat(now);
              for(var i=1;i<=6;i++) {
                sum+=parseFloat(array[index-i][variable]);
              }
              if(sum<0) sum = 0;
              yPoint = Math.round(sum*100/7)/100; //round to 2 decimals
            }
          }
          else yPoint = $scope.showAbsolute?d.mean7d:d.inzmean7d;
          let dateSplit;
          if(d.datum) dateSplit = d.datum.split("-");
          else dateSplit = d.date.split("-");
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
