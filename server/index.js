import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as db from "./queries.js";
// import cron from "node-cron";

// Import controllers using ES modules syntax
import {
  getLocationById,
  getAllLocation,
  editLocation,
  deleteLocation,
  addLocation,
  getAllLocationByOrgId,
  getRecentLocationByUserId,
} from "./controllers/locationControllers.js";

import {
  getActivitiesByUserId,
  createActivity,
  updateActivity,
  deleteActivity,
  getAllActivities,
} from "./controllers/activitiesControllers.js";


import { getApproveTimeSheet, getRejectTimeSheet, getPendingTimeSheet, getSubordinateTime, approveTimesheet, rejectTimesheet, pendingTimesheet, countPendingTsByManagerId } from "./controllers/managerController.js";
import { isManager, getUserInfo, checkUserExist, editProfile, getManager, getMyManager, assignManager, checkMyManger, checkMyManagement, addPersonelleInfo, addOrganizationToPersonelle, checkValidEmail, InsertResetPassToken, verifyResetPassToken, resetPassword, getAllUserByOrg, editDefaultTime } from "./controllers/userController.js";

import { getAllHolidays } from "./controllers/publicHollidayController.js";

import { 
  checkTimesheetExist,
  editTimesheet,
  getIndividualTimesheetsById,
  getPendingIndividualTimesheet,
  getTFR,
  getTimesheetById,
  postDayOff,
  submitMultipleTimesheetStatus,
  submitTimesheetStatus
 } from "./controllers/timeSheetsController.js";

import { getFundSources, getFundSourceById, createFundSource, updateFundSource, deleteFundSource } from "./controllers/fundSourcesConstroller.js"
import { getTotalHourByDate, getUserScheduleById } from "./controllers/userWorkingSheduleController.js";
import { createNotification, deleteNotification, getAllNotificationsByUserId, getCountUnseenNotifications, getRecentNotifications, markAsSeen } from "./controllers/notificationController.js";
import { getAllIssues, scanIssues } from "./controllers/issuesController.js";
import { getOrganizationByPersonId } from "./controllers/organizationsController.js";


// indepentnt Funtino impots
import excelToDbUpdateScheduler from "./excel-to-db-updater/excelToDbUpdatSheduler.js";
import { exportAllTimesheetByManager } from "./controllers/exportToExcelController.js";


import { apimUpdateDisableTil, apimUpdateDisableFlexi, apimUpdateDisableRdo, apimUpdateFirstName, apimUpdateLastName, apimUpdatePaidHours } from "./controllers/apimController.js";


const port = 4000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


//APIM functions for PV
app.post('/APIM/update-disable-til', apimUpdateDisableTil);
app.post('/APIM/update-disable-flexi', apimUpdateDisableFlexi);
app.post('/APIM/update-disable-rdo', apimUpdateDisableRdo);
app.post('/APIM/update-first-name', apimUpdateFirstName);
app.post('/APIM/update-last-name', apimUpdateLastName);
app.post('/APIM/update-paid-hours', apimUpdatePaidHours);


// Independent Functions Starts
// Call the function to update the database from Excel when the server starts

// Schedule the function to run every Saturday at 7:30 PM
// cron.schedule('44 19 * * 6', () => {
//   console.log('Running scheduled task: Updating database from Excel');
//   excelToDbUpdateScheduler().catch(console.error);
// });
// independent functions ENds



// ROUTES FOR THE TIMESHEETS CONTROLLERS
app.post("/tfr/:userID", getTFR);
app.post("/flexiDayOff/:userID", postDayOff);


// ROUTES FOR THE FUND SOURCE CONTROLLER
app.get("/fundSource", getFundSources);
app.get("/fundSource/:id", getFundSourceById);
app.post("/fundSource/create", createFundSource);
app.post("/fundSource/update", updateFundSource);
app.post("/fundSource/delete", deleteFundSource);


// ROUTES FOR USER WORKING SCHEDULE
app.get("/userSchedule/:userID", getUserScheduleById);
app.post("/totalHours/:userID", getTotalHourByDate);


// ROUTES FOR PUBLIC HOLIDAyS
app.get("/publicHolidays", getAllHolidays);

// ROUTES FOR ACTIVITIES Manager
app.get("/activities/:id", getActivitiesByUserId);
app.put("/activities/:orgId", getAllActivities);
app.put("/createActivity", createActivity);
app.put("/updateActivity/:id", updateActivity);
app.post("/deleteActivity", deleteActivity);

