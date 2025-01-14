require('dotenv').config(); // Load environment variables from .env
const { Client } = require('pg');
const fs = require('fs');
const { user } = require('pg/lib/defaults');

// PostgreSQL connection configuration using environment variables
const config = {
    user: process.env.PG_USER,
    host: '127.0.0.1',  //process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
};

// Function to log messages to ~/ntimes/pv_upload.log
function logMessage(message) {
    const logPath = 'pv_upload.log';
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
    
}

// Function to read from pv_upload and update users table
async function updateUsers() {
    console.log("pul1     ");
    logMessage("pv_upload table update started.");
    const client = new Client(config);
    
    try {
        await client.connect();
        console.log("pul21     DB connection successful");

        // Read from pv_upload table
        const selectQuery = 'SELECT * FROM pv_upload';
        const res = await client.query(selectQuery);

        // Iterate over the rows to update the users table
        for (let row of res.rows) {
            let upload_id;
            try {
                console.log("pul23      ");
                // console.table(row);

                upload_id = row.id;
                let first_name = row.first_name;
                let last_name = row.last_name;
                let email = row.email;
                let disable_til = row.disable_til;
                let disable_flexi = row.disable_flexi;
                let disable_rdo = row.disable_rdo;
                let paid_hours = row.paid_hours;
                let start_date = row.start_date;
                let end_date = row.end_date;
                let person_id = row.person_id;
                let user_id = row.user_id;
                
                //find our user_id with parks person_id
                user_id = null;
                if (user_id == null) {
                    console.log("pul3001    user_id is null, so we need to find the user_id from the parks person_id (" + person_id + ")");
                    const selectUserQuery = `SELECT person_id as user_id FROM personelle WHERE external_id = $1`;
                    const resUser = await client.query(selectUserQuery, [person_id]);
                    user_id = resUser.rows[0].user_id;
                    console.log("pul3002    user_id derived from personelle table where external_id.  Verify that (user_id:" + user_id + ") = (row.user_id:" + row.user_id + ")");
                }
                console.log("pul3004    user_id is " + user_id);
                
                // update first_name, and last_name in the personelle table
                const updatePersonelleQuery = `UPDATE personelle SET first_name = $1, last_name = $2 WHERE person_id = $3`;     //person_id is incorrectly named in the personelle table - it should be user_id
                const valuesPersonelle = [first_name, last_name, user_id];
                await client.query(updatePersonelleQuery, valuesPersonelle);
                console.log("pul4    personelle table updated with first_name and last_name");

                // update email in the users table
                const updateQuery = `UPDATE users SET email = $1 WHERE id = $2`;
                const values = [email, user_id];
                await client.query(updateQuery, values);
                console.log("pul5    users table updated with email");

                // update disable_til, disable_flexi, disable_rdo, start_date, and end_date in the user_work_schedule table
                const updateWorkScheduleQuery = `UPDATE user_work_schedule SET disable_til = $1, disable_flexi = $2, disable_rdo = $3 WHERE user_id = $4 returning schedule_id`;
                const valuesWorkSchedule = [disable_til, disable_flexi, disable_rdo, user_id];
                const resSchedule = await client.query(updateWorkScheduleQuery, valuesWorkSchedule);
                const schedule_id = resSchedule.rows[0]?.schedule_id;
                console.log("pul6    user_work_schedule table updated RETURNING schedule_id: " + schedule_id);

                // update paid_hours in the work_schedule table
                const updateWorkScheduleQuery2 = `UPDATE work_schedule SET paid_hours = $1, start_date = $2, end_date = $3 WHERE id = $4`;
                const valuesWorkSchedule2 = [paid_hours, start_date, end_date, schedule_id];
                await client.query(updateWorkScheduleQuery2, valuesWorkSchedule2);
                console.log("pul7    work_schedule table updated"); 
            } catch (err) {
                console.log("pul81    Error processing row with person_id " + row.person_id + ", user_id " + user_id + ": " + err.message);
                logMessage("pul81    Error processing row with person_id " + row.person_id + ", user_id " + user_id + ": " + err.message);
                continue;  // Skip this row and continue with the next one
            }                  
            console.log("pul91    record (" + row.person_id + ") updated successfully");
            logMessage("pul91    record (" + row.person_id + ") updated successfully");

            //delete this row from the pv_upload table
            const deleteQuery = `DELETE FROM pv_upload WHERE id = $1`;
            const valuesDelete = [upload_id];
            await client.query(deleteQuery, valuesDelete);
            console.log("pul92    record (" + row.person_id + ") deleted from pv_upload");
            logMessage("pul92    record (" + row.person_id + ") deleted from pv_upload");
            
        }
        console.log("pul92    Update successful: users table updated with data from pv_upload.");
        logMessage("pul92    Update successful: users table updated with data from pv_upload.");
    } catch (err) {
        console.log("pul83    Error: " + err.message);
        logMessage("pul83    Error: " + err.message);
    } finally {
        await client.end();
    }
}




module.exports = { updateUsers };
