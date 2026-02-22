const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to read form data
app.use(express.urlencoded({ extended: true }));

// 🔴 Basic Session Setup (VULNERABLE)
app.use(
  session({
    secret: "secretkey123",
    resave: false,
    saveUninitialized: true,
  })
);

// Show login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

// 🔓 LOGIN (NO SESSION BINDING)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    req.session.user = username;

    // ❌ No IP binding
    // ❌ No User-Agent binding
    // ❌ No environment verification

    res.redirect("/dashboard");
  } else {
    res.send("Invalid Credentials");
  }
});

// 🔓 WEAK PROTECTED DASHBOARD
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

// 🚪 Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`⚠️ Vulnerable server running on http://localhost:${PORT}`);
});