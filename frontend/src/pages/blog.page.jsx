import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";
import CommentContainer, { fetchComments } from "../components/comments.component";
import axios from "axios";
import AdBanner from "../components/ad-banner.component";
import InterviewStructureViewer from "../components/interview-structure-viewer.component";

export const blogStructure = {
    title: '',
    des: '',
    content: [],
    author: { personal_info: {} },
    banner: '',
    publishedAt: ''
};

export const BlogContext = createContext({});

const BlogPage = () => {
    let { blog_id } = useParams();

    const [blog, setBlog] = useState(blogStructure);
    const [similarBlogs, setSimilarBlogs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [islikedByUser, setLikedByUser] = useState(false);
    const [commentsWrapper, setCommentsWrapper] = useState(false);
    const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

    let { title, content, banner, author: { personal_info: { fullname, username: author_username, profile_img } }, publishedAt } = blog;

    const fetchBlog = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/get-blog', { blog_id })
            .then(async ({ data: { blog } }) => {
                blog.comments = await fetchComments({ blog_id: blog._id, setParentCommentCountFun: setTotalParentCommentsLoaded });
                setBlog(blog);

                axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/search-blogs', { tag: blog.tags[0], limit: 6, eliminate_blog: blog_id })
                    .then(({ data: { blogs } }) => {
                        setSimilarBlogs(blogs);
                    });
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        resetStates();
        fetchBlog();
    }, [blog_id]);

    const resetStates = () => {
        setBlog(blogStructure);
        setSimilarBlogs(null);
        setLoading(true);
        setLikedByUser(false);
        setCommentsWrapper(false);
        setTotalParentCommentsLoaded(0);
    };

    const structuredInterview = (Array.isArray(content) ? content[0]?.structured_interview : content?.structured_interview) || null;
    const blocksList = (Array.isArray(content) ? content[0]?.blocks : content?.blocks) || (Array.isArray(content) ? content : []);

    return (
        <AnimationWrapper>
            {loading ? (
                <Loader />
            ) : (
                <BlogContext.Provider value={{ blog, setBlog, islikedByUser, setLikedByUser, commentsWrapper, setCommentsWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded }}>
                    <CommentContainer />

                    <div className="max-w-[700px] center py-10 max-lg:px-[5vw]">
                        <img src={banner} className="aspect-video" alt="Blog Banner" />

                        <div className="mt-12 font-jakarta">
                            <h2 className="text-3xl font-extrabold text-black tracking-tight leading-tight">{title}</h2>

                            <div className="flex max-sm:flex-col justify-between my-8 font-jakarta">
                                <div className="flex gap-5 items-start">
                                    <img src={profile_img} className="w-12 h-12 rounded-full" alt="Profile" />

                                    <p className="capitalize text-sm font-semibold">
                                        {fullname}
                                        <br />
                                        @
                                        <Link to={`/user/${author_username}`} className="underline text-purple">{author_username}</Link>
                                    </p>
                                </div>
                                <p className="text-dark-grey text-xs opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5"> Published on {getDay(publishedAt)}</p>
                            </div>
                        </div>

                        <BlogInteraction />

                        <div className="my-12 font-jakarta blog-page-content leading-relaxed text-black">
                            {/* Structured Predefined Interview Experience Data */}
                            {structuredInterview && (
                                <InterviewStructureViewer data={structuredInterview} />
                            )}

                            {/* Standard EditorJS Text Content Blocks */}
                            {Array.isArray(blocksList) && blocksList.map((block, i, arr) => (
                                <div key={i}>
                                    <div className="my-4 md:my-8">
                                        <BlogContent block={block} />
                                    </div>
                                    {/* Programmatic Sponsorship Ad Slot In-Between Article Content */}
                                    {i === Math.floor(arr.length / 2) - 1 && (
                                        <div className="my-8 max-w-[700px] mx-auto">
                                            <AdBanner slotId="8888888888" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <BlogInteraction />

                        {similarBlogs != null && similarBlogs.length ? (
                            <>
                                <h1 className="text-2xl mt-14 mb-10 font-bold font-jakarta text-black">Similar Blogs</h1>

                                {similarBlogs.map((blogItem, i) => {
                                    let { author: { personal_info } } = blogItem;

                                    return (
                                        <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }}>
                                            <BlogPostCard content={blogItem} author={personal_info} />
                                        </AnimationWrapper>
                                    );
                                })}
                            </>
                        ) : null}
                    </div>
                </BlogContext.Provider>
            )}
        </AnimationWrapper>
    );
};

export default BlogPage;