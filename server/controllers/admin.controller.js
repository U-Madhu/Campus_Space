import Blog from "../models/Blog.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Notification from "../models/Notification.js";

export const getBlogs = (req, res) => {
    let { page = 1, query = "" } = req.body;
    let maxLimit = 10;
    
    Blog.find({ title: new RegExp(query, 'i') })
    .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
    .sort({ publishedAt: -1 })
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then(blogs => {
        Blog.countDocuments({ title: new RegExp(query, 'i') }).then(count => {
            return res.status(200).json({ blogs, totalDocs: count });
        });
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
};

export const approveBlog = (req, res) => {
    let { blog_id } = req.body;
    Blog.findOneAndUpdate({ blog_id }, { approved: true, draft: false })
    .then(blog => {
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        return res.status(200).json({ status: "success", approved: true });
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
};

export const toggleBlogVisibility = async (req, res) => {
    try {
        const { blog_id } = req.body;
        const blog = await Blog.findOne({ blog_id });
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        const isPublic = !blog.draft && blog.approved;
        
        if (isPublic) {
            blog.draft = true;
        } else {
            blog.draft = false;
            blog.approved = true;
        }

        await blog.save();

        return res.status(200).json({
            status: "success",
            isPublic: !blog.draft && blog.approved,
            message: `Blog status updated to ${!blog.draft && blog.approved ? 'Public' : 'Private'}`
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const approveBlogLink = (req, res) => {
    let { blog_id } = req.params;
    Blog.findOneAndUpdate({ blog_id }, { approved: true })
    .then(blog => {
        if (!blog) {
            return res.status(404).send("<h2>Blog not found</h2>");
        }
        return res.send(`
            <div style="font-family:sans-serif;text-align:center;padding:50px;">
                <h1 style="color:#4CAF50;">Success!</h1>
                <p>The blog "<strong>${blog.title}</strong>" has been approved and is now live.</p>
                <a href="${process.env.CLIENT_DOMAIN || 'http://localhost:5173'}/blog/${blog_id}" style="color:#6C63FF;text-decoration:none;font-weight:bold;">View Blog on Site</a>
            </div>
        `);
    })
    .catch(err => {
        return res.status(500).send(`<h2>Error approving blog: ${err.message}</h2>`);
    });
};

export const deleteBlog = (req, res) => {
    let { blog_id } = req.body;
    Blog.findOneAndDelete({ blog_id })
    .then(blog => {
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        Notification.deleteMany({ blog: blog._id }).then(() => console.log('notifications deleted'));
        Comment.deleteMany({ blog_id: blog._id }).then(() => console.log('comments deleted'));
        User.findOneAndUpdate({ _id: blog.author }, { $pull: { blogs: blog._id }, $inc: { "account_info.total_posts": -1 } })
        .then(() => console.log('Blog deleted from user list'));

        return res.status(200).json({ status: "success" });
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
};

export const getUsers = (req, res) => {
    let { page = 1, query = "" } = req.body;
    let maxLimit = 10;

    User.find({
        $or: [
            { "personal_info.fullname": new RegExp(query, 'i') },
            { "personal_info.username": new RegExp(query, 'i') },
            { "personal_info.email": new RegExp(query, 'i') }
        ]
    })
    .select("personal_info.fullname personal_info.username personal_info.email personal_info.profile_img role joinedAt")
    .sort({ joinedAt: -1 })
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then(users => {
        User.countDocuments({
            $or: [
                { "personal_info.fullname": new RegExp(query, 'i') },
                { "personal_info.username": new RegExp(query, 'i') },
                { "personal_info.email": new RegExp(query, 'i') }
            ]
        }).then(count => {
            return res.status(200).json({ users, totalDocs: count });
        });
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
};

export const deleteUser = (req, res) => {
    let { user_id } = req.body;
    User.findOneAndDelete({ _id: user_id })
    .then(user => {
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        Blog.find({ author: user_id }).then(blogs => {
            const blogIds = blogs.map(b => b._id);
            Notification.deleteMany({ blog: { $in: blogIds } }).exec();
            Comment.deleteMany({ blog_id: { $in: blogIds } }).exec();
            Blog.deleteMany({ author: user_id }).exec();
        });
        return res.status(200).json({ status: "success" });
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
};

export const changeRole = (req, res) => {
    let { user_id, role } = req.body;
    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ error: "Invalid role value" });
    }
    
    User.findOneAndUpdate({ _id: user_id }, { role })
    .then(user => {
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ status: "success", role });
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
};
