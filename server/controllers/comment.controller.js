import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";
import Notification from "../models/Notification.js";

export const addComment = (req, res) => {
    let user_id = req.user;
    let { _id, comment, replying_to, blog_author } = req.body;

    if (!comment.length) {
        return res.status(403).json({ error: 'Write something to leave a comment' });
    }

    let commentObj = {
        blog_id: _id,
        blog_author,
        comment,
        commented_by: user_id,
    };

    if (replying_to) {
        commentObj.parent = replying_to;
        commentObj.isReply = true;
    }

    new Comment(commentObj).save().then(async commentFile => {
        let { comment, commentedAt, children } = commentFile;

        Blog.findOneAndUpdate({ _id }, { $push: { "comments": commentFile._id }, $inc: { "activity.total_comments": 1, "activity.total_parent_comments": replying_to ? 0 : 1 } })
        .then(blog => {
            console.log('New comment created');
        });
        
        let notificationObj = {
            type: replying_to ? "reply" : "comment",
            blog: _id,
            notification_for: blog_author,
            user: user_id,
            comment: commentFile._id
        };
        if (replying_to) {
            notificationObj.replied_on_comment = replying_to;

            await Comment.findOneAndUpdate({ _id: replying_to }, { $push: { children: commentFile._id } })
            .then(replyingToCommentDoc => {
                notificationObj.notification_for = replyingToCommentDoc.commented_by;
            });
        }

        new Notification(notificationObj).save().then(notification => console.log('new notificaaation created'));

        return res.status(200).json({
            comment, commentedAt, _id: commentFile._id, user_id, children
        });
    });
};

export const getBlogComments = (req, res) => {
    let { blog_id, skip } = req.body;
    let maxLimit = 5;

    Comment.find({ blog_id, isReply: false })
    .populate("commented_by", "personal_info.username personal_info.fullname personal_info.profile_img")
    .skip(skip)
    .limit(maxLimit)
    .sort({ 'commentedAt': -1 })
    .then(comment => {
        return res.status(200).json(comment);
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
};

export const getReplies = (req, res) => {
    let { _id, skip } = req.body;
    let maxLimit = 5;

    Comment.findOne({ _id })
    .populate({
        path: "children",
        options: {
            limit: maxLimit,
            skip: skip,
            sort: { 'commentedAt': -1 }
        },
        populate: {
            path: 'commented_by',
            select: "personal_info.profile_img personal_info.username personal_info.fullname"
        },
        select: "-blog_id -updatedAt"
    })
    .select("children")
    .then(doc => {
        return res.status(200).json({ replies: doc.children });
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
};

const deleteCommentHelper = async (_id) => {
    let deletedCount = 0;
    try {
        const comment = await Comment.findOneAndDelete({ _id });
        if (comment) {
            deletedCount++;
            if (comment.parent) {
                await Comment.findOneAndUpdate({ _id: comment.parent }, { $pull: { children: _id } });
                console.log('comment delete from parent');
            }
            await Notification.findOneAndDelete({ comment: _id });
            console.log('comment notification deleted');

            await Notification.findOneAndDelete({ replied_on_comment: _id });
            console.log('reply notification deleted');

            await Blog.findOneAndUpdate({ _id: comment.blog_id }, { $pull: { comments: _id }, $inc: { "activity.total_comments": -1, "activity.total_parent_comments": comment.parent ? 0 : -1 } });
            
            if (comment.children && comment.children.length) {
                for (let i = 0; i < comment.children.length; i++) {
                    deletedCount += await deleteCommentHelper(comment.children[i]);
                }
            }
        }
    } catch (err) {
        console.log(err.message);
    }
    return deletedCount;
};

export const deleteComment = async (req, res) => {
    let user_id = req.user;
    let { _id } = req.body;

    try {
        const comment = await Comment.findOne({ _id });
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        if (user_id == comment.commented_by || user_id == comment.blog_author) {
            const deletedCount = await deleteCommentHelper(_id);
            return res.status(200).json({ status: 'done', deletedCount });
        } else {
            return res.status(403).json({ error: "You can not delete this comment" });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
