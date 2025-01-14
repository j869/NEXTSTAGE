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
  console.log("t1    direct user to the main calendar view ");
  logUser(req, "t1    open main calendar view ");
  try {
    const result = await axios.get(`${API_URL}/timesheets/${req.user.id}`);
    const publicHolidays = await axios.get(`${API_URL}/publicHolidays`);

    // console.log("THE PUBLIC HOLIDAYS", publicHolidays.data);
    const flexTilRdo = await axios.post(`${API_URL}/tfr/${req.user.id}`);

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { day: "2-digit", month: "short", year: "numeric" };
      return date.toLocaleDateString("en-US", options);
    };

    const filteredData = result.data.map((entry) => ({
      id: entry["id"],
      work_date: formatDate(entry["work_date"]),
      time_start: entry["time_start"],
      time_finish: entry["time_finish"],
      time_total: entry["time_total"],
      time_flexi: entry["time_flexi"],
      time_accrued: entry["time_total"],
      time_til: entry["time_til"],
      time_leave: entry["time_leave"],
      time_overtime: entry["time_overtime"],
      time_comm_svs: entry["time_comm_svs"],
      comment: entry["t_comment"],
      location_id: entry["location_id"],
      activity: entry["activity"],
      notes: entry["notes"],
      status: entry["status"],
      rwe_day: entry["rwe_day"],
      holiday_name:"",
      is_weekend:
        new Date(entry["work_date"]).getDay() === 0 ||
        new Date(entry["work_date"]).getDay() === 6
          ? "yes"
          : null,
    }));

    

    const queryMessage = req.query.m;
    const userInfo = req.session.userInfo;

    // console.log("FILTERED DATA", filteredData)

    const userScheduleResponse = await axios.get(`${API_URL}/userSchedule/${req.user.id}`);


    const userSchedule = userScheduleResponse.data ? userScheduleResponse.data : [];
    console.log("asdas", userScheduleResponse.data)
    
  


    console.log("t9  returned users timesheets ");
    logUser(req, "t9     ");
    res.render("timesheet/main.ejs", {
      title: "Timesheet",
      user: req.user,
      userInfo: userInfo,
      queryMessage: queryMessage,
      userSchedule: userSchedule,
      flexTilRdo: flexTilRdo.data[0],
      tableData: filteredData,
      publicHolidays: publicHolidays.data,
      messages: req.flash("messages"),
    });
  } catch (error) {
    handleError(error, req, res);
    res.redirect("/time");
  }
});



