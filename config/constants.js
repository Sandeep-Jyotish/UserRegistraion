require("dotenv").config();
// for field validation
const Validator = require("validatorjs");
// custom message to display if error is thrown by validatorjs
const CustomValidationMsg = {
  regex: ":attribute format is not valid",
  required: "Please enter :attribute",
  max: "The :attribute is too long. Maximum length is :max.",
  min: "The :attribute is too short. Minnimum length is :min.",
  required_if: "Please enter :attribute",
  required_unless: "Please enter :attribute",
};

//Validation Rules
const ValidationRules = {
  User: {
    firstName: "string|max:128",
    lastName: "string|max:128",
    email: "email",
    phoneNo: "string",
    otp: "string",
  },
};

module.exports.constants = {
  Validator,
  ValidationRules,
  CustomValidationMsg,
};
