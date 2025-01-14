import { queryDatabase } from "../middleware.js"; 
import { pool } from "../middleware.js";


const getTFR = (req, res) => { 
    console.log("tfr1");
    const userID = req.params.userID;
        const query = `SELECT
        (SELECT SUM(rwe_day) FROM ts_timesheet_t WHERE person_id = $1 AND ( status = 'approved' or time_til < 0 or time_flexi < 0 or time_leave < 0 or time_overtime < 0 or rwe_day < 0 )) AS totalrdo,
        (SELECT SUM(time_til) FROM ts_timesheet_t WHERE person_id = $1 AND ( status = 'approved' or time_til < 0 or time_flexi < 0 or time_leave < 0 or time_overtime < 0 or rwe_day < 0 )) AS totalTil,
        (SELECT SUM(time_flexi) FROM ts_timesheet_t WHERE person_id = $1 AND ( status = 'approved' or time_til < 0 or time_flexi < 0 or time_leave < 0 or time_overtime < 0 or rwe_day < 0 )) AS totalFlexi
    FROM
        ts_timesheet_t	
    WHERE
        person_id = $1  LIMIT 1 ;;
`

// const query = `
// SELECT
//         (SELECT SUM(rwe_day) FROM ts_timesheet_t WHERE person_id = $1 AND status = 'approved' ) AS totalrdo,
//         (SELECT SUM(time_til) FROM ts_timesheet_t WHERE person_id = $1 AND status = 'approved' ) AS totalTil,
//         (SELECT SUM(time_flexi) FROM ts_timesheet_t WHERE person_id = $1 AND status = 'approved') AS totalFlexi
//     FROM
//         ts_timesheet_t
//     WHERE
//         EXTRACT(DOW FROM work_date) IN (0, 6) AND person_id = $1  LIMIT 1 ; 
				
// `
pool.query(query, [userID], (err, result) => {
    if (err) {
        console.error("Error executing totalrdoQuery:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    console.log("tfr1      THE TOTAL TFR", result.rowCount);
    const totalrdo = result.rowCount != 0 ? result.rows[0].totalrdo : 0;
    const totalTil = result.rowCount != 0 ? result.rows[0].totaltil : 0;
    const totalFlexi = result.rowCount != 0 ? result.rows[0].totalflexi : 0;

    res.json([{ totalrdo, totalTil, totalFlexi }]);

    
   
});
}


// const updateTimesheet = async (userID, hoursType, remainingHours, dayOffOption, flexiInput, tilInput, workDate) => {
//     console.log("uts1");

//     let query;
//     let flexiQuery;
//     let tilQuery;


    


//     if (dayOffOption === "rdo") {
//         // Deduct RDO from weekend timesheets
//         query = `SELECT id, activity, EXTRACT(DOW FROM work_date) AS dayOfWeek FROM ts_timesheet_t WHERE person_id = $1 AND EXTRACT(DOW FROM work_date) IN (0, 6) ORDER BY id ASC`;
//     } else if (dayOffOption == "mix") {

       

//         query = `SELECT SUM(time_til) AS totalTil, SUM(time_flexi) AS totalFlexi FROM ts_timesheet_t WHERE person_id = $1`;

        
//         try {
//             flexiQuery = await pool.query(`SELECT id, time_flexi FROM ts_timesheet_t WHERE time_flexi > 0 AND person_id = $1`, [userID]);
//             tilQuery = await pool.query(`SELECT id, time_til FROM ts_timesheet_t WHERE time_til > 0 AND person_id = $1`, [userID]);
//         } catch (error) {
//             console.error("Error fetching flexi and til timesheets:", error);
//             return remainingHours;
//         }
//     } else {
//         query = `SELECT id, ${hoursType} FROM ts_timesheet_t WHERE person_id = $1 AND ${hoursType} > 0 ORDER BY id ASC`;
//     }
    

//     const result = await pool.query(query, [userID]);
//     const rows = result.rows;
//     // console.log(rows[0])
// try{
//     for (let i = 0; i < rows.length; i++) {
//         let id = rows[i].id;
//         let activity = rows[i].activity;

//         if (dayOffOption == "rdo" && activity != "RDO Used") {
//             // Deduct RDO day and mark the timesheet as "RDO Used"
//             await pool.query(`UPDATE ts_timesheet_t SET activity = 'RDO Used', rwe_day = -1 WHERE id = $1`, [id]);
//             remainingHours = 0;
            
//         } else if (dayOffOption == "mix") {
//             const totalFlexi = rows[0].totalflexi;
//             const totalTil = rows[0].totaltil;

//             const flexi = flexiQuery.rows;
//             const til = tilQuery.rows;

//             // console.log(flexi);
//             // console.log(til);
//             // console.log(totalFlexi)
//             // console.log(totalTil)

//             if (totalFlexi < 4) {
//                 remainingHours = remainingHours - totalFlexi;

//                 for (let i = 0; i < flexi.length; i++) {
//                     await pool.query(`UPDATE ts_timesheet_t SET time_flexi = $1 WHERE id = $2`, [0, flexi[i].id]);
                    
//                 }
            
//                 for (let i = 0; i < til.length; i++) {
//                     await pool.query(`UPDATE ts_timesheet_t SET time_til = $1 WHERE id = $2`, 
//                     [remainingHours < til[i].time_til ? til[i].time_til - remainingHours : remainingHours - til[i].time_til , remainingHours - til[i].time_til, til[i].id]);

//                     remainingHours = remainingHours < til[i].time_til ? 0 : remainingHours - til[i].time_til;

//                     if (remainingHours == 0) {
//                         break;
//                     }
//                 }
//             } else if (totalTil < 4) {
//                 remainingHours = remainingHours - totalTil;

//                 for (let i = 0; i < til.length; i++) {
//                     await pool.query(`UPDATE ts_timesheet_t SET time_til = $1 WHERE id = $2`, [0, til[i].id]);
//                 }

//                 for (let i = 0; i < flexi.length; i++) {
//                     await pool.query(`UPDATE ts_timesheet_t SET time_flexi = $1 WHERE id = $2`, 
//                     [ remainingHours < flexi[i].time_flexi ? flexi[i].time_flexi - remainingHours : remainingHours - flexi[i].time_flexi, flexi[i].id]);
//                     remainingHours = remainingHours < flexi[i].time_flexi ? 0 : remainingHours - flexi[i].time_flexi;

//                     if (remainingHours == 0) {
//                         break;
//                     }
//                 }
//             } else {
               
//                 for (let i = 0; i < til.length; i++) {
//                     let remainingTil = 4;
                  
//                     if(til[i].time_til < remainingTil) {
//                         await pool.query(`UPDATE ts_timesheet_t SET time_til = $1 WHERE id = $2`, [0, til[i].id]);
//                         remainingTil = remainingTil - til[i].time_til
//                     } else { 
//                         await pool.query(`UPDATE ts_timesheet_t SET time_til = $1 WHERE id = $2`, [til[i].time_til - remainingTil, til[i].id]);
//                         remainingTil = 0
//                     }

//                     if(remainingTil == 0) {
                        
//                         break
//                     }

//                 }

//                 for (let i = 0; i < flexi.length; i++) {

//                     let remainingFlexi = 4;
                  
//                     if(flexi[i].time_flexi < remainingFlexi) {
//                         await pool.query(`UPDATE ts_timesheet_t SET time_flexi = $1 WHERE id = $2`, [0, flexi[i].id]);
//                         remainingFlexi = remainingFlexi - flexi[i].time_flexi
//                     } else { 
//                         await pool.query(`UPDATE ts_timesheet_t SET time_flexi = $1 WHERE id = $2`, [flexi[i].time_flexi - remainingFlexi, flexi[i].id]);
//                         remainingFlexi = 0
//                     }

//                     if(remainingFlexi == 0) {
                        
//                         break
//                     }
                   
//                 }
                
//                 remainingHours = 0

//                 if (remainingHours == 0) {
//                     break;
//                 }

//             }
//         } else if (hoursType) {
//             let time = rows[i][hoursType];
//             let updatedTime = 0;

//             if (time <= remainingHours) {
//                 updatedTime = 0;
//                 remainingHours -= time;
//             } else {
//                 updatedTime = time - remainingHours;
//                 remainingHours = 0;
//             }

//             await pool.query(`UPDATE ts_timesheet_t SET ${hoursType} = $1 WHERE id = $2`, [updatedTime, id]);
//         }

//         if (remainingHours === 0) {
//             break;
//         }
//     }
// }catch (error) {
//     console.error("Error updating timesheet:", error);
//     // throw { message: error.message }; // Throw the error message as JSON
// }

//     return remainingHours;
// };


const updateTimesheet = async (userID, hoursType, remainingHours, dayOffOption, flexiInput, tilInput, workDate) => {
    console.log("uts1");

    let query;
    let flexiQuery;
    let tilQuery;



}



const postDayOff = async (req, res) => {
    console.log(req.body);
    const userID = req.params.userID;
    const { dayOffOption, workDate, flexiInput, tilInput, paidHour } = req.body;

    let workActivity;
    let remainingHours = paidHour;
    let query;

    try {
        switch (dayOffOption) {
            case "flexi":
                workActivity = "Day Off Using Flexi Time";
                query = `INSERT INTO ts_Timesheet_t (time_flexi, person_id, work_date, activity, t_comment, status) VALUES ($1, $2, $3, 'Flexi Variance Leave', 'Flexi Variance Leave', 'entered')`;
                await pool.query(query, [flexiInput, userID, workDate]);
                break;
            case "til":
                workActivity = "Day Off Using TIL Time";
                query = `INSERT INTO ts_Timesheet_t (time_til, person_id, work_date, activity, t_comment, status) VALUES ($1, $2, $3, 'Til Variance Leave', 'Til Variance Leave', 'entered')`;
                await pool.query(query, [tilInput, userID, workDate]);
                break;
            case "rdo":
                workActivity = "Day Off Using RDO";
                query = `INSERT INTO ts_timesheet_t (rwe_day, activity, t_comment, status, work_date, person_id) VALUES (-1, 'RDO Leave', 'RDO Leave', 'entered', $1, $2)`;
                await pool.query(query, [workDate, userID]);
                break;
            case "mix":
                workActivity = "Day Off Using Mix Time";
                query = `INSERT INTO ts_Timesheet_t (time_flexi, time_til, person_id, work_date, activity, t_comment, status) VALUES ($1, $2, $3, $4, 'Mix Variance Leave', 'Mix Variance Leave', 'entered')`;
                await pool.query(query, [flexiInput, tilInput, userID, workDate]);
                break;
            default:
                break;
        }

        res.status(200).json({ message: "Day off recorded successfully" });
    } catch (error) {
        console.error("Error posting day off:", error);
        return res.status(500).json({ message: error.message });
    }
};



const getIndividualTimesheetsById = async (req, res) => {
    const userId = req.body.userID;
    const ts_Id = req.params.id

    const timesheetQuery = `SELECT
	"location".location_name, 
	ts_timesheet_t.*
FROM
	ts_timesheet_t
	INNER JOIN
	"location"
	ON 
		ts_timesheet_t.location_id = "location".location_id
WHERE
	ts_timesheet_t."id" = $1
 AND
	ts_timesheet_t.person_id = $2`;

    const values = [ts_Id , userId];

    try {
        const { rows } = await pool.query(timesheetQuery, values);
        res.status(200).json({ timesheets: rows });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: error.message });
    }
}

