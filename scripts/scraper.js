const https = require('https');
const fs = require('fs');
var Twitter = require('twitter');
const readline = require("readline");
const core = require('@actions/core');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var config;
try {
  config = require('./config.js'); //for local use
  console.log("Using local credentials");
} catch(e) {
  console.log("Using server credentials");
  if(process.env.CONSUMER_KEY) {
    console.log("We got the keys...");
    config = {
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token_key: process.env.ACCESS_TOKEN_KEY,
      access_token_secret: process.env.ACCESS_TOKEN_SECRET
    };
  }
}
const excelToJson = require('convert-excel-to-json');
const csv=require('csvtojson');
const arDownload = require('./ar_scraper');

const cantons = ['AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR', 'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH', 'FL'];
const bagExcelLocation = "https://www.bag.admin.ch/dam/bag/de/dokumente/mt/k-und-i/aktuelle-ausbrueche-pandemien/2019-nCoV/covid-19-datengrundlage-lagebericht.xlsx.download.xlsx/200325_Datengrundlage_Grafiken_COVID-19-Bericht.xlsx";

const ageLabels = ["0-9","10-19","20-29","30-39","40-49","50-59","60-69","70-79","80+"];
var appendToFiles = false;

var myArgs = process.argv.slice(2);
switch (myArgs[0]) {
case 'download':
    console.log("Downloading the BAG-File");
    if(myArgs[1] == "append") {
      appendToFiles = true;
    }
    if(myArgs[1] == "force") {
      downloadFile();
      return;
    }
    checkIfFileNeedsToBeDownloaded();
    break;
case 'parse':
    console.log('Parsing temp.xlsx');
    if(myArgs[1] == "append") {
      appendToFiles = true;
    }
    parseExcel();
    break;
case 'tweet':
    console.log('Testing tweet');
    tweet("#COVID_19 #COVID19 #CoronaInfoCH #Coronavirus\n🇨🇭BAG-Data from today: +XX\nBE: +X\rZH +X");
    break;
case 'testbag':
    console.log('Testing BAG-Download');
    arDownload.start(['AR','VD']);
default:
    console.log('Sorry, that is not something I know how to do.');
    rl.close();
}

function checkIfFileNeedsToBeDownloaded() {
  console.log("** Checking if today has already been downloaded **");
  fs.readFile('../data/deaths.csv', 'utf-8', function(err, data) {
      if (err) throw err;

      var lines = data.trim().split('\n');
      var lastLine = lines.slice(-1)[0];

      var fields = lastLine.split(',');
      var fileDate = fields[0];

      let date_ob = new Date();
      let date_now = date_ob.toISOString().substring(0,10);
      console.log("Server time: "+date_ob.toString());
      console.log("Server time ISO: "+date_ob.toISOString());
      console.log("Date now = "+date_now);
      console.log("FileDate = "+fileDate);

      if(date_now!=fileDate) {
        console.log("We have not got today yet: Download BAG-File");
        downloadFile();
      }
      else {
        console.log("We already got today ... do nothing");
        core.setOutput('newdata', 0);
        rl.close();
        core.setFailed("We already got today ... do nothing");
      }
    });
}

function downloadFile() {
  const file = fs.createWriteStream("temp.xlsx");
  const request = https.get(bagExcelLocation, function(response) {
      response.pipe(file);

      file.on('finish', function() {
        console.log("Finish downloading");
        if(appendToFiles) parseExcel();
        else rl.close();
      });
  });
}

function downloadTestcasesFile() {
  var location = "https://www.bag.admin.ch/dam/bag/de/dokumente/mt/k-und-i/aktuelle-ausbrueche-pandemien/2019-nCoV/covid-19-basisdaten-labortests.xlsx.download.xlsx/Dashboard_3_COVID19_labtests_positivity.xlsx";
  const file = fs.createWriteStream("temptestcases.xlsx");
  const request = https.get(location, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        console.log("Finish downloading Testcases");
        parseTestCasesFile();
      });
  });
}

