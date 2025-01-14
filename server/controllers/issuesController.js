import { queryDatabase, pool } from "../middleware.js";

const getAllIssues = (req, res) => {
    const query = `
    SELECT
        issues.*, 
        ts_issue.ts_id
    FROM
        ts_issue
    INNER JOIN
        ts_timesheet_t
    ON 
        ts_issue.ts_id = ts_timesheet_t."id"
    INNER JOIN
        issues
    ON 
        ts_issue.issue_code = issues.issue_code`;

    queryDatabase(query, [], res, "Timesheet Issues Fetch Successfully!");
};

const scanIssues = async (req, res) => {
    const {
        person_id,
        work_date,
        time_total,
        variance,
    } = req.body;

    await pool.query(
        `SELECT
            ts_timesheet_t."id"
        FROM
            ts_timesheet_t
        WHERE
            ts_timesheet_t.person_id = $1
        AND
            ts_timesheet_t.work_date = $2`,
        [person_id, work_date],
        async (err, result) => {
            if (!err) {
                const ts_id = result.rows[0].id;
                const totalHours = parseFloat(time_total.split(':')[0]) + parseFloat(time_total.split(':')[1]) / 60;

                console.log("Timesheet ID:", ts_id);
                console.log("Total Hours:", totalHours);

                const issueCode = {
                    issue1: "issue1",
                    issue2: "issue2",
                    issue3: "issue3",
                    issue4: "issue4",
                    issue5: "issue5",
                    issue6: "issue6",
                    issue7: "issue7"
                };

                // Delete existing issues
                await pool.query(
                    "DELETE FROM ts_issue WHERE ts_id = $1",
                    [ts_id]
                );
                console.log("Deleted existing issues for ts_id:", ts_id);

                // Insert relevant issues based on conditions
                if (variance > 2) {
                    await scanIssueQueryHelper(
                        "INSERT INTO ts_issue (ts_id, issue_code) VALUES ($1, $2)",
                        [ts_id, issueCode.issue1]
                    );
                    console.log("Inserted Issue 1 (Variance > 2) for ts_id:", ts_id);
                }

                if (totalHours < 4) {
                    await scanIssueQueryHelper(
                        "INSERT INTO ts_issue (ts_id, issue_code) VALUES ($1, $2)",
                        [ts_id, issueCode.issue2]
                    );
                    console.log("Inserted Issue 2 (Total Hours < 4) for ts_id:", ts_id);
                }

                if (totalHours !== 7.6) {
                    await scanIssueQueryHelper(
                        "INSERT INTO ts_issue (ts_id, issue_code) VALUES ($1, $2)",
                        [ts_id, issueCode.issue6]
                    );
                    console.log("Inserted Issue 6 (Total Hours != 7.6) for ts_id:", ts_id);
                }

                if (totalHours > 11) {
                    await scanIssueQueryHelper(
                        "INSERT INTO ts_issue (ts_id, issue_code) VALUES ($1, $2)",
                        [ts_id, issueCode.issue3]
                    );
                    console.log("Inserted Issue 3 (Total Hours > 11) for ts_id:", ts_id);
                }

// Calculate consecutive days
let consecutiveDaysCount = 1;  // Start with 1 as the current day itself is counted
console.log("Starting calculation of consecutive days...");

await pool.query(`
    SELECT work_date, status, activity 
    FROM ts_timesheet_t 
    WHERE person_id = $1 
    ORDER BY work_date`, 
    [person_id], 
    async (err, result) => {
        if (!err && result) {
            const workDates = result.rows;
            let currentWorkDate = new Date(work_date);

            console.log("Work Dates:", workDates.map(row => new Date(row.work_date).toLocaleDateString()));
            console.log("Current Work Date:", currentWorkDate.toLocaleDateString());

            // Check previous dates (before currentWorkDate)
            for (let i = workDates.length - 1; i >= 0; i--) {
                const previousDate = new Date(workDates[i].work_date);
                const previousDiffInDays = Math.floor((currentWorkDate - previousDate) / (1000 * 60 * 60 * 24));
				
                const isPlannedLeave = workDates[i].activity == 'Approved Leave'
                const isRejected = workDates[i].status == 'reject';
                const isDayOff = ['RDO Leave', 'Mix Variance Leave', 'Til Variance Leave', 'Flexi Variance Leave'].includes(workDates[i].activity);

				// console.log('activity', workDates[i].activity);
				// console.log('status', workDates[i].status);
				// console.log("workDate", workDates[i].work_date);
                // console.log("Checking previous date:", previousDate.toLocaleDateString(), "Difference in Days:", previousDiffInDays);
                // console.log("Is Planned Leave:", isPlannedLeave, "Is Rejected:", isRejected, "Is Day Off:", isDayOff);

                if (previousDiffInDays == 1 && !isPlannedLeave && !isRejected && !isDayOff) {
                    consecutiveDaysCount++;
                    currentWorkDate = previousDate;  // Update currentWorkDate to the previous date
                } else if (previousDiffInDays > 1) {
                    break; // Stop counting if there's a gap or if it's an excluded date
                }
            }

            // Reset currentWorkDate to its original value
            currentWorkDate = new Date(work_date);
            currentWorkDate.setDate(currentWorkDate.getDate() - 1);

            // Check next dates (after currentWorkDate)
            for (let i = 0; i < workDates.length; i++) {
                const nextDate = new Date(workDates[i].work_date);
                const nextDiffInDays = Math.floor((nextDate - currentWorkDate) / (1000 * 60 * 60 * 24));
                const isPlannedLeave = workDates[i].activity == 'Approved Leave'
                const isRejected = workDates[i].status == 'reject';
                const isDayOff = ['RDO Leave', 'Mix Variance Leave', 'Til Variance Leave', 'Flexi Variance Leave'].includes(workDates[i].activity);

				// console.log('activity', workDates[i].activity);
				// console.log('status', workDates[i].status);
				// console.log("workDate", workDates[i].work_date);
                // console.log("Checking next date:", nextDate.toLocaleDateString(), "Difference in Days:", nextDiffInDays);
                // console.log("Is Planned Leave:", isPlannedLeave, "Is Rejected:", isRejected, "Is Day Off:", isDayOff);

                if (nextDiffInDays == 1 && !isPlannedLeave && !isRejected && !isDayOff) {
                    consecutiveDaysCount++;
                    currentWorkDate = nextDate;  // Update currentWorkDate to the next date
                } else if (nextDiffInDays > 1 ) {
                    break; // Stop counting if there's a gap or if it's an excluded date
                }
            }

            console.log("Final Consecutive Days Count:", consecutiveDaysCount);

            // Insert issues based on consecutive days
            if (consecutiveDaysCount >= 10) {
                await scanIssueQueryHelper(
                    "INSERT INTO ts_issue (ts_id, issue_code) VALUES ($1, $2)",
                    [ts_id, issueCode.issue4]
                );
                console.log("Inserted Issue 4 (Consecutive Days >= 10) for ts_id:", ts_id);
            } else if (consecutiveDaysCount >= 7) {
                await scanIssueQueryHelper(
                    "INSERT INTO ts_issue (ts_id, issue_code) VALUES ($1, $2)",
                    [ts_id, issueCode.issue5]
                );
                console.log("Inserted Issue 5 (Consecutive Days >= 7) for ts_id:", ts_id);
            }
        } else {
            console.log("Error during consecutive days calculation:", err);
        }
    }
);
				
                // Issue 7: Variance less than 0
                if (variance < 0) {
                    await scanIssueQueryHelper(
                        "INSERT INTO ts_issue (ts_id, issue_code) VALUES ($1, $2)",
                        [ts_id, issueCode.issue7]
                    );
                    console.log("Inserted Issue 7 (Variance < 0) for ts_id:", ts_id);
                }
            } else {
                console.log("Error during initial timesheet fetch:", err);
            }
        }
    );

    res.end(); // End the response to prevent loading
};

const scanIssueQueryHelper = (query, params) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (err) => {
            if (err) {
                console.log("Error during issue insertion:", err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export { getAllIssues, scanIssues };
