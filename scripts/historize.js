const https = require('https');
const fs = require('fs');
const excelToJson = require('convert-excel-to-json');


const bagExcelLocation = "https://www.bag.admin.ch/dam/bag/de/dokumente/mt/k-und-i/aktuelle-ausbrueche-pandemien/2019-nCoV/covid-19-datengrundlage-lagebericht.xlsx.download.xlsx/200325_Datengrundlage_Grafiken_COVID-19-Bericht.xlsx";
const cantons = ['AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR', 'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH', 'FL'];

const ageLabels = ["0-9","10-19","20-29","30-39","40-49","50-59","60-69","70-79","80+"];
var appendToFiles = false;
//listFiles();
listFiles();

function listFiles() {
    fs.readdir('../bagfiles', function(err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        parseCases(files[files.length-1],files[files.length-2]);
    });
}

function parseCases(today, yday) {
  console.log(today+" / "+yday);
  //const file = "2020-07-04.xlsx";
  const result = excelToJson({
      sourceFile: '../bagfiles/'+today
  });
  //const ydayfile = "2020-07-03.xlsx";
  const yesterday = excelToJson({
    sourceFile: '../bagfiles/'+yday
  });
  var cases = result["COVID19 Zahlen"];
  var data = cases.splice(5);
  var ydata = yesterday["COVID19 Zahlen"].splice(5);
  var csv = "date,new_cases,total_cases,new_hosp,total_hosp,new_deaths,total_deaths,diff";
  const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' })
  var diff = 0;
  var diffString = "";
  for(var i=0; i<data.length; i++) {
    var singleData = data[i];
    const date = data[i].A.setTime(data[i].A.getTime()+7200000);
    const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(date);
    if(i<data.length-1) {
      var singleYesterday = ydata[i];
      var casesYesterday = singleYesterday.B;
      var casesToday = singleData.B;
      var singleDiff = 0;
      if(casesYesterday!=casesToday) {
        singleDiff = casesToday - casesYesterday;
        diff += singleDiff;
        var singleDiffString;
        if(singleDiff<0) singleDiffString = singleDiff+" (correction)";
        else singleDiffString = "+"+singleDiff;
        diffString+=`${day}.${month}.${year}: ${singleDiffString}\n`;
      }
    }
    else {
      diffString+=`${day}.${month}.${year}: +${singleData.B}`;
      var singleDiff = singleData.B;
    }
    var line = `\n${year}-${month}-${day},${singleData.B},${singleData.C},${singleData.D},${singleData.E},${singleData.F},${singleData.G},${singleDiff}`;
    line = line.replace(/undefined/g, "0");
    csv += line;
  }
  //console.log(csv);
  diffString = "#COVID_19 #COVID19 #CoronaInfoCH #Coronavirus\n🇨🇭Date-Distribution of BAG-Data from today: +"+(diff+data[data.length-1].B)+"\n"+diffString;
  console.log(diffString);
  //console.log(csv);
}


function parseExcel(file) {

  console.log("Parsing Date: " + file.substring(0, file.length-5));

  const result = excelToJson({
      sourceFile: '../bagfiles/'+file
  });
  var casesPerCantons = result["COVID19 Kantone"];
  var data = casesPerCantons.splice(4,29);

  var dateObj = {};
  var date = file.substring(0, file.length-5);
  var dateObj = {};
  dateObj.date = date;

  data.forEach((item, i) => {
    if(item.B!=null && item.A!=null && item.A.length<3) {
      var singleCanton = {};
      singleCanton.cases = item.B,
      singleCanton.incidences = item.C
      dateObj[item.A.replace(/ /g,"")] = singleCanton;
    }
  });

  return dateObj;
}

function makeCantonCSVRow(obj) {
  var csv = "";
  csv += obj.date;
  for(var i=0; i<cantons.length; i++) {
    var canton = cantons[i];
    var cantonObj = obj[canton];
    if(cantonObj!=null && cantonObj.cases!=null) {
      csv += ","+cantonObj.cases;
    }
    else {
      csv += ",";
    }
  }
  return csv;
}
