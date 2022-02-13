const https = require('https');
const fs = require('fs');
const csv=require('csvtojson')
const readline = require("readline");


//const cantons = ['AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR', 'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH', 'FL'];
const bagMetaLocation = "https://www.covid19.admin.ch/api/data/context";
let whichCantons;

const startARDownload = (cantons) => {
  whichCantons = cantons;
  downloadJSON();
}

exports.start = startARDownload;
//startARDownload();

  function downloadJSON() {
  var metaJson;
  var data="";
  https.get(bagMetaLocation,(res) => {
      let body = "";

      res.on("data", (chunk) => {
          body += chunk;
      });

      res.on("end", () => {
          try {
              let metaFile = JSON.parse(body);
              var metaDate = metaFile.sourceDate;
              var dataVersion = metaFile.dataVersion;
              var casesSource = metaFile.sources.individual.csv.daily.cases;
              var deathSource = metaFile.sources.individual.csv.daily.death;
              var hospCapacitySource = metaFile.sources.individual.csv.daily.hospCapacity;
              downloadFiles([["ncumul_conf", casesSource], ["ncumul_deceased", deathSource], ["hospCapacity", hospCapacitySource]]);
          } catch (error) {
              console.error(error.message);
          };
      });

  }).on("error", (error) => {
      console.error(error.message);
  });
}

var data = {};

async function downloadFiles(list) {
  if(list.length==0) {
    finishedDownloading();
    return;
  }
  var element = list.splice(0,1)[0];
  var whichData = element[0];
  var source = element[1];
  https.get(source,(res) => {
      let body = "";

      res.on("data", (chunk) => {
          body += chunk;
      });

      res.on("end", () => {
          finishedSingleDownload(body, whichData, list);
      });

  }).on("error", (error) => {
      console.error(error.message);
  });
}

async function finishedSingleDownload(body, whichData, list) {
  var json = await csv().fromString(body);
  whichCantons.forEach((whichCanton) => {
    if(!data[whichCanton]) data[whichCanton] = {};
    var filtered = json.filter(d => d.geoRegion==whichCanton);
    if(whichData!="hospCapacity") {
      filtered = filtered.map(d => {
        var obj = {};
        obj.date = d.datum;
        obj[whichData] = d.sumTotal;
        return obj;
      });
    }
    else {
      filtered = filtered.map(d => {
        var obj = {};
        obj.date = d.date;
        obj.current_hosp = d.Total_Covid19Patients;
        obj.current_icu = d.ICU_Covid19Patients;
        return obj;
      });
    }
    data[whichCanton][whichData] = filtered;
  });
  downloadFiles(list);
}

function finishedDownloading() {
  //console.log("Finished Downloading");
  whichCantons.forEach((whichCanton) => {
    var singleData = data[whichCanton];
    var consolidated = singleData.ncumul_conf;
    singleData.ncumul_deceased.forEach((item, i) => {
      var date = item.date;
      var deaths = item.ncumul_deceased;
      var filtered = consolidated.filter(d => d.date==date);
      if(filtered.length==0) {
        consolidated.push(item);
      }
      else {
        filtered[0].ncumul_deceased = deaths;
      }
    });

    singleData.hospCapacity.forEach((item, i) => {
      var date = item.date;
      var filtered = consolidated.filter(d => d.date==date);
      if(filtered.length==0) {
        consolidated.push(item);
      }
      else {
        filtered[0].current_hosp = item.current_hosp;
        filtered[0].current_icu = item.current_icu;
      }
    });

    var csvtext = "date,abbreviation_canton_and_fl,ncumul_conf,ncumul_deceased,current_hosp,current_icu,current_vent";
    consolidated.forEach((item, i) => {
      var line = `\n${item.date},${whichCanton},${item.ncumul_conf},${item.ncumul_deceased},${item.current_hosp},${item.current_icu},`;
      line = line.split("undefined").join("")
      line = line.split("NA").join("");
      csvtext += line;
    });

    //console.log(csvtext);

    fs.writeFileSync(`../data/${whichCanton.toLowerCase()}.csv`, csvtext);
  });

}