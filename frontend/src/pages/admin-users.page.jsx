import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../App";
import Loader from "../components/loader.component";
import { Toaster, toast } from "react-hot-toast";
import { getDay } from "../common/date";

const AdminUsers = () => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const [users, setUsers] = useState(null);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalDocs, setTotalDocs] = useState(0);

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
                fetchUsers(page);
            })
            .catch(err => {
                toast.error("Failed to delete user");
            });
        }
    };

    return (
        <div className="w-full p-4">
            <Toaster />
            <div className="flex justify-between items-center mb-6 max-sm:flex-col gap-4">
                <h1 className="text-2xl font-bold text-black">Manage Users</h1>
                <input 
                    type="text" 
                    placeholder="Search by name, username, or email..." 
                    className="w-full max-w-[350px] bg-grey p-3 pl-6 pr-6 rounded-full outline-none focus:bg-transparent focus:border focus:border-grey"
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {users === null ? <Loader /> : (
                <div className="overflow-x-auto bg-white border border-grey rounded-2xl shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-grey/40 border-b border-grey text-dark-grey text-sm font-semibold">
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
                                    <td colSpan="5" className="p-8 text-center text-dark-grey">No users found.</td>
                                </tr>
                            ) : users.map((user) => (
                                <tr key={user._id} className="border-b border-grey hover:bg-grey/10 duration-200">
                                    <td className="p-4">
                                        <div className="flex gap-2 items-center">
                                            <img src={user.personal_info.profile_img} className="w-8 h-8 rounded-full object-cover" />
                                            <div>
                                                <p className="font-semibold text-sm text-black">{user.personal_info.fullname}</p>
                                                <p className="text-xs text-dark-grey">@{user.personal_info.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-black">
                                        {user.personal_info.email}
                                    </td>
                                    <td className="p-4 text-sm text-dark-grey">
                                        {getDay(user.joinedAt)}
                                    </td>
                                    <td className="p-4">
                                        {user.role === "admin" ? (
                                            <span className="bg-purple/10 text-purple text-xs font-semibold px-3 py-1 rounded-full font-inter">Admin</span>
                                        ) : (
                                            <span className="bg-grey text-dark-grey text-xs font-semibold px-3 py-1 rounded-full font-inter">User</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button 
                                                onClick={() => handleRoleChange(user._id, user.role, user.personal_info.fullname)}
                                                className="bg-grey/80 text-dark text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-black hover:text-white transition"
                                            >
                                                {user.role === "admin" ? "Demote" : "Make Admin"}
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteUser(user._id, user.personal_info.fullname)}
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
                        onClick={() => fetchUsers(page - 1)}
                        className="btn-light py-2 px-4 text-sm disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button 
                        disabled={page * 10 >= totalDocs}
                        onClick={() => fetchUsers(page + 1)}
                        className="btn-light py-2 px-4 text-sm disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
