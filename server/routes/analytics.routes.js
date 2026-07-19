import express from "express";
import VisitorLog from "../models/VisitorLog.js";

const router = express.Router();

// Public Visitor Count Endpoint for Footer
router.get("/visitor-count", async (req, res) => {
    try {
        const totalVisits = await VisitorLog.countDocuments({});
        return res.status(200).json({ totalVisits });
    } catch (err) {
        return res.status(200).json({ totalVisits: 0 });
    }
});

// 1. Silent Visitor Tracker Endpoint
router.post("/track-visitor", async (req, res) => {
    try {
        let { pageUrl, user, location } = req.body;

        // Get IP Address
        let rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "";
        let ip = rawIp.split(',')[0].trim();

        if (ip === "::1" || ip === "127.0.0.1" || ip.startsWith("::ffff:127")) {
            ip = "103.156.19.45"; // Default sample IP for localhost testing (Bengaluru)
        }

        // Parse User Agent
        const userAgent = req.headers['user-agent'] || "";
        let device = "Desktop";
        if (/mobile/i.test(userAgent)) device = "Mobile";
        else if (/ipad|tablet/i.test(userAgent)) device = "Tablet";

        let browser = "Chrome";
        if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = "Safari";
        else if (/firefox/i.test(userAgent)) browser = "Firefox";
        else if (/edg/i.test(userAgent)) browser = "Edge";

        let city = location?.city || "Bengaluru";
        let region = location?.region || "Karnataka";
        let country = location?.country || "India";

        // If location is unknown, fetch via free IP Geolocation API using native fetch
        if (city === "Unknown" && ip && ip !== "Unknown") {
            try {
                const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,city,regionName,country`);
                if (response.ok) {
                    const geoData = await response.json();
                    if (geoData && geoData.status === "success") {
                        city = geoData.city || "Bengaluru";
                        region = geoData.regionName || "Karnataka";
                        country = geoData.country || "India";
                    }
                }
            } catch (geoErr) {
                // Silently fallback if IP API times out
            }
        }

        const newLog = new VisitorLog({
            ip,
            city,
            region,
            country,
            device,
            browser,
            pageUrl: pageUrl || "/",
            user: {
                fullname: user?.fullname || "Anonymous Visitor",
                email: user?.email || "",
                username: user?.username || ""
            }
        });

        await newLog.save();
        return res.status(200).json({ status: "tracked" });
    } catch (err) {
        console.error("Track visitor error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

// 2. Admin Analytics Overview Endpoint
router.get("/analytics-overview", async (req, res) => {
    try {
        const totalVisits = await VisitorLog.countDocuments({});
        
        // Distinct IPs count
        const distinctIps = await VisitorLog.distinct("ip");
        const uniqueVisitors = distinctIps.length;

        // Top Visited Pages
        const topPages = await VisitorLog.aggregate([
            { $group: { _id: "$pageUrl", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Device Breakdown
        const deviceBreakdown = await VisitorLog.aggregate([
            { $group: { _id: "$device", count: { $sum: 1 } } }
        ]);

        // Country Breakdown
        const countryBreakdown = await VisitorLog.aggregate([
            { $group: { _id: "$city", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Recent 50 Visitor Logs
        const recentLogs = await VisitorLog.find({})
            .sort({ visitedAt: -1 })
            .limit(50);

        return res.status(200).json({
            totalVisits,
            uniqueVisitors,
            topPages,
            deviceBreakdown,
            countryBreakdown,
            recentLogs
        });
    } catch (err) {
        console.error("Analytics overview error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

export default router;
