const express = require("express");

const app = express();
//when on deployment it will choose avaible port on client side
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
