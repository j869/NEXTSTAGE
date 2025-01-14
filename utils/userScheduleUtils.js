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



const getUserScheduleByWorkDate = async(req, res, date) => {

const API_URL = process.env.API_URL;
const locationResponse = await axios.get(`${API_URL}/location`);
const userScheduleResponse = await axios.get(`${API_URL}/userSchedule/${req.user.id}`);

    let allDateSchedules = [];
    let userSchedules = [];


    console.log("the user schedule", userScheduleResponse.data);

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
      let currentDate = new Date(startDate);
      let i = 0;
      let paidHour = 0;
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

          if (date == new Date(currentDate).toISOString().split("T")[0]) {
            allDateSchedules.push({
              date: new Date(currentDate).toISOString().split("T")[0],
              paidHour: paidHour,
              start_date: userScheduleResponse.data[0].start_date,
              end_date: userScheduleResponse.data[0].end_date,
              user_id: userScheduleResponse.data[0].user_id,
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

    return userSchedules;
    
}

export {getUserScheduleByWorkDate}