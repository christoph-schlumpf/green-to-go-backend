import { createServer } from 'http';
import { co2 } from '@tgwf/co2';
import axios from 'axios';
const co2Emission = new co2();
const greenHost = true // Is the data transferred from a green host?

console.log("Loading...");

var data

axios.get('https://api.websitecarbon.com/site?url=https://green-to-go.vercel.app')
  .then(function (response) {
    console.log(response.data);
    console.log(response.data.statistics.co2.grid);
    console.log(response.data.statistics.co2.renewable);
    const estimatedCO2 = co2Emission.perByte(response.data.bytes, false)
    data = response.data.statistics.co2.grid
  })
  .catch(function (error) {
    console.log(error);
  });


createServer((req, res) => {
  res.write(JSON.stringify(data));
  res.end();
}).listen(process.env.PORT);
