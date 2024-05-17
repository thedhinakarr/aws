import { readFile } from 'fs/promises';

export async function getReport(queryParams) {
  try {
    // Assuming 'reportName' is the key for specifying the name of the report
    let reportName = queryParams && queryParams.studentname;

    if (!reportName) {
      throw new Error('Report name is required');
    }

    // Construct the file path based on the reportName
    let filePath = `./data/reports/MAT3/${reportName.toUpperCase()}.pdf`;

    // Read the PDF file
    let reportData = await readFile(filePath);

    // Read the PDF file
    reportData = await readFile(filePath);

    return reportData;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get report');
  }
}
