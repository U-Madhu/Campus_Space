import { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";

const UserNavigationPanel = ({ closePanel }) => {

    const { userAuth: { username, role }, setUserAuth } = useContext(UserContext);

    const signOutUser = () => {
        removeFromSession("user");
        setUserAuth({ access_token: null });
        if (closePanel) closePanel();
    };

    return (
        <AnimationWrapper className="absolute right-0 z-50" transition={{ duration: 0.2 }}>
            <div className="bg-white absolute right-0 border border-grey w-60 duration-200">
                <Link to='/editor' className="flex gap-2 link md:hidden pl-8 py-4" onClick={closePanel}>
                    <i className="fi fi-rr-file-edit"></i>
                    <p>Write</p>
                </Link>

                <Link to={`/user/${username}`} className="link pl-8 py-4" onClick={closePanel}>
                    Profile
                </Link>

                <Link to="/dashboard/blogs" className="link pl-8 py-4" onClick={closePanel}>
                    Dashboard
                </Link>

                {role === 'admin' && (
                    <Link to="/admin-panel/analytics" className="link pl-8 py-4 text-purple font-semibold flex items-center gap-2" onClick={closePanel}>
                        <i className="fi fi-rr-shield"></i>
                        <span>Admin Panel</span>
                    </Link>
                )}

                <Link to="/settings/edit-profile" className="link pl-8 py-4" onClick={closePanel}>
                    Settings
                </Link>

                <span className="absolute border-t border-grey w-[100%]"></span>

                <button className="text-left p-4 hover:bg-grey w-full pl-8 py-4" onClick={signOutUser}>
                    <h1 className="font-bold text-xl mg-1">Sign Out</h1>
                    <p className="text-dark-grey">@{username}</p>
                </button>
            </div>
        </AnimationWrapper>
    );
};

export default UserNavigationPanel;