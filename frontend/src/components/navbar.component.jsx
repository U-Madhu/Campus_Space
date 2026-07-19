import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png";
import { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component";

const Navbar = () => {
    const [searchBoxVisibility, SetsearchBoxVisibility] = useState(false);
    const [userNavPanel, setUserNavPanel] = useState(false);

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

    const handleBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false);
        }, 200);
    };

    useEffect(() => {
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
                            placeholder="Search blogs, companies, topics..."
                            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12 text-sm outline-none focus:border-purple"
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

            {/* Compact Slim Sticky Footer */}
            <footer className="w-full border-t border-grey mt-auto py-3 px-[5vw] bg-white flex flex-col sm:flex-row items-center justify-between gap-2 text-dark-grey text-xs">
                <p>© {new Date().getFullYear()} Campus Space. All Rights Reserved.</p>
                <p>Made with 💜 by <a href="https://www.linkedin.com/in/irfanrs/" target="_blank" rel="noopener noreferrer" className="text-purple underline hover:text-black font-semibold">Indian</a></p>
                <a href="https://irfansudarani.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-black font-medium transition-colors">
                    Contact Us
                </a>
            </footer>
        </div>
    );
};

export default Navbar;
