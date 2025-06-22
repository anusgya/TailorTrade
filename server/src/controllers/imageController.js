const Image = require("../models/Image");
const User = require("../models/User");

// Example for uploadImage function
exports.uploadImage = async (req, res) => {
  // Extract data from the request
  const { user_id, type } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  // Validate user
  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Create a new image record using the Image model
    const newImage = new Image({
      filename: file.filename,
      path: file.path,
      contentType: file.mimetype,
      user: user_id,
      type: type,
    });

    // Save the new image record to the database
    await newImage.save();

    // Send a successful response back
    res.status(200).send({
      message: "Image uploaded successfully",
      image: {
        id: newImage._id,
        path: newImage.path,
        type: newImage.type,
      },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res
      .status(500)
      .send({ message: "Error uploading image", error: error.message });
  }
};

exports.getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params._id);
    if (!image) {
      return res.status(404).send("Image not found");
    }

    res.contentType(image.contentType);
    res.sendFile(image.path, { root: "." });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getImagesByUserId = async (req, res) => {
  try {
    const images = await Image.find({ user: req.params._id });
    if (images.length === 0) {
      return res.status(404).send("No images found for this user");
    }

    res.status(200).json(images);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find();
    if (images.length === 0) {
      return res.status(404).send("No images found");
    }

    res.status(200).json(images);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
