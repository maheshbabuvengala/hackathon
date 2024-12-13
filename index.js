const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const FacultyRoutes = require("./routes/FacultyRoutes");
const StudentRoutes = require("./routes/StudentRoutes");

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

mongoose
  .connect("mongodb://localhost:27017/Student_Droupout")
  .then(() => console.log("Mongodb Connected successfully"))
  .catch((error) => console.log(error));

app.use(express.json());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use("/faculty", FacultyRoutes);
app.use("/student/", StudentRoutes);

app.listen(3000, () => {
  console.log("Server running successfully");
});
