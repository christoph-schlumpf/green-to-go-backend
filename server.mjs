import { createServer } from 'http';
import { co2 } from '@tgwf/co2';
import axios from 'axios';
const co2Emission = new co2();
const greenHost = true // Is the data transferred from a green host?


console.log("Loading...");

var dataWebsitecarbon

var dataCarbonIntensity
var dataCarbonPowerBreakdown

axios.get('https://api.websitecarbon.com/site?url=https://green-to-go.vercel.app')
  .then(function (response) {
    console.log(response.data);
    console.log(response.data.statistics.co2.grid);
    console.log(response.data.statistics.co2.renewable);
    const estimatedCO2 = co2Emission.perByte(response.data.bytes, false);
    dataWebsitecarbon = response.data.statistics.co2.grid;
  })
  .catch(function (error) {
    console.log(error);
  });

axios({
    method: 'get',
    url: 'https://api-access.electricitymaps.com/tw0j3yl62nfpdjv4/power-breakdown/latest?zone=CH',
    headers: { 'X-BLOBR-KEY': 'gpdq4kPznyvfeO31MlbBEdlnputaMnik' }
}).then(function (response) {
    console.log(response.data);
    dataCarbonPowerBreakdown = response.data;
}).catch(function (error) {
        console.log(error);
    });

axios({
    method: 'get',
    url: 'https://api-access.electricitymaps.com/tw0j3yl62nfpdjv4/carbon-intensity/latest?zone=CH',
    headers: { 'X-BLOBR-KEY': 'gpdq4kPznyvfeO31MlbBEdlnputaMnik' }
}).then(function (response) {
    console.log(response.data);
    dataCarbonIntensity = response.data;
}).catch(function (error) {
    console.log(error);
});

createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Content-Type", "application/json");
  var result = {
      "carbonIntensity" : dataCarbonIntensity,
      "carbonPowerBreakdown": dataCarbonPowerBreakdown,
      "websiteCarbon": dataWebsitecarbon
  };
  res.write(JSON.stringify(result));
  res.end();
}).listen(process.env.PORT || 8080)
