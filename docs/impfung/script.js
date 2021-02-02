var data = [];
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


Chart.defaults.global.defaultFontFamily = "IBM Plex Sans";

document.getElementById("loaded").style.display = 'none';

getData();
//getJSON();

function getData() {
  var url = 'https://raw.githubusercontent.com/rsalzer/COVID_19_VACC/main/data.csv';
  d3.csv(url, function(error, csvdata) {
    data = csvdata;
    processData();
  });
}

function processData() {
  processActualData(null, null);
  document.getElementById("loadingspinner").style.display = 'none';
  document.getElementById("loaded").style.display = 'block';
}

var total;
var activeMode = "ncumul_conf";
var activeDay = 0; //0 = today; -1 = yesterday; -2 = two days ago;
function processActualData(mode, chosenDay) {
  let latestDay = data[data.length-1].date;
  let dateSpan = document.getElementById("dateSpan");
  dateSpan.innerHTML = latestDay;
  let todaysData = data.filter(d => d.date == latestDay);
  let firstDay = data[0].date;
  let firstDayData = data.filter(d=> d.date == firstDay);
  let table = document.getElementById("impftabelle");
  table.innerHTML = "";
  let latestDayDate = stringToDate(latestDay);
  let firstDayDate = stringToDate(firstDay);
  let daysDifference = (latestDayDate.getTime() - firstDayDate.getTime()) / (1000 * 60 * 60 * 24);
  console.log("Day difference: "+daysDifference);
  for(var i=0; i<cantons.length; i++) {
    let canton = cantons[i];
    let lastDayFilteredByCanton = todaysData.filter(d => d.geounit == canton)[0];
    let firstDayFilteredByCanton = firstDayData.filter(d => d.geounit == canton)[0];
    let vaccLast = parseFloat(lastDayFilteredByCanton.ncumul_vacc);
    let averagePerDay = (vaccLast - parseFloat(firstDayFilteredByCanton.ncumul_vacc)) / daysDifference;
    let pop65 = population[canton]*0.65 * 2; //we need 2 doses per person ...
    let pop80 = population[canton]*0.8 * 2;//we need 2 doses per person ...
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
      <td class="total">${lastDayFilteredByCanton.ncumul_vacc_per100pop}</td>
      <td class="total">${Math.round(averagePerDay).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "’")}</td>
      <td class="total">${days65}</td>
      <td class="total leftalign">(${date65String})</td>
      <td class="total">${days80}</td>
      <td class="total leftalign">(${date80String})</td>
    `;

    table.appendChild(tr);
  }
}

function stringToDate(datestring) {
  let dateSplit = datestring.split("-");
  let day = parseInt(dateSplit[2]);
  let month = parseInt(dateSplit[1])-1;
  let year = parseInt(dateSplit[0]);
  let d = new Date(Date.UTC(year,month,day))
  return d;
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