app.get("/timesheetEntry", isAuthenticated, async (req, res) => {
  const todaysDate = new Date();
  const formattedTodaysDate = todaysDate.toISOString().split('T')[0]; // Example: "YYYY-MM-DD"


  const userId = req.user.id; // Use req.user.id instead of req.query.userId
  const date = req.query.date || formattedTodaysDate; // Pick up the date from the URL parameter
  console.log(`y1   User wants to add a new timeshset`, date);
  logUser(req, "y1     user wants to add a regular timesheet");
  logUser(req, "y9     ");

  if (!date) {
    res.redirect("/time?m=dateAlreadyExist");
    return; // Added return to stop further execution
  }

  try {
    const myManager = await axios.get(`${API_URL}/users/checkMyManger/${userId}`);

    if (myManager.data.length == 0) {
      return res.redirect("/profile?status=noManager"); // Use return to stop further execution
    }

    const locationResponse = await axios.get(`${API_URL}/location`);
    const userScheduleResponse = await axios.get(`${API_URL}/userSchedule/${req.user.id}`);
    const userSchedules = userScheduleResponse.data[0] ? userScheduleResponse.data : [] ;
        

    let userWorkSchedules = [];
    let allDateSchedules = [];

    console.log("the user schedule", userScheduleResponse.data[0]);

    if (!userScheduleResponse.data.length < 1) {
      const scheduleDays = userScheduleResponse.data[0].schedule_day;
      const paidHours = userScheduleResponse.data[0].paid_hours;
      const startDate = new Date(userScheduleResponse.data[0].start_date);
      const endDate = new Date(userScheduleResponse.data[0].end_date);

      userWorkSchedules = getPayPeriods(startDate, endDate, scheduleDays, paidHours);
      console.log("user schedules: ", userWorkSchedules);
    }

    function getDayOfWeekName(dayOfWeek) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[dayOfWeek];
    }

    function getPayPeriods(startDate, endDate, scheduleDays, paidHours) {
  
      console.log('get pay per period'+  startDate);
      let currentDate = new Date(startDate);
      let i = 0;
      let paidHour = 0;


         console.log("date", date)
          console.log('current date', new Date(currentDate).toISOString().split("T")[0] )
          
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();

        if (scheduleDays.includes(getDayOfWeekName(dayOfWeek))) {     
          if (i <= paidHours.length - 1) {
            paidHour = paidHours[i];
            if (i == paidHours.length - 1) {
              i = 0;
            } else {
              i += 1;
            }
          }

          //  console.log("date", date, '+', new Date(currentDate).toISOString().split("T")[0])
          // console.log('current date', new Date(currentDate).toISOString().split("T")[0] )

          if (date == new Date(currentDate).toISOString().split("T")[0]) {
            // console.log("================================", true)
            allDateSchedules.push({
              date: new Date(currentDate).toISOString().split("T")[0],
              paidHour: paidHour,
              start_date: userScheduleResponse.data[0].start_date,
              end_date: userScheduleResponse.data[0].end_date,
              user_id: userScheduleResponse.data[0].user_id,
              default_time_start: userScheduleResponse.data[0].default_time_start,
              default_time_break: userScheduleResponse.data[0].default_time_break,
              schedule_id: userScheduleResponse.data[0].schedule_id,
              disable_til: userScheduleResponse.data[0].disable_til,
              disable_flexi: userScheduleResponse.data[0].disable_flexi,
              disable_rdo: userScheduleResponse.data[0].disable_rdo
            });


            
          }
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
 


      return allDateSchedules;
    }

    const location = locationResponse.data;
    const selectedDate = req.query.date;


    const timesheetExists = await axios.post(
      `${API_URL}/timesheets/checkTimeSheetsExist`,
      { date: selectedDate, userID: userId }
    );

    const flexTilRdo = await axios.post(`${API_URL}/tfr/${req.user.id}`);
    const recentLocation = await axios.get(`${API_URL}/location/getRecentLocation/${req.user.id}`);

    const userInfo = req.session.userInfo;



    // console.log("THE FLADSASDASD", timesheetExists.data.timesheetExists)

    if (timesheetExists.data.timesheetExists) {
 
      res.redirect("/time?m=dateAlreadyExist");
    } else {
      // console.log("userchedules ----------------------------: " , userSchedules.length)
      if (userWorkSchedules.length == 0) {
        res.redirect("/time?m=noSchedule");
      } else {

        // console.log("ASDKLJHASJKDHASJKLHDASJK", userSchedules)
        
        res.render("timesheet/recordHours.ejs", {
          forDate: date,
          user: req.user,
          userWorkSchedule: userWorkSchedules,
          userSchedules: userSchedules,
          userInfo: userInfo,
          selectedDate: selectedDate,
          location: location,
          flexTilRdo: flexTilRdo.data[0],
          recentLocation: recentLocation.data,
          title: "Enter Timesheet",
          messages: req.flash("messages"),
        });
      }
    }
  } catch (error) {
    handleError(error, req, res);
    // res.status(500).send("Internal Server Error");
  }
});

// app.get("/recordHours", (req, res) => {
//   res.render("recordHours", { userLocation: userLocation });
// });


const isValidTimeFormat = (value) => {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value); // Custom validation function for time format (hh:mm)
};


