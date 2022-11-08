import { createServer } from 'http';

console.log("Loading...");

createServer((req, res) => {
  res.write('Hello Green to Go!');
  res.end();
}).listen(process.env.PORT);
