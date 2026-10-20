// Tiny first server. Just proves the setup works.
// We will expand this file as we build the inventory app.

const express = require("express");

const app = express();
const PORT = 3001;

// A test route: visiting http://localhost:3001 returns a greeting.
app.get("/", (req, res) => {
  res.json({
    message: "Inventory app backend is running!",
  });
});

app.listen(PORT, () => {
  console.log(`Backend listening at http://localhost:${PORT}`);
});
