import { useEffect } from "react";

const AdBanner = ({ slotId }) => {
    useEffect(() => {
        try {
            // Push to AdSense queue if Google AdSense script is loaded in index.html
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            // AdSense error catching
        }
    }, []);

    const enableAds = import.meta.env.VITE_ENABLE_ADS === 'true';

    return (
        <div className="w-full my-6 bg-grey/30 border border-grey rounded-2xl p-4 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden group">
            {enableAds ? (
                <ins className="adsbygoogle"
                     style={{ display: 'block' }}
                     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
                     data-ad-slot={slotId}
                     data-ad-format="auto"
                     data-full-width-responsive="true">
                </ins>
            ) : (
                /* Premium Sponsorship Placeholder */
                <div className="text-center flex flex-col items-center justify-center p-6">
                    <span className="absolute top-3 right-3 bg-grey text-[9px] font-bold text-dark-grey px-2.5 py-1 rounded-md uppercase tracking-wider">
                        Sponsor
                    </span>
                    <i className="fi fi-rr-megaphone text-3xl text-purple mb-2 animate-bounce"></i>
                    <h4 className="font-bold text-sm text-black mb-1">Advertise with Campus Space</h4>
                    <p className="text-xs text-dark-grey max-w-[200px] mb-4 leading-relaxed">
                        Promote your product, bootcamps, or events directly to student developers.
                    </p>
                    <a 
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=irfanrs024@gmail.com&su=Advertise+with+us"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-purple !text-white !no-underline text-[11px] font-bold py-2 px-5 rounded-full shadow-sm hover:scale-105 duration-200 transition-transform"
                    >
                        Get In Touch
                    </a>
                </div>
            )}
        </div>
    );
};

export default AdBanner;
