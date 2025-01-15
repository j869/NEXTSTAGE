//#region imports
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local"; //import { Strategy as LocalStrategy } from 'passport-local';
import bodyParser from "body-parser";
import { body, validationResult } from "express-validator";
import helmet from "helmet";
import axios from "axios";
import bcrypt from "bcrypt";
import env from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";
import flash from "express-flash";
import { error } from "console";
import path from "path";

// ROUTES IMPORts
// ROUTES IMPORTS
import createLocationRoutes from "./routes/locationRoutes.js";
import createActivityRoutes from "./routes/activityRoutes.js";
import createTimesheetRoutes from "./routes/timeSheetsRoutes.js";
import createFundSourceRoutes from "./routes/fundSourcesRoutes.js";
import createManagerRoutes from "./routes/managerRoutes.js";
import { userInfo } from "os";
import createProfileRoutes from "./routes/profileRoutes.js";
import createNotificaitonRoute from "./routes/notificationRoutes.js";
import handleError from "./utils/handleError.js";
import {logEvent, logUser} from "./utils/logging.js";
import createResetPasswordRoutes from "./routes/resetPasswordRoutes.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();

// Serve static files
app.use(express.static(__dirname + "/public"));

// Middleware to set the correct MIME type for CSS files
app.use((req, res, next) => {
  if (req.url.endsWith(".css")) {
    res.header("Content-Type", "text/css");
  }
  next();
});

const API_URL = "http://localhost:4000";
const saltRounds = 10;
env.config();
if (process.env.SESSION_SECRET) {
  logEvent(null, 'en2     -- server has started - node is working ------------------------------------------');
  console.log('en2     server has started - node is working');
} else {
  console.log("en8    you must run nodemon from Documents/ntimes/  : ",process.cwd()   );
  console.log("       rm -R node_modules");
  console.log("       npm cache clean --force");
  console.log("       npm i");
}

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days in milliseconds
  })
);

app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

// Pass the config object to all EJS templates
const config = {
  baseUrl: process.env.BASE_URL, // 'http://localhost:3000'
};
app.use((req, res, next) => {
  res.locals.config = config;
  next();
});


// ERROR PAGE HANDLER 






// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  console.log(`iau1     our website is loaded on this (${req.ip}) browser `);
  if (req.isAuthenticated()) {
    console.log("iau9    user is authenticated");
    return next();
  }
  console.log("iau8    user is not authenticated");
  res.redirect("/login");
};

const isAdmin = (req, res, next) => {
  console.log("iad1");
  if (req.user && req.user.role === "admin") {
    console.log("iad2    user is not admin");
    return next();
  } else {
    console.log("iad3   user is admin");
    console.log("iad3 STATUS: PERMISSION DENIED");
    return res.redirect("/login");
  }
};

app.get("/", (req, res) => {
  const userInfo = req.session.userInfo;

  console.log("z1     THE USER INFO, ", userInfo);

  const username =
    req.user && req.user.username ? " for " + req.user.username : "[]";
  console.log("z9    Home ");
  res.render("home.ejs", {
    userInfo: userInfo,
    user: req.user,
    title: "Home",
    body: "",
  });
});


app.get("/tasks", (req, res) => {
  const userInfo = req.session.userInfo;

  console.log("z1     THE USER INFO, ", userInfo);

  const username =
    req.user && req.user.username ? " for " + req.user.username : "[]";
  console.log("z9    Home ");
  res.render("tasks/dashboard.ejs", {
    tasks : [],
    userInfo: userInfo,
    user: req.user,
    title: "Home",
    body: "",
  });
});

//#endregion


//--------------------------------
//----  Authenticated users
//-------------------------------
//#region regular users

