import xlsx from 'xlsx';
import { pool } from "../middleware.js";

const exportAllTimesheetByManager = async (req, res) => {
  const managerId = req.params.id; // Assuming managerID is passed as a URL parameter

  try {
    // Fetch timesheet data for all users managed by the specified manager
    const result = await pool.query(
      `

      SELECT
	*
FROM
	ts_timesheet_t
	INNER JOIN
	staff_hierarchy
	ON 
		ts_timesheet_t.person_id = staff_hierarchy.user_id WHERE manager_id = $1 ORDER BY id asc
      `,
      [managerId]
    );

    const timesheetData = result.rows;

    // Convert data to Excel
    const worksheet = xlsx.utils.json_to_sheet(timesheetData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Timesheets");

    // Generate buffer
    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Set headers and send the file
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=timesheets_manager_${managerId}.xlsx`
    ); 
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  } catch (error) {
    console.error("Error exporting timesheets:", error);
    res.status(500).send("Error exporting timesheets");
  }
};

export {
    exportAllTimesheetByManager,
};