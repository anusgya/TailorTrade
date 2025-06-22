const mongoose = require("mongoose");

const IsExperiencedOnSchema = new mongoose.Schema({
  seamster_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seamster",
    required: true,
  },
  experience_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AreasOfExperience",
    required: true,
  },
});

module.exports = mongoose.model("IsExperiencedOn", IsExperiencedOnSchema);