const runManager = (req, res, next) => {
  console.log("rm1    allowing routes ");
  const userInfo = req.session.userInfo;

  const allowedRoutes = [
    "/notification",
    "/notification/delete/:id",
    "/notification/fetch",
    "/notification/unseen",
    "/notification/markAsSeen",
    "/notification/seen",
    "/timesheet/approveManager",
    "/timesheet/pending",
    "/timesheet/data",
    "/timesheet/data",
    "/timesheet/approved",
    "/timesheet/rejected",
    "/timesheet/approveTs",
    "/timesheet/multipleApproveTs",
    "/timesheet/multipleRejectTs",
    "/timesheet/multiplePendingTs",
    "/timesheet/rejectTs",
    "/timesheet/pendingTs",
    
    "/time",
    "/profile", 
    "/profile/update",
    "/profile/check",
     "/profile/editDefaultTime",
    "/emergencyEntry",
    "/timesheetEntry",
    "/deleteTimesheet/:id",
    "/plannedLeave",
    "/login",
    "/logout",
    "/reportBug"
    
   
  ];

  if (userInfo != undefined && userInfo.position == "manager") {
    app.use("/timesheet", createManagerRoutes(isAuthenticated));
    console.log( "rm3    allowing manager routes ");

    if (
      allowedRoutes.includes(req.path) ||
      req.path.startsWith("/deleteTimesheet/") ||
      req.path.startsWith("/timesheets/") ||
    
     
      req.path.startsWith("/notification/delete/") 

    ) {
      next();
    } else {
      // res.status(403).json({ messages: ["Permission denied"] });
    console.log("iad4 STATUS: PERMISSION DENIED")

      return res.redirect("/login");
      
    }
    // console.log("rm4    ");
  } else {
    console.log("rm91    ");
    next();
  }
  console.log("rm9    ");

};
app.use(runManager);

// NOTIFICATION ROUTER HEREss
app.use("/notification", createNotificaitonRoute(isAuthenticated));

// PROILE ROUTE HERE
app.use("/profile", createProfileRoutes(isAuthenticated));

// LOCATION MANAGER ROUTES HERE
app.use("/locationManager", createLocationRoutes(isAuthenticated));
// PAGE LOCATION MANAGER ROUTES ENDS

// ACTIVIY MANAGER ROUTES
app.use("/activity", createActivityRoutes(isAuthenticated));
// ACTIVIYT MAGER ROUTES ENDS

// TIMESHEETS ROUTES
app.use("/timesheets", createTimesheetRoutes(isAuthenticated));

// FUND SOURCS ROUTES
app.use("/fundSource", createFundSourceRoutes(isAuthenticated));



app.use("/passwordReset", createResetPasswordRoutes(isAuthenticated));




app.get("/settings", isAuthenticated, async (req, res) => {
  try {
    console.log("set1   ");
    res.render("settings.ejs", {
      title: "Settings",
      user: req.user,
      userInfo: userInfo,
      messages: req.flash("messages"),
    });
    console.log("set9   ");
  } catch (error) {
    handleError(error, req, res);
    res.redirect("/");
  }
});


app.get("/time", isAuthenticated, async (req, res) => {
  const userInfo = req.session.userInfo;

  console.log("z1     THE USER INFO, ", userInfo);

  const username =
    req.user && req.user.username ? " for " + req.user.username : "[]";
  console.log("z9    Home ");
  res.render("home.ejs", {
    userInfo: userInfo,
    user: req.user,
    title: "Home",
    body: "",
  });

});



const isValidTimeFormat = (value) => {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value); // Custom validation function for time format (hh:mm)
};






//#endregion

//--------------------------------
//---  Admin functions
//-------------------------------
//#region admin

app.get("/users", isAdmin, async (req, res) => {
  try {
    console.log("u1    Admin route: Rendering settings page...");
    
    const data = await axios.get(`${API_URL}/users/userInfo/${req.user.id}`);

    if(data.data[0] == undefined ) {
        return res.redirect('/profile?status=noOrganization');
    }

    if(data.data[0].org_id == undefined || data.data[0].org_id == null ) {
       return res.redirect('/profile?status=noOrganization');
    }

    const result = await axios.get(`${API_URL}/usersByOrg/${data.data[0].org_id}`);
    console.log("u2    ", result.data);

    res.render("settings.ejs", {
      user: req.user,
      userInfo: data.data[0],
      users: result.data,
      title: "Users",
      messages: req.flash("messages"),
    });

    console.log("u9  all users displayed on screen ");
  } catch (error) {
    console.error("Error in /users route:", error);
    handleError(error, req, res);
  }
});


