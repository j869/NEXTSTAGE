import { pool } from "../middleware.js";

const getAllHolidays = (req, res) => {
    console.log("ph1");
    const query = `
        SELECT 
            id, 
            holiday_name, 
            to_char(holiday_date, 'YYYY-MM-DD') AS holiday_date
        FROM 
            "public_holidays"
    `;

    pool.query(query, [], (error, result) => {
        if (error) {
            console.error("Database error:", error);
            res.status(500).json(error);
        } else {
            console.log("ph2");

            // Convert date strings back to Date objects if needed
            const holidays = result.rows.map(row => ({
                ...row,
                holiday_date: new Date(row.holiday_date + 'T00:00:00Z') // Assuming dates are at midnight UTC
            }));

            res.status(200).json(holidays);
            console.log('public holiday', holidays);
        }
    });
};

export { 
    getAllHolidays
};