app.post("/timesheetEntry",
  isAuthenticated,
  [
    // Validate request body
    body("work_date")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Timesheet not saved.  Invalid date format"),
    body("time_start")
      .optional()
      .custom(isValidTimeFormat)
      .withMessage(
        "Timesheet not saved.  Invalid time format for time_start (hh:mm)"
      ),
    body("time_finish")
      .optional()
      .custom(isValidTimeFormat)
      .withMessage(
        "Timesheet not saved.  Invalid time format for time_finish (hh:mm)"
      ),
    body("time_lunch")
      .optional()
      .isInt({ min: 0, max: 360 })
      .withMessage(
        "Timesheet not saved.  Please enter the number of minutes taken for lunch (eg. 90)"
      ),
    body("time_extra_break")
      .optional()
      .isInt({ min: 0, max: 360 })
      .withMessage(
        "Timesheet not saved.  Please enter the number of minutes taken for break (eg. 45)"
      ),
    //body('time_total').optional().custom(isValidTimeFormat).withMessage('Invalid time format for time_total (hh:mm)'),      //calculated field
    body("location_id")
      .optional()
      .isInt()
      .withMessage("Invalid entry for location_id"),
    body("fund_src")
      .optional()
      .isString()
      .withMessage("Invalid string format for fund_src"),
    body("activity")
      .optional()
      .isString()
      .isLength({ max: 30 })
      .withMessage("Activity must be less than 31 characters"),
    body("comment")
      .optional()
      .isString()
      .withMessage("Invalid string format for comment"),
    body("variance")
      .optional()
      .isString()
      .withMessage("Invalid string format for variance"),
    body("notes")
      .optional()
      .isString()
      .withMessage("Invalid string format for notes"),
    // body('flexi_accrued').optional().isNumeric().withMessage('Invalid numeric format for flexi_accrued'),
    // body('flexi_taken').optional().isNumeric().withMessage('Invalid numeric format for flexi_taken'),
    // body('til_accrued').optional().isNumeric().withMessage('Invalid numeric format for til_accrued'),
    // body('til_taken').optional().isNumeric().withMessage('Invalid numeric format for til_taken')
  ],
  async (req, res) => {
    try {
      console.log("n10 ", req.body);
      logUser(req, "n1     saved timesheet");
      logUser(req, "n9     ");
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash(
          "messages",
          errors.array().map((error) => error.msg)
        );
        return res.redirect("/time");
      }

      const {
        work_date,
        time_start,
        time_finish,
        time_lunch,
        time_extra_break,
        time_total,
        location_id,
        fund_src,
        activity,
        comment,
        variance,
        notes,
        flexi_accrued,
        flexi_taken,
        til_accrued,
        til_taken, tilMixInput, flexiMixInput, overtimeMixInput , disableRdo, draft
      } = req.body;
      let { variance_type, time_leave, time_overtime } = req.body;

      console.log("n15   variance", variance);
      if (variance === "") {
        variance_type = ""; // timesheet has no variance, tidy up data set
        console.log("n16   variance_type", variance_type);
      }
      const currentDate = new Date();

      //set calculated fields
      let time_total_numeric = parseFloat(time_total);
      let flexi_accrued_numeric =
        flexi_accrued.trim() !== "" ? parseFloat(flexi_accrued) : 0;
      let flexi_taken_numeric =
        flexi_taken.trim() !== "" ? parseFloat(flexi_taken) : 0;
      let til_accrued_numeric =
        til_accrued.trim() !== "" ? parseFloat(til_accrued) : 0;
      let til_taken_numeric =
        til_taken.trim() !== "" ? parseFloat(til_taken) : 0;
      let time_leave_numeric =
        time_leave.trim() !== "" ? parseFloat(time_leave) : 0;
      let time_overtime_numeric =
        time_overtime.trim() !== "" ? parseFloat(time_overtime) : 0;
      const on_duty = 0; //activity.startsWith("Rest Day") ? 0 : 1;       //deleted 14May2024

      let time_flexi = null;
      let time_til = null;
      
      time_leave = null;
      time_overtime = null;

      // check if the day is weekend 
      const isWeekend = (new Date(work_date).getDay() === 0 || new Date(work_date).getDay() === 6)

      // check if the RDO is applicable. 
      const toHoursTimeTotal = parseFloat(time_total.split(':')[0]) + parseFloat(time_total.split(':')[1]) / 60;
      let rwe_day = disableRdo == 'false' && isWeekend && toHoursTimeTotal >= 4 ? 1 :  null;
      



      if (variance_type === "flexi") {
        time_flexi = flexi_accrued_numeric - flexi_taken_numeric;
        console.log(
          "n21 " +
            time_flexi +
            " " +
            flexi_accrued_numeric +
            " " +
            flexi_taken_numeric
        );
      } else if (variance_type === "til") {
        time_til = variance;
        console.log("n22  ", time_til);
      } else if (variance_type === "leave") {
        time_leave = time_leave_numeric;
        console.log("n23  ", time_leave);
      } else if (variance_type === "overtime") {
        time_overtime = time_overtime_numeric;
        console.log("n24  ", time_overtime);
      } else if (variance_type === "mixed") {
        time_til = tilMixInput;
        time_flexi = flexiMixInput;
        time_overtime = overtimeMixInput;
      } else {
        console.log("n25   mixed not working"); // mixed is not completed
      }

      // Insert a new timesheet
      console.log("n26  ", req.user);
      console.log(`n27      ${API_URL}/timesheets`);
      const result = await axios.put(`${API_URL}/timesheets`, {
        person_id: req.user.id,
        username: req.user.username,
        work_date,
        time_start,
        time_finish,
        time_lunch,
        time_extra_break,
        time_total,
        location_id,
        fund_src,
        activity,
        t_comment: comment,
        entry_date: currentDate,
        variance,
        variance_type,
        notes,
        time_flexi,
        time_til,
        time_leave,
        time_overtime,
        on_duty, // 1 for work day, 0 if activity name begins with "Rest Day", ie. "Rest Day (Planned Burning)".
        duty_category: null,
        status: "entered",
        rwe_day, 
        draft
      });
      console.log("n30   res.status: ", result.status);

      const scanIssueResult = await axios.put(`${API_URL}/timesheet/scanIssues`, {
        person_id: req.user.id,
        username: req.user.username,
        work_date,
        time_start,
        time_finish,
        time_lunch,
        time_extra_break,
        time_total,
        location_id,
        fund_src,
        activity,
        t_comment: comment,
        entry_date: currentDate,
        variance,
        variance_type,
        notes,
        time_flexi,
        time_til,
        time_leave,
        time_overtime,
        on_duty, // 1 for work day, 0 if activity name begins with "Rest Day", ie. "Rest Day (Planned Burning)".
        duty_category: null,
        status: "entered",
        rwe_day: null, tilMixInput, flexiMixInput 
      });
      console.log("n90    New timesheet created");

      console.log("n30   res.status: ", scanIssueResult.status);


      req.flash("messages", "Thank you for entering your timesheet");
 
      return res.redirect(`/time?date=${work_date}#${new Date(work_date).getDay()}`);
    } catch (error) {
      handleError(error, req, res);
      req.flash(
        "messages",
        "An error occurred while creating the timesheet - the timesheet was not saved"
      );
      return res.redirect(`/time?date=${work_date}#${new Date(work_date).getDay()}`);

    }
  }
);

