import express from "express";
import mongoose from "mongoose";
import 'dotenv/config';
import cors from 'cors';
import routes from "./routes/index.js";
import "./config/firebase.config.js";
import User from "./models/User.js";
import Blog from "./models/Blog.js";

const server = express();
const PORT = process.env.PORT || 3000;

server.use(express.json());
server.use(cors());

// connecting database
mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
})
.then(() => {
    console.log("Database connected successfully");
    
    // One-time migrations for existing Atlas documents
    User.updateMany({ role: { $exists: false } }, { $set: { role: "user" } })
    .then(res => {
        if (res.modifiedCount > 0) {
            console.log(`Migrated ${res.modifiedCount} users to default role 'user'`);
        }
    })
    .catch(err => console.log("User role migration failed:", err.message));

    Blog.updateMany({ approved: { $exists: false } }, { $set: { approved: true } })
    .then(res => {
        if (res.modifiedCount > 0) {
            console.log(`Migrated ${res.modifiedCount} blogs to default approved 'true'`);
        }
    })
    .catch(err => console.log("Blog approved migration failed:", err.message));

    // Auto-promote admin account
    User.findOneAndUpdate({ "personal_info.email": "dev@campusspace.in" }, { role: "admin" })
    .then(user => {
        if (user && user.role !== "admin") {
            console.log("Successfully auto-promoted dev@campusspace.in to admin role.");
        }
    });
})
.catch(err => console.log("Database connection failed:", err.message));

// root endpoint
server.get("/", (req, res) => {
    return res.status(200).json({ status: "OK", message: "Campus Space API is active" });
});

// health check endpoint
server.get("/healthcheck", (req, res) => {
    return res.status(200).json({ status: "OK", message: "Server is healthy", timestamp: new Date() });
});

// mount routes
server.use(routes);

server.listen(PORT, () => {
    console.log(`listening on port : http://localhost:${PORT}`);
});
