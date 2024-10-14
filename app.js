const fs = require("fs");
const express = require("express");
const { styleText } = require("util");
const { json } = require("body-parser");
const app = express();
app.use(express.json());

let studentData = null;

function getId() {
  return Object.keys(studentData).length + 1;
}

function getRollNumber() {
  maxRollNumber = 0;
  Object.values(studentData).map((student) =>
    student.rollNumber > maxRollNumber
      ? (maxRollNumber = student.rollNumber)
      : (maxRollNumber = maxRollNumber)
  );
  return maxRollNumber + 1;
}

function checkIdValiity(id) {
  if (studentData[`student-${id}`]) {
    return true;
  } else {
    return false;
  }
}

function writeFile(data) {
  fs.writeFile("Students.json", JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.log("error writing file", err);
    }
  });
}

fs.readFile("Students.json", "utf-8", (err, data) => {
  if (err) {
    return console.log("could not read file : ", err);
  } else {
    studentData = JSON.parse(data);
  }
});

app.get("/listStudents", (req, res) => {
  res.status(200).send(JSON.stringify(studentData));
});

app.get("/showStudent/:id", (req, res) => {
  const id = req.params.id;
  if (checkIdValiity(id)) {
    res.send(JSON.stringify(studentData[`student-${id}`]));
  } else {
    res.status(404).json({ error: "could not find id" });
  }
});

app.post("/addStudent", (req, res) => {
  const id = getId();
  const rollNumber = getRollNumber();
  const newStudent = req.body;
  newStudent["rollNumber"] = rollNumber;
  studentData[`student-${id}`] = newStudent;
  writeFile(studentData);
  res.status(201).json(newStudent);
});

app.put("/changeStudent/:id", (req, res) => {
  const id = req.params.id;
  if (checkIdValiity(id)) {
    const editedStudent = req.body;
    studentData[`student-${id}`] = editedStudent;
    writeFile(studentData);
    res.status(201).json(editedStudent);
  } else {
    res.status(404).json({ error: "could not find id" });
  }
});

app.patch("/updateStudent/:id", (req, res) => {
  const id = req.params.id;
  if (checkIdValiity(id)) {
    const updatedUser = { ...studentData[`student-${id}`], ...req.body };
    studentData[`student-${id}`] = updatedUser;
    writeFile(studentData);
    res.status(201).json(updatedUser);
  } else {
    res.status(404).json({ error: "could not find id" });
  }
});

app.delete("/deleteStudent/:id", (req, res) => {
  const id = req.params.id;
  if (checkIdValiity(id)) {
    delete studentData[`student-${id}`];
    writeFile(studentData);
    res.status(200).json({ message: "student deleted" });
  } else {
    res.status(404).json({ error: "could not find id" });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log("app is running on port: ", port);
});