app.get("/reportBug", isAuthenticated, (req, res) => {
  res.render("reportBug.ejs", {
    user: req.user,
    title: "Report a Bug",
    email: req.user.email,
    messages: req.flash("messages"),
  });
});



app.get("/emergencyEntry", isAuthenticated, async (req, res) => {
  try {
    console.log(`yg1   `);
    logUser(req, "yg1     I want to enter emergency timesheet");
    logUser(req, "yg9     ");

    const selectedDate = req.query.date;

    let formData = {}; // Declare formData before assigning values to it

    try {
      const result = await axios.get(`${API_URL}/rdo/${req.user.id}`);
      console.log("yg2    user RDO ", result.data);

      formData = {
        RDO: result.data[0].is_eligible,
      };
    } catch (error) {
      console.error("Error fetching RDO:", error);
      handleError(error, req, res); // Handle error using the handleError function
      formData = {
        RDO: null, // Set RDO to some default value or handle error case appropriately
      };
    }

    const date = req.query.date; // Pick up the date from the URL parameter

    if (!date) {
      res.redirect("/time?m=dateAlreadyExist");
    }

    const timesheetExists = await axios.post(
      `${API_URL}/timesheets/checkTimeSheetsExist`,
      { date: selectedDate, userID: req.user.id }
    );

    if (timesheetExists.data.timesheetExists) {
      res.redirect("/time?m=dateAlreadyExist");
    } else {
      res.render("timesheet/emergencyResponse.ejs", {
        formData,
        selectedDate: selectedDate,
        user: req.user,
        title: "Enter Timesheet",
        messages: req.flash("messages"),
      });
    }
  } catch (error) {
    handleError(error, req, res); // Handle any uncaught errors using the handleError function
  }
});