function parseTestCasesFile() {
  var result;
  try {
     result = excelToJson({
        sourceFile: 'temptestcases.xlsx'
    });
  }
  catch(e) {
    console.log('\x1b[41m%s\x1b[0m', "Testcase-File is not an Excel");
    return;
  }
  var dash = result["Dashboard_3"];
  const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' })
  var csv = "date,pos,neg";
  for(var i=1; i<dash.length; i++) {
      var row = dash[i];
      if(i%2==1) {
        var csvrow = "\n";
        const date = row.B.setTime(row.B.getTime()+10800000);
        const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(date);
        csvrow += `${year}-${month}-${day},`;
        csvrow += row.C+",";
      }
      else {
        csvrow += row.C;
        csv += csvrow;
      }
  }
  console.log('Write tests.csv');
  fs.writeFileSync('../data/tests.csv', csv);
  fs.unlinkSync('temptestcases.xlsx');
  console.log('temptestcases.xlsx deleted!');
}

function parseExcel() {
  const result = excelToJson({
      sourceFile: 'temp.xlsx'
  });
  var deaths = result["COVID19 Altersverteilung TodF"];
  if(deaths==null) deaths = result["COVID19 cas décédés sexe âge"];
  var data = deaths.splice(4,10);

  var deaths = [];
  data.forEach((item, i) => {
    if(item.B!=null || item.C!=null) {
      deaths.push({
        age: item.A.replace(/ /g,""),
        m: item.B,
        f: item.C
      })
    }
  });
  console.log("Deaths:");
  console.log(deaths);

  var hospit = result["COVID19 Altersverteilung Hospit"];
  if(hospit==null) hospit = result["COVID19 cas hosp sexe âge"];
  data = hospit.splice(4,20);

  var hospitalised = [];
  data.forEach((item, i) => {
    if(item.B!=null) {
      hospitalised.push({
        age: item.A.replace(/ /g,""),
        m: item.B,
        f: item.C
      })
    }
  });
  console.log("Hospitalised:");
  console.log(hospitalised);

  var casessheet = result["COVID19 Altersverteilung"];
  if(casessheet==null) {
    casessheet = result["COVID19 cas par sexe et âge"];
    data = casessheet.splice(4,20);
  }
  else
    data = casessheet.splice(5,20);

  var cases = [];
  var incidences = [];
  data.forEach((item, i) => {
    if(item.B!=null) {
      cases.push({
        age: item.A.replace(/ /g,""),
        m: item.B,
        f: item.E
      });
      incidences.push({
        age: item.A.replace(/ /g,""),
        m: item.D,
        f: item.G
      });
    }
  });
  console.log("Cases:");
  console.log(cases);
  console.log("Incidences:");
  console.log(incidences);

  var isolation = result["COVID19 Isolation Quarantäne"];
  if(isolation==null) isolation = result["COVID19 isolement quarantaine"];
  var isolationCSV = null;
  if(isolation) {
    data = isolation.splice(4,27);
    var isolations = [];
    data.forEach((item, i) => {
    if(item.A!=null) {
      isolations.push({
        abbreviation_canton_and_fl: item.A,
        date: item.B,
        current_isolated: item.C,
        current_quarantined: item.D,
        foreign_quarantined: item.E
      });
    }
    });
    isolationCSV = makeIsolationCSV(isolations);
    console.log(isolationCSV);
  }


  var totals = result["COVID19 Zahlen"];
  var french = false;
  if(totals==null) {
    totals = result["COVID19 chiffres"];
    french = true;
  }
  data = totals.splice(5);
  var total = data.reduce(function(acc, val) { return acc + val.B; }, 0);
  console.log("BAG Total: "+total);

  var dateString = totals[0].A
  var length = dateString.length;;
  var date = dateString.substring(length-20,length-10);
  if(french) {
    date = dateString.substring(length-18,length-8);
  }
  console.log("Date: " + date);

  var casesPerCantons = result["COVID19 Kantone"];
  if(casesPerCantons==null) casesPerCantons = result["COVID19 cas par canton"];
  var data = casesPerCantons.splice(4,29);

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

  var cantonRow = makeCantonCSVRow(dateObj);
  console.log("Canton row: "+cantonRow);

  var allAgesDetailCSVRow = makeCSVRow(cases, date);
  allAgesDetailCSVRow+= ","+total; //Add BAG-Total
  console.log("All ages details CSV: "+allAgesDetailCSVRow);
  var deathCSVRow = makeCSVRow(deaths, date);
  console.log("Deaths CSV: "+deathCSVRow);
  var incidenceCSVRow = makeCSVRow(incidences, date);
  console.log("Insidences CSV: "+incidenceCSVRow);
  var hospitalicedCSVRow = makeCSVRow(hospitalised, date);
  console.log("Hospitalised CSV: "+hospitalicedCSVRow);
  //fs.unlink("temp.xlsx", function() { console.log("deleted") });

  if(appendToFiles) {
    console.log("** Checking if date already exists **");
    fs.readFile('../data/deaths.csv', 'utf-8', function(err, data) {
        if (err) throw err;

        var lines = data.trim().split('\n');
        var lastLine = lines.slice(-1)[0];

        var fields = lastLine.split(',');
        var fileDate = fields[0];

        console.log("FileDate = "+fileDate);
        console.log("Date of BAG = "+date);

        core.exportVariable('date', date);

        if(fileDate==date) {
          console.log('\x1b[41m%s\x1b[0m', "No new data ... doing nothing!");
          fs.unlinkSync('temp.xlsx');
          console.log('Temp.xlsx deleted!');
          core.setOutput('newdata', 0);
          rl.close();
          core.setFailed("No new data ... doing nothing!");
          return;
        }

        console.log("New Data ... lets append!");
        console.log("** Appending to files **");
        fs.appendFileSync('../data/deaths.csv', '\r\n'+deathCSVRow);
        fs.appendFileSync('../data/incidences.csv', '\r\n'+incidenceCSVRow);
        fs.appendFileSync('../data/allagesdetails.csv', '\r\n'+allAgesDetailCSVRow);
        fs.appendFileSync('../data/hospitalised.csv', '\r\n'+hospitalicedCSVRow);
        fs.appendFileSync('../data/casesPerCanton.csv', '\r\n'+cantonRow);
        if(isolationCSV!=null) fs.writeFileSync('../data/current_isolated.csv', isolationCSV);
        console.log("** Done appending **");

        console.log("Download testCases");
        downloadTestcasesFile();

        fs.readFile('label.json', (err, data) => {
            if (err) throw err;
            let label = JSON.parse(data);
            console.log(label);
            label.message = date;
            fs.writeFileSync('label.json', JSON.stringify(label));
        });

        var oldPath = 'temp.xlsx'
        var newPath = '../bagfiles/'+date+'.xlsx'
        fs.rename(oldPath, newPath, function (err) {
          if (err) throw err
          console.log('\x1b[42m%s\x1b[0m', 'Successfully renamed temp.xlsx - AKA moved!')

          tweetNewNumbers();
          arDownload.start(['AR','VD']);
          listFiles();
        });
    });
  }
  else {
    rl.close();
  }
}

