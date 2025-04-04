const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Load users
const USERS_FILE = "users.json";

// Read existing users
function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Write users
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Signup API
app.post("/signup", (req, res) => {
  const { username, password, role } = req.body;
  const users = readUsers();
  const existing = users.find(u => u.username === username);

  if (existing) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password, role });
  writeUsers(users);
  res.json({ message: "Signup successful" });
});

// Login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful", role: user.role });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});