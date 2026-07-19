import 'dotenv/config';
import mongoose from 'mongoose';
import Blog from './models/Blog.js';

const migrateBlogs = async () => {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(process.env.DB_LOCATION, {
            autoIndex: true
        });
        console.log("Connected successfully!");

        const blogs = await Blog.find({});
        console.log(`Found ${blogs.length} blogs to inspect.`);

        let updatedCount = 0;

        for (let blog of blogs) {
            let contentObj = Array.isArray(blog.content) ? blog.content[0] : blog.content;
            if (!contentObj) {
                contentObj = { blocks: [] };
            }

            // Check if already has structured_interview
            if (!contentObj.structured_interview) {
                // Construct a default structured_interview based on existing blocks
                const blocks = contentObj.blocks || [];
                
                // Sample extraction: search for coding, concept, or project keywords in blocks
                const codingQuestions = [];
                const coreConcepts = [];
                const projectQuestions = [];
                const hrQuestions = [];

                blocks.forEach((block, idx) => {
                    const text = block.data?.text || "";
                    if (text.toLowerCase().includes("code") || text.toLowerCase().includes("leetcode") || text.toLowerCase().includes("problem")) {
                        codingQuestions.push({
                            id: Date.now().toString() + idx,
                            title: text.replace(/<[^>]*>?/gm, '').substring(0, 80),
                            difficulty: "Medium",
                            leetcode: "",
                            youtube: "",
                            resource: "",
                            statement: text.replace(/<[^>]*>?/gm, ''),
                            approach: "Discussed approach with interviewer.",
                            code: "",
                            isOpen: false
                        });
                    } else if (text.toLowerCase().includes("dbms") || text.toLowerCase().includes("os") || text.toLowerCase().includes("oops") || text.toLowerCase().includes("network")) {
                        coreConcepts.push({
                            id: Date.now().toString() + idx,
                            topic: text.toLowerCase().includes("dbms") ? "DBMS" : text.toLowerCase().includes("os") ? "OS" : "OOPS",
                            question: text.replace(/<[^>]*>?/gm, '').substring(0, 100),
                            answer: "Answered questions based on CS core fundamentals.",
                            isOpen: false
                        });
                    } else if (text.toLowerCase().includes("project")) {
                        projectQuestions.push({
                            id: Date.now().toString() + idx,
                            project: "Resume Project",
                            question: text.replace(/<[^>]*>?/gm, '').substring(0, 100),
                            answer: "Explained architecture and implementation details.",
                            isOpen: false
                        });
                    } else if (text.toLowerCase().includes("hr") || text.toLowerCase().includes("tell me about") || text.toLowerCase().includes("behavioral")) {
                        hrQuestions.push({
                            id: Date.now().toString() + idx,
                            question: text.replace(/<[^>]*>?/gm, '').substring(0, 100),
                            answer: "Shared personal experience using STAR method.",
                            isOpen: false
                        });
                    }
                });

                const newStructuredInterview = {
                    coding: {
                        na: codingQuestions.length === 0,
                        questions: codingQuestions
                    },
                    core_concepts: {
                        na: coreConcepts.length === 0,
                        questions: coreConcepts
                    },
                    project_related: {
                        na: projectQuestions.length === 0,
                        questions: projectQuestions
                    },
                    personality_related: {
                        na: hrQuestions.length === 0,
                        questions: hrQuestions
                    }
                };

                const newContent = {
                    blocks,
                    structured_interview: newStructuredInterview
                };

                blog.content = newContent;
                await blog.save();
                updatedCount++;
                console.log(`Updated blog ID: ${blog.blog_id} ("${blog.title}")`);
            }
        }

        console.log(`Migration complete! Successfully updated ${updatedCount} blogs.`);
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err.message);
        process.exit(1);
    }
};

migrateBlogs();
