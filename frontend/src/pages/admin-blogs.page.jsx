import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../App";
import Loader from "../components/loader.component";
import { Toaster, toast } from "react-hot-toast";
import { getDay } from "../common/date";
import { Link } from "react-router-dom";

const AdminBlogs = () => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const [blogs, setBlogs] = useState(null);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalDocs, setTotalDocs] = useState(0);

    const fetchBlogs = (pageNum = 1) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/admin/blogs", 
            { page: pageNum, query },
            { headers: { Authorization: `Bearer ${access_token}` } }
        )
        .then(({ data }) => {
            setBlogs(data.blogs);
            setTotalDocs(data.totalDocs);
            setPage(pageNum);
        })
        .catch(err => {
            toast.error(err.response?.data?.error || "Error fetching blogs");
        });
    };

    useEffect(() => {
        if (access_token) {
            fetchBlogs(1);
        }
    }, [query, access_token]);

    const handleToggleVisibility = (blog_id, title, isCurrentlyPublic) => {
        const targetState = isCurrentlyPublic ? "Private" : "Public";
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/admin/toggle-blog-visibility",
            { blog_id },
            { headers: { Authorization: `Bearer ${access_token}` } }
        )
        .then(() => {
            toast.success(`"${title}" is now ${targetState}!`);
            fetchBlogs(page);
        })
        .catch(err => {
            toast.error(err.response?.data?.error || "Failed to update blog visibility");
        });
    };

    const handleDelete = (blog_id, title) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/admin/delete-blog",
                { blog_id },
                { headers: { Authorization: `Bearer ${access_token}` } }
            )
            .then(() => {
                toast.success("Blog deleted successfully");
                fetchBlogs(page);
            })
            .catch(err => {
                toast.error("Failed to delete blog");
            });
        }
    };

    return (
        <div className="w-full p-4 font-jakarta">
            <Toaster />
            <div className="flex justify-between items-center mb-6 max-sm:flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-black">Manage Blogs</h1>
                    <p className="text-xs text-dark-grey mt-0.5">Toggle blog visibility between Public and Private with a single click.</p>
                </div>
                <input 
                    type="text" 
                    placeholder="Search blogs by title..." 
                    className="w-full max-w-[300px] bg-grey p-3 pl-6 pr-6 rounded-full outline-none focus:bg-transparent focus:border focus:border-grey text-sm"
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {blogs === null ? <Loader /> : (
                <div className="overflow-x-auto bg-white border border-grey rounded-2xl shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-grey/40 border-b border-grey text-dark-grey text-xs font-bold uppercase tracking-wider">
                                <th className="p-4">Title</th>
                                <th className="p-4">Author</th>
                                <th className="p-4">Published Date</th>
                                <th className="p-4">Visibility Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-dark-grey text-sm">No blogs found.</td>
                                </tr>
                            ) : blogs.map((blog) => {
                                const isPublic = !blog.draft && blog.approved;

                                return (
                                    <tr key={blog.blog_id} className="border-b border-grey hover:bg-grey/10 transition-colors">
                                        <td className="p-4 max-w-[300px]">
                                            <Link to={`/blog/${blog.blog_id}`} target="_blank" className="font-bold text-sm text-black hover:text-purple line-clamp-2">
                                                {blog.title}
                                            </Link>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2.5 items-center">
                                                <img src={blog.author?.personal_info?.profile_img} className="w-8 h-8 rounded-full object-cover border border-grey" alt="Avatar" />
                                                <div>
                                                    <p className="font-bold text-xs text-black">{blog.author?.personal_info?.fullname || "Unknown"}</p>
                                                    <p className="text-[11px] text-dark-grey">@{blog.author?.personal_info?.username || "user"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs text-dark-grey">
                                            {getDay(blog.publishedAt)}
                                        </td>
                                        <td className="p-4">
                                            {isPublic ? (
                                                <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                                    <span>Public (Live)</span>
                                                </span>
                                            ) : (
                                                <span className="bg-grey text-dark-grey border border-grey text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-dark-grey"></span>
                                                    <span>Private (Draft)</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex gap-2 justify-end items-center">
                                                {/* Direct Make Public / Make Private Toggle Button */}
                                                {isPublic ? (
                                                    <button 
                                                        onClick={() => handleToggleVisibility(blog.blog_id, blog.title, true)}
                                                        className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-all active:scale-95"
                                                    >
                                                        Make Private
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleToggleVisibility(blog.blog_id, blog.title, false)}
                                                        className="bg-purple text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-purple/90 transition-all shadow-2xs active:scale-95"
                                                    >
                                                        Make Public
                                                    </button>
                                                )}

                                                <Link 
                                                    to={`/blog/${blog.blog_id}`}
                                                    className="bg-grey text-black text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-black hover:text-white transition-all border border-grey"
                                                >
                                                    View
                                                </Link>

                                                <button 
                                                    onClick={() => handleDelete(blog.blog_id, blog.title)}
                                                    className="bg-red/10 text-red text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red hover:text-white transition-all border border-red/20"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalDocs > 10 && (
                <div className="flex gap-4 mt-6 justify-center">
                    <button 
                        disabled={page === 1}
                        onClick={() => fetchBlogs(page - 1)}
                        className="bg-grey text-black text-xs font-bold px-4 py-2 rounded-xl disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-xs font-bold self-center">Page {page} of {Math.ceil(totalDocs / 10)}</span>
                    <button 
                        disabled={page * 10 >= totalDocs}
                        onClick={() => fetchBlogs(page + 1)}
                        className="bg-grey text-black text-xs font-bold px-4 py-2 rounded-xl disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminBlogs;