const getPendingIndividualTimesheet = (req , res) => { 
   
    const ts_Id = req.params.id
    const work_date = req.query.work_date
    
    const query = `
    SELECT
	ts_timesheet_t.*
FROM
	ts_timesheet_t
WHERE
	ts_timesheet_t.status <> 'approved' AND id = $1 AND work_date = $2
    `

    pool.query(query, [ts_Id, work_date], (err, result)=> { 
        if(!err){ 
            console.log("tsData", result.rows)
            res.status(200).json(result.rows);
        } else { 
            res.status(500).json(err);
        }
    });
}

const checkTimesheetExist = async (req, res) => { 
    
    const userId = req.body.userID 
    const date = req.body.date

    const timesheetQuery = `SELECT id FROM ts_timesheet_t WHERE work_date = $1 AND person_id = $2`;
    const values = [date, userId];
    console.log('the date', date)

    try {
        const { rows } = await pool.query(timesheetQuery, values);
        console.log('the rows', rows)
        if (rows.length > 0) {
            res.status(200).json({ timesheetExists: true });
        } else {
            res.status(200).json({ timesheetExists: false });
        }
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: error.message });
    }
}


const editTimesheet = async (req, res) => {
  console.log("ct1   ");
  const {
    person_id,
    username,
    work_date, 
    time_start,
    time_finish,
    time_total,
    time_flexi,
    time_til,
    time_leave,
    time_overtime,
    time_comm_svs,
    t_comment,
    location_id,
    activity,
    notes,
    time_lunch,
    time_extra_break,
    fund_src,
    variance,
    variance_type,
    entry_date,
    rwe_day,
    duty_category,
    status,
    on_duty,
  } = req.body;

  const ts_id = req.params.id;
  
  try {
    const { rows } = await pool.query("SELECT * FROM ts_timesheet_t WHERE id = $1", [ts_id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Timesheet not found" });
    }

    const query = `UPDATE ts_timesheet_t SET 
      person_id = $1, 
      username = $2, 
      work_date = $3, 
      time_start = $4, 
      time_finish = $5, 
      time_total = $6, 
      time_flexi = $7, 
      time_til = $8, 
      time_leave = $9, 
      time_overtime = $10, 
      time_comm_svs = $11, 
      t_comment = $12, 
      location_id = $13, 
      activity = $14, 
      notes = $15, 
      time_lunch = $16, 
      time_extra_break = $17, 
      fund_src = $18, 
      variance = $19, 
      variance_type = $20, 
      entry_date = $21, 
      duty_category = $22, 
      "status" = $23, 
      on_duty = $24, 
      rwe_day = $25 
    WHERE id = $26 
    RETURNING id`;
    const values = [
      person_id,
      username,
      work_date,
      time_start,
      time_finish,
      time_total,
      time_flexi,
      time_til,
      time_leave,
      time_overtime,
      time_comm_svs,
      t_comment,
      location_id,
      activity,
      notes,
      time_lunch,
      time_extra_break,
      fund_src,
      variance,
      variance_type,
      entry_date,
      duty_category,
      status,
      on_duty,
      rwe_day,
      ts_id
    ];

    const updateResult = await pool.query(query, values);

    console.log("ct9 Successfully updated timesheet with ID:", timesheetId);
    return res.status(200).json({
      id: timesheetId,
      message: `Updated timesheet with ID ${timesheetId}`,
    });
  } catch (error) {
    console.error("Error updating timesheet:", error);
    return res.status(500).json({ error: "Error updating timesheet" });
  }
};


const getTimesheetById = (req ,res ) => {

    const tsId = req.params.id

    const query = `
    SELECT
	*
FROM
	ts_timesheet_t
	INNER JOIN
	staff_hierarchy
	ON 
		ts_timesheet_t.person_id = staff_hierarchy.user_id
	WHERE 
	
	ts_timesheet_t.id = $1`

    pool.query(query, [tsId], (err, result) => {

        if(err) { 
            return res.status(500).json(err)
        } else { 
            return res.status(200).json(result.rows);
        }
    })

}

const submitTimesheetStatus = (req, res) => {
    
    const ts_id = req.params.id;
    const draft = req.body.draft;
    let query;

     console.log("the draft0", draft)

    if(draft == 'true') {
         query = `UPDATE ts_timesheet_t SET status = 'draft' WHERE id = $1`;    
    } else {
         query = `UPDATE ts_timesheet_t SET status = 'entered' WHERE id = $1`;
    }

    pool.query(query, [ts_id], (err, result) => {
        if(err) {
            return res.status(500).json(err)
        } else {
            return res.status(200).json({ message: "Timesheet submitted successfully to draft" });
        }
    })
}


const submitMultipleTimesheetStatus = (req, res) => {
    console.log(req.body.ts_Ids)
    const ts_ids = req.body.ts_Ids.split(',').map(id => parseInt(id));
    const draft = req.body.draft;
    const userId = req.params.userId; // Assuming userId is a parameter in the request

    console.log("Received request to submit multiple timesheets with IDs:", ts_ids, "and draft status:", draft, "for user ID:", userId);

    let query;

    // First, check if all timesheets belong to the same user_id
    const checkUserIdQuery = `SELECT person_id FROM ts_timesheet_t WHERE id = $1 AND person_id = $2`;
    let allSameUserId = true;
    let promises = ts_ids.map(id => {
        return new Promise((resolve, reject) => {
            pool.query(checkUserIdQuery, [id, userId], (userIdErr, userIdResult) => {
                if (userIdErr) {
                    console.error("Error checking user IDs:", userIdErr);
                    reject(userIdErr);
                } else if (userIdResult.rows.length === 0) {
                    allSameUserId = false;
                    console.log("Not all timesheets belong to the same user ID.");
                    reject({ message: "One or more timesheets do not belong to the specified user." });
                }
                resolve();
            });
        });
    });

    Promise.all(promises)
        .then(() => {
            if (allSameUserId) {
                // Check if all timesheets are in pending or entered status
                const checkStatusQuery = `SELECT status FROM ts_timesheet_t WHERE id = ANY($1)`;
                pool.query(checkStatusQuery, [ts_ids], (err, result) => {
                    if (err) {
                        console.error("Error checking timesheet statuses:", err);
                        return res.status(500).json(err);
                    } else {
                        const statuses = result.rows.map(row => row.status);
                        console.log("Timesheet statuses found:", statuses);
                        const allPendingOrEntered = statuses.every(status => status === 'draft' || status === 'entered');
                        if (!allPendingOrEntered) {
                            console.log("Not all timesheets are in pending or entered status.");
                            return res.status(400).json({ message: "One or more timesheets are not in pending or entered status." });
                        } else {
                            // Update the status of all timesheets
                            query = `UPDATE ts_timesheet_t SET status = $2 WHERE id = ANY($1)`;
                            pool.query(query, [ts_ids, draft ? 'draft' : 'entered'], (updateErr, updateResult) => {
                                if (updateErr) {
                                    console.error("Error updating timesheet statuses:", updateErr);
                                    return res.status(500).json(updateErr);
                                } else {
                                    console.log("Timesheets statuses updated successfully.");
                                    return res.status(200).json({ message: "Timesheets status updated successfully." });
                                }
                            });
                        }
                    }
                });
            }
        })
        .catch(err => {
            return res.status(500).json(err);
        });


}
  



export {
    getTFR , 
    postDayOff, 
    checkTimesheetExist,
    getIndividualTimesheetsById,
    getTimesheetById,
    getPendingIndividualTimesheet,
    editTimesheet,
    submitTimesheetStatus,
    submitMultipleTimesheetStatus
}