import xlsx from 'xlsx';
import { pool } from '../middleware.js'; // Import the pool

export default async function excelToDbUpdateScheduler() {
  // Get the current date
  const date = new Date();
  const month = date.getMonth() + 1; // Months are zero-based
  const day = date.getDate();
  const year = date.getFullYear();

  // Construct the file name
  const fileName = `workbook_${month}_${day}_${year}.xlsx`;

  try {
    // Read the Excel file
    const workbook = xlsx.readFile(`excel-to-db-updater/workbooks/${fileName}`);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    
    // Log the data instead of processing it
    console.log("THE EXCELLLLLLL DATA", data);

    // Iterate over the data and update the database
    for (const row of data) {
      const { person_id, first_name, last_name, position } = row;

      // Validate data
      if (!person_id || !first_name || !last_name) {
        console.error(`Invalid data for person_id: ${person_id}`);
        continue;
      }

      try {
        // Update the user in the database
        await pool.query(
          'UPDATE personelle SET first_name = $1, last_name = $2, position = $3 WHERE person_id = $4',
          [first_name, last_name, position, person_id]
        );

        // Log successful update
        await pool.query(
          'INSERT INTO excelUpdateLog (user_id, status) VALUES ($1, $2)',
          [person_id, 'success']
        );
      } catch (error) {
        // console.error(`Error updating person_id: ${person_id}`, error);

        // Log error
        await pool.query(
          'INSERT INTO excelUpdateLog (user_id, status, error_message) VALUES ($1, $2, $3)',
          [person_id, 'error', error.message]
        );
      }
    }
  } catch (error) {
    console.error(`Error reading Excel file: ${fileName}`, error);
  }
}