import { readFile, writeFile } from 'fs/promises';
import fs from 'fs';
import http from 'http';
import https from 'https';
import url from 'url';


import logRequestDetails from './utils/logRequestDetails.js'

const httpPort = 80;
const httpsPort = 443;

const httpServer = http.createServer(async (req, res) => {
  await logRequestDetails(req, res);

  const parsedUrl = url.parse(req.url, true);

  if (req.method == 'GET' && parsedUrl.path == '/logs') {
    try {
      let logsData = await readFile('./data/logs.txt');
      logsData = logsData.toString();

      res.statusCode = 200;
      res.setHeader('content-type', 'text')
      res.end(logsData);

    } catch (error) {
      console.log(error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

const httpsServer = https.createServer(
  {
    key: fs.readFileSync('certs/privkey.pem'),
    cert: fs.readFileSync('certs/fullchain.pem')
  }, async (req, res) => {
    await logRequestDetails(req, res);

    const parsedUrl = url.parse(req.url, true);

    if (req.method == 'GET' && parsedUrl.path == '/logs') {
      try {
        let logsData = await readFile('./data/logs.txt');
        logsData = logsData.toString();

        res.statusCode = 200;
        res.setHeader('content-type', 'text')
        res.end(logsData);

      } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    } else if (req.method == 'GET' && parsedUrl.path == '/leaderboard') {
      try {
        let logsData = await readFile('./data/cohortScores.json');
        res.statusCode = 200;
        res.setHeader('content-type', 'data/json')
        res.end(logsData);

      } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    } else {
      res.statusCode = 404;
      res.end('Not found');
    }



  });




httpServer.listen(httpPort, () => {
  console.log(`Server is running at ${httpPort}`);
});

httpsServer.listen(httpsPort, () => {
  console.log(`Server is running at ${httpsPort}`);
})
