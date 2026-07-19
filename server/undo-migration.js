import 'dotenv/config';
import mongoose from 'mongoose';
import Blog from './models/Blog.js';

const undoMigration = async () => {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(process.env.DB_LOCATION, {
            autoIndex: true
        });
        console.log("Connected successfully!");

        const blogs = await Blog.find({});
        console.log(`Found ${blogs.length} blogs to check.`);

        let revertedCount = 0;

        for (let blog of blogs) {
            let contentObj = Array.isArray(blog.content) ? blog.content[0] : blog.content;

            if (contentObj && contentObj.structured_interview) {
                // Keep only the original blocks array
                const originalBlocks = contentObj.blocks || [];
                blog.content = {
                    blocks: originalBlocks
                };
                await blog.save();
                revertedCount++;
                console.log(`Reverted blog ID: ${blog.blog_id} ("${blog.title}")`);
            }
        }

        console.log(`Undo complete! Successfully reverted ${revertedCount} blogs to their original format.`);
        process.exit(0);
    } catch (err) {
        console.error("Undo migration failed:", err.message);
        process.exit(1);
    }
};

undoMigration();
