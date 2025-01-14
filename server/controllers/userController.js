import { queryDatabase, pool } from "../middleware.js";
import bcrypt from "bcrypt";
import { getUserScheduleById } from "./userWorkingSheduleController.js";

const getUserInfo = (req, res) => {
  console.log("inf1    params, ", req.params);
  const userId = req.params.userID;

  const query = `SELECT
	personelle.*, 
	users.username, 
	users.email, 
	users."role", 
	users."password"
FROM
	users
	INNER JOIN
	personelle
	ON 
		users."id" = personelle.person_id
WHERE
users."id" = $1`;
  console.log("inf5    query", query);
  queryDatabase(query, [userId], res, "User fetched successfully");
  console.log("inf9");
};

//STATUS if ts_user_t.role_id = 1 then it is NORMAL USER
//STATUS if ts_user_t.role_id = 2 then it is MANAGER USER

const isManager = async (req, res) => {
  console.log("gt1    params, ", req.params);
  try {
    const userId = req.params.userID;
    const query = `SELECT
        users.*, 
        personelle.*
    FROM
        personelle
        INNER JOIN
        users
        ON 
            personelle.person_id = users."id"
    WHERE
        personelle."position" = 'manager'
     AND
        users."id" = $1`;

    // const result = await pool.query(query, [userId]);
    const result = await queryDatabase(
      query,
      [userId],
      res,
      "fetched Successfully"
    );

    return result.rows.length > 0 ? true : false;
  } catch (error) {
    console.error("Error in isManager function:", error);
    return false;
  }
};

