const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
    required: true,
  },
});

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  regno: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  joiningYear: {
    type: String,
    required: true,
  },
  studentphno: {
    type: String,
    required: true,
  },
  parentphno: {
    type: String,
    required: true,
  },
  subjects: {
    type: Map,
    of: Number,
  },
  attendence: {
    type: [AttendanceSchema],
    default: [],
  },
});

const student = new mongoose.model("StudentDetails", StudentSchema);
module.exports = student;
