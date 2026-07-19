import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png";
import { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component";
import axios from "axios";

const Navbar = () => {
    const [searchBoxVisibility, SetsearchBoxVisibility] = useState(false);
    const [userNavPanel, setUserNavPanel] = useState(false);
    const [totalVisits, setTotalVisits] = useState(0);

    let navigate = useNavigate();
    const userNavRef = useRef();

    const { userAuth, userAuth: { access_token, profile_img, new_notification_available } } = useContext(UserContext);

    const handleUserNavPanel = () => {
        setUserNavPanel(currentVal => !currentVal);
    };

    const handleSearch = (e) => {
        let query = e.target.value;
        if (e.keyCode === 13 && query.length) {
            navigate(`/search/${query}`);
        }
    };

    const fetchVisitorCount = async () => {
        try {
            const domain = import.meta.env.VITE_SERVER_DOMAIN || "http://localhost:3000";
            const { data } = await axios.get(domain + "/visitor-count");
            if (data && typeof data.totalVisits === "number") {
                setTotalVisits(data.totalVisits);
            }
        } catch (err) {
            console.error("Failed to fetch visitor count:", err.message);
        }
    };

    useEffect(() => {
        fetchVisitorCount();

        const handleClickOutside = (event) => {
            if (userNavRef.current && !userNavRef.current.contains(event.target)) {
                setUserNavPanel(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col justify-between font-jakarta bg-white">
            <div>
                <nav className="navbar z-50">
                    {/* Logo */}
                    <Link to="/" className="flex-none w-10">
                        <img src={logo} className="w-full" />
                    </Link>

                    {/* Search Box */}
                    <div
                        className={
                            "absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
                            (searchBoxVisibility ? "show" : "hide")
                        }
                    >
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
                            onKeyDown={handleSearch}
                        />
                        <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3 md:gap-6 ml-auto">
                        {/* Toggle Search Icon on Mobile */}
                        <button
                            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
                            onClick={() => SetsearchBoxVisibility(currentVal => !currentVal)}
                        >
                            <i className="fi fi-rr-search text-xl"></i>
                        </button>

                        {/* Write Button */}
                        <Link to="/editor" className="hidden md:flex gap-2 link">
                            <i className="fi fi-rr-file-edit"></i>
                            <p>Write</p>
                        </Link>

                        {/* Authenticated User */}
                        {access_token ? (
                            <>
                                <Link to="/dashboard/notifications">
                                    <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                                        <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                                        {
                                            new_notification_available ?
                                                <span className='bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2'>
                                                </span> : ""
                                        }
                                    </button>
                                </Link>

                                <div className="relative" ref={userNavRef}>
                                    <button className="w-12 h-12 mt-1" onClick={handleUserNavPanel}>
                                        <img
                                            src={profile_img}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </button>

                                    {userNavPanel && <UserNavigationPanel closePanel={() => setUserNavPanel(false)} />}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link className="btn-dark py-2" to="/signin">
                                    Sign In
                                </Link>
                                <Link className="btn-light py-2 hidden md:block" to="/signup">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                <main className="w-full">
                    <Outlet />
                </main>
            </div>

            {/* Gorgeous Modern Dark Footer */}
            <footer className="w-full bg-black text-white mt-auto pt-10 pb-6 px-[5vw] md:px-[7vw] lg:px-[10vw] border-t-4 border-purple relative overflow-hidden font-jakarta">
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/15">
                    {/* Brand Column */}
                    <div className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left gap-3">
                        <div className="flex items-center gap-3">
                            <img src={logo} className="w-9 h-9 object-contain" alt="Campus Space Logo" />
                            <span className="font-bold text-xl tracking-tight text-white">Campus Space</span>
                        </div>
                        <p className="text-xs text-grey leading-relaxed max-w-md">
                            Empowering student developers with authentic placement interview experiences, coding resources, and peer guidance.
                        </p>
                    </div>

                    {/* Navigation Column */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h4 className="font-bold text-sm text-purple uppercase tracking-wider mb-3">Quick Links</h4>
                        <ul className="flex flex-col items-center md:items-start gap-2 text-xs text-grey">
                            <li>
                                <Link to="/" className="hover:text-white transition-colors">Home & Experiences</Link>
                            </li>
                            <li>
                                <Link to="/editor" className="hover:text-white transition-colors">Write Experience</Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-white transition-colors font-semibold text-purple">
                                    About Platform
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Developer & Contact Column */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h4 className="font-bold text-sm text-purple uppercase tracking-wider mb-3">Connect & Contact</h4>
                        <ul className="flex flex-col items-center md:items-start gap-2 text-xs text-grey">
                            <li>
                                <a
                                    href="https://www.linkedin.com/in/irfanrs/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:text-purple transition-colors"
                                >
                                    <i className="fi fi-brands-linkedin text-sm"></i>
                                    <span>LinkedIn Profile</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://irfansudarani.netlify.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:text-purple transition-colors"
                                >
                                    <i className="fi fi-rr-globe text-sm"></i>
                                    <span>Portfolio & Contact</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Sub-Footer Copyright & Live Visit Counter Bar */}
                <div className="max-w-[1200px] mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-grey text-center sm:text-left">
                    <p>© {new Date().getFullYear()} Campus Space. All Rights Reserved.</p>
                    
                    {/* Live Visit Count Badge */}
                    <div className="bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-white/10 shadow-inner">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="text-white font-mono">{totalVisits.toLocaleString()}</span>
                        <span className="text-grey font-medium">Total Visits</span>
                    </div>

                    {/* Plain text without hyperlink */}
                    <p className="flex items-center gap-1 text-grey">
                        <span>Made with</span>
                        <span className="text-purple text-sm">💜</span>
                        <span>by Indian</span>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Navbar;