app.get("/users/:id", isAuthenticated, async (req, res) => {
  console.log("v1      Protected route: Fetching user data...", req.params);
  // if (req.isAuthenticated()) {
  try {
    console.log(`v2      ${API_URL}/users/${req.user.id}`);
    const response = await axios.get(`${API_URL}/users/${req.user.id}`);
    
    const q = response.data[0];
    const { password, ...userData } = q; //remove password from being sent
    console.log("v3    ", userData);
    //res.send(response.data);
    const errors = req.flash("messages");
    const messages = errors.map((error) => error.msg);

    res.render("profile.ejs", {
      title: "Edit Profile",
      user: req.user,
      userData,
      messages,
    });
    console.log("v4 ");
  } catch (error) {
    console.error("Error fetching user data:", error);
    
    console.log("v7 ");

    handleError(error, req, res)
  }
  // } else {
  //     res.redirect("/login");
  // }
  console.log("v9 user " + req.params.id + " returned ok");
});

// Custom validation middleware to limit character count
const characterLimit = (field, limit) => {
  return body(field).custom((value) => {
    if (value.length > limit) {
      throw new Error(`${field} is too long`);
    }
    return true;
  });
};

app.post(
  "/addUser",
  isAdmin,
  [
    // Validate request body
    characterLimit("username", 31).withMessage(
      "Username must be less than 31 characters"
    ),
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
    body("role").notEmpty().withMessage("Role is required"),
  ],
  async (req, res) => {

    
    try {

      const data = await axios.get(`${API_URL}/users/userInfo/${req.user.id}`);

      if(data.data[0] == undefined ) {
          return res.redirect('/profile?status=noOrganization');
      }
  
      
      if(data.data[0].org_id == undefined || data.data[0].org_id == null ) {
         return res.redirect('/profile?status=noOrganization');
      }

      

      console.log("pau1   add user ", req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("pau2");
        //req.flash('messages', errors.array());
        return res.redirect("/users");
      }

      const { username, email, password, role } = req.body;
      const userData = {
        org_id: data.data[0].org_id,
        username,
        email,
        password,
        role,
        verificationToken: "added by " + req.user.username,
        verified_email: true,
      };
      console.log("pau3");

      // Register the user using the registerUser function
      const userID = await registerUser(userData).catch((error) => {
        if (error.response && error.response.status === 400) {
          return res.redirect("/users?status=400");
        } else {
          throw error;
        }
      }); 

      // await axios.put(`${API_URL}/users/addOrganizationToPersonelle`, {
      //   person_id: userID,
      //   position: 'user',
      //   org_id: data.data[0].org_id,
      // })
      
      console.log("pau4");

      req.flash("messages", "User added successfully");
      console.log("pau9");
      return res.redirect("/users");
    } catch (error) {
      console.error("pau8    Error adding user:", error);
      // res.status(500).send("Error adding user");
      handleError(error, req, res)
    }
  }
);

app.post("/editUser", isAdmin, async (req, res) => {
  console.log("p1 Request Body:", req.body);

  try {
    const { userID, username, email, password, role } = req.body;
    let userData = {
      userID,
      username,
      email,
      password,
      role,
      verificationToken: "updated by " + req.user.username,
      verified_email: true,
    };
    console.log("p2 ", userData);

    // If password is provided, hash it
    if (password !== "") {
      userData.password = await bcrypt.hash(password, saltRounds);
      console.log("p3 Hashed password:", userData.password);
    } else {
      const { password, ...rest } = userData; // Remove password from being sent
      userData = rest;
    }

    console.log(`p4 ${API_URL}/users/${userID}`, userData);

    // Update the user using the PUT request
    const result = await axios.put(`${API_URL}/users/${userID}`, userData);
    console.log("p5 Updated user:", result.data);

    req.flash(
      "messages",
      "User updated. Skipped email verification. Ensure that the correct email was used."
    );

    res.redirect("/users");
  } catch (error) {
    console.error("Error updating user information:", error);
    // res.status(500).send("Internal server error");
    handleError(error, req, res)
  }
});
//#endregion

//-------------------------------------------------
//---  Passport code and authorisation middleware
//-------------------------------------------------
//#region Authorisation


app.get("/login", async (req, res) => {
  try {
    console.log( "li1     rendering login page");
    // const errors = req.flash('messages');
    // console.log("li2     messages : ", errors);
    // res.render('login.ejs', { user: req.user, title: 'numbat', body: '', messages: errors });
    const defaultEmail = process.env.DEFAULT_USER || "";
    res.render("login.ejs", {
      defaultEmail,
      user: req.user,
      title: "numbat",
      body: "",
      query: req.query,
      messages: req.flash("messages"),
    });
    console.log( "li9   ");
  } catch (error) {
    handleError(error, req, res);
  }
});


