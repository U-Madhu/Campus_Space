import { nanoid } from "nanoid";
import Blog from "../models/Blog.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Comment from "../models/Comment.js";
import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.config.js';
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const sendApprovalEmail = async (blog, author) => {
    try {
        if (!process.env.ADMIN_EMAIL) {
            console.log("ADMIN_EMAIL not set, skipping approval email.");
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        const approvalLink = `${process.env.VITE_SERVER_DOMAIN || 'http://localhost:3000'}/admin/approve-blog-link/${blog.blog_id}`;

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `Pending Approval: ${blog.title}`,
            html: `
                <div style="font-family:sans-serif;padding:20px;line-height:1.6;">
                    <h2>New Blog Publication Request</h2>
                    <p><strong>Title:</strong> ${blog.title}</p>
                    <p><strong>Author:</strong> ${author.personal_info.fullname} (@${author.personal_info.username})</p>
                    <p><strong>Description:</strong> ${blog.des}</p>
                    <p>Please click the button below to approve this blog post and publish it to the campus space:</p>
                    <div style="margin: 20px 0;">
                        <a href="${approvalLink}" style="background-color:#4CAF50;color:white;padding:12px 24px;text-decoration:none;border-radius:5px;font-weight:bold;display:inline-block;">Approve Blog</a>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Approval email sent successfully to ${process.env.ADMIN_EMAIL}`);
    } catch (err) {
        console.error("Failed to send approval email:", err.message);
    }
};

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        
        const stream = cloudinary.uploader.upload_stream(
            { folder: "campus-space" },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error.message);
                    return res.status(500).json({ error: error.message });
                }
                return res.status(200).json({ url: result.secure_url });
            }
        );
        
        Readable.from(req.file.buffer).pipe(stream);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const latestBlogs = (req, res) => {
    let { page = 1 } = req.body;
    let maxLimit = 3;
    Blog.find({ draft: false, approved: true })
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({ 'publishedAt': -1 })
    .select('blog_id title des banner activity tags publishedAt -_id')
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then(blogs => {
        return res.status(200).json({ blogs });
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
};

export const allLatestBlogsCount = (req, res) => {
    Blog.countDocuments({ draft: false, approved: true })
    .then(count => {
        return res.status(200).json({ totalDocs: count });
    })
    .catch(err => {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
    });
};

export const trendingBlogs = (req, res) => {
    Blog.find({ draft: false, approved: true })
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({ "activity.total_reads": -1, "publishedAt": -1 })
    .select("blog_id title publishedAt -_id")
    .limit(5)
    .then(blogs => {
        return res.status(200).json({ blogs });
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
};

export const searchBlogs = (req, res) => {
    let { tag, query, page, author, limit, eliminate_blog } = req.body;
    let findQuery;
    if (tag) {
        findQuery = { tags: tag, draft: false, approved: true, blog_id: { $ne: eliminate_blog } };
    } else if (query) {
        findQuery = { draft: false, approved: true, title: new RegExp(query, 'i') };
    } else if (author) {
        findQuery = { author, draft: false, approved: true };
    }

    let maxLimit = limit ? limit : 2;

    Blog.find(findQuery)
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({ 'publishedAt': -1 })
    .select('blog_id title des banner activity tags publishedAt -_id')
    .limit(maxLimit)
    .skip((page - 1) * maxLimit)
    .then(blogs => {
        return res.status(200).json({ blogs });
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
};

export const searchBlogsCount = (req, res) => {
    let { tag, query, author } = req.body;
    let findQuery;
    if (tag) {
        findQuery = { tags: tag, draft: false, approved: true };
    } else if (query) {
        findQuery = { draft: false, approved: true, title: new RegExp(query, 'i') };
    } else if (author) {
        findQuery = { author, draft: false, approved: true };
    }

    Blog.countDocuments(findQuery)
    .then(count => {
        return res.status(200).json({ totalDocs: count });
    })
    .catch(err => {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
    });
};

export const createBlog = (req, res) => {
    let authorId = req.user;
    let { id, title, des, banner, tags, content, draft } = req.body;
    let approved = req.role === 'admin' ? true : false;
    
    if (!title.length) {
        return res.status(403).json({ error: "You must provid a title" });
    }
    if (!draft) {
        if (!des.length || des.length > 200) {
            return res.status(403).json({ error: "You must provide blog description under 200 characters" });
        }
        if (!banner.length) {
            return res.status(403).json({ error: "You must provide blog banner to publish it" });
        }
        const hasBlocks = content && Array.isArray(content.blocks) && content.blocks.length > 0;
        const si = content && content.structured_interview;
        const hasStructured = si && (
            si.selection_process?.notes ||
            (si.selection_process?.rounds && Object.keys(si.selection_process.rounds).length > 0) ||
            (si.coding?.questions && si.coding.questions.length > 0) ||
            (si.core_concepts?.questions && si.core_concepts.questions.length > 0) ||
            (si.project_related?.questions && si.project_related.questions.length > 0) ||
            (si.personality_related?.questions && si.personality_related.questions.length > 0)
        );

        if (!hasBlocks && !hasStructured) {
            return res.status(403).json({ error: "There must be some blog content to publish it" });
        }
        if (!tags.length || tags.length > 10) {
            return res.status(403).json({ error: "Provide Tags in order to publish the blog," });
        }
    }
    
    tags = tags.map(tag => tag.toLowerCase());
    let blogId = id || title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-').trim() + nanoid();

    if (id) {
        let updateObj = { title, des, banner, content, tags, draft: draft ? draft : false };
        if (!draft) {
            updateObj.approved = approved;
        }

        Blog.findOneAndUpdate({ blog_id: blogId }, updateObj)
        .then(blog => {
            if (!draft && req.role !== 'admin') {
                User.findById(authorId).then(user => {
                    if (user) {
                        sendApprovalEmail({ blog_id: blogId, title, des }, user);
                    }
                });
            }
            return res.status(200).json({ id: blogId });
        })
        .catch(err => {
            return res.status(500).json({ error: "Failed to update blog details" });
        });
    } else {
        let blog = new Blog({
            title, des, banner, content, tags, author: authorId, blog_id: blogId, draft: Boolean(draft), approved: draft ? false : approved
        });

        blog.save().then(savedBlog => {
            let incrementVal = draft ? 0 : 1;
            User.findOneAndUpdate({ _id: authorId }, { $inc: { "account_info.total_posts": incrementVal }, $push: { "blogs": savedBlog._id } })
            .then(user => {
                if (!draft && req.role !== 'admin') {
                    sendApprovalEmail(savedBlog, user);
                }
                return res.status(200).json({ id: blogId });
            })
            .catch(err => {
                return res.status(500).json({ error: "Failed to update total posts number" });
            });
        }).catch(err => {
            return res.status(500).json({ error: err.message });
        });
    }
};

export const getBlog = (req, res) => {
    let { blog_id, draft, mode } = req.body;
    let incrementVal = mode != 'edit' ? 1 : 0;
    
    let userId = null;
    let userRole = null;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            userId = decoded.id;
            userRole = decoded.role;
        } catch (err) {
            // ignore token error
        }
    }

    Blog.findOneAndUpdate({ blog_id }, { $inc: { "activity.total_reads": incrementVal } })
    .populate("author", "personal_info.fullname personal_info.profile_img personal_info.username")
    .select("title des content banner activity publishedAt blog_id tags approved draft author")
    .then(blog => {
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        if (blog.author && blog.author.personal_info) {
            User.findOneAndUpdate({ "personal_info.username": blog.author.personal_info.username }, {
                $inc: { "account_info.total_reads": incrementVal }
            })
            .catch(err => console.error("Error updating user total_reads:", err.message));
        }

        const authorIdStr = blog.author && (blog.author._id ? blog.author._id.toString() : blog.author.toString());
        const isAuthor = userId && authorIdStr && authorIdStr === userId.toString();
        const isAdmin = userRole === 'admin';
        
        // Private / Draft blog permissions check: allow Author and Admin
        if (blog.draft && !draft) {
            if (!isAuthor && !isAdmin) {
                return res.status(403).json({ error: 'You cannot access private draft blogs' });
            }
        }

        // Enforce approval flow security
        if (!blog.draft && !blog.approved) {
            if (!isAdmin && !isAuthor) {
                return res.status(403).json({ error: "This blog is pending admin approval." });
            }
        }

        return res.status(200).json({ blog });
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
};

export const likeBlog = (req, res) => {
    let user_id = req.user;
    let { _id, islikedByUser } = req.body;
    let incrementVal = !islikedByUser ? 1 : -1;

    Blog.findOneAndUpdate({ _id }, { $inc: { "activity.total_likes": incrementVal } })
    .then(blog => {
        if (!islikedByUser) {
            let like = new Notification({
                type: "like",
                blog: _id,
                notification_for: blog.author,
                user: user_id
            });
            like.save().then(notification => {
                return res.status(200).json({ liked_by_user: true });
            });
        } else {
            Notification.findOneAndDelete({ user: user_id, blog: _id, type: "like" })
            .then(data => {
                return res.status(200).json({ liked_by_user: false });
            })
            .catch(err => {
                return res.status(500).json({ error: err.message });
            });
        }
    });
};

export const isLikedByUser = (req, res) => {
    let user_id = req.user;
    let { _id } = req.body;
    Notification.exists({ user: user_id, type: "like", blog: _id })
    .then(result => {
        return res.status(200).json({ result });
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
};

export const userWrittenBlogs = (req, res) => {
    let user_id = req.user;
    let { page, draft, query, deletedDocCount } = req.body;
    let maxLimit = 5;
    let skipDocs = (page - 1) * maxLimit;

    if (deletedDocCount) {
        skipDocs -= deletedDocCount;
    }

    Blog.find({ author: user_id, draft, title: new RegExp(query, 'i') })
    .skip(skipDocs)
    .limit(maxLimit)
    .sort({ publishedAt: -1 })
    .select("title banner publishedAt blog_id activity des draft approved -_id")
    .then(blogs => {
        return res.status(200).json({ blogs });
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
};

export const userWrittenBlogsCount = (req, res) => {
    let user_id = req.user;
    let { draft, query } = req.body;

    Blog.countDocuments({ author: user_id, draft, title: new RegExp(query, 'i') })
    .then(count => {
        return res.status(200).json({ totalDocs: count });
    })
    .catch(err => {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
    });
};

export const deleteBlog = (req, res) => {
    let user_id = req.user;
    let { blog_id } = req.body;

    Blog.findOneAndDelete({ blog_id })
    .then(blog => {
        Notification.deleteMany({ blog: blog._id }).then(data => console.log('notifications deleted'));
        Comment.deleteMany({ blog_id: blog._id }).then(data => console.log('comments deleted'));
        User.findOneAndUpdate({ _id: user_id }, { $pull: { blogs: blog._id }, $inc: { "account_info.total_posts": -1 } })
        .then(user => console.log('Blog deleted'));

        return res.status(200).json({ status: 'done' });
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
};
