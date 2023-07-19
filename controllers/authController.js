const validation = require("../helper/validation");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
// const validation = require(".api/helper/validation");

module.exports = {
  loginUser: async (req, res) => {
    try {
      let field = ["email", "otp"];
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
        //   get the data from body
        let { email, otp } = result.data;
        console.log(email);
        //   find the user in database through email
        let user = await User.findOne({ email });
        if (!user) {
          // return badRequest
          return res.status(404).json({
            data: {},
            error: "User not found",
          });
        }

        if (user.isVerified) {
          // return badRequest
          return res.status(403).json({
            data: {},
            error: "Email already verified. You can log in now.",
          });
        }

        // verify the otp
        if (otp !== user.otp) {
          return res.status(403).json({
            data: {},
            error: "Invalid OTP",
          });
        }

        // Update the user's record to set isVerified to true
        user.isVerified = true;
        await user.save();

        // Verification successful; generate and return a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        res.json({
          message: "Success",
          data: { token, user },
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  },
};