app.post("/login", async function (req, res, next) {
  try {
    const reqIp = req.ip || 'unknownIP';
    logEvent(req, "lg2     " + req.ip + " is trying to login ");
    passport.authenticate("local", async function (err, user, info) {
      try {
        if (err) {
          console.log("lg12   ", err);
          throw err;
        }
        if (!user) {
          console.log("lg13   ", info);

          if (info && info.messages[0] === "Incorrect password.") {
            req.flash(
              "messages",
              "Invalid username or password. Please try again."
            );
          } else {
            req.flash(
              "messages",
              "Email has not been verified. Please check your email for the verification link."
            );
          }
          return res.redirect("/login");
        }

        req.logIn(user, async function (err) {
          try {
            if (err) {
              console.log("lg20   ", err);
              throw err;
            }

            console.log("lg3   ");
            try {
              console.log("lg32  ")
              const isManager = await axios.get(
                `${API_URL}/users/userInfo/${req.user.id}`
              );

              console.log("lg31   user is a manager? ", isManager.data[0].email);

              req.session.userInfo = isManager.data[0];
              
              if (req.session.userInfo === undefined) {
                await axios.put(`${API_URL}/users/addPersonelleInfo/${req.user.id}`);
              }
              console.log("lg32    regular user ", req.user.email);
              let sessionID = req.session.id || 'unknownSessionID' 
              let userID = req.user.id  || 'unknownUserID'
              let reqIP = req.ip || 'unknownIP'
              logEvent(req, "lg33    successfull log in as " + userID + " from " + reqIP + " session " + sessionID ) 
              logUser(req, "lg33    successfull log in as " + userID + " from " + reqIP + " session " + sessionID ) 

              if (
                req.session.userInfo &&
                req.session.userInfo.position === "manager"
              ) {
                console.log("lg40   ");
                return res.redirect("/time");
              }
              console.log("lg94   ");

              return res.redirect("/time");
            } catch (error) {
              console.log("lg32   ", error);
              throw error;
            }
          } catch (error) {
            console.error("Error logging in user:", error);
            handleError(error, req, res);
          }
        });
      } catch (error) {
        console.error("Error authenticating user:", error);
        handleError(error, req, res);
      }
    })(req, res, next);
    console.log("lg95 ")

  } catch (error) {
    console.log("lg8    Error in login route:");
    handleError(error, req, res);
  }
});


app.get("/logout", (req, res) => {
  try {
    console.log("lo1    user is logging out");
    
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.redirect("/login"); // Or handle the error appropriately
      }
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
        }
        res.clearCookie('connect.sid'); // 'connect.sid' is the default cookie name for express-session
        res.redirect("/login");
      });
    });
  } catch (error) {
    console.error("Error logging out user:", error);
    handleError(error, req, res);
  }
});


app.get("/register", (req, res) => {
  try {
    console.log("r1");
    res.render("register.ejs", {
      title: "Register",
      user: req.user,
      messages: req.flash("messages"),
    });
  } catch (error) {
    console.error("Error rendering register page:", error);
    handleError(error, req, res);
  }
});

const registerUser = async (userData, orgID) => {
  try {
    let {org_id, username, email, password, role, verificationToken, verified_email } =
      userData;
    console.log("ru1 ", userData);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("ru2 ", hashedPassword);


    // Generate a verification token
    if (!verificationToken) {
      verificationToken = generateToken();
      console.log("ru3 ", verificationToken);
    }
    if (verified_email !== true) {
      verified_email = null;
      console.log("ru4   verified_email=null");
    }
    if (!username && !email) {
      throw new Error("Must have username or email");
    }
    if (!email) {
      email = username;
    }
    if (!username) {
      username = email;
    }
    // if (!role) {
     role = "user"
    // }
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    // Insert a new user record into the users table with the verification token
    const result = await axios.post(`${API_URL}/users`, {
      username,
      org_id,
      email,
      password: hashedPassword,
      role,
      verificationToken,
      verified_email,

    });

    // Extract the newly inserted user_id from the result
    const userID = result.data.id;
    console.log("ru5 ", userID);

    // Send verification email
    if (verified_email !== true) {
      const transporter = nodemailer.createTransport({
        host: "cp-wc64.per01.ds.network",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: "john@buildingbb.com.au",
        to: email,
        subject: "Please verify your email address",
        text: `Click the following link to verify your email address: ${process.env.BASE_URL}/verify?token=${verificationToken}`,
      });
      console.log("ru6 user registered. check your email ");
    }

    return userID;
  } catch (error) {
    // if (error.response && error.response.status === 400) {
    //   // Email already registered
    //   console.log("ru7 Error: ", error.response);
    //   throw new Error("Email already registered");
    // } else if (error.response && error.response.status === 500) {
    //   console.log("ru8 ");
    // } else {
    //   console.log("ru9 ");
    //   throw error; // Other errors
    // }

    handleError(error, req, res)
  }
};

