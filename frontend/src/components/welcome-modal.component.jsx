import { useState, useEffect } from "react";
import logo from "../imgs/logo.png";

const WelcomeModal = () => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white border border-grey rounded-3xl p-8 max-w-[450px] w-full text-center shadow-2xl relative transform transition-all duration-300 scale-100 animate-scale-up">
                
                {/* Close Icon button */}
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-dark-grey hover:text-black transition duration-200"
                >
                    <i className="fi fi-rr-cross text-lg"></i>
                </button>

                {/* Website Logo */}
                <div className="w-48 h-48 mx-auto flex items-center justify-center mb-2">
                    <img src={logo} className="w-44 object-contain" alt="Campus Space Logo" />
                </div>

                {/* Greeting Title */}
                <h2 className="text-lg font-bold text-black mb-1.5 font-inter">
                    Welcome to Campus Space!
                </h2>

                {/* Inspiration Quote */}
                <p className="text-dark-grey text-[11px] leading-relaxed mb-6 font-gelasio px-4">
                    "Gain the knowledge and share the experience among each other."
                </p>

                {/* Interactive CTA */}
                <button 
                    onClick={handleClose}
                    className="w-full bg-purple text-white font-bold py-3 rounded-full shadow-lg shadow-purple/20 hover:bg-opacity-90 hover:shadow-purple/30 transition duration-200"
                >
                    Let's Explore
                </button>
            </div>
        </div>
    );
};

export default WelcomeModal;
