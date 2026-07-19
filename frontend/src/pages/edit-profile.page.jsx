import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import { profileDataStructure } from "./profile.page";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import toast, { Toaster } from "react-hot-toast";
import InputBox from "../components/input.component";
import { uploadImage } from "../common/cloudinary";
import { storeInSession } from "../common/session";
import { compressImage } from "../common/image-resizer";

const defaultAvatars = [
    "/default-avatars/avatar1.jpg",
    "/default-avatars/avatar2.jpg",
    "/default-avatars/avatar3.jpg",
    "/default-avatars/avatar4.jpg",
    "/default-avatars/avatar5.jpg"
];

const EditProfile = () => {
    let { userAuth, userAuth: { access_token }, setUserAuth } = useContext(UserContext);

    let bioLimit = 150;
    let profileImgEle = useRef();
    let editProfileForm = useRef();

    const [profile, setProfile] = useState(profileDataStructure);
    const [loading, setLoading] = useState(true);

    const [charactersLeft, setCharactersLeft] = useState(bioLimit);
    const [updatedProfileImg, setUpdatedProfileImg] = useState(null);

    let { social_links, personal_info: { fullname, username: profile_username, profile_img, email, bio } } = profile;

    useEffect(() => {
        if (access_token) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { username: userAuth.username })
                .then(({ data }) => {
                    setProfile(data);
                    setLoading(false);
                }).catch(err => {
                    console.log(err);
                });
        }
    }, [access_token]);

    const handleCharacterChange = (e) => {
        setCharactersLeft(bioLimit - e.target.value.length);
    };

    const handleImagePreview = async (e) => {
        let img = e.target.files[0];
        if (!img) return;

        let loadingToast = toast.loading("Optimizing image...");
        try {
            const compressedImg = await compressImage(img, 600, 600, 0.75);
            profileImgEle.current.src = URL.createObjectURL(compressedImg);
            setUpdatedProfileImg(compressedImg);
            toast.success("Image optimized!");
        } catch (err) {
            console.error("Compression failed:", err);
            profileImgEle.current.src = URL.createObjectURL(img);
            setUpdatedProfileImg(img);
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    const handleSelectPresetAvatar = async (avatarUrl) => {
        let loadingToast = toast.loading("Updating profile image...");
        try {
            const { data } = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile-img", { url: avatarUrl }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });

            let newUserAuth = { ...userAuth, profile_img: data.profile_img };
            storeInSession("user", JSON.stringify(newUserAuth));
            setUserAuth(newUserAuth);

            setProfile(prevProfile => ({
                ...prevProfile,
                personal_info: {
                    ...prevProfile.personal_info,
                    profile_img: data.profile_img
                }
            }));

            if (profileImgEle.current) {
                profileImgEle.current.src = data.profile_img;
            }

            setUpdatedProfileImg(null);
            toast.success("Profile Image Updated!");
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.error || err.message || "Failed to update profile image");
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();
        const button = e.currentTarget;

        if (!updatedProfileImg) {
            return toast.error("Please select an image first.");
        }

        let loadingToast = toast.loading("Uploading...");
        button.disabled = true;

        try {
            const url = await uploadImage(updatedProfileImg);
            if (!url) {
                throw new Error("Image upload failed. Try again.");
            }

            const { data } = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile-img", { url }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });

            let newUserAuth = { ...userAuth, profile_img: data.profile_img };
            storeInSession("user", JSON.stringify(newUserAuth));
            setUserAuth(newUserAuth);

            setProfile(prevProfile => ({
                ...prevProfile,
                personal_info: {
                    ...prevProfile.personal_info,
                    profile_img: data.profile_img
                }
            }));

            if (profileImgEle.current) {
                profileImgEle.current.src = data.profile_img;
            }

            setUpdatedProfileImg(null);
            toast.success("Uploaded ");
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.error || err.message || "Upload failed");
        } finally {
            toast.dismiss(loadingToast);
            button.disabled = false;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let form = new FormData(editProfileForm.current);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { username, bio, youtube, facebook, twitter, github, instagram, website } = formData;

        if (username.length < 3) {
            return toast.error("Username should be at least 3 letters long");
        }
        if (bio.length > bioLimit) {
            return toast.error(`Bio should not be more than ${bioLimit} characters`);
        }

        let loadingToast = toast.loading("Updating...");
        e.target.setAttribute("disabled", true);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile", {
            username, bio, social_links: { youtube, facebook, twitter, github, instagram, website }
        }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(({ data }) => {
                if (userAuth.username !== data.username) {
                    let newUserAuth = { ...userAuth, username: data.username };
                    storeInSession("user", JSON.stringify(newUserAuth));
                    setUserAuth(newUserAuth);
                }
                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                toast.success("Profile Updated");
            })
            .catch(({ response }) => {
                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                toast.error(response?.data?.error || "Update failed");
            });
    };

    return (
        <AnimationWrapper>
            {loading ? (
                <Loader />
            ) : (
                <form ref={editProfileForm}>
                    <Toaster />

                    <h1 className="max-md:hidden font-jakarta font-bold text-2xl mb-4">Edit Profile</h1>

                    <div className="flex flex-col lg:flex-row items-start py-6 gap-8 lg:gap-10 font-jakarta">
                        <div className="max-lg:center mb-5 flex flex-col items-center gap-4">
                            <label htmlFor="uploadImg" id="profileImgLable" className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden border-2 border-grey shadow-sm">
                                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/80 opacity-0 hover:opacity-100 cursor-pointer transition-opacity font-bold text-xs">
                                    Upload Image
                                </div>
                                <img ref={profileImgEle} src={profile_img} className="w-full h-full object-cover" alt="Profile" />
                            </label>

                            <input type="file" id="uploadImg" accept=".jpg, .png, .jpeg" hidden onChange={handleImagePreview} />

                            <button className="btn-light px-8 text-xs font-bold" onClick={handleImageUpload}>
                                Upload Photo
                            </button>

                            {/* PRESET AVATAR SELECTOR */}
                            <div className="mt-4 w-full text-center">
                                <span className="text-xs font-bold text-dark-grey block mb-2 uppercase tracking-wider">
                                    Or Select Default Nature Avatar:
                                </span>
                                <div className="flex items-center justify-center gap-2 flex-wrap">
                                    {defaultAvatars.map((url, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => handleSelectPresetAvatar(url)}
                                            className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                                                profile_img === url ? "border-purple scale-110 shadow-md" : "border-grey opacity-75 hover:opacity-100"
                                            }`}
                                            title={`Select Avatar ${i + 1}`}
                                        >
                                            <img src={url} className="w-full h-full object-cover" alt={`Preset Avatar ${i + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="w-full font-jakarta">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <InputBox name="fullname" type="text" value={fullname} placeholder="Full Name" disable={true} icon="fi-rr-user" />
                                </div>
                                <div>
                                    <InputBox name="email" type="email" value={email} placeholder="Email" disable={true} icon="fi-rr-envelope" />
                                </div>
                            </div>

                            <InputBox type="text" name="username" value={profile_username} placeholder="Username" icon="fi-rr-at" />

                            <p className="text-dark-grey -mt-3 text-xs">Username will use to search user and will be visible to all users</p>

                            <textarea
                                name="bio"
                                maxLength={bioLimit}
                                defaultValue={bio}
                                className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5 font-jakarta"
                                placeholder="Bio"
                                onChange={handleCharacterChange}
                            ></textarea>

                            <p className="mt-1 text-dark-grey text-xs text-right">{charactersLeft} characters left</p>

                            <p className="my-6 text-dark-grey font-bold text-sm">Add your social handles below</p>

                            <div className="md:grid md:grid-cols-2 gap-[x-14]">
                                <InputBox type="text" name="youtube" value={social_links.youtube} placeholder="https://" icon="fi-brands-youtube" />
                                <InputBox type="text" name="instagram" value={social_links.instagram} placeholder="https://" icon="fi-brands-instagram font-jakarta" />
                                <InputBox type="text" name="facebook" value={social_links.facebook} placeholder="https://" icon="fi-brands-facebook" />
                                <InputBox type="text" name="twitter" value={social_links.twitter} placeholder="https://" icon="fi-brands-twitter" />
                                <InputBox type="text" name="github" value={social_links.github} placeholder="https://" icon="fi-brands-github" />
                                <InputBox type="text" name="website" value={social_links.website} placeholder="https://" icon="fi-rr-globe" />
                            </div>

                            <button className="btn-dark w-1/3 max-lg:w-full font-bold text-xs py-3" type="submit" onClick={handleSubmit}>
                                Update Profile
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </AnimationWrapper>
    );
};

export default EditProfile;