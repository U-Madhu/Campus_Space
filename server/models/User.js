import mongoose, { Schema } from "mongoose";

let default_avatar_list = [
    "/default-avatars/avatar1.jpg",
    "/default-avatars/avatar2.jpg",
    "/default-avatars/avatar3.jpg",
    "/default-avatars/avatar4.jpg",
    "/default-avatars/avatar5.jpg"
];

const userSchema = mongoose.Schema({

    personal_info: {
        fullname: {
            type: String,
            lowercase: true,
            required: true,
            minlength: [3, 'fullname must be 3 letters long'],
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        password: String,
        username: {
            type: String,
            minlength: [3, 'Username must be 3 letters long'],
            unique: true,
        },
        bio: {
            type: String,
            maxlength: [200, 'Bio should not be more than 200'],
            default: "",
        },
        profile_img: {
            type: String,
            default: function() {
                return default_avatar_list[Math.floor(Math.random() * default_avatar_list.length)];
            }
        },
    },
    social_links: {
        youtube: {
            type: String,
            default: "",
        },
        instagram: {
            type: String,
            default: "",
        },
        facebook: {
            type: String,
            default: "",
        },
        twitter: {
            type: String,
            default: "",
        },
        github: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        }
    },
    account_info:{
        total_posts: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
    },
    google_auth: {
        type: Boolean,
        default: false
    },
    blogs: {
        type: [ Schema.Types.ObjectId ],
        ref: 'blogs',
        default: [],
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    }

}, 
{ 
    timestamps: {
        createdAt: 'joinedAt'
    } 

})

export default mongoose.model("users", userSchema);