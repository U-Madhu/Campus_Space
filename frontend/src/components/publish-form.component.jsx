import { Toaster, toast } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";

const PublishForm = () => {
    let characterLimit = 200;
    let tagLimit = 10;

    let { blog_id } = useParams();

    let { blog, setEditorState, setBlog } = useContext(EditorContext);
    let { banner = "", title = "", tags = [], des = "" } = blog || {};

    let { userAuth: { access_token } } = useContext(UserContext);

    let navigate = useNavigate();

    const handleCloseEvent = () => {
        setEditorState("editor");
    };

    const handleBlogTitleChange = (e) => {
        let input = e.target;
        setBlog({ ...blog, title: input.value });
    };

    const handleBlogDesChange = (e) => {
        let input = e.target;
        setBlog({ ...blog, des: input.value });
    };

    const handleTitleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 13 || e.keyCode === 188) {
            e.preventDefault();

            let tag = e.target.value.trim().toLowerCase();

            if (!tag.length) return;

            if (tags.length >= tagLimit) {
                return toast.error(`You can add max ${tagLimit} Tags`);
            }

            if (!tags.includes(tag)) {
                setBlog({ ...blog, tags: [...tags, tag] });
            }

            e.target.value = ""; // clear input
        }
    };

    const publishBlog = (e) => {
        if (e.target.classList.contains('disable')) {
            return;
        }

        if (!title.length) {
            return toast.error("Write blog title before publishing");
        }
        if (!des.length || des.length > characterLimit) {
            return toast.error("Write description about your blog under 200 characters before publishing");
        }
        if (!tags.length) {
            return toast.error("Enter at least 1 tag to help us rank your blog");
        }

        let loadingToast = toast.loading("Publishing...");
        e.target.classList.add('disable');

        let blogObj = {
            title, banner, des, content: blog.content, tags, draft: false
        };

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/create-blogs', { ...blogObj, id: blog_id }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(() => {
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            toast.success("Published Successfully!");
            setTimeout(() => {
                navigate('/');
            }, 500);
        }).catch(({ response }) => {
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            return toast.error(response?.data?.error || "Failed to publish blog");
        });
    };

    return (
        <AnimationWrapper>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-8 font-jakarta">
                <Toaster />

                <button
                    className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
                    onClick={handleCloseEvent}
                >
                    <i className="fi fi-br-cross text-xl"></i>
                </button>

                <div className="max-w-[550px] center">
                    <p className="text-dark-grey mb-1">Preview</p>

                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey border border-grey mt-4">
                        <img src={banner} alt="Preview Banner" className="w-full h-full object-cover" />
                    </div>

                    <h1 className="text-4xl font-bold leading-tight font-jakarta mt-2 line-clamp-2">{title}</h1>

                    <p className="font-jakarta text-sm leading-6 line-clamp-2 text-dark-grey mt-4">{des}</p>
                </div>

                <div className="border-grey lg:border-l lg:pl-8">
                    <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
                    <input
                        type="text"
                        placeholder="Blog Title"
                        defaultValue={title}
                        className="input-box pl-4"
                        onChange={handleBlogTitleChange}
                    />

                    <p className="text-dark-grey mb-2 mt-9">Short Description</p>
                    <textarea
                        maxLength={characterLimit}
                        defaultValue={des}
                        className="h-40 resize-none leading-7 input-box pl-4"
                        onChange={handleBlogDesChange}
                        onKeyDown={handleTitleKeyDown}
                    ></textarea>

                    <p className="mt-1 text-dark-grey text-xs text-right">{characterLimit - des.length} characters left</p>

                    <p className="text-dark-grey mb-2 mt-9">Topics / Tags - (Helps searching and ranking your blog)</p>

                    <div className="relative input-box pl-2 pt-2 pb-4">
                        <input
                            type="text"
                            placeholder="Topic (Press Enter or comma to add tag)"
                            className="sticky top-0 left-0 bg-white border-b border-grey mb-3 font-jakarta outline-none focus:border-purple text-sm w-full p-2"
                            onKeyDown={handleKeyDown}
                        />

                        {tags.map((tag, i) => {
                            return <Tag tag={tag} tagIndex={i} key={i} />;
                        })}
                    </div>

                    <p className="mt-1 text-dark-grey text-xs text-right">{tagLimit - tags.length} Tags left</p>

                    <button className="btn-dark px-8 mt-6" onClick={publishBlog}>
                        Publish Now
                    </button>
                </div>
            </section>
        </AnimationWrapper>
    );
};

export default PublishForm;