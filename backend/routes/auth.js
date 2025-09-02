require('dotenv').config();
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
// ROUTE 1 : Create a User using: POST "/api/auth/createuser".No login required
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
  body('mobile', 'mob no must be atleast 10 characters').isLength({ min: 10 }),
], async (req, res) => {
  const errors = validationResult(req);
  let success = false;
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success, error: "Sorry a user with this eamil already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt)
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
      mobile: req.body.mobile,
      image: '',
      gender: '',
      waitTime: 5
    })

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    // res.json(user)
    success = true;
    res.json({ success, authtoken });
  }
  catch (err) {
    console.log(err.message);
    res.status(500).send("Some error occurred");
  }
})

// ROUTE 2 : Authenticate a User using : Post "/api/auth/login".No login requiered
router.post('/login', [

  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {

  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success = false;
      return res.status(400).json({ msg: "Invalid credentials" })
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({ success, msg: 'Invalid Credentials' })
    }
    const data = {
      user: {
        id: user.id
      }
    }

    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken });
  }
  catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server error");
  }

});


// ROUTE 3 : Get loggedin User Details using : POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server error");
  }
})


router.post("/userdata", async (req, res) => {
  const { token } = req.body;
  try {
    const data = jwt.verify(token, JWT_SECRET);
    const user = data.user
    console.log(user)
    const userId = user.id;

    User.findById(userId).then((data) => {
      if (!data) {
        return res.status(404).send({ error: "User not found" });
      }
      return res.status(200).send({ status: "Ok", data: data });
    }).catch(err => {
      console.error("Error finding user:", err);
      return res.status(500).send({ error: "Internal server error" });
    });
  } catch (error) {
    console.error("Error decoding token:", error);
    return res.status(401).send({ error: "Invalid token" });
  }
});


router.post("/update-user", async (req, res) => {
  const { name, email, mobile, image, gender, waitTime } = req.body;
  try {
    await User.updateOne(
      { email: email },
      {
        $set: {
          name,
          mobile,
          image,
          gender,
          waitTime,
        },
      }
    );
    res.send({ status: "Ok", data: "Updated" });
  } catch (error) {
    return res.send({ error: error.message });
  }
});


router.post('/forgot-password', async (req, res) => {

  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const verificationCode = crypto.randomBytes(4).toString('hex');
    const verificationCodeExpires = Date.now() + 3600000;
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Password Reset Verification Code',
      text: `Your verification code is ${verificationCode}. It will expire in 1 hour.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: 'Failed to send email', error });
      }
      res.json({ success: true, message: 'Verification code sent' });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.verificationCode !== code) {
      return res.status(400).json({ success: false, message: 'Invalid code or email' });
    }

    if (Date.now() > user.verificationCodeExpires) {
      return res.status(400).json({ success: false, message: 'Verification code has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/update-password', async (req, res) => {
  try {
    const { token, currentPassword, newPassword } = req.body;
    const data = jwt.verify(token, JWT_SECRET);
    const usertoken = data.user
    console.log(usertoken)
    const userId = usertoken.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router