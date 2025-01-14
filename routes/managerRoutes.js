import { Router } from "express";
import axios from "axios";
import axiosRetry from 'axios-retry';
import handleError from "../utils/handleError.js"; // Import the handleError function
import { logUser } from "../utils/logging.js";

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const createManagerRoutes = (isAuthenticated) => {
  const router = Router();
  const API_URL = process.env.API_URL;


  // Set a timeout for all axios requests
  const axiosInstance = axios.create({
    timeout: 5000, // 5 seconds timeout
  });

  router.get("/data", isAuthenticated, async (req, res) => {
    try {
      console.log("dat1  running reports");
      logUser(req, "dat1     user wants to review staff timesheets");
  
      const data = await axios.get(`${API_URL}/timesheet/data/${req.user.id}`);
      console.log("dat4    ", data.data);
  
      const timesheetIssues = await axios.get(`${API_URL}/timesheet/getAllIssues`);
      const userInfo = req.session.userInfo;
  
      const status = req.query.status;
      let statusMessage = "";
      if (status == 202) {
        statusMessage = "Update Successfully!";
      } else if (status == 500) {
        statusMessage = "Something went wrong. Try Again!";
      }
  
      // Extract startDate and endDate from query parameters
      const startDate = req.query.startDate ? new Date(req.query.startDate) : getPreviousSunday();
      const endDate = req.query.endDate ? new Date(req.query.endDate) : getNextSaturday();
      

      
      console.log("dat5    ", startDate, endDate);

      // Format the dates for easier display in EJS
      // const formattedStartDate = startDate.toISOString().split('T')[0];
      // const formattedEndDate = endDate.toISOString().split('T')[0];
  
      res.render("user/manager/managerReport.ejs", {
        user: req.user,
        data: data.data,
        timesheetIssues: timesheetIssues.data,
        userInfo: userInfo,
        messages: req.flash(""),
        statusMessage: statusMessage,
        title: "Timesheet Report",
        startDate: startDate, //formattedStartDate,
        endDate: endDate,   //formattedEndDate,
      });
      logUser(req, "dat9   ");
    } catch (error) {
      handleError(error, req, res);
    }
  });
  
      // Function to get the next Saturday
      function getNextSaturday() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
        const nextSaturday = new Date(today);
        nextSaturday.setDate(today.getDate() + daysUntilSaturday);
        console.log("dati9  ", nextSaturday)
        return nextSaturday;
      }
      
      // Function to get the previous Sunday
      function getPreviousSunday() {
        const endDate = getNextSaturday();
        const previousSunday = new Date(endDate);
        previousSunday.setDate(endDate.getDate() - 6);
        console.log("datj9  ", previousSunday)
        return previousSunday;
      }

  router.get("/pending", isAuthenticated, async (req, res) => {
    try {
      logUser(req,"tpb1     user wants to see pending timesheet approval requests")
      const data = await axios.get(`${API_URL}/timesheet/pending/${req.user.id}`);
      const timesheetIssues = await axios.get(`${API_URL}/timesheet/getAllIssues`);
      const userInfo = req.session.userInfo;

    console.log("timesheetIssues" , timesheetIssues.data)
    console.log("timesheets" , data.data)


    const status = req.query.status;
    let statusMessage = "";
    if (status == 202) {
      statusMessage = "Update Successfully!"
    } else if (status == 500) {
      statusMessage = "Something went wrong. Try Again!"
    }


      res.render("user/manager/pendingTimeSheets.ejs", {
        user: req.user,
        data: data.data,
        timesheetIssues: timesheetIssues.data,
        userInfo: userInfo,
        messages: req.flash(""),
        statusMessage: statusMessage,
        title: "Pending Timesheets",
      });
      logUser(req,"tpb9   ")
    } catch (error) {
      handleError(error, req, res);
   
   
  }})


  router.get("/approved", isAuthenticated, async (req, res) => {
    try {
      logUser(req,"tab1   user wants to see approved timesheets ")
      const data = await axios.get(`${API_URL}/timesheet/approved/${req.user.id}`);
      const userInfo = req.session.userInfo;

    const status = req.query.status;
    let statusMessage = "";

      if (status == 202) {
        statusMessage = "Update Successfully!"
      } else if (status == 500) {
        statusMessage = "Something went wrong. Try Again!"
      }

      res.render("user/manager/approvedTimeSheets.ejs", {
        user: req.user,
        data: data.data,
        userInfo: userInfo,
        statusMessage: statusMessage,
        messages: req.flash(""),
        title: "Approved Timesheets",
      });
      logUser(req,"tab9    ");
    } catch (error) {
      handleError(error, req, res);
    }


 
  });


  router.post("/approveTs", isAuthenticated, async (req ,res) => {
    console.log("mrp1     ")
    const ts_id = req.body.ts_id
    const back_page = req.query.page
  try {
    await axios.post(`${API_URL}/timesheet/approveTs/${req.user.id}`, {ts_id});

    res.redirect(`/timesheet/${back_page}?status=202#${ts_id}`);

    
  } catch (error) {
    console.error("Error updating location:", error);
    res.redirect(`/timesheet/${back_page}?status=500`);

    res
      .status(500)
      .json({ success: false, error: "Error updating location" });
  }





  })

  
  router.post("/multipleApproveTs", isAuthenticated, async(req,res) => {
    const ts_ids = JSON.parse(req.body.ids)
    const back_page = req.query.page

    // console.log("gwawad", ts_ids)


  try {

    await Promise.all(ts_ids.map(ts_id => 
      axios.post(`${API_URL}/timesheet/approveTs/${req.user.id}`, {ts_id})
    ));

    res.redirect(`/timesheet/${back_page}?status=202`);

    
  } catch (error) {
    console.error("Error updating location:", error);
    res
      .status(500)
      .json({ success: false, error: "Error updating location" });
  }

  })

  router.post("/multipleRejectTs", isAuthenticated, async(req,res) => {
    const ts_ids = JSON.parse(req.body.ids)
    const back_page = req.query.page

    // console.log("gwawad", ts_ids)


  try {

    await Promise.all(ts_ids.map(ts_id => 
      axios.post(`${API_URL}/timesheet/rejectTs/${req.user.id}`, {ts_id})
    ));

    res.redirect(`/timesheet/${back_page}?status=202`);

    
  } catch (error) {
    console.error("Error updating location:", error);
    res
      .status(500)
      .json({ success: false, error: "Error updating location" });
  }

  })

  // MOVE TO PENDING 

  router.post("/pendingTs", isAuthenticated, async (req ,res) => {
    console.log("mrp1     ")
    const ts_id = req.body.ts_id
    const back_page = req.query.page
  try {
    await axios.post(`${API_URL}/timesheet/pendingTs/${req.user.id}`, {ts_id});

    res.redirect(`/timesheet/${back_page}?status=202`);

    
  } catch (error) {
    console.error("Error updating location:", error);
    res.redirect(`/timesheet/${back_page}?status=500`);

    res
      .status(500)
      .json({ success: false, error: "Error updating location" });
  }


  })

  router.post("/multiplePendingTs", isAuthenticated, async(req,res) => {
    const ts_ids = JSON.parse(req.body.ids)
    const back_page = req.query.page

    // console.log("gwawad", ts_ids)


  try {

    await Promise.all(ts_ids.map(ts_id => 
      axios.post(`${API_URL}/timesheet/pendingTs/${req.user.id}`, {ts_id})
    ));

    res.redirect(`/timesheet/${back_page}?status=202`);

    
  } catch (error) {
    console.error("Error updating location:", error);
    res
      .status(500)
      .json({ success: false, error: "Error updating location" });
  }

  })

