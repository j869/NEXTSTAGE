
import { queryDatabase, pool } from "../middleware.js";
import {logUser} from '../../utils/logging.js';

const getSubordinateTime = (req, res) => {
    console.log("gsts1    ");
    const userId = req.params.userID
	console.log("gsts2 " + userId)

    const query = `
	SELECT
    t.person_id, 
    t.work_date,
    SUM(COALESCE(t.time_total::interval, '0 minutes'::interval)) AS total_time,
	(Select p.first_name || ' ' || p.last_name from personelle p where p.person_id = t.person_id) as person_name
FROM
    ts_timesheet_t t
INNER JOIN
    staff_hierarchy
ON 
    t.person_id = staff_hierarchy.user_id
WHERE
    t.status = 'approved' AND
    staff_hierarchy.manager_id = $1
GROUP BY
    t.person_id, t.work_date, person_name
ORDER BY
    t.work_date, t.person_id DESC;
	`

queryDatabase(query, [userId], res, "Manager Timesheets fetched successfully");



}

const getPendingTimeSheet = (req, res) => {
    console.log("gpts1    ");
    const userId = req.params.userID;
    console.log("gpts2     " + userId);
    const query = `SELECT
    ts_timesheet_t.*,
    users.username as user_name,
    users.email,
    staff_hierarchy.user_id as user_id,
    DATE_TRUNC('week', ts_timesheet_t.work_date) AS week_start,
    EXTRACT(YEAR FROM ts_timesheet_t.work_date) AS year,
    personelle.first_name || ' ' || personelle.last_name as full_name
FROM
    ts_timesheet_t
    INNER JOIN
    staff_hierarchy
    ON 
        ts_timesheet_t.person_id = staff_hierarchy.user_id
    INNER JOIN
    users
    ON 
        staff_hierarchy.user_id = users."id"
    INNER JOIN
    personelle
    ON 
        staff_hierarchy.user_id = personelle.person_id
WHERE
    ts_timesheet_t.status = 'entered' AND
    staff_hierarchy.manager_id = $1
ORDER BY
    user_id, year DESC, week_start DESC, work_date 
    `;

    queryDatabase(query, [userId], res, "Manager Timesheets fetched successfully");
};


const getApproveTimeSheet = (req, res) => { 
    console.log("gats1    ");
    const userId = req.params.userID
    const query = `SELECT
	ts_timesheet_t.*, 
	users.username as user_name, 
	users.email,
	DATE_TRUNC('week', ts_timesheet_t.work_date) AS week_start,
    EXTRACT(YEAR FROM ts_timesheet_t.work_date) AS year,
    personelle.first_name || ' ' || personelle.last_name as full_name
FROM
	ts_timesheet_t
	INNER JOIN
	staff_hierarchy
	ON 
		ts_timesheet_t.person_id = staff_hierarchy.user_id
	INNER JOIN
	users
	ON 
		staff_hierarchy.user_id = users."id"
	INNER JOIN
    personelle
    ON 
        staff_hierarchy.user_id = personelle.person_id
WHERE
	ts_timesheet_t.status = 'approved' AND
	staff_hierarchy.manager_id = $1
ORDER BY
	user_id, year DESC, week_start DESC, work_date
	`
    queryDatabase(query, [userId], res, "manager Timesheets fetched successfully!")
}


const getRejectTimeSheet = (req, res) => { 
    console.log("grts1    ");
    const userId = req.params.userID
    const query = `SELECT
	ts_timesheet_t.*, 
	users.username as user_name, 
	users.email,
	personelle.first_name || ' ' || personelle.last_name as full_name,
	DATE_TRUNC('week', ts_timesheet_t.work_date) AS week_start,
    EXTRACT(YEAR FROM ts_timesheet_t.work_date) AS year
FROM
	ts_timesheet_t
	INNER JOIN
	staff_hierarchy
	ON 
		ts_timesheet_t.person_id = staff_hierarchy.user_id
	INNER JOIN
	users
	ON 
		staff_hierarchy.user_id = users."id"
	INNER JOIN
    personelle
    ON 
        staff_hierarchy.user_id = personelle.person_id
WHERE
	ts_timesheet_t.status = 'reject' AND
	staff_hierarchy.manager_id = $1
ORDER BY
	user_id, year DESC, week_start DESC, work_date 
	
	`
    queryDatabase(query, [userId], res, "manager Timesheets fetched successfully!")
}



