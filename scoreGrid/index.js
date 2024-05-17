import fs from 'fs';
import http from 'http';
import https from 'https';
import url from 'url';

import { logRequestDetails, getLogs } from './utils/logs.js'
import { getStudentScore, readCohortScores } from './utils/getLeaderBoardData.js';
import { getReport } from './utils/getReport.js';

const httpPort = 80;
const httpsPort = 443;

const httpServer = http.createServer((req, res) => {
  const httpsUrl = `https://${req.headers.host}${req.url}`;
  res.writeHead(301, { Location: httpsUrl });
  res.end();
});

const httpsServer = https.createServer(
  {
    key: fs.readFileSync('certs/privkey.pem'),
    cert: fs.readFileSync('certs/fullchain.pem')
  }, async (req, res) => {

    console.log(
      `request received for ${req.url} from ${req.socket.remoteAddress}`
    );

    await logRequestDetails(req, res);

    const parsedUrl = url.parse(req.url, true);
    const queryParams = parsedUrl.query;

    if (req.method === 'GET') {
      if (parsedUrl.pathname === '/') {
        try {

          res.statusCode = 200;
          res.setHeader('content-type', 'application/json');
          let options = {
            "API 1": "/leaderboard",
            "API 2": "/leaderboard?studentname=<name>",
            "API 3": "/report?studentname=<name>"
          }
          res.end(JSON.stringify(options));
        } catch (error) {
          console.error(error);
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      }
      else if (parsedUrl.pathname === '/logs') {
        try {
          let logsData = await getLogs();
          logsData = logsData.toString();
          res.statusCode = 200;
          res.setHeader('content-type', 'text');
          res.end(logsData);
        } catch (error) {
          console.error(error);
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      } else if (parsedUrl.pathname === '/leaderboard') {
        if (queryParams && queryParams.studentname) {
          console.log(queryParams.studentname);
          let result = await getStudentScore(queryParams);
          console.log(result);
          res.statusCode = 200;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify(result));
        } else {
          try {
            let scoresData = await readCohortScores();
            res.statusCode = 200;
            res.setHeader('content-type', 'application/json');
            res.end(scoresData);
          } catch (error) {
            console.error(error);
            res.statusCode = 500;
            res.end('Internal Server Error');
          }
        }
      } else if (parsedUrl.pathname === '/report') {
        if (queryParams && queryParams.studentname) {

          let reportData = await getReport(queryParams);
          // Set headers to indicate a downloadable PDF file
          res.setHeader('Content-Disposition', 'inline');
          res.setHeader('Content-Type', 'application/pdf');
          // Send the PDF data in the response
          res.statusCode = 200;
          res.end(reportData);
        } else {
          res.statusCode = 500;
          res.setHeader('content-type', 'text');
          res.end("Need params.");
        }
      } else {
        res.statusCode = 404;
        res.end('Not found');
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