function listFiles() {
    fs.readdir('../bagfiles', function(err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        parseCases(files[files.length-1],files[files.length-2]);
        core.setOutput('newdata', 1);
        rl.close();
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
  if(cases==null) cases = result["COVID19 chiffres"];
  var data = cases.splice(5);
  //var ydata = yesterday["COVID19 Zahlen"].splice(5);
  var csv = "date,new_cases,total_cases,new_hosp,total_hosp,new_deaths,total_deaths";
  const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' })
  var diff = 0;
  var diffString = "";
  for(var i=0; i<data.length; i++) {
    var singleData = data[i];
    const date = data[i].A.setTime(data[i].A.getTime()+7200000);
    const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(date);
    // if(i<data.length-1) {
    //   var singleYesterday = ydata[i];
    //   var casesYesterday = singleYesterday.B;
    //   var casesToday = singleData.B;
    //   var singleDiff = 0;
    //   if(casesYesterday!=casesToday) {
    //     singleDiff = casesToday - casesYesterday;
    //     diff += singleDiff;
    //     var singleDiffString;
    //     if(singleDiff<0) singleDiffString = singleDiff+" (correction)";
    //     else singleDiffString = "+"+singleDiff;
    //     diffString+=`${day}.${month}.${year}: ${singleDiffString}\n`;
    //   }
    // }
    // else {
    //   diffString+=`${day}.${month}.${year}: +${singleData.B}`;
    //   var singleDiff = singleData.B;
    // }
    var line = `\n${year}-${month}-${day},${singleData.B},${singleData.C},${singleData.D},${singleData.E},${singleData.F},${singleData.G}`;
    line = line.replace(/undefined/g, "0");
    csv += line;
  }
  fs.writeFileSync('../data/totals.csv', csv);
  console.log("Done writing Totals");
  //console.log(csv);
  // diffString = "#COVID_19 #COVID19 #CoronaInfoCH #Coronavirus\n🇨🇭Date-Distribution of BAG-Data from today: +"+(diff+data[data.length-1].B)+"\n"+diffString;
  // console.log(diffString);
  //console.log(csv);
}

function tweetNewNumbers() {
  csv()
  .fromFile('../data/casesPerCanton.csv')
  .then((jsonObj)=>{
      //console.log(jsonObj);
      var lastRow = jsonObj[jsonObj.length-1];
      var secondLastRow = jsonObj[jsonObj.length-2];
      var diffs = [];
      var totalDiff = 0;
      var diffString = "";
      for(var i=0; i<cantons.length-1;i++) { //ignore 'FL'
        var canton = cantons[i];
        var today = parseInt(lastRow[canton]);
        var yesterday = parseInt(secondLastRow[canton]);
        if(today!=yesterday) {
          var diff = today-yesterday;
          totalDiff += diff;
          var singleDiff = {
            canton: canton,
            diff: diff
          }
          diffs.push(singleDiff);
          var numberString = diff>0 ? ""+diff : diff+" (cr.)";
          diffString += "\n"+canton+": "+numberString;
        }
      }
      diffString = "#COVID19 #CoronaInfoCH\n🇨🇭BAG-Data from today: "+totalDiff+diffString;
      if(280-diffString.length>=37) {
        diffString += "\nhttps://rsalzer.github.io/COVID_19_CH";
      }
      console.log(diffString);
      console.log("Length of tweet:"+diffString.length);
      tweet(diffString);
      //rl.close();
      // rl.question("Should I tweet it? (y/n)", function(name) {
      //       if(name=="y") {
      //         console.log("OK, i will tweet");
      //         tweet(diffString);
      //       }
      //       rl.close();
      //   });
    });
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

function makeCSVRow(array, date) {
  var csv = "";
  csv += date;
  ageLabels.forEach((item, i) => {
    var singleCase = array.filter(function(d) { if(d.age==item) return d});
    if(singleCase.length>0) {
      csv += ","+singleCase[0].f;
    }
    else {
      csv += ",0";
    }
  });
  ageLabels.forEach((item, i) => {
    var singleCase = array.filter(function(d) { if(d.age==item) return d});
    if(singleCase.length>0) {
      csv += ","+singleCase[0].m;
    }
    else {
      csv += ",0";
    }
  });
  return csv;
}

function makeIsolationCSV(array) {
  var csv = "date,abbreviation_canton_and_fl,current_isolated,current_quarantined,foreign_quarantined\n";
  const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' })
  array.forEach((item,i) => {
    if(item.current_isolated!=undefined && item.current_isolated.length<9) {
      var csvline = "";
      const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(item.date);
      csvline += `${year}-${month}-${day},`
      csvline += item.abbreviation_canton_and_fl+",";
      if(item.current_isolated!=undefined) csvline += item.current_isolated;
      csvline += ",";
      if(item.current_quarantined!=undefined) csvline += item.current_quarantined;
      csvline += ",";
      if(item.foreign_quarantined!=undefined) csvline += item.foreign_quarantined;
      csvline += "\n";
      csv += csvline;
    }
  });
  return csv;
}

function tweet(message) {
    var T = new Twitter(config);
    T.post('statuses/update', {status: message},  function(error, tweet, response) {
      if(error) {
        console.log("Error while tweeting: "+error[0].message);
        //throw error;
      }
      //console.log(tweet);  // Tweet body.
      console.log("Tweet sent");  // Raw response object.
    });
}