app.post(
  "/emergencyEntry",
  isAuthenticated,
  [
    // Validate request body
    body("work_date")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Invalid date format"),
    body("activity")
      .optional()
      .isString()
      .isLength({ max: 30 })
      .withMessage("Activity must be less than 31 characters"),
    body("comment")
      .optional()
      .isString()
      .withMessage("Invalid string format for comment"),
    body("notes")
      .optional()
      .isString()
      .withMessage("Invalid string format for notes"),
  ],
  async (req, res) => {
    logUser(req, "eg1     I tried to save an emergency timesheet");
    logUser(req, "eg9     ");

    console.log("eg1 ", req.body);
    const errors = validationResult(req);
    const currentDate = new Date();
    if (!errors.isEmpty()) {
      req.flash(
        "messages",
        errors.array().map((error) => error.msg)
      );
      return res.redirect("/time");
    }

    try {
      let {
        work_date,
        time_start,
        time_finish,
        time_lunch,
        time_extra_break,
        time_total,
        location_id,
        fund_src,
        activity,
        comment,
        variance,
        notes,
        flexi_accrued,
        flexi_taken,
        til_accrued,
        til_taken,
        pvWorkDay,
        commencedWork,
      } = req.body;
      const onDuty = activity.startsWith("Rest Day") ? 0 : 1;
      let rweCol;
      console.log("eg22   ");

      if (pvWorkDay && commencedWork) {
        rweCol = 1;
        comment = "Rostered Workday";
        console.log("eg25   " + rweCol);
      }
      if (comment == "no IRIS entry" && !activity.startsWith("Rest Day")) {
        console.log("eg28   ");
        req.flash(
          "messages",
          'We redirected you because you nominated that the timekeeper did not record the work day. Choose an activity like "Bushfire Readiness" from the activity column'
        );
        const formattedDate = new Date(work_date).toISOString().split("T")[0];
        return res.redirect(`/emergencyEntry?date=${formattedDate}`);
      }
      console.log(`eg50      ${API_URL}/timesheets`);
      const result = await axios.put(`${API_URL}/timesheets`, {
        person_id: req.user.id,
        username: req.user.username,
        work_date,
        location_id: null, //set to the users home location, but add 'Emergency Readiness / Response' to the description
        fund_src: "000", //always find 000 for emergency
        activity,
        t_comment: comment,
        entry_date: currentDate,
        notes,
        on_duty: onDuty, // 1 for work day, 0 if activity name begins with "Rest Day", ie. "Rest Day (Planned Burning)".
        duty_category: 2, // Cells(CurRow, categoryCol) = 2  'Emergency Response
        status: "entered",
        rwe_day: rweCol, //  If CheckBox1 And CheckBox2 Then Cells(CurRow, RWECol) = 1
      });
      console.log("eg70   res.status: ", result.status);

      console.log("eg90    New timesheet created");
      req.flash("messages", "Thank you for entering your timesheet");
      return res.redirect("/time");
    } catch {
      console.error("eg80     Error creating timesheet:", error);
      req.flash(
        "messages",
        "An error occurred while creating the timesheet - the timesheet was not saved"
      );
      return res.redirect("/time");
    }
  }
);

