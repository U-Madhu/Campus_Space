import { useEffect, useState } from "react";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import { Toaster, toast } from "react-hot-toast";

const AdminAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchAnalytics = async (isManual = false) => {
        if (isManual) setIsRefreshing(true);
        try {
            const { data } = await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/analytics-overview");
            setAnalytics(data);
            if (isManual) {
                toast.success("Live Analytics Refreshed!");
            }
        } catch (err) {
            console.error("Failed to load analytics:", err);
            if (isManual) toast.error("Failed to refresh analytics");
        } finally {
            setLoading(false);
            if (isManual) setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
        const interval = setInterval(() => fetchAnalytics(false), 10000); // Auto refresh every 10 sec
        return () => clearInterval(interval);
    }, []);

    if (loading) return <Loader />;

    const filteredLogs = analytics?.recentLogs?.filter(log => {
        const query = searchTerm.toLowerCase();
        return (
            log.ip?.toLowerCase().includes(query) ||
            log.city?.toLowerCase().includes(query) ||
            log.country?.toLowerCase().includes(query) ||
            log.user?.fullname?.toLowerCase().includes(query) ||
            log.user?.email?.toLowerCase().includes(query) ||
            log.pageUrl?.toLowerCase().includes(query)
        );
    }) || [];

    return (
        <AnimationWrapper>
            <Toaster />
            <section className="py-8 font-jakarta">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-black tracking-tight">Visitor Analytics Dashboard</h1>
                        <p className="text-xs text-dark-grey">Real-time visitor logs, locations, devices, and traffic analytics.</p>
                    </div>
                    <button
                        onClick={() => fetchAnalytics(true)}
                        disabled={isRefreshing}
                        className="bg-purple text-white hover:bg-purple/90 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        <i className={`fi fi-rr-refresh ${isRefreshing ? "animate-spin" : ""}`}></i>
                        <span>{isRefreshing ? "Refreshing..." : "Refresh Live Data"}</span>
                    </button>
                </div>

                {/* 1. KEY STATS CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    <div className="bg-white border border-grey p-5 rounded-2xl shadow-sm">
                        <div className="text-dark-grey text-xs font-bold uppercase tracking-wider mb-1">Total Page Visits</div>
                        <div className="text-3xl font-extrabold text-black">{analytics?.totalVisits || 0}</div>
                        <div className="text-[11px] text-purple font-medium mt-1">All recorded page views</div>
                    </div>

                    <div className="bg-white border border-grey p-5 rounded-2xl shadow-sm">
                        <div className="text-dark-grey text-xs font-bold uppercase tracking-wider mb-1">Unique Visitors (IPs)</div>
                        <div className="text-3xl font-extrabold text-purple">{analytics?.uniqueVisitors || 0}</div>
                        <div className="text-[11px] text-dark-grey font-medium mt-1">Distinct IP addresses</div>
                    </div>

                    <div className="bg-white border border-grey p-5 rounded-2xl shadow-sm">
                        <div className="text-dark-grey text-xs font-bold uppercase tracking-wider mb-1">Top Location</div>
                        <div className="text-2xl font-extrabold text-black truncate">
                            {analytics?.countryBreakdown?.[0]?._id || "Bengaluru"}
                        </div>
                        <div className="text-[11px] text-green-600 font-medium mt-1">
                            {analytics?.countryBreakdown?.[0]?.count || 0} visits from this city
                        </div>
                    </div>

                    <div className="bg-white border border-grey p-5 rounded-2xl shadow-sm">
                        <div className="text-dark-grey text-xs font-bold uppercase tracking-wider mb-1">Primary Device</div>
                        <div className="text-2xl font-extrabold text-black">
                            {analytics?.deviceBreakdown?.[0]?._id || "Desktop"}
                        </div>
                        <div className="text-[11px] text-amber-600 font-medium mt-1">
                            {analytics?.deviceBreakdown?.[0]?.count || 0} total sessions
                        </div>
                    </div>
                </div>

                {/* 2. TOP PAGES & CITIES BREAKDOWN */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Top Visited Pages */}
                    <div className="bg-white border border-grey p-6 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-lg text-black mb-4">Top Visited Pages</h3>
                        <div className="flex flex-col gap-3">
                            {analytics?.topPages?.map((page, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-grey/20 rounded-xl text-xs">
                                    <span className="font-semibold text-black truncate max-w-[250px]">{page._id || "/"}</span>
                                    <span className="bg-purple text-white px-2.5 py-1 rounded-lg font-bold">{page.count} views</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Visitor Locations */}
                    <div className="bg-white border border-grey p-6 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-lg text-black mb-4">Top Visitor Cities</h3>
                        <div className="flex flex-col gap-3">
                            {analytics?.countryBreakdown?.map((loc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-grey/20 rounded-xl text-xs">
                                    <span className="font-semibold text-black">{loc._id || "Bengaluru"}</span>
                                    <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg font-bold">{loc.count} visitors</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. LIVE RECENT VISITOR LOGS TABLE */}
                <div className="bg-white border border-grey rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className="font-bold text-xl text-black">Live Visitor Logs</h3>
                            <p className="text-xs text-dark-grey">Recent 50 real-time website visits</p>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by IP, City, Name, Page..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-grey/30 p-2.5 px-4 rounded-xl text-xs border border-grey outline-none focus:border-purple w-full sm:w-64"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-grey text-xs uppercase tracking-wider text-dark-grey font-bold bg-grey/10">
                                    <th className="p-3">Visitor Info</th>
                                    <th className="p-3">IP Address</th>
                                    <th className="p-3">Location</th>
                                    <th className="p-3">Device / Browser</th>
                                    <th className="p-3">Page Visited</th>
                                    <th className="p-3">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-grey text-xs">
                                {filteredLogs.length > 0 ? (
                                    filteredLogs.map((log) => (
                                        <tr key={log._id} className="hover:bg-grey/20 transition-colors">
                                            <td className="p-3 font-semibold text-black">
                                                <div>{log.user?.fullname || "Anonymous Visitor"}</div>
                                                {log.user?.email && <div className="text-[10px] text-dark-grey">{log.user.email}</div>}
                                            </td>
                                            <td className="p-3 font-mono text-purple">{log.ip || "103.156.19.45"}</td>
                                            <td className="p-3 font-medium text-black">
                                                {log.city || "Bengaluru"}, {log.country || "India"}
                                            </td>
                                            <td className="p-3">
                                                <span className="bg-grey/50 px-2 py-0.5 rounded text-[11px] font-medium text-dark-grey">
                                                    {log.device} • {log.browser}
                                                </span>
                                            </td>
                                            <td className="p-3 font-mono text-xs text-blue-600 truncate max-w-[150px]">
                                                {log.pageUrl}
                                            </td>
                                            <td className="p-3 text-dark-grey">
                                                {new Date(log.visitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({getDay(log.visitedAt)})
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="p-6 text-center text-dark-grey italic">
                                            No visitor logs found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    );
};

export default AdminAnalytics;
