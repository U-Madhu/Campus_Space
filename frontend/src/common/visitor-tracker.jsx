import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App";

const VisitorTracker = () => {
    const location = useLocation();
    const { userAuth } = useContext(UserContext) || {};

    useEffect(() => {
        const trackVisit = async () => {
            try {
                let userDetails = null;

                if (userAuth?.access_token) {
                    userDetails = {
                        username: userAuth.username || "",
                        fullname: userAuth.fullname || "",
                        email: userAuth.email || ""
                    };
                } else {
                    // Check if visitor identity was saved in localStorage from modal
                    const savedIdentity = localStorage.getItem("visitor_identity");
                    if (savedIdentity) {
                        try {
                            userDetails = JSON.parse(savedIdentity);
                        } catch (e) {
                            // Silently ignore parse errors
                        }
                    }
                }

                await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/track-visitor', {
                    pageUrl: location.pathname + location.search,
                    user: userDetails
                });
            } catch (err) {
                // Silently ignore tracking errors so UX is never impacted
            }
        };

        trackVisit();
    }, [location.pathname]);

    return null;
};

export default VisitorTracker;