app.get("/plannedLeave", isAuthenticated, async (req, res) => {
  try {
    logUser(req, "plm1     I want to enter planned leave timesheet");
    logUser(req, "plm9     ");
    
    const selectedDate = req.query.date;

    if (!selectedDate) {
      req.flash(
        "messages",
        "Invalid Date, Please select a valid date"
      );
      return res.redirect("/time");
    }
    

    const userId = req.user.id;
    const result = await axios.get(`${API_URL}/timesheets/${req.user.id}`);

    const publicHolidays = await axios.get(`${API_URL}/publicHolidays`);

    const myManager = await axios.get(`${API_URL}/users/checkMyManger/${userId}`);

    

    if (myManager.data.length == 0) {
      return res.redirect("/profile?status=noManager"); // Use return to stop further execution
    }

    const locationResponse = await axios.get(`${API_URL}/location`);
    const userScheduleResponse = await axios.get(`${API_URL}/userSchedule/${req.user.id}`);
    const userWorkSchedules = userScheduleResponse.data[0] ? userScheduleResponse.data : [] ;
    if (userWorkSchedules.length === 0) {
      req.flash("messages", "You don't have a work schedule yet");
      return res.redirect("/time");
    } else if (userWorkSchedules[0].paid_hours.every(hour => hour <= 0)) {
      req.flash("messages", "User don't have a work schedule");
      return res.redirect("/time");
    }

    let userSchedules = [];
    let allDateSchedules = [];

    console.log("the user schedule", userScheduleResponse.data.length);

    if (!userScheduleResponse.data.length < 1) {
      const scheduleDays = userScheduleResponse.data[0].schedule_day;
      const paidHours = userScheduleResponse.data[0].paid_hours;
      const startDate = new Date(userScheduleResponse.data[0].start_date);
      const endDate = new Date(userScheduleResponse.data[0].end_date);

      userSchedules = getPayPeriods(startDate, endDate, scheduleDays, paidHours);
      console.log("user schedules: ", userSchedules);
    }

    function getDayOfWeekName(dayOfWeek) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[dayOfWeek];
    }

    function getPayPeriods(startDate, endDate, scheduleDays, paidHours) {
      // console.log('get pay per period' + paidHours);
      // console.log('get pay per period'+  scheduleDays);
      // console.log('get pay per period' + endDate);
      console.log('get pay per period'+  startDate);
      let currentDate = new Date(startDate);
      let i = 0;
      let paidHour = 0;


         console.log("date", selectedDate)
          console.log('current date', new Date(currentDate).toISOString().split("T")[0] )
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();

        if (scheduleDays.includes(getDayOfWeekName(dayOfWeek))) {     
          if (i <= paidHours.length - 1) {
            paidHour = paidHours[i];
            if (i == paidHours.length - 1) {
              i = 0;
            } else {
              i += 1;
            }
          }

          //  console.log("date", date, '+', new Date(currentDate).toISOString().split("T")[0])
          // console.log('current date', new Date(currentDate).toISOString().split("T")[0] )

          if (selectedDate == new Date(currentDate).toISOString().split("T")[0]) {
            // console.log("================================", true)
            allDateSchedules.push({
              date: new Date(currentDate).toISOString().split("T")[0],
              paidHour: paidHour,
              start_date: userScheduleResponse.data[0].start_date,
              end_date: userScheduleResponse.data[0].end_date,
              user_id: userScheduleResponse.data[0].user_id,
              default_time_start: userScheduleResponse.data[0].default_time_start,
              default_time_break: userScheduleResponse.data[0].default_time_break,
              schedule_id: userScheduleResponse.data[0].schedule_id,
              disable_til: userScheduleResponse.data[0].disable_til,
              disable_flexi: userScheduleResponse.data[0].disable_flexi,
              disable_rdo: userScheduleResponse.data[0].disable_rdo
            });


            
          }
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
 


      return allDateSchedules;
    }
    

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { day: "2-digit", month: "short", year: "numeric" };
      return date.toLocaleDateString("en-US", options);
    };

    // Filter the result.data array to exclude entries where id === null
    const filteredData = result.data
      .filter((entry) => entry["id"] !== null)
      .map((entry) => ({
        work_date: formatDate(entry["work_date"]),
        id: entry["id"],
      }));

    // console.log(publicHolidays.data)

    const date = req.query.date; // Pick up the date from the URL parameter
    const userInfo = req.session.userInfo;


    if (!date) {
      req.flash(
        "messages",
        "Invalid Date, Please select a valid date"
      );
      return res.redirect("/time");
    }

    const timesheetExists = await axios.post(
      `${API_URL}/timesheets/checkTimeSheetsExist`,
      { date: selectedDate, userID: req.user.id }
    );

    if (timesheetExists.data.timesheetExists) {
      res.redirect("/time?m=dateAlreadyExist");
    }   else { 
      if (userSchedules.length == 0) {
      res.redirect("/time?m=noSchedule");
      } else {
        // Render the leavePlanned.ejs file
        res.render("timesheet/leavePlanned.ejs", {
          workDays: filteredData,
          selectedDate: selectedDate,
          userInfo: userInfo,
          publicHolidays: publicHolidays.data,
          title: "Leave Request",
          user: req.user,
          messages: req.flash("messages"),
        });
      }
    }
  } catch (error) {
    req.flash(
      "messages",
      "Something Went Wrong, Please try again later!"
    );
    return res.redirect("/time");
  }
});

