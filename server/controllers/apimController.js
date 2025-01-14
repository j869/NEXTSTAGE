import { queryDatabase, pool } from "../middleware.js";
const API_KEY = 'abc123';


const apimUpdateDisableTil = async (req, res) => {
  console.log('ama01', req.body);

  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    console.log('ama08   Key mismatch or missing');
    return res.status(403).send('Forbidden'); 
  }

  try {
    const { userId, disableTil } = req.body;
    const query = 'UPDATE user_work_schedule SET disable_til = $1 WHERE user_id = $2';
    await pool.query(query, [disableTil, userId]);

    console.log('ama09');
    res.status(200).send('Update successful');
  } catch (error) {
    console.error('ama81 Error updating database:', error);
    res.status(500).send('Internal Server Error');
  }
};



const apimUpdateDisableFlexi = async (req, res) => {
  console.log('amb01', req.body);

  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    console.log('amb08   Key mismatch or missing');
    return res.status(403).send('Forbidden'); 
  }

  try {
    const { userId, disableFlexi } = req.body;
    const query = 'UPDATE user_work_schedule SET disable_flexi = $1 WHERE user_id = $2';
    await pool.query(query, [disableFlexi, userId]);

    console.log('amb09');
    res.status(200).send('Update successful');
  } catch (error) {
    console.error('amb81 Error updating database:', error);
    res.status(500).send('Internal Server Error');
  }
};



const apimUpdateDisableRdo = async (req, res) => {
  console.log('amc01', req.body);

  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    console.log('amc08   Key mismatch or missing');
    return res.status(403).send('Forbidden'); 
  }

  try {
    const { userId, disableRdo } = req.body;
    const query = 'UPDATE user_work_schedule SET disable_rdo = $1 WHERE user_id = $2';
    await pool.query(query, [disableRdo, userId]);

    console.log('amc09');
    res.status(200).send('Update successful');
  } catch (error) {
    console.error('amc81 Error updating database:', error);
    res.status(500).send('Internal Server Error');
  }
};


const apimUpdateFirstName = async (req, res) => {
  console.log('amd01', req.body);

  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    console.log('amd08   Key mismatch or missing');
    return res.status(403).send('Forbidden'); 
  }

  try {
    const { userId, firstName } = req.body;
    const query = 'UPDATE personelle SET first_name = $1 WHERE person_id = $2';
    await pool.query(query, [firstName, userId]);

    console.log('amd09');
    res.status(200).send('Update successful');
  } catch (error) {
    console.error('amd81 Error updating database:', error);
    res.status(500).send('Internal Server Error');
  }
};



const apimUpdateLastName = async (req, res) => {
  console.log('amd01', req.body);

  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    console.log('amd08   Key mismatch or missing');
    return res.status(403).send('Forbidden'); 
  }

  try {
    const { userId, lastName } = req.body;
    const query = 'UPDATE personelle SET last_name = $1 WHERE person_id = $2';
    await pool.query(query, [lastName, userId]);

    console.log('amd09');
    res.status(200).send('Update successful');
  } catch (error) {
    console.error('amd81 Error updating database:', error);
    res.status(500).send('Internal Server Error');
  }
};


const apimUpdatePaidHours = async (req, res) => {
  console.log('ame01', req.body);

  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    console.log('ame08   Key mismatch or missing');
    return res.status(403).send('Forbidden'); 
  }

  try {
    const { userId, paidHours } = req.body;

    // Await the result of the query to ensure it's resolved before accessing the rows
    const result = await pool.query("SELECT schedule_id FROM user_work_schedule WHERE user_id = $1", [userId]);
    const scheduleId = result.rows[0]?.schedule_id;

    // If no scheduleId is found, return an error
    if (!scheduleId) {
      console.log('ame82   No scheduleId found');
      return res.status(404).send('Schedule not found');
    }

    const query = 'UPDATE work_schedule SET paid_hours = $1 WHERE id = $2';
    await pool.query(query, [paidHours, scheduleId]);

    console.log('ame09');
    res.status(200).send('Update successful');
  } catch (error) {
    console.error('ame81 Error updating database:', error);
    res.status(500).send('Internal Server Error');
  }
};



export {
  apimUpdateDisableTil,
  apimUpdateDisableFlexi,
  apimUpdateDisableRdo,
  apimUpdateFirstName,
  apimUpdateLastName,
  apimUpdatePaidHours
}