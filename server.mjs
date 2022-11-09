import { createServer } from 'http';
import { co2 } from '@tgwf/co2';
import axios from 'axios';
const co2Emission = new co2();
const greenHost = true // Is the data transferred from a green host?

const apiKeyElectricityMap = 'gpdq4kPznyvfeO31MlbBEdlnputaMnik';
const apiHeaderElectricityMap = { 'X-BLOBR-KEY': apiKeyElectricityMap };
const baseUrlElectricityMap = 'https://api-access.electricitymaps.com/tw0j3yl62nfpdjv4';

const randomNumber = Math.random();

console.log("Loading... " + randomNumber);

var dataWebsitecarbonEco
var dataWebsitecarbon


var dataCarbonPowerBreakdown
var dataCarbonPowerBreakdownHistory
var dataCarbonIntensity
var dataCarbonIntensityForecast
var dataCarbonIntensityHistory


axios.get('https://api.websitecarbon.com/site?url=https://green-to-go.vercel.app?' + randomNumber)
  .then(function (response) {
    console.log(response.data);
    console.log(response.data.statistics.co2.grid);
    const estimatedCO2 = co2Emission.perByte(response.data.bytes, false);
    dataWebsitecarbon = response.data.statistics.co2.grid;
  })
  .catch(function (error) {
    console.log(error);
  });

axios.get('https://api.websitecarbon.com/site?url=https://green-to-go.vercel.app?eco' + randomNumber)
    .then(function (response) {
      console.log(response.data);
      console.log(response.data.statistics.co2.grid);
      const estimatedCO2 = co2Emission.perByte(response.data.bytes, false);
      dataWebsitecarbonEco = response.data.statistics.co2.grid;
    })
    .catch(function (error) {
      console.log(error);
    });

axios({
    method: 'get',
    url: `${baseUrlElectricityMap}/power-breakdown/latest?zone=CH`,
    headers: apiHeaderElectricityMap
}).then(function (response) {
    console.log(response.data);
    dataCarbonPowerBreakdown = response.data;
}).catch(function (error) {
        console.log(error);
    });

axios({
    method: 'get',
    url: `${baseUrlElectricityMap}/power-breakdown/history?zone=CH`,
    headers: apiHeaderElectricityMap
}).then(function (response) {
    console.log(response.data);
    dataCarbonPowerBreakdownHistory = response.data;
}).catch(function (error) {
    console.log(error);
});

axios({
    method: 'get',
    url: `${baseUrlElectricityMap}/carbon-intensity/latest?zone=CH`,
    headers: apiHeaderElectricityMap
}).then(function (response) {
    console.log(response.data);
    dataCarbonIntensity = response.data;
}).catch(function (error) {
    console.log(error);
});

axios({
    method: 'get',
    url: `${baseUrlElectricityMap}/carbon-intensity/forecast?zone=CH`,
    headers: apiHeaderElectricityMap
}).then(function (response) {
    console.log(response.data);
    dataCarbonIntensityForecast = response.data;
}).catch(function (error) {
    console.log(error);
});

axios({
    method: 'get',
    url: `${baseUrlElectricityMap}/carbon-intensity/history?zone=CH`,
    headers: apiHeaderElectricityMap
}).then(function (response) {
    console.log(response.data);
    dataCarbonIntensityHistory = response.data;
}).catch(function (error) {
    console.log(error);
});

createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Content-Type", "application/json");
  var result = {
      "carbonIntensity" : dataCarbonIntensity,
      "carbonIntensityForecast": dataCarbonIntensityForecast,
      "carbonIntensityHistory": dataCarbonIntensityHistory,
      "carbonPowerBreakdown": dataCarbonPowerBreakdown,
      "carbonPowerBreakdownHistory": dataCarbonPowerBreakdownHistory,
      "websiteCarbon": dataWebsitecarbon,
      "websiteCarbonEco": dataWebsitecarbonEco,
      "websiteCarbonEcoImprovementFactor": dataWebsitecarbon && dataWebsitecarbonEco ? dataWebsitecarbon.grams / dataWebsitecarbonEco.grams : undefined
  };
  res.write(JSON.stringify(result, null, 4));
  res.end();
}).listen(process.env.PORT || 8080)
