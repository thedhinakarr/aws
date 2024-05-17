import { readFile, writeFile } from 'fs/promises';

export async function readCohortScores() {
  try {
    const scoresData = await readFile('./data/cohortScores.json');
    return scoresData;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to read cohort scores data');
  }
}


export async function getStudentScore(queryParams) {
  try {
    // Assuming 'studentId' is the key for identifying the student
    const studentId = queryParams && queryParams.studentname;

    if (!studentId) {
      throw new Error('Student ID is required');
    }

    // Read the cohort scores JSON file
    const scoresData = await readFile('data/cohortScores.json', 'utf-8');
    const scores = JSON.parse(scoresData);

    // Find the student's score based on the provided student ID
    const studentScore = scores.find(student => student.studentname === studentId);

    if (!studentScore) {
      throw new Error('Student not found');
    }

    return studentScore;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get student score');
  }
}
