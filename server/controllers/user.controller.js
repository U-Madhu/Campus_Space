import bcrypt from "bcrypt";
import User from "../models/User.js";
// import { s3 } from "../config/aws.config.js";
import cloudinary from "../config/cloudinary.config.js";

const getCloudinaryPublicId = (url) => {
    try {
        const parts = url.split('/upload/');
        if (parts.length < 2) return null;
        const pathParts = parts[1].split('/');
        if (pathParts[0].startsWith('v')) {
            pathParts.shift();
        }
        const fullPath = pathParts.join('/');
        const lastDot = fullPath.lastIndexOf('.');
        return lastDot === -1 ? fullPath : fullPath.substring(0, lastDot);
    } catch (err) {
        console.error("Failed to parse public ID:", err.message);
        return null;
    }
};

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

export const changePassword = (req, res) => {
    let { currentPassword, newPassword } = req.body;

    if (!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)) {
        return res.status(403).json({
            "error": "Password should be 6-20 letter including long with numeric,1 lowercase and 1 uppercase letter"
        });
    }
    
    User.findOne({ _id: req.user })
    .then((user) => {
        if (user.google_auth) {
            return res.status(403).json({ error: "You cant change the accounts password because you logged in throgh google" });
        }

        bcrypt.compare(currentPassword, user.personal_info.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Some error occured while changing the password ,please try again later" });
            }
            if (!result) {
                return res.status(403).json({ error: "Incorrect current password" });
            }

            bcrypt.hash(newPassword, 10, (err, hashed_password) => {
                User.findOneAndUpdate({ _id: req.user }, { "personal_info.password": hashed_password })
                .then((u) => {
                    return res.status(200).json({ status: 'password changed' });
                })
                .catch(err => {
                    return res.status(500).json({ error: 'some error occured while saving new password.please try again later' });
                });
            });
        });
    })
    .catch(err => {
        return res.status(500).json({ error: "User not found" });
    });
};

export const searchUsers = (req, res) => {
    let { query } = req.body;
    User.find({ "personal_info.username": new RegExp(query, 'i') })
    .limit(50)
    .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
    .then(users => {
        return res.status(200).json({ users });
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
};

export const getProfile = async (req, res) => {
    let { username } = req.body;
    console.log("Searching for:", username);

    await User.findOne({ "personal_info.username": username })
    .select("-personal_info.password -google_auth -updatedAt -blogs")
    .then(user => {
        console.log("Found user:", user);
        return res.status(200).json(user);
    })
    .catch(err => {
        res.status(500).json({ error: err.message });
    });
};

export const updateProfileImg = (req, res) => {
    let { url } = req.body;

    User.findOneAndUpdate({ _id: req.user }, { "personal_info.profile_img": url })
    .then((user) => {
        if (user && user.personal_info.profile_img) {
            const oldImg = user.personal_info.profile_img;
            
            /* S3 cleanup commented out
            if (oldImg && oldImg.includes('campus-space-image-bucket') && oldImg !== url) {
                const key = oldImg.split('/').pop();
                s3.deleteObject({
                    Bucket: 'campus-space-image-bucket',
                    Key: key
                }, (err, data) => {
                    if (err) {
                        console.log("Failed to delete older image from S3:", err);
                    } else {
                        console.log("Successfully deleted older image from S3:", key);
                    }
                });
            }
            */

            // Cloudinary cleanup
            if (oldImg && oldImg.includes('res.cloudinary.com') && oldImg !== url) {
                const publicId = getCloudinaryPublicId(oldImg);
                if (publicId) {
                    cloudinary.uploader.destroy(publicId, (err, result) => {
                        if (err) {
                            console.log("Failed to delete older image from Cloudinary:", err);
                        } else {
                            console.log("Successfully deleted older image from Cloudinary:", publicId);
                        }
                    });
                }
            }
        }
        return res.status(200).json({ profile_img: url });
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
};

export const updateProfile = (req, res) => {
    let { username, bio, social_links } = req.body;
    let bioLimit = 150;

    if (username.length < 3) {
        return res.status(403).json({ error: "Username should be at least 3 letter long" });
    }
    if (bio.length > bioLimit) {
        return res.status(403).json({ error: `Bio should not be morethan ${bioLimit} characters` });
    }

    let socialLinksArr = Object.keys(social_links);

    try {
        for (let i = 0; i < socialLinksArr.length; i++) {
            if (social_links[socialLinksArr[i]].length) {
                let hostname = new URL(social_links[socialLinksArr[i]]).hostname;

                if (!hostname.includes(`${socialLinksArr[i]}.com`) && socialLinksArr[i] != 'website') {
                    return res.status(403).json({ error: `${socialLinksArr[i]} link is invalid. you must enter a full link` });
                }
            }
        }
    } catch (err) {
        return res.status(500).json({ error: "You must provide full social links with http(s) included" });
    }

    let updateObj = {
        "personal_info.username": username,
        "personal_info.bio": bio,
        social_links
    };

    User.findOneAndUpdate({ _id: req.user }, updateObj, {
        runValidators: true
    })
    .then(() => {
        return res.status(200).json({ username });
    })
    .catch(err => {
        if (err.code == 11000) {
            return res.status(409).json({ error: "username is already taken" });
        }
        return res.status(500).json({ error: err.message });
    });
};