const approveTimesheet = async (req, res) => {
    console.log("ppt1   ")
    const userId = req.query.userID 
    const ts_id = req.body.ts_id
	logUser(req, "ppt1      user just approved timesheet(#" + ts_id + ")")
	logUser(req, "ppt9");

	await pool.query("SELECT * FROM notification WHERE timesheet_id = $1", [ts_id], async (err, result) => {
		
		if (err) {
		  console.error("Database error fetching notification:", err);
		 
		  return;
		} else {

		let notificationId;

		   notificationId = result.rowCount != 0 ? result.rows[0].notification_id : 0;

		  console.log("NotoficationID: ", notificationId);

		//   const query = `UPDATE ts_timesheet_t SET status = 'approved' , activity = 'Approved by the Manager' WHERE id = $1`
		  const query = `UPDATE ts_timesheet_t SET status = 'approved'  WHERE id = $1`
        
		  await pool.query(
			`UPDATE notification SET 
			title = 'Timesheet Approved',
			message = 'Your timesheet for the week has been approved by the Manager.',
			read_status = false, 
			created_at = NOW() WHERE notification_id = $1
			 `,[notificationId], (error) => { console.error("something went wrong in updating the notification", error)});


			await queryDatabase(query, [ts_id], res, "Timesheet updated Successfully!")
		}
	  });

    
}



const pendingTimesheet = async (req, res) => {
    console.log("ppt1   ")
    const userId = req.query.userID 
    const ts_id = req.body.ts_id

	await pool.query("SELECT * FROM notification WHERE timesheet_id = $1", [ts_id], async (err, result) => {
		
		if (err) {
		  console.error("Database error fetching notification:", err);
		 
		  return;
		} else {

		let notificationId;


		   notificationId = result.rowCount != 0 ? result.rows[0].notification_id : 0;

		  console.log("NotoficationID: ", notificationId);

		//   const query = `UPDATE ts_timesheet_t SET status = 'entered' , activity = 'Move to pending by the Manager' WHERE id = $1`
		  const query = `UPDATE ts_timesheet_t SET status = 'entered' WHERE id = $1`
        
		  await pool.query(
			`UPDATE notification SET 
			title = 'Timesheet Move to Pending',
			message = 'Your timesheet was move back to pending status.',
			read_status = false, 
			created_at = NOW() WHERE notification_id = $1
			 `,[notificationId], (error) => { console.error("something went wrong in updating the notification", error)});


			await queryDatabase(query, [ts_id], res, "Timesheet updated Successfully!")
		}
	  });

    
}





const rejectTimesheet = async (req, res) => { 
	console.log("rpt1   ")
    const userId = req.query.userID 
    const ts_id = req.body.ts_id

  
	await pool.query("SELECT * FROM notification WHERE timesheet_id = $1", [ts_id], async (err, result) => {
		
		if (err) {
		  console.error("Database error fetching notification:", err);
		 
		  return;
		} else {
		  
		let notificationId;

		notificationId = result.rowCount != 0 ? result.rows[0].notification_id : 0;

		  console.log("NotoficationID: ", notificationId);

		//   const query = `UPDATE ts_timesheet_t SET status = 'reject' , activity = 'Rejected by the Manager' WHERE id = $1`
		  const query = `UPDATE ts_timesheet_t SET status = 'reject' WHERE id = $1`

		  await pool.query(
			`UPDATE notification SET 
			title = 'Timesheet Rejected',
			message = 'Your timesheet for the week has been rejected by the Manager.',
			read_status = false, 
			created_at = NOW() WHERE notification_id = $1
			 `,[notificationId], (error) => { console.error("something went wrong in updating the notification", error)});


			await queryDatabase(query, [ts_id], res, "Timesheet updated Successfully!")
    
		}
	  });

}

const countPendingTsByManagerId = async (req, res) => {

	const managerId = req.params.managerId

	await pool.query(`SELECT
	COUNT(ts_timesheet_t."id") as totalPendingTs
FROM
	ts_timesheet_t
	INNER JOIN
	staff_hierarchy
	ON 
		ts_timesheet_t.person_id = staff_hierarchy.user_id
WHERE
	status = 'entered' AND
	manager_id = $1`, [managerId],  async (err, result) => { 
			if (err) {
                console.error("Database error fetching pending timesheets:", err);
                return;
            } else {
                res.status(200).json();
            }
		})

}





export {
  
  getRejectTimeSheet,
  getApproveTimeSheet,
  getPendingTimeSheet,
  getSubordinateTime,
  approveTimesheet,
  rejectTimesheet,
  pendingTimesheet,
  countPendingTsByManagerId

  
};
