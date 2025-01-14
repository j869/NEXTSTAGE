import { Router } from "express";
import axios from "axios";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";


import handleError from "../utils/handleError.js";


const createResetPasswordRoutes = () => {

  const router = Router();
  const API_URL = process.env.API_URL;

  router.get("/", (req, res) => {

    const email = req.query.email;
    const token = req.query.token;


    res.render("resetPassword.ejs", {
      token: token,
      email: email, 
      title: "Request Password Reset",
      messages: req.flash("messages"),

    });
  });

  router.post("/", async (req, res) => {
   const token = req.body.token;
    try {

       
        console.log("token: " + token);
      const tokenVerification = await axios.post(`${API_URL}/users/verifyResetPassToken`, {
        token: token,
      });

      console.log("verification", tokenVerification.data);

      if (!tokenVerification.data.valid) {
        req.flash("messages", "Token is Invalid or Expired!");
        return res.redirect("/passwordReset/requestReset");
      } else { 
        const password = req.body.newPassword;
        const hashedPassword = await bcrypt.hash(password, 10);

        await axios.post(`${API_URL}/users/resetPassword`, {
          password: hashedPassword,
          token: token,
        });

        req.flash("messages", "You have successfully reset your password. You can now login!");
        return res.redirect("/login");
      }


    } catch (error) {
      handleError(error, req, res)
    }

   



    
  });

  router.get("/verify",async (req, res) => {
    
    try {
      const token = req.query.token;

    const tokenVerification = await axios.post(`${API_URL}/users/verifyResetPassToken`, {
      token: token,
    });
    console.log("verificatino Token: " + tokenVerification.data.valid)

    if (!tokenVerification.data.valid) {
      req.flash("messages", "Token is Invalid or Expired!");
      return res.redirect("/passwordReset/requestReset");
    } else {
      res.redirect("/passwordReset?token=" + tokenVerification.data.token);
    }
    } catch (error) {
      handleError(error, req, res)
    }
    

  })



  router.get("/requestReset", (req, res) => {

    const email = req.query.email;

    res.render("requestReset.ejs", {
    email: email, 
      title: "Request Password Reset",
      messages: req.flash("messages"),
    });
  });

  router.post("/requestReset", async (req, res) => {
    try {
      const email = req.body.email;

    
      const validEmail = await axios.post(`${API_URL}/users/checkValidEmail`, {
        email: email,
      });

      // console.log("valid EMail", validEmail.data);


      if (!validEmail.data.valid) {
        req.flash("messages", "Email is Not Verified, Please Use your verified email address!");
        return res.redirect("/passwordReset/requestReset");
      } else { 

          const verificationToken = crypto.randomBytes(20).toString("hex");
         
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
            subject: "Password Reset Request for Numbat Timekeeping",
            text: `Click the following link to reset your password: ${process.env.BASE_URL}/passwordReset/verify?token=${verificationToken}`,
          });


          await axios.post(`${API_URL}/users/insertResetPassToken`, {
            email: email,
            token: verificationToken,
          });




          



          
          console.log("ru6 user registered. check your email ");


        
        return res.redirect("/passwordReset/waitRequest");
      }
      
    } catch (error) {
      handleError(error, req, res);
    }
   







  })  

  router.get("/waitRequest", (req, res) => {

    const email = req.query.email;

    res.render("waitingPage.ejs", {
    email: email, 
      title: "Request Password Reset",
      messages: req.flash("messages"),
    });
  });

  
return router;
}

export default createResetPasswordRoutes;