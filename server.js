const express = require("express");
const connectDB = require("./config/db");

const app = express();
//Connect Databases
connectDB();

//Init Middleware
//look at the notes it was different back then.And the reason we use this!!!
//urlencoded parse input areas this parse json object
app.use(express.json({ extended: false }));
//when on deployment it will choose avaible port on client side
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.sendFile("API running");
});

//Define Routes
//DO NOT FORGET TO PUTT "/" BEFORE ANYTHING THAT NEEDS IT!!!!
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