app.post(
  "/plannedLeave",
  isAuthenticated,
  [
    // Validate request body
    body("work_date")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Invalid date format"),
    body("num_days")
      .isInt({ min: 1 })
      .withMessage("Number of days must be a positive integer"),
    body("leave_approved")
      ,
    body("notes")
      .optional()
      .isString()
      .withMessage("Invalid string format for notes"),
  ],
  async (req, res) => {
    logUser(req, "pl1     saving a planned leave timesheet");
    console.log("pl1   ", req.body);
    const errors = validationResult(req);
    const currentDate = new Date();
    if (!errors.isEmpty()) {
      req.flash(
        "messages",
        errors.array().map((error) => error.msg)
      );
      return res.redirect("/time");
    }

    try {
      const { num_days, leave_approved, notes } = req.body;
      let workDate = new Date(req.body.work_date); // Start date for leave

      const publicHolidays = await axios.get(`${API_URL}/publicHolidays`);
      console.log("THE NUMBER: " + num_days);

      let daysAdded = 0; // Track the number of days added

      while (daysAdded < num_days) {

        const timesheetExists = await axios.post(
          `${API_URL}/timesheets/checkTimeSheetsExist`,
          { date: workDate, userID: req.user.id }
        );
    

      
        const dayOfWeek = workDate.getDay();
        const isSunday = dayOfWeek === 0;
        const isSaturday = dayOfWeek === 6;
        
        const isPublicHoliday = publicHolidays.data.some(
          (holiday) =>
            holiday.holiday_date.slice(0, 10) ==
            workDate.toISOString().slice(0, 10)
        );

        if (!isSunday && !isSaturday && !isPublicHoliday && !timesheetExists.data.timesheetExists) {
          const result = await axios.put(`${API_URL}/timesheets`, {
            person_id: req.user.id,
            username: req.user.username,
            work_date: workDate.toISOString(), // Convert to ISO string
            activity: "Approved Leave",
            entry_date: new Date().toISOString(), // Convert to ISO string for current date
            notes,
            on_duty: 0, // Off duty
            duty_category: 3, // Approved leave
            status: "entered",
          });
          console.log(
            `Adding record for ${workDate.toLocaleDateString()}: Status ${
              result.status === 201
                ? "success(201)"
                : "error(" + result.status + ")"
            }`
          );

          daysAdded++; // Increment daysAdded only if a valid day is added
        }

        // Increment workDate for the next day
        workDate.setDate(workDate.getDate() + 1);

        // Check for public holidays again after incrementing workDate
        const nextDayIsPublicHoliday = publicHolidays.data.some(
          (holiday) =>
            holiday.holiday_date.slice(0, 10) ===
            workDate.toISOString().slice(0, 10)
        );
        if (nextDayIsPublicHoliday) {
          // Skip the public holiday by incrementing workDate again
          workDate.setDate(workDate.getDate() + 1);
        }
      }

      console.log("pl9");
      return res.redirect(`/time?date=${workDate}#${new Date(workDate).getDay()}`);

    } catch (error) {
      console.error("pl8 Error creating timesheet:", error);
      req.flash(
        "messages",
        "An error occurred while creating the timesheet - the timesheet was not saved"
      );
      return res.redirect(`/time?date=${workDate}#${new Date(workDate).getDay()}`);

    }

    logUser(req, "pl9     ");

  }
);

