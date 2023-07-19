const validation = require("../helper/validation");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const sendOtpEmail = async (email, otp) => {
  // / setup SMTP for nodeMailer
  const Transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Setup email data
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Email Verification OTP",
    text: `Your OTP for email verification is: ${otp}`,
  };

  // Send the email
  Transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  registerUser: async (req, res) => {
    try {
      let field = ["firstName", "lastName", "email", "phoneNo"];

      // Validate the data
      let result = await validation.validation(req.body, field);
      if (result.hasError) {
        //if has any error in input field
        return res.badRequest({
          status: ResponseCodes.BAD_REQUEST,
          data: {},
          message: Object.keys(result.errors).length,
          error: result.errors,
        });
      } else {
        //   get the data
        let { firstName, lastName, email, phone } = result.data;

        //   find the user in database through email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          // return badRequest
          return res.status(403).json({
            data: {},
            error: "Email is already existed ",
          });
        } else {
          //   generate OTP
          const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit OTP

          //   create user in database
          const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            otp,
          });

          // Send the OTP to the user's email
          await sendOtpEmail(email, otp);

          //   susccess Response
          res.json({
            message:
              "Registration successful. Please check your email for OTP verification.",
          });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Something went wrong",
        error: error.toString(),
      });
    }
  },
};
