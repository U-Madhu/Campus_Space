import mongoose, { Schema } from "mongoose";

const visitorLogSchema = new Schema({
    ip: { 
        type: String, 
        default: "" 
    },
    city: { 
        type: String, 
        default: "Unknown" 
    },
    region: { 
        type: String, 
        default: "Unknown" 
    },
    country: { 
        type: String, 
        default: "Unknown" 
    },
    device: { 
        type: String, 
        default: "Desktop" 
    },
    browser: { 
        type: String, 
        default: "Chrome" 
    },
    pageUrl: { 
        type: String, 
        default: "/" 
    },
    user: {
        fullname: { type: String, default: "Anonymous Visitor" },
        email: { type: String, default: "" },
        username: { type: String, default: "" }
    },
    visitedAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

export default mongoose.model("visitor_logs", visitorLogSchema);
