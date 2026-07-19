import AnimationWrapper from "../common/page-animation";
import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";

const AboutPage = () => {
    return (
        <AnimationWrapper>
            <section className="py-12 max-w-[950px] mx-auto font-jakarta">
                {/* 1. HERO SECTION */}
                <div className="text-center mb-16">
                    <div className="w-20 h-20 mx-auto mb-4 bg-purple/10 rounded-2xl flex items-center justify-center p-3 border border-purple/20 shadow-sm">
                        <img src={logo} alt="Campus Space Logo" className="w-full object-contain" />
                    </div>
                    <span className="bg-purple/10 text-purple font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider inline-block mb-3 border border-purple/20">
                        Platform Story & Architecture
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-black tracking-tight leading-tight mb-4">
                        How Campus Space Was Born
                    </h1>
                    <p className="text-dark-grey text-base max-w-2xl mx-auto font-medium leading-relaxed">
                        From personal placement anxiety to a centralized platform for student developers to share authentic interview experiences and career guidance.
                    </p>
                </div>

                {/* 2. THE ORIGIN STORY CARD */}
                <div className="bg-white border border-grey rounded-3xl p-8 sm:p-10 shadow-sm mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple/5 rounded-full blur-3xl pointer-events-none"></div>

                    <h2 className="text-2xl font-bold text-black mb-6 tracking-tight">The Origin Story</h2>

                    <div className="flex flex-col gap-5 text-sm sm:text-base leading-relaxed text-dark-grey font-normal">
                        <p>
                            A few months ago, I was feeling really anxious about upcoming campus placement interviews. I kept wondering: <span className="font-bold text-black">What are these interviews actually like? How can we prepare better?</span>
                        </p>

                        <p>
                            To find out, I took a simple step. I personally emailed <span className="font-semibold text-purple">150 of my batchmates</span> asking about their real interview experiences.
                        </p>

                        <div className="my-2 p-5 bg-grey/30 border-l-4 border-purple rounded-r-2xl font-medium text-black">
                            I got about 30 responses. Reading their stories, I realized how incredibly valuable this advice was.
                        </div>

                        <p>
                            It sparked an idea: <span className="font-semibold text-black">what if we had a shared, central space where students could easily post their interview tips, bootcamps, and career advice to help others succeed?</span>
                        </p>

                        <p className="font-bold text-black text-lg">
                            This is how Campus Space was born.
                        </p>
                    </div>
                </div>

                {/* 3. ENGINEERING & PRODUCT ARCHITECTURE */}
                <div className="mb-14">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
                            Built From Scratch: Technical Features
                        </h2>
                        <p className="text-xs text-dark-grey mt-1">Designed for high performance, security, and scalability</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="bg-white border border-grey p-6 rounded-2xl shadow-sm hover:border-purple/40 transition-all group">
                            <div className="w-10 h-10 rounded-xl bg-purple/10 text-purple flex items-center justify-center mb-4 group-hover:bg-purple group-hover:text-white transition-colors">
                                <i className="fi fi-rr-cubes text-lg"></i>
                            </div>
                            <h3 className="font-bold text-base text-black mb-2">Modular Architecture</h3>
                            <p className="text-xs text-dark-grey leading-relaxed">
                                Component-based structure with decoupled UI and Mongoose backend server for speed, stability, and future scaling.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white border border-grey p-6 rounded-2xl shadow-sm hover:border-purple/40 transition-all group">
                            <div className="w-10 h-10 rounded-xl bg-purple/10 text-purple flex items-center justify-center mb-4 group-hover:bg-purple group-hover:text-white transition-colors">
                                <i className="fi fi-rr-lock text-lg"></i>
                            </div>
                            <h3 className="font-bold text-base text-black mb-2">Secure Account Protection</h3>
                            <p className="text-xs text-dark-grey leading-relaxed">
                                Industry-standard session security using JWT tokens and bcrypt password hashing to safeguard user data.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white border border-grey p-6 rounded-2xl shadow-sm hover:border-purple/40 transition-all group">
                            <div className="w-10 h-10 rounded-xl bg-purple/10 text-purple flex items-center justify-center mb-4 group-hover:bg-purple group-hover:text-white transition-colors">
                                <i className="fi fi-rr-shield-check text-lg"></i>
                            </div>
                            <h3 className="font-bold text-base text-black mb-2">Content Moderation</h3>
                            <p className="text-xs text-dark-grey leading-relaxed">
                                Admin review workflow ensures articles remain high-quality, authentic, and spam-free before going public.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white border border-grey p-6 rounded-2xl shadow-sm hover:border-purple/40 transition-all group">
                            <div className="w-10 h-10 rounded-xl bg-purple/10 text-purple flex items-center justify-center mb-4 group-hover:bg-purple group-hover:text-white transition-colors">
                                <i className="fi fi-rr-bell text-lg"></i>
                            </div>
                            <h3 className="font-bold text-base text-black mb-2">Interactive Alerts</h3>
                            <p className="text-xs text-dark-grey leading-relaxed">
                                Real-time notifications for writers whenever readers like posts, leave comments, or engage in discussions.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-white border border-grey p-6 rounded-2xl shadow-sm hover:border-purple/40 transition-all group">
                            <div className="w-10 h-10 rounded-xl bg-purple/10 text-purple flex items-center justify-center mb-4 group-hover:bg-purple group-hover:text-white transition-colors">
                                <i className="fi fi-rr-compress text-lg"></i>
                            </div>
                            <h3 className="font-bold text-base text-black mb-2">Smart Media Uploads</h3>
                            <p className="text-xs text-dark-grey leading-relaxed">
                                Built-in HTML5 Canvas image compressor shrinks phone photos for instant loading on mobile connections.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 4. CLOSING REFLECTION & CONNECT CARDS */}
                <div className="bg-black text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-white/10 text-center relative overflow-hidden mb-12">
                    <h2 className="text-2xl font-bold mb-4 tracking-tight">Reflection & Future Journey</h2>
                    <p className="text-sm text-grey max-w-2xl mx-auto leading-relaxed mb-8">
                        What started as a way to ease my own interview worries became an incredible journey in product design, building secure user tools, and learning full-stack engineering.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <a
                            href="https://campus-space-26.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-purple text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-purple/90 transition-transform active:scale-95 flex items-center gap-2"
                        >
                            <span>Explore Live Platform</span>
                            <i className="fi fi-rr-arrow-up-right text-[10px]"></i>
                        </a>

                        <a
                            href="https://irfansudarani.netlify.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/10 text-white hover:bg-white/20 px-6 py-3 rounded-full text-xs font-bold transition-transform active:scale-95 border border-white/20 flex items-center gap-2"
                        >
                            <span>Developer Portfolio</span>
                            <i className="fi fi-rr-globe text-[10px]"></i>
                        </a>

                        <a
                            href="https://www.linkedin.com/in/irfanrs/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-black hover:bg-grey px-6 py-3 rounded-full text-xs font-bold transition-transform active:scale-95 flex items-center gap-2"
                        >
                            <i className="fi fi-brands-linkedin text-sm"></i>
                            <span>LinkedIn Connect</span>
                        </a>
                    </div>
                </div>

                {/* Back to Home Button */}
                <div className="text-center">
                    <Link to="/" className="text-xs font-bold text-purple hover:underline inline-flex items-center gap-1">
                        <i className="fi fi-rr-arrow-left"></i>
                        <span>Back to Home</span>
                    </Link>
                </div>
            </section>
        </AnimationWrapper>
    );
};

export default AboutPage;
