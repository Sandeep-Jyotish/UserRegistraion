const { constants } = require("../config/constants");

const { Validator, ValidationRules, CustomValidationMsg } = constants;
module.exports = {
  validation: async function (data, requiredRules) {
    let result = {};
    //getting the rules from the constants.js related to User
    let Rules = ValidationRules.User;

    let checks = {};
    let dataValues = {};
    //looping all the rules and getting the rules that are required
    requiredRules.forEach((property) => {
      checks[property] = Rules[property];
    });

    requiredRules.forEach((property) => {
      if (data[property] === "" || data[property] === undefined) {
        data[property] = null;
      }
      dataValues[property] = data[property];
    });

    //if the user provide empty value or provide space
    Object.keys(dataValues).forEach(function (key) {
      if (typeof dataValues[key] === "string") {
        dataValues[key] = dataValues[key].trim();
      }
      if (dataValues[key] === "") {
        dataValues[key] = null;
      }
      if (key === "isActive") {
        dataValues[key] = dataValues[key] === "true" ? true : false;
      }
    });

    // Set the checks that you want to validate before create
    let validation = new Validator(data, checks, CustomValidationMsg);
    if (validation.passes()) {
      //if all rules are satisfied
      result["hasError"] = false;
      result["data"] = dataValues;
    }
    if (validation.fails()) {
      //if any rule is violated
      result["hasError"] = true;
      result["errors"] = validation.errors.all();
    }
    return result;
  },
};