app.get("/deleteTimesheet/:id", async (req, res) => {
  console.log("de1  ");
  const timesheetId = req.params.id;
  const workDate = req.query.workDate || ''; 
  try {
    console.log(`de3    ${API_URL}/timesheets/${timesheetId}`);
    const response = await axios.delete(`${API_URL}/timesheets/${timesheetId}`);

    console.log("de9  Timesheet deleted successfully:", response.data);
    return res.redirect(`/time?date=${workDate}#${new Date(workDate).getDay()}`);
  } catch (error) {
    console.error(
      "de8  Error deleting timesheet:",
      error.response ? error.response.data : error.message
    );
    handleError(error, req, res)
  }
});

app.get("/approveTimesheet/:id", async (req, res) => {
  console.log("ap1  ", req.body);
  const timesheetId = req.params.id;
  const newStatus = "approved";

  try {
    //const scrollY = req.query.scrollY || 0; // Store the current scroll position

    //const response = await axios.post(`${API_URL}/timesheets/${timesheetId}`);
    console.log(`ap3       ${API_URL}/timesheets/${timesheetId}/updateStatus`);
    const response = await axios.post(
      `${API_URL}/timesheets/${timesheetId}/updateStatus`,
      { status: newStatus }
    );

    console.log("ap9     Timesheet updated successfully:", response.data);
    //return res.redirect(`/time?scrollY=${scrollY}`);
    return res.redirect(`/time`);
  } catch (error) {
    console.error(
      "ap8      Error updating timesheet:",
      error.response ? error.response.data : error.message
    );
    handleError(error, req, res)
  }
});

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
                return res.redirect("/timesheet/pending");
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

      

      // Check if user exists
      // if (!user) {
      //     console.log("ps3")
      //     return cb(null, false, { messages: 'Incorrect username.' });
      // }

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

      //, (err, valid) => {
      //   console.log("ps7");
      //   if (valid) {
      //     console.log("ps8");
      //     return cb(null, false, { messages: ["Error comparing passwords."] });
      //   } else {
      //     console.log("ps9");
      //     if (valid) {
      //       console.log("ps10 password correct");
      //       return cb(null, user, { messages: ["Success."] });
      //     } else {
      //       console.log("ps11");
      //       return cb(null, false, { messages: ["Incorrect password."] });
      //     }
      //   }
      // });
      // console.log("ps12");

      console.log("ps7");
      if (valid) {
        console.log("ps10 password correct");
        return cb(null, user, { messages: ["Success."] });
      } else {
        console.log("ps11");
        return cb(null, false, { messages: ["Incorrect password."] });
      }
      // known issue: page should redirect to the register screen.  To reproduce this error enter an unknown username into the login screen
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