// Handler for registration form submission
app.post("/register", async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log("gp1   ", req.body);
    await registerUser({ email, password, role: "user",  });
    //req.flash('messages', 'User registered successfully. Please check your email for verification.');
    req.flash(
      "messages",
      "Please check your email for verification."
    );

    
    console.log("gp9 registered user ok");
    res.redirect("/login");
  } catch (error) {
    if (error.message === "Email already registered") {
      console.log("gp8 already reg'd");
      return res.render("register.ejs", {
        user: req.user,
        messages: ["This email is already registered"],
        title: "Register",
      });
    } else {
      // console.log("gp7 db error");
      // console.error("Error during registration:", error);
      // return res.status(500).send("Error registering user");

      handleError(error, req, res);
    }
  }
});

// Route for handling email verification
app.get("/verify", async (req, res) => {
  console.log("ve1");
  try {
    const { token } = req.query;
    console.log("ve2");

    // Update the user's email verification status in the database
    console.log(`ve3    Fetching user: ${API_URL}/verify/${token}`);
    const result = await axios.put(`${API_URL}/verify/${token}`);

    // Check if the email verification was successful
    if (result.status === 200) {
      console.log("ve4");
      req.flash("messages", "Email verified successfully. You can now log in");
      console.log("ve5 Email verified successfully. You can now log in");
      return res.redirect("/login");
    } else if (result.status === 409) {
      console.log("ve6 Email has already been verified");
      req.flash("messages", "Email has already been verified");
      return res.redirect("/login"); // Redirect to the login page or handle as appropriate
    } else {
      console.log("ve7 unknown error");
      req.flash("messages", "Error verifying email");
      return res.redirect("/login"); // Redirect to the login page or handle as appropriate
    }
  } catch (error) {
    console.log("ve9");
    console.error("Error verifying email:", error);
    req.flash("messages", "Error verifying email");
    return res.redirect("/login"); // Redirect to the login page or handle as appropriate
  }
});

// varify email on user registration
function generateToken() {
  // generate a random token
  return crypto.randomBytes(20).toString("hex");
}

// Passport configuration
passport.use(
  "local",
  new Strategy(async function verify(email, password, cb) {
    console.log("ps0    LocalStrategy: Authenticating user...");
    logEvent(null, "ps2     attempted to authenticate as " + email + "");

    try {
      //const result = await db.query("SELECT password, verified_email FROM users WHERE email = $1 ", [                username,            ]);
      console.log(`ps1     `, email); //Fetching user: ${API_URL}/login/${username}
      const result = await axios.get(`${API_URL}/login/${email}`);
      console.log("ps2     ");

      const user = result.data[0];

      //check if user is verified
      const emailVerified = user.verified_email;
      console.log("ps4");
      if (!emailVerified) {
        console.log("ps5     email has not been verified - login failed");
        return cb(null, false, { messages: "Email has not been verified." });
      }

      // Compare passwords
      console.log("ps6");
      const storedHashedPassword = user.password;
      const valid = await bcrypt.compare(password, storedHashedPassword); 

      console.log("ps7");
      if (valid) {
        console.log("ps10 password correct");
        return cb(null, user, { messages: ["Success."] });
      } else {
        console.log("ps11");
        return cb(null, false, { messages: ["Incorrect password."] });
      }
    } catch (err) {
      console.log("ps13   ");

      if(err.response.status == 500) {
        console.log("ps14    server Error, check for duplicate user");
        return cb(null, false, { messages: ["Server Error"] });
      }
      // Check for status 404 User not found
      if (err.response.status === 404) {
        console.log("ps14    Cannot find this username in the user table.");
        return cb(null, false, { messages: ["User not found."] });
      } else {
        console.log("ps15");
        console.error("Error during authentication:", err);
        return cb(err);
      }
    }
    console.log("ps16");
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

//#endregion

//------------------------------------
//---- Start the server
//-----------------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
