const express = require("express");
const connectDB = require("./config/db");

const app = express();
connectDB();
//when on deployment it will choose avaible port on client side
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API Running");
});

//Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

//Testing git commands
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
