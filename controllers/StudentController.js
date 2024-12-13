const student = require("../models/StudentModel");
const jwt = require("jsonwebtoken");

secret = "Student@12";

const StudentSign = async (req, res) => {
  const { name, regno, branch, joiningYear, studentphno, parentphno } =
    req.body;
  try {
    const sign = await student.findOne({ regno: regno });
    if (sign) {
      res.status(400).json({ message: "regno is already exists" });
    }

    const studentreg = await student.create({
      name,
      regno,
      branch,
      joiningYear,
      studentphno,
      parentphno,
    });
    if (studentreg) {
      res.status(200).json({ message: "Student rgistration successful" });
    } else {
      res.status(400).json({ message: "Error while registering" });
    }
  } catch (error) {
    console.log(error);
  }
};

const StudentLogin = async (req, res) => {
  const { regno } = req.body;
  // const password = "123456";

  try {
    const stlog = await student.findOne({ regno: regno });

    if (stlog) {
      const token = await jwt.sign({ stuId: stlog._id }, secret, {
        expiresIn: "1h",
      });
      res.status(200).json({ message: "Student login successful", token });
    } else {
      res.status(400).json({ message: "Invalid regno or password" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getStudents = async (req, res) => {
  try {
    const getStudent = await student.findById(req.stuId);
    if (!getStudent) {
      return res.status(400).json({ message: "Student not found" });
    }
    res.status(200).json(getStudent);
  } catch (error) {
    console.log(error);
  }
};

const StudentMarks = async (req, res) => {
  const { regno, subject, marks } = req.body;

  try {
    const studentRecord = await student.findOne({ regno });

    if (!studentRecord) {
      return res.status(400).json({ message: "Student not found" });
    }

    // Update the subject marks
    studentRecord.subjects.set(subject, marks);

    // Save changes to the database
    await studentRecord.save();

    return res
      .status(200)
      .json({ message: "Subject details added successfully" });
  } catch (error) {
    console.error("Error while adding subject details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const Stuattendence = async (req, res) => {
  const { regno, date, status } = req.body;

  try {
    const students = await student.findOne({ regno });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if attendance for the given date already exists
    const existingRecord = students.attendence.find(
      (record) => record.date.toISOString().split("T")[0] === date
    );

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Attendance for this date already exists" });
    }

    // Add new attendance record
    students.attendence.push({ date: new Date(date), status });
    await students.save();

    res.status(200).json({ message: "Attendance added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getMonthlyAttendance = async (req, res) => {
  const { regno, month, year } = req.query;

  try {
    const students = await student.findOne({ regno });

    if (!students) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Filter attendance for the given month and year
    const monthlyAttendance = students.attendence.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() + 1 === parseInt(month, 10) &&
        recordDate.getFullYear() === parseInt(year, 10)
      );
    });

    // Calculate attendance percentage
    const totalDays = monthlyAttendance.length;
    const presentDays = monthlyAttendance.filter(
      (record) => record.status === "Present"
    ).length;
    const attendancePercentage = totalDays
      ? (presentDays / totalDays) * 100
      : 0;

    res.status(200).json({
      attendance: monthlyAttendance,
      totalDays,
      presentDays,
      attendancePercentage: attendancePercentage.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const FilterStu = async (req, res) => {
  const { branch, year } = req.query;
  try {
    if (!branch || !year) {
      return res.status(400).json({
        message: "Branch and year are required parameters.",
      });
    }

    const students = await student.find({ branch: branch, joiningYear: year });

    if (students.length === 0) {
      return res.status(404).json({
        message: "No students found for the given branch and year.",
      });
    }

    return res.status(200).json({
      message: "Students retrieved successfully.",
      students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  StudentSign,
  StudentLogin,
  StudentMarks,
  Stuattendence,
  FilterStu,
  getMonthlyAttendance,
  getStudents,
};