// REJECT THE TIMESHEET
  router.post("/rejectTs", isAuthenticated, async (req ,res) => {
    console.log("mrj1     ")
    const ts_id = req.body.ts_id
    const back_page = req.query.page
  try {
    await axios.post(`${API_URL}/timesheet/rejectTs/${req.user.id}`, {ts_id});

    res.redirect(`/timesheet/${back_page}?status=202`);
    
  } catch (error) {
    console.error("Error updating location:", error);
    res
      .status(500)
      .json({ success: false, error: "Error updating location" });
  }


  })


  router.get("/rejected", isAuthenticated, async (req, res) => {
    console.log("mrr1     ")
    const data = await axios.get(`${API_URL}/timesheet/reject/${req.user.id}`);
    const userInfo = req.session.userInfo;


    const status = req.query.status;
    let statusMessage = "";

    if (status == 202) {
      statusMessage = "Update Successfully!"
    } else if (status == 500) {
      statusMessage = "Something went wrong. Try Again!"
    }



    res.render("user/manager/rejectedTimeSheets.ejs", {
      user: req.user,
      data: data.data,
      userInfo: userInfo,
      statusMessage: statusMessage,
      messages: req.flash(""),
      title: "Rejected Timesheets",
    });
  });

  


  router.post("/approveManager", isAuthenticated, async (req, res) => {
    const managerID = req.body.managerID;
    const userID = req.body.userID;
    const notificationID = req.body.notificationID;

    console.log("userID: " + userID);
    console.log("managerID: " + managerID);
    console.log("notificationID: " + notificationID);

    try {
        await axios.post(`${API_URL}/users/assignManager/${managerID}?userID=${userID}&notificationID=${notificationID}`);
        res.redirect("/notification");
    } catch (err) {
        console.log("ASSIGNing Manager error: ", err);
        res.status(500).send("Error assigning manager");
    }
});


router.get('/getTotalPendingTsByManagerId', isAuthenticated, async(req, res) => { 
  try {
    const pendingTs = await axios.get(`/timesheet/countPendingTsByManagerId/${req.user.id}`)
    res.json(pendingTs.data);
    
  } catch (error) {
    console.error('Error fetching Fetching Total number of Pending Ts:', error.message);
    res.status(500).json({ error: 'Error fetching total number of Pending Ts' });
  }
})





  return router;
};

export default createManagerRoutes;