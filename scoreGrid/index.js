import { readFile, writeFile } from 'fs/promises';
import fs from 'fs';
import http from 'http';
import https from 'https';
import url from 'url';

const httpPort = 80;
const httpsPort = 443;

const httpServer = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method == 'GET' && parsedUrl.path == '/') {
    try {
      res.statusCode = 200;
      res.setHeader('content-type', 'text')
      res.end("HOI");
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


    const parsedUrl = url.parse(req.url, true);

    if (req.method == 'GET' && parsedUrl.path == '/') {
      try {
        res.statusCode = 200;
        res.setHeader('content-type', 'text')
        res.end("HOI");
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
