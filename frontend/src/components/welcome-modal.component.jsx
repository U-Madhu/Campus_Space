import { useState, useEffect, useContext } from "react";
import logo from "../imgs/logo.png";
import axios from "axios";
import { UserContext } from "../App";
import { toast } from "react-hot-toast";

const WelcomeModal = () => {
    const { userAuth } = useContext(UserContext) || {};
    const [isOpen, setIsOpen] = useState(false);
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (userAuth?.access_token) {
            setIsOpen(false);
            return;
        }

        const savedIdentity = localStorage.getItem("visitor_identity");
        const modalSeen = sessionStorage.getItem("welcome_modal_seen");

        if (!savedIdentity && !modalSeen) {
            setIsOpen(true);
        }
    }, [userAuth]);

    const handleClose = () => {
        sessionStorage.setItem("welcome_modal_seen", "true");
        setIsOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (fullname.trim() && email.trim()) {
            const identityObj = {
                fullname: fullname.trim(),
                email: email.trim(),
                username: email.split('@')[0]
            };

            // Save locally so visitor is never asked again
            localStorage.setItem("visitor_identity", JSON.stringify(identityObj));
            
            // Immediately log in MongoDB
            try {
                await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/track-visitor', {
                    pageUrl: window.location.pathname,
                    user: identityObj
                });
            } catch (err) {
                console.error("Failed to post visitor identity:", err);
            }

            toast.success(`Subscribed! Welcome to Campus Space, ${fullname}.`);
        }

        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-jakarta">
            <div className="bg-white border border-grey rounded-3xl p-8 max-w-[450px] w-full text-center shadow-2xl relative transform transition-all duration-300 scale-100">
                
                {/* Close Icon button */}
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-dark-grey hover:text-black transition duration-200"
                >
                    <i className="fi fi-rr-cross text-lg"></i>
                </button>

                {/* Website Logo */}
                <div className="w-32 h-32 mx-auto flex items-center justify-center mb-1">
                    <img src={logo} className="w-28 object-contain" alt="Campus Space Logo" />
                </div>

                {/* Greeting Title */}
                <h2 className="text-xl font-bold text-black mb-1 font-jakarta">
                    Welcome to Campus Space!
                </h2>

                {/* Inspiration Quote */}
                <p className="text-dark-grey text-xs italic leading-relaxed mb-3 font-gelasio px-2">
                    "Gain the knowledge and share the experience among each other."
                </p>

                {/* Notification Sub-line */}
                <p className="text-purple font-semibold text-xs mb-5 px-3 bg-purple/5 py-2 rounded-xl border border-purple/10">
                    🔔 Enter your details below to receive instant notifications when a new interview experience is published!
                </p>

                {/* Visitor Name & Email Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mb-2">
                    <div>
                        <input
                            type="text"
                            placeholder="Your Full Name"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className="w-full bg-grey/30 p-3 rounded-xl text-xs border border-grey outline-none focus:border-purple text-center font-medium"
                        />
                    </div>

                    <div>
                        <input
                            type="email"
                            placeholder="Email Address (e.g. student@bmsce.ac.in)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-grey/30 p-3 rounded-xl text-xs border border-grey outline-none focus:border-purple text-center font-medium"
                        />
                    </div>

                    {/* Interactive CTA */}
                    <button 
                        type="submit"
                        className="w-full bg-purple text-white font-bold py-3 rounded-full shadow-lg shadow-purple/20 hover:bg-opacity-90 hover:shadow-purple/30 transition duration-200 text-xs mt-2"
                    >
                        Let's Explore & Subscribe
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WelcomeModal;
