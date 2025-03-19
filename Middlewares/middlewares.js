const joi = require("joi");
const env = require("dotenv");
env.config();

const signupValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().min(6).required().email(),
    password: joi.string().min(4).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Invalid Name, Email or Password",
      error: error?.message || error,
    });
  }
  next();
};

const loginValidation = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().min(6).required().email(),
    password: joi.string().min(4).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Invalid Email or Password",
      error: error?.message || error, // Ensures error is properly formatted
    });
  }
  next();
};

const orderVerification = (req, res, next) => {
 

  next();
 
};

module.exports = { signupValidation, loginValidation, orderVerification};
