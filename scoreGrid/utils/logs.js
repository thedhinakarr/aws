import { readFile, writeFile } from 'fs/promises';


export async function logRequestDetails(req, res) {
  const remoteAddress = req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const method = req.method;
  const dateTime = new Date().toISOString();
  const url = req.url;

  let log = [remoteAddress, userAgent, method, dateTime, url].join(' ');

  try {
    let logsData = await readFile('./data/logs.txt');
    logsData = logsData.toString();
    logsData += '\n' + log;
    await writeFile('./data/logs.txt', logsData);

  } catch (error) {
    console.log(error);
    return error;
  }
}

export const getLogs = async () => {
  try {
    const logsData = await readFile('./data/logs.txt', 'utf8');
    return logsData;
  } catch (error) {
    console.error(error);
    return 'Failed to read logs data';
  }
};
