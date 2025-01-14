    import { Router } from "express";
    import axios from "axios";
    import handleError from "../utils/handleError.js";
import { getUserScheduleByWorkDate } from "../utils/userScheduleUtils.js";
import { logUser } from "../utils/logging.js";
    // Function to create timesheet routes
    const createTimesheetRoutes = (isAuthenticated) => {
      const router = Router(); // Initialize the router
      const API_URL = process.env.API_URL; // Get the API URL from environment variables
      

      // POST route to handle flexi day off
      router.post("/flexiDayOff", isAuthenticated, async (req, res) => {

        const myManager = await axios.get(`${API_URL}/users/checkMyManger/${req.user.id}`);

    if (myManager.data.length == 0) {
      return res.redirect("/profile?status=noManager"); // Use return to stop further execution
    }
  
        const userID = req.user.id;
        const { dayOffOption, workDate, paidHour, flexiHours, tilHours } = req.body;
        let flexiInput = 0;
        let tilInput = 0;

        if (dayOffOption == 'til') {
          flexiInput = 0;
          tilInput = paidHour * -1;
        } else if(dayOffOption == 'flexi') {
          flexiInput = paidHour * -1;
          tilInput = 0;
        }

         else if(dayOffOption == 'mix'){
          flexiInput = flexiHours * -1;
          tilInput = tilHours * -1;
        }

        // console.log(req.body)

        try {
          // Make a POST request to the API to handle the flexi day off
          await axios.post(`${API_URL}/flexiDayOff/${userID}`, {
            dayOffOption,
            workDate,
            flexiInput: flexiInput,
            tilInput: tilInput,
            paidHour
            
          });
          return res.redirect(`/time?date=${workDate}#${new Date(workDate).getDay()}`);
          // Redirect to the timesheet page on success
        } catch (error) {
          handleError(error, req, res)


        }
      });


      // GET route to fetch and display an individual timesheet by ID
      router.get("/:id", isAuthenticated, async (req, res) => {
        const ts_id = req.params.id;

        try {
          // Make a GET request to the API to fetch the timesheet by ID
          const timesheetResult = await axios.get(`${API_URL}/timesheets/getTimesheetById/${ts_id}`);

          // Redirect if no data is found or if the user is not authorized to view the timesheet
          if (timesheetResult.data.length === 0 || 
              (timesheetResult.data[0].manager_id !== req.user.id && timesheetResult.data[0].user_id !== req.user.id)) {
            return res.redirect(req.get('referer') || '/time');
          }

          const userInfo = req.session.userInfo; // Get user information from the session
          const data = timesheetResult.data[0]; // Extract the timesheet data

          // Render the individual timesheet page
          res.render("timesheet/individualTimeSheet.ejs", {
            title: "Timesheet",
            user: req.user,
            userInfo,
            data,
            messages: req.flash("messages"),
          });
        } catch (error) {
          
          handleError(error, req, res)

          res.redirect("/time"); // Redirect to the timesheet page on error
        }
      });

      // GET route to edit a timesheet by ID
      router.get("/edit/:id", isAuthenticated, async (req, res) => {
        // console.log("GFCVBOASIJDBHJHANKSMLDBVGASGBHDMK<LAMSNBVDG BNASMKL ASVBNMSABBKJNMLS:")
        const ts_id = req.params.id;
        const { work_date: workDate } = req.query;
        const userInfo = req.session.userInfo;

      

        try {
          // Check if the user has a manager
          const myManager = await axios.get(`${API_URL}/users/checkMyManger/${req.user.id}`);
          if (myManager.data.length === 0) {
            return res.redirect("/profile?status=noManager");
          }

          // Fetch the pending timesheet data by ID and work date
          const tsData = await axios.get(`${API_URL}/timesheets/getPendingTimesheetById/${ts_id}?work_date=${workDate}`);
          if (tsData.data.length === 0) {
           
            return res.redirect("/time");
          }

          // console.log("AKLJSHDAJKSHDKLASJDHKLAJSDHLASJKD", tsData.data[0].time_total);

          if(tsData.data[0].time_total == '' || tsData.data[0].time_total == null  ) {
            req.flash("messages", "You cannot edit a leave or day off entry" );
            return res.redirect("/time");

          }

          const userId = req.user.id;
          const locationResponse = await axios.get(`${API_URL}/location`);
          const userScheduleResponse = await axios.get(`${API_URL}/userSchedule/${userId}`);
         
          const userSchedules = userScheduleResponse.data[0] ? userScheduleResponse.data : [] ;
              



          let userWorkSchedules = [];
          // console.log("the userscheduleResponse", userScheduleResponse.data)

          // Process user schedule if available
          if (userScheduleResponse.data.length !== 0) {
            const { 
              schedule_day: scheduleDays,
               paid_hours: paidHours,
                start_date: startDate,
                 end_date: endDate
                 } = userScheduleResponse.data[0];
            userWorkSchedules = getPayPeriods(new Date(startDate), new Date(endDate), scheduleDays, paidHours, userScheduleResponse, workDate);  
          // console.log("userSchedules", userSchedules)
          }

          // if (!userScheduleResponse.data.length < 1) {
          //   const scheduleDays = userScheduleResponse.data[0].schedule_day;
          //   const paidHours = userScheduleResponse.data[0].paid_hours;
          //   const startDate = new Date(userScheduleResponse.data[0].start_date);
          //   const endDate = new Date(userScheduleResponse.data[0].end_date);
      
          //   userSchedules = getPayPeriods(startDate, endDate, scheduleDays, paidHours, userScheduleResponse);
          //   // console.log("user schedules: ", userSchedules);
          // }

          const location = locationResponse.data; // Get location data
          const recentLocation = await axios.get(`${API_URL}/location/getRecentLocation/${userId}`);
          const flexTilRdo = await axios.post(`${API_URL}/tfr/${req.user.id}`);
          const selectedDate = workDate;


          // Redirect if no schedules are found
          if (userWorkSchedules.length === 0) {
            return res.redirect("/time?m=noSchedule");
          }

          console.log("user schedules: ", userScheduleResponse.data[0]);
          // Render the edit timesheet page
          res.render("timesheet/editTimesheet.ejs", {
            tsData: tsData.data[0],
            forDate: workDate,
            userInfo: userInfo,
            user: req.user,
            userWorkSchedule: userWorkSchedules,
            userSchedules: userSchedules,
            selectedDate,
            location,
            flexTilRdo: flexTilRdo.data[0],
            recentLocation: recentLocation.data,
            title: "Enter Timesheet",
            messages: req.flash("messages"),
          });
        } catch (error) {
          handleError(error, req, res)

          res.redirect("/time"); // Redirect to the timesheet page on error
          
        }
      });

      // Helper function to get the name of the day of the week
      function getDayOfWeekName(dayOfWeek) {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[dayOfWeek];
      }

      // Helper function to get pay periods
      function getPayPeriods(startDate, endDate, scheduleDays, paidHours, userScheduleResponse, workDate) {
        const allDateSchedules = [];
        
        let currentDate = new Date(startDate);
        let i = 0;
        let paidHour = 0;

        // Iterate through the dates to generate schedules
        while (currentDate <= endDate) {
          const dayOfWeek = currentDate.getDay();
          if (scheduleDays.includes(getDayOfWeekName(dayOfWeek))) {

            // if (i <= paidHours.length - 1) {
            //   paidHour = paidHours[i];
            //   i = i === paidHours.length - 1 ? 0 : i + 1; 
            // }

            if (i <= paidHours.length - 1) {
              paidHour = paidHours[i];
              if (i == paidHours.length - 1) {
                i = 0;
              } else {
                i += 1;
              }
            }


if (workDate == new Date(currentDate).toISOString().split("T")[0]) {
            allDateSchedules.push({
              date: currentDate.toISOString().split("T")[0],
              paidHour,
              start_date: startDate,
              end_date: endDate,
              user_id: userScheduleResponse.data[0].user_id,
              schedule_id: userScheduleResponse.data[0].schedule_id,
              disable_til: userScheduleResponse.data[0].disable_til,
              disable_flexi: userScheduleResponse.data[0].disable_flexi,
              disable_rdo: userScheduleResponse.data[0].disable_rdo,
            });
          }
        }
          currentDate.setDate(currentDate.getDate() + 1);
        }

        return allDateSchedules;
      }



      router.get("/leaveDay/add",isAuthenticated, async(req, res)=>{

        try {

          const myManager = await axios.get(`${API_URL}/users/checkMyManger/${req.user.id}`);
          if (myManager.data.length == 0) {
            return res.redirect("/profile?status=noManager"); // Use return to stop further execution
          }
          
          const date = req.query.date 
          // console.log(`y1   User wants to add a new timeshset`, date);
        
          if (!date) {
             req.flash("messages", "Please Select a date");
            res.redirect("/time");
          }

          const timesheetExists = await axios.post(
            `${API_URL}/timesheets/checkTimeSheetsExist`,
            { date: date, userID: req.user.id }
          );
      

          if (timesheetExists.data.timesheetExists) {
           req.flash("messages", "Timesheet already filled. Please delete it first!");
            res.redirect("/time");
          }

          const userScheduleResponse = await axios.get(`${API_URL}/userSchedule/${req.user.id}`);
          const userSchedules = userScheduleResponse.data[0] ? userScheduleResponse.data : [] ;
        


          const queryMessage = req.query.m;
          const userInfo = req.session.userInfo;

          const flexTilRdo = await axios.post(`${API_URL}/tfr/${req.user.id}`);
          console.log("ja;lsdkfjasdklfjalsdfj", flexTilRdo.data)
          const userWorkSchedules = await getUserScheduleByWorkDate(req,res, date)
          console.log("userSche", userSchedules)

          logUser(req, 'lda2 user is taking a day off')


          if (userSchedules.length === 0) {
            req.flash("messages", "You don't have a work schedule yet");
            res.redirect("/time");
          } else if (userSchedules[0].paid_hours.every(hour => hour <= 0)) {
            req.flash("messages", "User don't have a work schedule");
            res.redirect("/time");
          }

          res.render("timesheet/leaveDay.ejs", {
          title: "Leave For A Day",
          date: date,
          user: req.user,
          userInfo: userInfo,
          userWorkSchedule: userWorkSchedules,
          userSchedules: userSchedules,
          queryMessage: queryMessage,
          flexTilRdo: flexTilRdo.data[0],
          messages: req.flash("messages"),

        })
        } catch (error) {
          handleError(error, req, res)
        }

        

      
      })

      router.get('/exportTimesheetByManager/:id', async (req, res) => {
        const managerId = req.params.id;
        // console.log("ASDASDASDAS $%^&*()_*(&^%^&*(")
      
        // Validate if the logged-in user is the manager
        if (req.user.id !== parseInt(managerId, 10)) {
          // console.log("ASDASDASDASKLJHASHKHKASJHKAJHKASASDJHKASDHKLASDJHKLADJHKADJHKL")
          req.flash('messages', 'Unauthorized access');
          return res.redirect(req.get('referer') || '/time');
        } try {
          // Make a request to the server-side export endpoint
          const response = await axios.get(`${process.env.API_URL}/exportTimesheetsByManager/${managerId}`, {
            responseType: 'arraybuffer', // Ensure the response is treated as a binary file
            headers: {
              'Authorization': `Bearer ${req.user.token}` // Assuming you use token-based authentication
            }
          });

          // Log the response data for debugging
    console.log("Received data for export:", response.data);

      
          // Set headers to prompt download
          res.setHeader('Content-Disposition', `attachment; filename=TimesheetWorkbook_${Date.now()}_${managerId}.xlsx`);
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.send(response.data);
        } catch (error) {
          console.error('Error exporting timesheets:', error);
          req.flash('messages', 'Error exporting timesheets');
          res.redirect(req.get('referer') || '/time');
        }
      });


    router.post('/submitTimesheetStatus/:id', async (req, res)  => {
      const draft = req.body.draft;
      const tsId = req.params.id;

      console.log("DRAFT", draft)

      try {
        await axios.post(`${API_URL}/timesheet/submitTimesheetStatus/${tsId}`, {draft: draft});
        req.flash('messages', 'Status changed successfully');
        res.redirect(req.get('referer') || '/time');

      } catch (err) {

        console.error('Error submitting timesheet status:', err);
        req.flash('messages', 'Error submitting timesheet status');
        res.redirect(req.get('referer') || '/time');
      } 


    });

    router.post('/multipleSubmitTimesheetStatus', async (req, res)  => {
      let draft = req.body.action == 'draft' ? true : false;
      const userId = req.user.id;
      const ts_Ids = req.body.selectedTimesheetIds;

      console.log("DRAFT", draft);

      try {
        await axios.post(`${API_URL}/timesheet/multipleSubmitTimesheetStatus/${userId}`, {draft: draft, ts_Ids: ts_Ids});
        req.flash('messages', 'Status changed successfully');
        res.redirect(req.get('referer') || '/time');

      } catch (err) {

        console.error('Error submitting timesheet status:', err);
        req.flash('messages', 'Error submitting timesheet status');
        res.redirect(req.get('referer') || '/time');
      } 


    });


    router.get('/getWorkScheduleByDate', async (req, res) => {
      console.log("#$%^&*()")
        const date = req.query.date;

        // Validate the date format (YYYY-MM-DD)
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ error: 'Invalid date format. Expected format: YYYY-MM-DD' });
        }

        try {
            const userScheduleResponse = await axios.get(`${API_URL}/userSchedule/${req.user.id}`);
            const userSchedules = userScheduleResponse.data[0] ? userScheduleResponse.data : [];

            let paidHours = 0; // Initialize paidHours

            if (userSchedules.length > 0) {
                const scheduleDays = userSchedules[0].schedule_day;
                const paidHoursArray = userSchedules[0].paid_hours;
                const startDate = new Date(userSchedules[0].start_date);
                const endDate = new Date(userSchedules[0].end_date);

                // Get the paid hours for the specific date
                const allDateSchedules = getPayPeriods(startDate, endDate, scheduleDays, paidHoursArray);
                const scheduleForDate = allDateSchedules.find(schedule => schedule.date === date);
                paidHours = scheduleForDate ? scheduleForDate.paidHour : 0; // Set paidHours based on the found schedule
            }

            res.json({ paidHours }); // Send the paid hours back in the response
        } catch (error) {
            console.error('Error fetching user schedule:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/quickEntry',  isAuthenticated, async (req, res) => {

      try {
        const { date, scheduleHour, defaultTimeStart, defaultTimeBreak, comment, draft, lunchTime} = req.body;
        const totalHour = `${Math.floor(scheduleHour)}:${Math.round((scheduleHour % 1) * 60)}`.padStart(5, '0');
        console.log("Date:", date);
        console.log("Schedule Hour:", scheduleHour);
        console.log("Default Time Start:", defaultTimeStart);
        console.log("Default Time Break:", defaultTimeBreak);
        console.log("Comment:", comment);
        console.log("Draft:", draft);
        console.log("Lunch:", lunchTime);

        if (!date || !scheduleHour || !defaultTimeStart ) {
          req.flash('messages', 'Missing required fields');
          return res.redirect(req.get('referer') || '/time');
        }

        const myManager = await axios.get(`${API_URL}/users/checkMyManger/${req.user.id}`);

        if (myManager.data.length == 0) {
          req.flash('messages', 'No manager found');
          return res.redirect("/profile?status=noManager"); // Use return to stop further execution
        }

        const userScheduleResponse = await axios.get(`${API_URL}/userSchedule/${req.user.id}`);
        const userSchedules = userScheduleResponse.data[0] ? userScheduleResponse.data : [];

        if (userSchedules.length === 0) {
          req.flash('messages', 'No user work schedule found');
          return res.redirect(req.get('referer') || '/time');
        }

        const timesheetExists = await axios.post(
          `${API_URL}/timesheets/checkTimeSheetsExist`,
          { date: date, userID: req.user.id }
        ); 

        if (timesheetExists.data.timesheetExists) {
          req.flash('messages', 'Timesheet for this date already exists');
          return res.redirect(req.get('referer') || '/time');
        }

        if(!defaultTimeStart) {
          req.flash('messages', 'Default time start is required. Set your default time start in your profile');
          return res.redirect(req.get('referer') || '/time');
        }

        // Calculate time_finish based on schedule hour
        const timeFinish = calculateTimeFinish(defaultTimeStart, scheduleHour, defaultTimeBreak, lunchTime);
        console.log(
          "CALCULATE TIME FINISH", timeFinish
        )
        const timesheetData = {
          person_id: req.user.id,
          username: req.user.username,
          work_date: date,
          comment: comment,
          time_start: defaultTimeStart.substring(0, 5),
          time_finish: timeFinish,
          time_total: totalHour,
          entry_date: new Date(),
          draft,
          status: 'entered',
          time_lunch: lunchTime,
        };

        
        await axios.put(`${API_URL}/timesheets`, timesheetData);
        
        const scanIssueResult = await axios.put(`${API_URL}/timesheet/scanIssues`, {
          person_id: req.user.id,
          username: req.user.username,
          work_date: date,
          time_total: totalHour,
          t_comment: comment,
          entry_date: new Date(),
           // 1 for work day, 0 if activity name begins with "Rest Day", ie. "Rest Day (Planned Burning)".
          duty_category: null,
          status: "entered",
          
        }, (err, req) => {
          if (err) {
            console.error('Error scanning issues:', err);
            req.flash('messages', 'Error scanning issues');
            res.redirect(req.get('referer') || '/time');
          }
        });

        console.log("n30   res.status: ", scanIssueResult.status);
        req.flash('messages', 'Timesheet submitted successfully');
        res.redirect(req.get('referer') || '/time');



      } catch (error) {
        console.error('Error submitting timesheet:', error);
        req.flash('messages', 'Error submitting timesheet');
        res.redirect(req.get('referer') || '/time');
      }
    });

    // Function to calculate time_finish
    function calculateTimeFinish(defaultTimeStart, scheduleHour, defaultTimeBreak, lunchTime) {
      // Ensure valid inputs
      if (!defaultTimeStart || scheduleHour === undefined || !defaultTimeBreak || lunchTime === undefined) {
        console.error("Invalid inputs:", { defaultTimeStart, scheduleHour, defaultTimeBreak, lunchTime });
        return "00:00"; // Return a default value if inputs are invalid
      }

      // Convert defaultTimeStart to 24 hour format
      const startTimeParts = defaultTimeStart.split(':');
      const startHour = parseInt(startTimeParts[0]);
      const startMinute = parseInt(startTimeParts[1]);
      const startSecond = parseInt(startTimeParts[2] || '0'); // Default to 0 if not provided

      console.log("Start Time:", { startHour, startMinute, startSecond });

      // Parse defaultTimeBreak (assuming it's in minutes)
      const breakMinutes = parseInt(defaultTimeBreak); // Assuming defaultTimeBreak is in minutes
      const lunchMinutes = parseInt(lunchTime); // Assuming lunchTime is in minutes

      console.log("Break Minutes:", breakMinutes);
      console.log("Lunch Minutes:", lunchMinutes);

      // Calculate total minutes from start time
      const totalMinutes = (startHour * 60) + startMinute + startSecond + breakMinutes + lunchMinutes;
      console.log("Total Minutes:", totalMinutes);

      // Calculate hours and minutes from scheduleHour
      const hours = Math.floor(scheduleHour);
      const minutes = Math.round((scheduleHour - hours) * 60);

      console.log("Schedule Hours:", hours);
      console.log("Schedule Minutes:", minutes);

      // Calculate finish time in minutes
      const finishMinutes = totalMinutes + (hours * 60) + minutes;
      const finishHour = Math.floor(finishMinutes / 60);
      const finishMinute = finishMinutes % 60;

      console.log("Finish Time (in minutes):", finishMinutes);
      console.log("Calculated Finish Time:", { finishHour, finishMinute });

      return `${finishHour.toString().padStart(2, '0')}:${finishMinute.toString().padStart(2, '0')}`;
    }




      return router;
    };


    export default createTimesheetRoutes;
