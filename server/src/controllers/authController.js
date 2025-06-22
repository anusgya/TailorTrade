const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Address = require("../models/Address");
const Customer = require("../models/Customer");
const Seamster = require("../models/Seamster");
const { validationResult } = require("express-validator");
const Image = require("../models/Image");
const { raw } = require("express");

exports.getMe = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    // console.log("from backend", token);
    if (!token) {
      return res
        .status(401)
        .json({ error: "No token provided, authorization denied." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id)
      .select("-password_hash")
      .populate({
        path: "address",
      })
      .populate({
        path: "profile_picture",
      })
      .exec();
    // user.profile_picture.path = `http://localhost:8080/uploads/${user.profile_picture.type}/${post.profile_picture.filename}`; // Exclude password hash from the result
    // console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(user);
    if (user.profile_picture) {
      user.profile_picture.path = `http://localhost:8080/uploads/${user.profile_picture.type}/${user.profile_picture.filename}`;
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) throw error;

        res.cookie("accessToken", token, {
          httpOnly: false,
          // secure: process.env.NODE_ENV === "production",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000, // 1 day
          sameSite: "None",
        });

        // res.cookie("user", "John Doe", { maxAge: 900000, httpOnly: true });

        return res
          .status(200)
          .send({ message: "Logged in successfully", token, user: user });
      }
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      user_role,
      email,
      password,
      phone,
      province,
      city,
      street,
      gender,
    } = req.body;

    console.log("this is file", req.file);
    // Check if the user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    let newUser;
    try {
      newUser = await User.create({
        first_name,
        last_name,
        user_role,
        email,
        password_hash: hashedPassword,
        phone,
        gender,
      });
      await newUser.save();
    } catch (error) {
      console.log(`${error} in creating user`);
      return res.status(500).json({ error: "Failed to create user" });
    }

    // Create the address for the user
    try {
      const address = await Address.create({
        user: newUser._id,
        province,
        city,
        street,
      });

      // Assign the address to the user
      newUser.address = address._id;
      await newUser.save();
    } catch (error) {
      console.log(`${error} in creating address`);
      return res.status(500).json({ error: "Failed to create address" });
    }

    // Create the image for the user profile picture
    try {
      const newImage = new Image({
        filename: req.file.filename,
        path: req.file.path,
        contentType: req.file.mimetype,
        type: req.body.image_type,
        user: newUser._id, // Associate the image with the user
      });

      // Save the image
      await newImage.save();

      // Assign the profile picture to the user
      newUser.profile_picture = newImage._id;
      await newUser.save();
    } catch (error) {
      console.log(`${error} in creating image`);
      return res.status(500).json({ error: "Failed to create image" });
    }

    // Depending on user_role, create customer or seamster
    if (newUser.user_role === "customer") {
      const newCustomer = await Customer.create({
        customer_id: newUser._id,
      });
      return res.status(201).json({
        message: "Customer created successfully",
        user: newUser,
        customer: newCustomer,
      });
    } else if (newUser.user_role === "seamster") {
      const newSeamster = await Seamster.create({
        seamster_id: newUser._id,
        bio: req.body.bio,
      });
      return res.status(201).json({
        message: "Seamster created successfully",
        user: newUser,
        seamster: newSeamster,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// exports.register = async (req, res) => {
//   try {
//     const {
//       first_name,
//       last_name,
//       user_role,
//       email,
//       password,
//       phone,
//       province,
//       city,
//       street,
//       gender,
//     } = req.body;

//     // Create the user without profile picture first
//     const newUser = await User.create({
//       first_name,
//       last_name,
//       user_role,
//       email,
//       password_hash: hashedPassword,
//       phone,
//       gender,
//     });

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     // Create the address for the user
//     const address = await Address.create({
//       user: newUser._id,
//       province,
//       city,
//       street,
//     });

//     // Update the user with the address reference
//     newUser.address = address._id;
//     await newUser.save();

//     // Create the image for the user
//     const newImage = new Image({
//       filename: req.file.filename,
//       path: req.file.path,
//       contentType: req.file.mimetype,
//       type: req.body.image_type,
//       user_id: newUser._id, // Assign user_id to the image
//     });

//     await newImage.save();

//     // Depending on user_role, create customer or seamster
//     if (newUser.user_role === "customer") {
//       const newCustomer = await Customer.create({
//         customer_id: newUser._id,
//       });
//       return res.status(201).json({
//         message: "Customer created successfully",
//         user: newUser,
//         customer: newCustomer,
//       });
//     } else if (newUser.user_role === "seamster") {
//       const newSeamster = await Seamster.create({
//         seamster_id: newUser._id,
//         bio: req.body.bio,
//       });
//       return res.status(201).json({
//         message: "Seamster created successfully",
//         user: newUser,
//         seamster: newSeamster,
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

exports.logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out.");
};
