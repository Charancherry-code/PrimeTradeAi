require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Task = require("./models/Task");
const connectDb = require("./config/db");

const seed = async () => {
  try {
    // Connect to database first
    await connectDb();

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash("AdminPass123", 10);
    const admin = await User.create({
      name: "Admin User",
      email: "admin@primetrade.ai",
      password: adminPassword,
      role: "admin",
    });

    // Create regular user
    const userPassword = await bcrypt.hash("UserPass123", 10);
    const user = await User.create({
      name: "Regular User",
      email: "user@primetrade.ai",
      password: userPassword,
      role: "user",
    });

    // Create sample tasks
    await Task.create([
      {
        title: "Admin Task 1",
        description: "Created by admin",
        status: "todo",
        owner: admin._id,
      },
      {
        title: "User Task 1",
        description: "Created by user",
        status: "in-progress",
        owner: user._id,
      },
      {
        title: "User Task 2",
        description: "Another user task",
        status: "done",
        owner: user._id,
      },
    ]);

    console.log("✅ Seeded successfully!");
    console.log("\nTest Accounts:");
    console.log("Admin: admin@primetrade.ai / AdminPass123");
    console.log("User:  user@primetrade.ai / UserPass123");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seed();
