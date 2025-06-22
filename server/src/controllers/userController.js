const User = require("../models/User");
const Seamster = require("../models/Seamster");
const Customer = require("../models/Customer");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

exports.getUserById = async (req, res) => {
  const { _id } = req.params;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.user_role === "seamster") {
      const seamster = await Seamster.findOne({ seamster_id: _id }).populate(
        "seamster_id"
      );
      return res.status(200).json(seamster);
    } else if (user.user_role === "customer") {
      const customer = await Customer.findOne({ customer_id: _id }).populate(
        "customer_id"
      );
      return res.status(200).json(customer);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllSeamsters = async (req, res) => {
  try {
    const seamsters = await Seamster.find().populate({
      path: "seamster_id",
      populate: {
        path: "_id",
      },
    });
    return res.status(200).json(seamsters);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().populate({
      path: "customer_id",
      populate: {
        path: "_id",
      },
    });
    return res.status(200).json(customers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getSeamsterById = async (req, res) => {
  const { _id } = req.params;

  try {
    const seamster = await Seamster.findOne({ seamster_id: _id }).populate(
      "seamster_id"
    );

    if (!seamster) {
      return res.status(404).json({ error: "Seamster not found" });
    }

    return res.status(200).json(seamster);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getCustomerById = async (req, res) => {
  const { _id } = req.params;

  try {
    const seamster = await Seamster.findOne({ seamster_id: _id }).populate(
      "seamster_id"
    );

    if (!seamster) {
      return res.status(404).json({ error: "Seamster not found" });
    }

    return res.status(200).json(seamster);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const { first_name, last_name, email, phone, province, city, street } =
      req.body;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (req.body.gender) user.gender = req.body.gender;
    if (province || city || street) {
      if (user.address) {
        await Address.findByIdAndUpdate(user.address, {
          province: province || user.address.province,
          city: city || user.address.city,
          street: street || user.address.street,
        });
      } else {
        const newAddress = await Address.create({
          user: user._id,
          province,
          city,
          street,
        });
        user.address = newAddress._id;
      }
    }

    if (req.file) {
      if (user.profile_picture) {
        await Image.findByIdAndUpdate(user.profile_picture, {
          filename: req.file.filename,
          path: req.file.path,
          contentType: req.file.mimetype,
        });
      } else {
        const newImage = new Image({
          filename: req.file.filename,
          path: req.file.path,
          contentType: req.file.mimetype,
          type: "profile",
          user: user._id,
        });
        await newImage.save();
        user.profile_picture = newImage._id;
      }
    }

    await user.save();

    if (user.user_role === "customer") {
    } else if (user.user_role === "seamster") {
      if (req.body.bio) {
        await Seamster.findOneAndUpdate(
          { seamster_id: user._id },
          { bio: req.body.bio }
        );
      }
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: user, // Fix this line
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    return res.status(500).json({ error: error.message });
  }
};
