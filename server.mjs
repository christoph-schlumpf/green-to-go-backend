import { createServer } from 'http';

console.log("Loading...");

createServer((req, res) => {
  res.write('Hello World!');
  res.end();
}).listen(process.env.PORT);
