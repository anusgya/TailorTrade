const mongoose = require('mongoose');

const AreasOfExperienceSchema = new mongoose.Schema({
  experience_name: { type: String, required: true }
});

module.exports = mongoose.model('AreasOfExperience', AreasOfExperienceSchema);
