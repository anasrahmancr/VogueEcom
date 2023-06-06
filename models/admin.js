const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminName: {type: String, required: true, unique: true},
  adminEmail: {type: String, required: true, unique: true},
  adminPassword: {type: String, required: true}
});

const admin = mongoose.model('admin', adminSchema);

module.exports = admin;
