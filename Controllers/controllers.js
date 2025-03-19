const userSchema = require("../Models/user");
const orderSchema = require ("../Models/order")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userSchema.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User Already Exists with this Email",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userSchema({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(200).json({ message: "User Saved Successfully", success: true });
  } catch (err) {
    res.status(400).json({ message: "Error in Saving User", success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res
        .status(409)
        .json({ message: "Email or Passwor is wrong", success: false });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "Invalid Password", success: false });
    }

    const token = jwt.sign(
      { email: user.email ,name:user.name,  _id: user._id },
      process.env.JWT_Secret
     
    );

    res
      .status(200)
      .cookie("token", token)
      .json({ message: "Login Successfully", success: true, token });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Something Went Wrong...", success: false });
  }
};

const order = async(req,res)=>{

  try {
    const {email, checkoutItems, shippingAddress } = req.body;
    
    if (!email,!shippingAddress || !checkoutItems ) {
      return res.status(400).json({ message: "Missing order details" });
    
    }
    

    const newOrder = new orderSchema({email,checkoutItems,shippingAddress});
    await newOrder.save();

    res.status(201).json({ message: "Order created successfully", success:true, order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error,success:false });
  }

}

const myOrders = async (req, res) => {
  try {
    const { email } = req.body; // Extract email from request body

    if (!email) {
      return res.status(400).json({ message: "Email is required", success: false });
    }

    const myOrders = await orderSchema.find({ email: email }); // Fetch all orders

    if (!myOrders || myOrders.length === 0) {
      return res.status(404).json({ message: "No orders found", success: false });
    }

    res.status(200).json({ message: "Orders found", success: true, myOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

const orderDetails = async (req, res) => {
  const { ID } = req.body;
  
  if (!ID) {
    return res.status(400).json({ message: "Order ID is required", success: false });
  }

  try {
    const order = await orderSchema.findOne({ _id: ID });

    if (!order) {
      return res.status(404).json({ message: "No orders found", success: false });
    }

    res.status(200).json({ message: "Order found", success: true, order });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};


module.exports = { signup, login,order,myOrders,orderDetails };
