import { Link, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { uploadImage } from "../common/cloudinary";
import { useEffect, useRef, useState, useContext } from "react";
import { Toaster, toast } from "react-hot-toast";
import { compressImage } from "../common/image-resizer";
import { EditorContext } from "../pages/editor.pages";
import { UserContext } from "../App";
import EditorJS from '@editorjs/editorjs';
import { tools } from './tools.component';
import axios from "axios";
import InterviewStructureEditor from "./interview-structure-editor.component";

const BlogEditor = () => {
    const navigate = useNavigate();
    const titleRef = useRef(null);

    let { blog, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);
    let { blog_id = "", title = "", banner = "", content = { blocks: [] }, tags = [], des = "" } = blog || {};

    let { userAuth: { access_token } } = useContext(UserContext);

    // Initializing Structured Interview State safely
    const [structuredData, setStructuredData] = useState(() => {
        const initialContent = Array.isArray(content) ? content[0] : content;
        if (initialContent && typeof initialContent === "object" && initialContent.structured_interview) {
            return initialContent.structured_interview;
        }
        return {
            selection_process: { na: false, rounds: {}, notes: "" },
            coding: { na: false, questions: [] },
            core_concepts: { na: false, questions: [] },
            project_related: { na: false, questions: [] },
            personality_related: { na: false, questions: [] }
        };
    });

    // Category / Format Switcher: "interview" (IT/Tech Predefined Sections) vs "general" (Non-IT / Standard Free Writing)
    const [blogType, setBlogType] = useState(() => {
        const initialContent = Array.isArray(content) ? content[0] : content;
        if (initialContent && typeof initialContent === "object" && initialContent.structured_interview) {
            const si = initialContent.structured_interview;
            if (si.selection_process || si.coding?.questions?.length > 0 || si.core_concepts?.questions?.length > 0 || si.project_related?.questions?.length > 0 || si.personality_related?.questions?.length > 0) {
                return "interview";
            }
        }
        return "interview";
    });

    useEffect(() => {
        if (textEditor && !textEditor.isReady) {
            const initialContent = Array.isArray(content) ? content[0] : content;
            const blocksData = (initialContent && initialContent.blocks) ? initialContent : { blocks: [] };

            const editorInstance = new EditorJS({
                holder: "textEditor",
                data: blocksData,
                tools: tools,
                placeholder: "Type text here... Press Enter for a new line inside this box. Click 'Add New Text Box' for a new box.",
                onReady: () => {
                    const el = document.getElementById("textEditor");
                    if (el) {
                        el.addEventListener("keydown", (e) => {
                            if (e.key === 'Enter') {
                                e.stopPropagation();
                                e.preventDefault();
                                document.execCommand("insertLineBreak");
                            }
                        }, true);
                    }
                }
            });
            setTextEditor(editorInstance);
        }
    }, []);

    // Auto-adjust Title textarea height dynamically on mount & title change
    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.style.height = 'auto';
            titleRef.current.style.height = (titleRef.current.scrollHeight || 60) + "px";
        }
    }, [title]);

    const handleAddNewBlock = () => {
        if (textEditor && textEditor.isReady) {
            try {
                const count = textEditor.blocks.getBlocksCount();
                textEditor.blocks.insert('paragraph', { text: '' }, {}, count, true);
            } catch (err) {
                console.error("Failed to insert block:", err);
            }
        }
    };

    const handleBannerUpload = async (e) => {
        let img = e.target.files[0];
        if (img) {
            let loadingToast = toast.loading("Compressing & Uploading...");
            try {
                const compressedImg = await compressImage(img, 1200, 800, 0.8);
                const url = await uploadImage(compressedImg);
                if (url) {
                    toast.success("Uploaded");
                    setBlog({ ...blog, banner: url });
                } else {
                    toast.error("Upload failed");
                }
            } catch (err) {
                console.error("Banner upload failed:", err);
                toast.error("Failed to process image");
            } finally {
                toast.dismiss(loadingToast);
            }
        }
    };

    const handleTitleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    };

    const handleTitleChange = (e) => {
        let input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + "px";
        setBlog({ ...blog, title: input.value });
    };

    const handleError = (e) => {
        let input = e.target;
        input.src = defaultBanner;
    };

    const getCombinedContent = async () => {
        let blocks = [];
        if (textEditor && textEditor.isReady) {
            try {
                const editorData = await textEditor.save();
                blocks = editorData.blocks || [];
            } catch (err) {
                console.error("Failed to save EditorJS blocks:", err);
            }
        }
        return {
            blocks,
            structured_interview: blogType === "interview" ? structuredData : null
        };
    };

    const handlePublishEvent = async () => {
        if (!banner || !banner.length) {
            return toast.error("Upload a blog banner to publish it");
        }
        if (!title || !title.length) {
            return toast.error("Write Blog title to publish it");
        }

        const fullContent = await getCombinedContent();
        setBlog({ ...blog, content: fullContent });
        setEditorState("publish");
    };

    const handleSaveDraft = async (e) => {
        if (e.target.classList.contains('disable')) return;

        if (!title || !title.length) {
            return toast.error("Write blog title before saving it as a draft");
        }

        let loadingToast = toast.loading("Saving...");
        e.target.classList.add('disable');

        const fullContent = await getCombinedContent();

        let blogObj = {
            title, banner, des, content: fullContent, tags, draft: true
        };

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/create-blogs', { ...blogObj, id: blog_id }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(() => {
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            toast.success("Saved");
            setTimeout(() => {
                navigate('/');
            }, 500);
        }).catch(({ response }) => {
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            return toast.error(response?.data?.error || "Failed to save draft");
        });
    };

    return (
        <>
            <nav className="navbar">
                <Link to='/' className="flex-none w-10">
                    <img src={logo} />
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full font-jakarta font-semibold">
                    {title?.length ? title : "New Blog"}
                </p>
                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2" onClick={handlePublishEvent}>
                        Publish
                    </button>
                    <button className="btn-dark py-2" onClick={handleSaveDraft}>
                        Save Draft
                    </button>
                </div>
            </nav>

            <Toaster />

            <AnimationWrapper>
                <section>
                    <div className="mx-auto max-w-[900px] w-full font-jakarta">
                        {/* Format / Category Type Switcher Bar */}
                        <div className="mb-8 p-4 bg-grey/30 border border-grey rounded-2xl flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <span className="font-bold text-sm text-black block">Post Format</span>
                                <span className="text-xs text-dark-grey">Choose whether you are sharing a structured Interview Experience or a general article.</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-grey">
                                <button
                                    type="button"
                                    onClick={() => setBlogType("interview")}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                        blogType === "interview"
                                            ? "bg-purple text-white shadow-sm"
                                            : "text-dark-grey hover:text-black"
                                    }`}
                                >
                                    IT / Tech (Interview Experience)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setBlogType("general")}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                        blogType === "general"
                                            ? "bg-purple text-white shadow-sm"
                                            : "text-dark-grey hover:text-black"
                                    }`}
                                >
                                    Non-IT / General Blog
                                </button>
                            </div>
                        </div>

                        {/* Blog Banner */}
                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey rounded-xl overflow-hidden">
                            <label htmlFor="uploadBanner">
                                <img
                                    src={banner}
                                    className="z-20 w-full h-full object-cover"
                                    onError={handleError}
                                />
                                <input
                                    id="uploadBanner"
                                    type="file"
                                    accept=".png, .jpg, .jpeg"
                                    hidden
                                    onChange={handleBannerUpload}
                                />
                            </label>
                        </div>

                        {/* Non-Scrollable Auto-Expanding Blog Title */}
                        <textarea
                            ref={titleRef}
                            defaultValue={title}
                            placeholder="Blog Title (e.g. Amazon SDE Interview Experience / My Journey)"
                            className="text-4xl font-jakarta font-bold w-full h-auto min-h-[60px] outline-none resize-none overflow-hidden mt-10 leading-tight placeholder:opacity-40 tracking-tight"
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        ></textarea>

                        <hr className="w-full opacity-10 my-5" />

                        {/* If IT/Tech format selected, render Predefined Interview Experience Sections */}
                        {blogType === "interview" && (
                            <InterviewStructureEditor
                                data={structuredData}
                                onChange={setStructuredData}
                            />
                        )}

                        {/* General Article EditorJS Container with Distinct Card Blocks */}
                        <div className="my-8">
                            {blogType === "interview" && (
                                <h4 className="font-bold text-lg text-black mb-3">Additional Notes & Story</h4>
                            )}
                            <div id="textEditor" className="font-jakarta min-h-[150px] w-full outline-none"></div>

                            <button
                                type="button"
                                onClick={handleAddNewBlock}
                                className="mt-4 bg-purple text-white hover:bg-purple/90 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm active:scale-95"
                            >
                                <i className="fi fi-rr-plus"></i>
                                <span>Add New Text Box</span>
                            </button>
                        </div>
                    </div>
                </section>
            </AnimationWrapper>
        </>
    );
};

export default BlogEditor;