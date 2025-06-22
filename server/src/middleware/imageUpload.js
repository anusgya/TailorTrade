const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define storage paths
const storagePaths = {
  profilePic: path.join(__dirname, "../uploads/profilePic"),
  postImage: path.join(__dirname, "../uploads/postImage"),
};

// Ensure directories exist
Object.keys(storagePaths).forEach((key) => {
  if (!fs.existsSync(storagePaths[key])) {
    console.log(`Creating directory at: ${storagePaths[key]}`);
    fs.mkdirSync(storagePaths[key], { recursive: true });
  }
});

// Dynamic storage configuration based on the type of image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.body.image_type; // Ensure this is exactly either 'profilePic' or 'postImage'
    console.log(type);
    if (!type || !storagePaths[type]) {
      const error = new Error(
        `Invalid image type provided: ${type}. Please specify 'profilePic' or 'postImage'.`
      );
      console.error(error);
      return cb(error);
    }

    const destinationPath = storagePaths[type];
    console.log(`Using destination path for ${type}: ${destinationPath}`);
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    const newFilename = `${Date.now()}-${file.originalname}`;
    console.log(`Using filename: ${newFilename}`);
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
