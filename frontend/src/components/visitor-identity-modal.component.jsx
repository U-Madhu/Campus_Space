import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../App";
import { toast } from "react-hot-toast";

const VisitorIdentityModal = () => {
    const { userAuth } = useContext(UserContext) || {};
    const [showModal, setShowModal] = useState(false);
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        // If already logged in, no need to ask
        if (userAuth?.access_token) return;

        // Check if visitor identity is already saved in localStorage
        const savedIdentity = localStorage.getItem("visitor_identity");
        if (!savedIdentity) {
            // Show prompt after 1.5 seconds delay for a smooth landing experience
            const timer = setTimeout(() => {
                setShowModal(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [userAuth]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fullname.trim() || !email.trim()) {
            return toast.error("Please enter both Name and Email");
        }

        const identityObj = {
            fullname: fullname.trim(),
            email: email.trim(),
            username: email.split('@')[0]
        };

        // Save locally so visitor is never prompted again
        localStorage.setItem("visitor_identity", JSON.stringify(identityObj));
        setShowModal(false);
        toast.success(`Welcome to Campus Space, ${fullname}!`);

        // Immediately update backend visitor tracker with their identity
        try {
            await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/track-visitor', {
                pageUrl: window.location.pathname,
                user: identityObj
            });
        } catch (err) {
            console.error("Failed to post visitor identity:", err);
        }
    };

    const handleSkip = () => {
        // Mark as skipped for current session
        sessionStorage.setItem("visitor_identity_skipped", "true");
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50 max-w-md w-full p-4 bg-white border-2 border-purple rounded-2xl shadow-2xl font-jakarta transition-all animate-bounce-short">
            <div className="flex items-center justify-between pb-3 border-b border-grey">
                <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-purple/10 text-purple flex items-center justify-center font-bold text-sm">
                        👋
                    </span>
                    <div>
                        <h4 className="font-bold text-sm text-black">Welcome to Campus Space!</h4>
                        <p className="text-[11px] text-dark-grey">Enter details to get placement interview alerts</p>
                    </div>
                </div>
                <button onClick={handleSkip} className="text-dark-grey hover:text-black text-sm">
                    <i className="fi fi-rr-cross-small text-lg"></i>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
                <div>
                    <label className="text-[11px] font-bold text-dark-grey block mb-1">Your Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Irfan Sudarani"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        className="w-full bg-grey/30 p-2.5 rounded-xl text-xs border border-grey outline-none focus:border-purple"
                        required
                    />
                </div>

                <div>
                    <label className="text-[11px] font-bold text-dark-grey block mb-1">Email Address</label>
                    <input
                        type="email"
                        placeholder="e.g. student@bmsce.ac.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-grey/30 p-2.5 rounded-xl text-xs border border-grey outline-none focus:border-purple"
                        required
                    />
                </div>

                <div className="flex items-center gap-2 mt-1">
                    <button
                        type="submit"
                        className="flex-1 bg-purple text-white py-2 rounded-xl text-xs font-bold hover:bg-purple/90 transition-transform active:scale-95"
                    >
                        Save & Continue
                    </button>
                    <button
                        type="button"
                        onClick={handleSkip}
                        className="px-3 py-2 text-dark-grey hover:text-black text-xs font-semibold"
                    >
                        Skip
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VisitorIdentityModal;