// Define routes using the imported controllers
app.get("/location/:id", getLocationById);
app.get("/location", getAllLocation);
app.get("/location/byOrg/:id", getAllLocationByOrgId ); 
app.get("/location/getRecentLocation/:userID", getRecentLocationByUserId);


app.put("/editlocation/:id", editLocation);
app.post("/deletelocation", deleteLocation);
app.put("/addlocation", addLocation);

// Manager timeSheets approval 
app.get("/timesheet/pending/:userID", getPendingTimeSheet);
app.get("/timesheet/data/:userID", getSubordinateTime);
app.get("/timesheet/approved/:userID", getApproveTimeSheet);
app.get("/timesheet/reject/:userID", getRejectTimeSheet);
app.post("/timesheet/rejectTs/:userID",rejectTimesheet );
app.post("/timesheet/approveTs/:userID", approveTimesheet);
app.post("/timesheet/pendingTs/:userID", pendingTimesheet);

app.get("/timesheet/getAllIssues", getAllIssues);
app.put("/timesheet/scanIssues", scanIssues);
app.get("/timesheet/countPendingTsByManagerId", countPendingTsByManagerId);
app.post("/timesheet/submitTimesheetStatus/:id", submitTimesheetStatus);
app.post("/timesheet/multipleSubmitTimesheetStatus/:userId", submitMultipleTimesheetStatus);


// NOTIFICATION ROUTES
app.get("/notification/getByUserId", getAllNotificationsByUserId);
app.post("/notification/add", createNotification);
app.get("/notification/recent", getRecentNotifications)
app.get("/notification/unseen/:userID", getCountUnseenNotifications)
app.get("/notification/seen/:userID", markAsSeen)
app.get("/notification/delete/:notificationID", deleteNotification);


// ORGANIZATION ROUTES
app.get("/organization/:userID", getOrganizationByPersonId);




// Define other routes
app.get("/usersByOrg/:orgID", db.getUsers);
app.get("/login/:email", db.getUserByEmail);
app.get("/users/:id", db.getUserById);
app.post("/users", db.createUser);
app.put("/users/:id", db.updateUser);
app.put("/verify/:token", db.verifyUserEmail);
app.delete("/users/:id", db.deleteUser);
//app.get("/rdo/:id", db.getRdoById);    --John wants to remove this function because RDO has moved to the user_work_schedule table as per #96

app.get("/users/userInfo/:userID",getUserInfo);
app.get("/users/isManager/:userID", isManager);
app.post("/users/check", checkUserExist);
app.post("/users/update", editProfile);
app.get("/users/getManager/:orgID", getManager);
app.get("/users/getAllUsersByOrg/:orgID", getAllUserByOrg);
app.get("/users/getMyManager/:userID", getMyManager);
app.post("/users/assignManager/:managerID", assignManager)
app.get("/users/checkMyManger/:id" , checkMyManger);
app.put("/users/checkMyManagement" , checkMyManagement);
app.put("/users/addPersonelleInfo/:userID" , addPersonelleInfo);
app.put("/users/addOrganizationToPersonelle" , addOrganizationToPersonelle);
app.post("/users/checkValidEmail", checkValidEmail);
app.post("/users/insertResetPassToken", InsertResetPassToken);
app.post("/users/verifyResetPassToken", verifyResetPassToken);
app.post("/users/resetPassword", resetPassword);


app.put("/editDefaultTime", editDefaultTime);



// FOR TIMESHEETS ROUTES
app.get("/timesheetsbyid/:id", db.getTimesheetsById);
app.get("/timesheets/:id", db.getCurrentYearTimesheetsForUser);
app.put("/timesheets", db.createTimesheet);
app.post("/timesheets/:id/updateStatus", db.updateTimesheetStatus);
app.delete("/timesheets/:id", db.deleteTimesheet);


app.post("/timesheets/checkTimeSheetsExist", checkTimesheetExist);
app.post("/timesheets/getTimesheetById/:id", getIndividualTimesheetsById);
app.get("/timesheets/getPendingTimesheetById/:id", getPendingIndividualTimesheet);
app.put("/timesheets/edit/:id", editTimesheet);
app.get("/timesheets/getTimesheetById/:id", getTimesheetById);



// EXPORT TO EXCEL
app.get("/exportTimesheetsByManager/:id", exportAllTimesheetByManager);



app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});


