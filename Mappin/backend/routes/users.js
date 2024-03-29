const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");

//Register
router.post("/", async (req, res) => {
  try {
    // generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and send response
    const user = await newUser.save();
    res.status(200).json({ message: "user created successfully", user: user });
  } catch (err) {
    res.status(500).json({ message: "unsuccessfully ", err });
  }
});

// login api

router.post("/login", async (req, res) => {

  try {
    //find user
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Wrong username or password");
    // Validate password
    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validatePassword && res.status(400).json("Wrong username or password");

				// send response 

				res.status(200).json({message:"logged in successfully",_id:user._id, username:user.username})
  } catch (err) {
    res.status(500).json("interval server error")
  }
});

module.exports = router;
