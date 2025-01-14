import { queryDatabase, pool } from "../middleware.js";

const getOrganizationByPersonId = (req, res) => {
    const personId = req.params.userID;

    const query = `
    SELECT
        organizations.*
    FROM
        organizations
        INNER JOIN
        personelle
        ON 
            organizations.org_id = personelle.org_id
    WHERE
        personelle.person_id = $1
    `;

    pool.query(query, [personId], (error, result) => {
        if (error) {
            console.error("Database error:", error);
            res.status(500).json(error);
            return;
        }

        res.status(200).json(result.rows);
    });
}


export {
    getOrganizationByPersonId
}