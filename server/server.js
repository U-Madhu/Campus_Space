import express from "express";
import mongoose from "mongoose";
import 'dotenv/config';
import cors from 'cors';
import routes from "./routes/index.js";
import "./config/firebase.config.js";

const server = express();
const PORT = process.env.PORT || 3000;

server.use(express.json());
server.use(cors());

// connecting database
mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
})
.then(() => console.log("Database connected successfully"))
.catch(err => console.log("Database connection failed:", err.message));

// mount routes
server.use(routes);

server.listen(PORT, () => {
    console.log(`listening on port : http://localhost:${PORT}`);
});