const checkUserExist = async (req, res) => {
  console.log("ck1     params, ", req.params);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    // console.log(user.rows)

    if (!user) {
      return res.status(200).json({ exists: false });
    }

    //   console.log(user.rows[0])
    const isPasswordMatch =
      user && user.rows[0].password
        ? await bcrypt.compare(password, user.rows[0].password)
        : false;
    if (isPasswordMatch) {
      console.log("Password Match");
      return res
        .status(200)
        .json({ exists: true, user: { id: user.id, username: user.username } });
    } else {
      console.log("Password Nope");
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const editDefaultTime = async (req, res) => {
  const { startTimeInput, breakTimeInput, userId } = req.body;
  console.log("ed1");
  console.log(startTimeInput, breakTimeInput, userId);

  try {
    await pool.query(
      `UPDATE user_work_schedule SET default_time_start = $1, default_time_break = $2 WHERE user_id = $3`,
      [startTimeInput, breakTimeInput, userId]
    );
    return res.status(200).json();
  } catch (error) {
    console.error("Error updating default times:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// PROFILE PART
const editProfile = async (req, res) => {
  // console.log("req.body:", req.body);
  const { firstName, lastName, email, username, password, userId, managerID } =
    req.body;

  // console.log("req.body.firstName:", firstName);
  // console.log("req.body.lastName:", lastName);
  // console.log("req.body.email:", email);
  // console.log("req.body.username:", username);
  // console.log("req.body.password:", password);
  // console.log("req.body.userIdm:", userId);
  // console.log("req.body.managerID:", managerID);

  if (!firstName || !lastName || !email || !username) {
    return res.status(400).json({ error: "All fields must be filled out." });
  }

  // Check if the user exists in the personelle table
  const userExists = await pool.query(
    "SELECT * FROM personelle WHERE person_id = $1",
    [userId]
  );
  const checkManager = await pool.query(
    "SELECT * FROM staff_hierarchy WHERE user_id = $1 AND manager_id = $2",
    [userId, managerID]
  );
  

  // If the user does not exist, insert it
  if (!userExists.rows.length) {
    await pool.query(
      "INSERT INTO personelle (person_id, first_name, last_name) VALUES ($1, $2, $3)",
      [userId, firstName, lastName]
    );
  } else {
    await pool.query(
      "UPDATE personelle SET first_name = $2, last_name = $3 WHERE person_id = $1",
      [userId, firstName, lastName]
    );
  }

  await pool.query(
    "SELECT * FROM staff_hierarchy WHERE user_id = $1",
    [userId],
    async (err, result) => {
      console.log("uc 1 staff_hierarchy", result);
      if (!err) {
        if (result.rowCount == 0) {
          await pool.query(
            `INSERT INTO staff_hierarchy (user_id, manager_id) VALUES ($1, $2)`,
            [userId, managerID]
          );
          await pool.query(
            `UPDATE personelle SET position = 'manager' WHERE person_id = $1`,
            [managerID]
          );

          // console.log("ALKSD:LASJHD:LKASJD:LKASJDLKAJSD:KLAJSD:LKJAS:LDKJAS:LKJDA:LSKJDKL")
        } else {
          console.log("ALKSDasdasdasdasdasd", checkManager.rowCount);
          
          if (checkManager.rowCount < 1) {
            await pool.query(
              `UPDATE staff_hierarchy SET  manager_id = $1 WHERE user_id = $2`,
              [managerID, userId]
            );
            await pool.query(
              `UPDATE personelle SET position ='manager' WHERE person_id = $1`,
              [managerID]
            );

            // console.log("ALKSD:LASJHD:LKASJD:LKASJDLKAJSD:KLAJSD:LKJAS:LDKJAS:LKJDA:LSKJDKL")
            const oldManagerTitle = "Change Manager";
            const oldMangerMessage = `${firstName} ${lastName} (@${username}) assigned you as their new manager`;
            
            await pool.query(
              `
          INSERT INTO notification (title,message, sender_message, sender_title, sender_id, receiver_id, notification_type, read_status, created_at, sender_read_status, receiver_read_status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE, NOW(), FALSE, FALSE);
          `,
              [
                oldManagerTitle,
                oldMangerMessage,
                oldManagerTitle,
                oldMangerMessage,
                managerID, 
                managerID,
                "Manager Request",
              ]
            );

              
        const receiverTitle = "Assign Manager";
        const receiverMessage = `You are no longer assigned as ${firstName} ${lastName}'s (@${email}) manager`;
        const senderTitle = "Assign Manager";
        const senderMessage = `You changed your Manager`;
        const senderId = userId;
        const receiverId = result.rows[0].manager_id;
        const notificationType = "Manager Request";

        await pool.query(
          `
    INSERT INTO notification (title,message, sender_message, sender_title, sender_id, receiver_id, notification_type, read_status, created_at, sender_read_status, receiver_read_status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE, NOW(), FALSE, FALSE);
    `,
          [
            receiverTitle,
            receiverMessage,
            senderMessage,
            senderTitle,
            senderId,
            receiverId,
            notificationType,
          ]
        );
          }

        


        }

      } else {
        console.log("error in updateing or insterting the manager: ", err);
      }
    }
  );

  try {
    if (password) {
      await pool.query(
        `
          UPDATE users SET email = $1, username = $2, password = $3 WHERE id = $4
          `, [email, username, password, userId]
      );
    } else {
      await pool.query(
        `
          UPDATE users SET email = $1, username = $2 WHERE id = $3
          `, [email, username, userId]
      );
    }
    return res
      .status(200)
      .json({ success: true, message: "Profile updated successfully." });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllUserByOrg = async (req, res) => {
  // console.log("AKSJDHASJKDHASJKLDHASJKLDHAKLSJDHAKLSJHDKLAJSDHASKLJDH")
  const orgID = req.params.orgID;

  console.log("orgID: ", orgID);
  const query = `SELECT
	users."id", 
	users.username, 
	users.email, 
	personelle."position", 
	personelle.first_name, 
	personelle.last_name
FROM
	personelle
	INNER JOIN
	users
	ON 
		personelle.person_id = users."id"
		
	WHERE role = 'user' AND org_id = $1`;

  try {
    const result = await pool.query(query, [orgID]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching manager:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getManager = async (req, res) => {
  // console.log("AKSJDHASJKDHASJKLDHASJKLDHAKLSJDHAKLSJHDKLAJSDHASKLJDH")
  const orgID = req.params.orgID;

  console.log("orgID: ", orgID);
  const query = `SELECT
	users."id", 
	users.username, 
	users.email, 
	personelle."position", 
	personelle.first_name, 
	personelle.last_name
FROM
	personelle
	INNER JOIN
	users
	ON 
		personelle.person_id = users."id"
		
	WHERE position = 'manager' AND org_id = $1`;

  try {
    const result = await pool.query(query, [orgID]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching manager:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMyManager = async (req, res) => {
  const userId = req.params.userID;
  console.log("userid " + userId);

  const query = `SELECT
	users.email, 
  users.username,
	personelle.*
FROM
	staff_hierarchy
	INNER JOIN
	users
	ON 
		staff_hierarchy.manager_id = users."id"
	INNER JOIN
	personelle
	ON 
		users."id" = personelle.person_id
WHERE
	user_id = $1`;

  try {
    const result = await pool.query(query, [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching my manager:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const checkMyManger = async (req, res) => {
  const person_id = req.params.id;
  // console.log("ct4");
  pool.query(
    `
    SELECT
  staff_hierarchy.*
  FROM
  staff_hierarchy
  WHERE
  user_id = $1
  `,
    [person_id],
    (error, result) => {
      if (error) {
        console.error("Error fetching Manager:", error);
        return res.status(500).json({ error: "Error creating timesheet" });
      } else {
        res.status(200).json(result.rows);
      }
    }
  );
};

const assignManager = async (req, res) => {
  const userId = res.body.userID;
  const notificationID = res.body.notificationID;
  const managerID = res.params.managerID;

  await pool.query(
    "SELECT * FROM staff_hierarchy WHERE user_id = $1",
    [userId],
    async (err, result) => {
      if (err) {
        console.error("AssignManager getting staff error:", err);
      } else {
        if (result.rows.length == 0) {
          await pool.query(
            "INSERT INTO staff_hierarchy (user_id, manager_id) VALUES ($1, $2) ",
            [userId, managerID],
            async (err, result) => {
              if (err) {
                console.error("INSERTING MANAGER ", err);

                return;
              } else {
                console.log("Manager assigned successfully!");
              }
            }
          );
        } else {
          await pool.query(
            "UPDATE staff_hierarchy SET manager_id = $2 WHERE user_id = $1",
            [userId, managerID],
            async (err, result) => {
              if (err) {
                console.error("UPDATING MANAGER ", err);

                return;
              } else {
                console.log("Manager assigned successfully!");
              }
            }
          );
        }
      }

      const receiverTitle = "Manager Request Approved";

      const receiverMessage = `You can now manage ${firstName} ${lastName} (@${email}) timesheet Entries`;
      const senderTitle = "Manager Request Approved";
      const senderMessage = `The Manager approved your request. The manager can now manage your timesheet entries`;
      const senderId = userId;
      const receiverId = managerID;

      const approveManagerRequestQuery = `
  UPDATE notification SET 
  title = $1, message = $2, 
  sender_message = $3, 
  sender_title = $4,
  receiver_message = $5,
  receiver_title = $6, 
  sender_id = $7,
  receiver_id = $8,
  created_at = NOW(),
  sender_read_status = FALSE,
  receiver_read_status = FALSE

  WHERE notification_id = $9

  
  `;

      await pool.query(
        approveManagerRequestQuery,
        [
          receiverTitle,
          receiverMessage,
          senderMessage,
          senderTitle,
          receiverMessage,
          receiverTitle,
          senderId,
          receiverId,
          notificationID,
        ],
        (err, res) => {
          if (err) {
            console.log("Manager Approve", err);
          }
        }
      );
    }
  );
};

const checkMyManagement = (req, res) => {
  const { tsId, managerId } = req.body;

  const query = `
    SELECT
	ts_timesheet_t.id
FROM
	ts_timesheet_t
	INNER JOIN
	staff_hierarchy
	ON 
		ts_timesheet_t.person_id = staff_hierarchy.user_id
	WHERE 
	
	ts_timesheet_t.id = $1 AND manager_id = $2
    `;

  pool.query(query, [tsId, managerId], (err, result) => {
    if (err) {
      console.log("Checking management Error:", err);
      return res.status(500).json(err);
    } else {
      return res.status(200).json(result.rows);
    }
  });
};

const addPersonelleInfo = (req, res) => {
  const userId = req.params.userID;
  const query = `INSERT INTO personelle (person_id, position) VALUES ($1 , 'user')`;

  pool.query(query, [userId], (err, result) => {
    if (err) {
      console.log("Adding personelle info Error:", err);
      return res.status(500).json(err);
    } else {
      return res.status(200).json();
    }
  });
};

const addOrganizationToPersonelle = (req, res) => {
  const { person_id, position, org_id } = req.body;

  pool.query(
    `INSERT INTO personelle (person_id , position, org_id) VALUES ($1, $2, $3)`,
    [person_id, position, org_id],
    (err, result) => {
      if (!err) {
        console.log("uc1", result);
      }
    }
  );
};

// ADMIN FUNCTIONS

const adminEditUser = (req, res) => {
  const { email, username, password, userId, role } = req.body;

  console.log("req.body.email:", email);
  console.log("req.body.username:", username);
  console.log("req.body.password:", password);
  console.log("req.body.userIdm:", userId);

  if (!email || !username || !role) {
    return res
      .status(400)
      .json({ error: "Important fields must be filled out." });
  }
};

const checkValidEmail = (req, res) => {
  const email = req.body.email;
  console.log("cve1");
  // console.log("email:", email);

  const query = `
      SELECT email FROM users WHERE email = $1 
    `;

  pool.query(query, [email], (err, result) => {
    if (err) {
      console.log("Checking management Error:", err);
      console.log("cve8    error occured", err);

      return res.status(500).json(err);
    } else {
      // console.log("result.rows.length:", result.rows);

      if (result.rows.length > 0) {
        return res.status(200).json({ valid: true });
      } else {
        return res.status(200).json({ valid: false });
      }
    }
  });

  console.log("cv9");
};

const InsertResetPassToken = (req, res) => {
  const { email, token } = req.body;

  const query = `
      UPDATE users SET verification_token = $1 WHERE email = $2
    `;

  pool.query(query, [token, email], (err, result) => {
    if (err) {
      console.error("IRPT8 Error inserting reset pass token:", err);
      return res.status(500).json({ error: "Internal server error" });
    } else {
      console.log("IRPT9 Reset pass token inserted successfully!");
      return res.status(200).json();
    }
  });
};

const verifyResetPassToken = (req, res) => {
  const token = req.body.token;

  console.log("ver1        token", token);

  const query = `
      SELECT email FROM users WHERE verification_token = $1
    `;

  pool.query(query, [token], (err, result) => {
    if (err) {
      console.error("Error inserting reset pass token:", err);
      return res.status(500).json({ error: "Internal server error" });
    } else {
      if (result.rowCount > 0) {
        // console.log("asdfasdfasdfasdf a", result.rows)

        return res.status(200).json({ valid: true, token: token });
      } else {
        return res.status(200).json({ valid: false });
      }
    }
  });
};

const resetPassword = (req, res) => {
  const { password, token } = req.body;

  const query = `
      UPDATE users SET password = $1 , verified_email = true, verification_token = '' WHERE verification_token = $2
    `;
  pool.query(query, [password, token], (err, result) => {
    if (err) {
      console.error("Error resetting password:", err);
      return res.status(500).json({ error: "Internal server error" });
    } else {
      console.log("Password reset successfully!");
      return res.status(200).json();
    }
  });
};

export {
  getUserInfo,
  getAllUserByOrg,
  isManager,
  checkUserExist,
  editProfile,
  getMyManager,
  getManager,
  assignManager,
  checkMyManger,
  checkMyManagement,
  addPersonelleInfo,
  addOrganizationToPersonelle,
  adminEditUser,
  checkValidEmail,
  InsertResetPassToken,
  verifyResetPassToken,
  resetPassword,
  editDefaultTime
};
