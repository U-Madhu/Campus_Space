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

    const handleApprove = (blog_id, title) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/admin/approve-blog",
            { blog_id },
            { headers: { Authorization: `Bearer ${access_token}` } }
        )
        .then(() => {
            toast.success(`"${title}" Approved successfully!`);
            fetchBlogs(page);
        })
        .catch(err => {
            toast.error("Failed to approve blog");
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
        <div className="w-full p-4">
            <Toaster />
            <div className="flex justify-between items-center mb-6 max-sm:flex-col gap-4">
                <h1 className="text-2xl font-bold text-black">Manage Blogs</h1>
                <input 
                    type="text" 
                    placeholder="Search blogs by title..." 
                    className="w-full max-w-[300px] bg-grey p-3 pl-6 pr-6 rounded-full outline-none focus:bg-transparent focus:border focus:border-grey"
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {blogs === null ? <Loader /> : (
                <div className="overflow-x-auto bg-white border border-grey rounded-2xl shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-grey/40 border-b border-grey text-dark-grey text-sm font-semibold">
                                <th className="p-4">Title</th>
                                <th className="p-4">Author</th>
                                <th className="p-4">Published</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Visibility</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-dark-grey">No blogs found.</td>
                                </tr>
                            ) : blogs.map((blog) => (
                                <tr key={blog.blog_id} className="border-b border-grey hover:bg-grey/10 duration-200">
                                    <td className="p-4 max-w-[300px]">
                                        <Link to={`/blog/${blog.blog_id}`} className="font-semibold text-black hover:text-purple line-clamp-2">
                                            {blog.title}
                                        </Link>
                                        {blog.draft && <span className="bg-grey text-dark-grey text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">Draft</span>}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2 items-center">
                                            <img src={blog.author.personal_info.profile_img} className="w-8 h-8 rounded-full object-cover" />
                                            <div>
                                                <p className="font-semibold text-sm text-black">{blog.author.personal_info.fullname}</p>
                                                <p className="text-xs text-dark-grey">@{blog.author.personal_info.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-dark-grey">
                                        {getDay(blog.publishedAt)}
                                    </td>
                                    <td className="p-4">
                                        {blog.draft ? (
                                            <span className="text-xs font-semibold text-dark-grey">N/A</span>
                                        ) : blog.approved ? (
                                            <span className="bg-green/10 text-green text-xs font-semibold px-3 py-1 rounded-full font-inter">Live</span>
                                        ) : (
                                            <span className="bg-red/10 text-red text-xs font-semibold px-3 py-1 rounded-full font-inter">Pending</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {blog.draft ? (
                                            <span className="text-xs font-semibold text-dark-grey">Private</span>
                                        ) : blog.approved ? (
                                            <span className="text-xs font-semibold text-green font-inter">Public</span>
                                        ) : (
                                            <span className="text-xs font-semibold text-red font-inter">Private</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex gap-2 justify-end">
                                            {!blog.approved && !blog.draft && (
                                                <button 
                                                    onClick={() => handleApprove(blog.blog_id, blog.title)}
                                                    className="bg-green text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-opacity-80 transition"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDelete(blog.blog_id, blog.title)}
                                                className="bg-red/10 text-red text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red hover:text-white transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
                        className="btn-light py-2 px-4 text-sm disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button 
                        disabled={page * 10 >= totalDocs}
                        onClick={() => fetchBlogs(page + 1)}
                        className="btn-light py-2 px-4 text-sm disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminBlogs;
