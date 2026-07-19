import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../App";
import Loader from "../components/loader.component";
import { Toaster, toast } from "react-hot-toast";
import { getDay } from "../common/date";
import { Link } from "react-router-dom";

const AdminUsers = () => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const [users, setUsers] = useState(null);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalDocs, setTotalDocs] = useState(0);

    // Selected user for detailed inspection modal
    const [selectedUser, setSelectedUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [userBlogs, setUserBlogs] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const fetchUsers = (pageNum = 1) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/admin/users", 
            { page: pageNum, query },
            { headers: { Authorization: `Bearer ${access_token}` } }
        )
        .then(({ data }) => {
            setUsers(data.users);
            setTotalDocs(data.totalDocs);
            setPage(pageNum);
        })
        .catch(err => {
            toast.error(err.response?.data?.error || "Error fetching users");
        });
    };

    useEffect(() => {
        if (access_token) {
            fetchUsers(1);
        }
    }, [query, access_token]);

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setModalLoading(true);
        setUserProfile(null);
        setUserBlogs(null);

        // 1. Fetch user detailed profile
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
            username: user.personal_info.username
        })
        .then(({ data }) => {
            setUserProfile(data);
        })
        .catch(err => {
            console.error("Failed to load user profile:", err);
        });

        // 2. Fetch user's blogs
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
            author: user._id,
            page: 1
        })
        .then(({ data }) => {
            setUserBlogs(data.blogs || []);
            setModalLoading(false);
        })
        .catch(err => {
            console.error("Failed to load user blogs:", err);
            setUserBlogs([]);
            setModalLoading(false);
        });
    };

    const handleRoleChange = (user_id, currentRole, fullname) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        if (confirm(`Are you sure you want to change ${fullname}'s role to "${newRole}"?`)) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/admin/change-role",
                { user_id, role: newRole },
                { headers: { Authorization: `Bearer ${access_token}` } }
            )
            .then(() => {
                toast.success(`Role updated successfully to ${newRole}`);
                fetchUsers(page);
                if (selectedUser && selectedUser._id === user_id) {
                    setSelectedUser(prev => ({ ...prev, role: newRole }));
                }
            })
            .catch(err => {
                toast.error("Failed to change user role");
            });
        }
    };

    const handleDeleteUser = (user_id, fullname) => {
        if (confirm(`Are you sure you want to delete user ${fullname}? This will permanently remove their account and all their published blogs.`)) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/admin/delete-user",
                { user_id },
                { headers: { Authorization: `Bearer ${access_token}` } }
            )
            .then(() => {
                toast.success("User and all associated blogs deleted successfully");
                setSelectedUser(null);
                fetchUsers(page);
            })
            .catch(err => {
                toast.error("Failed to delete user");
            });
        }
    };

    const handleDeleteBlog = (blog_id, title) => {
        if (confirm(`Are you sure you want to delete blog "${title}"?`)) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/delete-blog",
                { blog_id },
                { headers: { Authorization: `Bearer ${access_token}` } }
            )
            .then(() => {
                toast.success("Blog deleted successfully");
                setUserBlogs(prev => prev.filter(b => b.blog_id !== blog_id));
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
                    <h1 className="text-2xl font-bold text-black">Manage Users</h1>
                    <p className="text-xs text-dark-grey mt-0.5">Click any user to view their profile details, bio, and published blogs.</p>
                </div>
                <input 
                    type="text" 
                    placeholder="Search by name, username, or email..." 
                    className="w-full max-w-[350px] bg-grey p-3 pl-6 pr-6 rounded-full outline-none focus:bg-transparent focus:border focus:border-grey text-sm"
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {users === null ? <Loader /> : (
                <div className="overflow-x-auto bg-white border border-grey rounded-2xl shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-grey/40 border-b border-grey text-dark-grey text-xs font-bold uppercase tracking-wider">
                                <th className="p-4">User</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Joined Date</th>
                                <th className="p-4">Role</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-dark-grey text-sm">No users found.</td>
                                </tr>
                            ) : users.map((user) => (
                                <tr 
                                    key={user._id} 
                                    className="border-b border-grey hover:bg-purple/5 cursor-pointer transition-colors"
                                    onClick={() => handleUserClick(user)}
                                >
                                    <td className="p-4">
                                        <div className="flex gap-3 items-center">
                                            <img src={user.personal_info.profile_img} className="w-10 h-10 rounded-full object-cover border border-grey" alt="Avatar" />
                                            <div>
                                                <p className="font-bold text-sm text-black hover:text-purple transition-colors">{user.personal_info.fullname}</p>
                                                <p className="text-xs text-dark-grey">@{user.personal_info.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-black font-medium">
                                        {user.personal_info.email}
                                    </td>
                                    <td className="p-4 text-sm text-dark-grey">
                                        {getDay(user.joinedAt)}
                                    </td>
                                    <td className="p-4">
                                        {user.role === "admin" ? (
                                            <span className="bg-purple/10 text-purple text-xs font-bold px-3 py-1 rounded-full border border-purple/20">Admin</span>
                                        ) : (
                                            <span className="bg-grey text-dark-grey text-xs font-semibold px-3 py-1 rounded-full border border-grey">User</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex gap-2 justify-end">
                                            <button 
                                                onClick={() => handleRoleChange(user._id, user.role, user.personal_info.fullname)}
                                                className="bg-grey text-black text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-black hover:text-white transition-all border border-grey"
                                            >
                                                {user.role === "admin" ? "Demote" : "Make Admin"}
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteUser(user._id, user.personal_info.fullname)}
                                                className="bg-red/10 text-red text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red hover:text-white transition-all border border-red/20"
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
                        onClick={() => fetchUsers(page - 1)}
                        className="bg-grey text-black text-xs font-bold px-4 py-2 rounded-xl disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-xs font-bold self-center">Page {page} of {Math.ceil(totalDocs / 10)}</span>
                    <button 
                        disabled={page * 10 >= totalDocs}
                        onClick={() => fetchUsers(page + 1)}
                        className="bg-grey text-black text-xs font-bold px-4 py-2 rounded-xl disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* USER DETAILS INSPECTION MODAL */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-grey rounded-2xl w-full max-w-[750px] max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative animate-fadeIn font-jakarta">
                        {/* Close Modal Cross */}
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-grey hover:bg-black hover:text-white flex items-center justify-center text-dark-grey transition-all"
                        >
                            <i className="fi fi-br-cross text-xs"></i>
                        </button>

                        {/* User Header Profile Card */}
                        <div className="flex flex-wrap items-center gap-5 pb-6 border-b border-grey">
                            <img src={selectedUser.personal_info.profile_img} className="w-20 h-20 rounded-full object-cover border-2 border-purple/30 shadow-sm" alt="Avatar" />
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-bold text-black">{selectedUser.personal_info.fullname}</h2>
                                    {selectedUser.role === "admin" ? (
                                        <span className="bg-purple text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">Admin</span>
                                    ) : (
                                        <span className="bg-grey text-dark-grey text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">User</span>
                                    )}
                                </div>
                                <p className="text-xs text-dark-grey mt-0.5">@{selectedUser.personal_info.username} • {selectedUser.personal_info.email}</p>
                                <p className="text-xs text-dark-grey/70 mt-1">Member since: {getDay(selectedUser.joinedAt)}</p>
                            </div>
                        </div>

                        {/* Stats Badges */}
                        <div className="grid grid-cols-2 gap-4 my-6">
                            <div className="bg-grey/30 p-4 rounded-xl border border-grey text-center">
                                <span className="text-2xl font-bold text-black block">{userProfile?.account_info?.total_posts ?? "..."}</span>
                                <span className="text-xs text-dark-grey font-semibold">Total Blogs Published</span>
                            </div>
                            <div className="bg-grey/30 p-4 rounded-xl border border-grey text-center">
                                <span className="text-2xl font-bold text-purple block">{userProfile?.account_info?.total_reads ?? "..."}</span>
                                <span className="text-xs text-dark-grey font-semibold">Total Reads</span>
                            </div>
                        </div>

                        {/* About & Bio Section */}
                        <div className="mb-6 bg-grey/10 p-4 rounded-xl border border-grey">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-black mb-1">About / Bio</h4>
                            <p className="text-xs text-dark-grey leading-relaxed">
                                {userProfile?.personal_info?.bio || selectedUser.personal_info.bio || "No bio added by this user yet."}
                            </p>

                            {/* Social Links */}
                            {userProfile?.social_links && Object.values(userProfile.social_links).some(val => val) && (
                                <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-grey">
                                    {Object.keys(userProfile.social_links).map((key) => {
                                        const url = userProfile.social_links[key];
                                        if (!url) return null;
                                        return (
                                            <a
                                                key={key}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-white hover:bg-black hover:text-white border border-grey px-3 py-1 rounded-lg text-xs font-semibold capitalize flex items-center gap-1 transition-all"
                                            >
                                                <span>{key}</span>
                                                <i className="fi fi-rr-arrow-up-right text-[10px]"></i>
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* User's Blogs List */}
                        <div className="mt-6">
                            <h4 className="font-bold text-sm text-black mb-3 flex items-center justify-between">
                                <span>Blogs Written ({userBlogs ? userBlogs.length : "Loading..."})</span>
                                <Link to={`/user/${selectedUser.personal_info.username}`} target="_blank" className="text-xs text-purple underline font-semibold">
                                    View Full Public Profile Page →
                                </Link>
                            </h4>

                            {modalLoading ? (
                                <Loader />
                            ) : userBlogs && userBlogs.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {userBlogs.map((b) => (
                                        <div key={b.blog_id} className="p-3 bg-white border border-grey rounded-xl flex items-center justify-between gap-4 hover:border-purple/30 transition-all">
                                            <div className="flex items-center gap-3 min-w-0">
                                                {b.banner && (
                                                    <img src={b.banner} className="w-14 h-10 rounded-lg object-cover flex-none border border-grey" alt="Banner" />
                                                )}
                                                <div className="min-w-0">
                                                    <h5 className="font-bold text-xs text-black line-clamp-1">{b.title}</h5>
                                                    <p className="text-[11px] text-dark-grey">Published on {getDay(b.publishedAt)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-none">
                                                <Link
                                                    to={`/blog/${b.blog_id}`}
                                                    target="_blank"
                                                    className="bg-grey hover:bg-black hover:text-white px-3 py-1 rounded-lg text-xs font-bold transition-all"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteBlog(b.blog_id, b.title)}
                                                    className="bg-red/10 text-red hover:bg-red hover:text-white px-3 py-1 rounded-lg text-xs font-bold transition-all"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 bg-grey/20 rounded-xl text-center text-xs text-dark-grey italic">
                                    This user has not published any blogs yet.
                                </div>
                            )}
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="mt-8 pt-4 border-t border-grey flex justify-between items-center gap-4">
                            <button
                                onClick={() => handleRoleChange(selectedUser._id, selectedUser.role, selectedUser.personal_info.fullname)}
                                className="bg-grey hover:bg-black hover:text-white text-black text-xs font-bold px-4 py-2 rounded-xl transition-all border border-grey"
                            >
                                {selectedUser.role === "admin" ? "Demote to User" : "Promote to Admin"}
                            </button>

                            <button
                                onClick={() => handleDeleteUser(selectedUser._id, selectedUser.personal_info.fullname)}
                                className="bg-red text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-red/90 transition-all shadow-2xs"
                            >
                                Delete User Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
