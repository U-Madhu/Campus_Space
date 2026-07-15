import { createContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import AnimationWrapper from "../common/page-animation"
import Loader from "../components/loader.component"
import { getDay } from "../common/date"
import BlogInteraction from "../components/blog-interaction.component"
import BlogPostCard from "../components/blog-post.component"
import BlogContent from "../components/blog-content.component" 
import CommentContainer, { fetchComments } from "../components/comments.component"
import axios from "axios"
import AdBanner from "../components/ad-banner.component"

export const blogStructure={
    title:'',
    des:'',
    tags:[],
    content:{blocks:[]},
    
    author:{personal_info:{}},
    banner:'',
    publishedAt:''
}

export const BlogContext= createContext({});

const BlogPage =()=>{
    let {blog_id} =useParams()

    const [blog,setBlog]=useState(blogStructure);
    const [similarBlogs,setSimilarBlogs]=useState(null);
    const [loading,setLoading]=useState(true);
    const [islikedByUser,setLikedByUser]=useState(false);
    const [commentsWrapper,setCommentsWrapper]=useState(false);
    const [totalParentCommentLoaded,setTotalParentCommentLoaded]=useState(0);


    let {title,content,banner,tags,author:{personal_info:{fullname,username:author_username,profile_img}},publishedAt}=blog;

    const fetcBlog=()=>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN +"/get-blog",{blog_id})
        .then(async({data:{blog}})=>{

            blog.comments=await fetchComments({blog_id:blog._id,setParentCommentCountFun:setTotalParentCommentLoaded})

            setBlog(blog);

            console.log(blog);

            axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/search-blogs",{tag:blog.tags[0],limit:6,eliminate_blog:blog_id})
            .then(({data})=>{

                setSimilarBlogs(data.blogs);

                //console.log(data.blogs)
            })
            
            setLoading(false);

            //console.log(blog);
        })
        .catch(err=>{
            console.log(err);
            setLoading(false);
        })
    }
    useEffect(()=>{
        resetStates();
        fetcBlog();
    },[blog_id])

    const resetStates=()=>{
        setBlog(blogStructure);
        setSimilarBlogs(null);
        setLoading(true);
        setLikedByUser(false);
        setCommentsWrapper(false);
        setTotalParentCommentLoaded(0);

    }

    return (
         <AnimationWrapper>
            {
                loading?<Loader/>
                :
                <BlogContext.Provider value={{blog,setBlog,islikedByUser,setLikedByUser,commentsWrapper,setCommentsWrapper,totalParentCommentLoaded,setTotalParentCommentLoaded}}>

                                    <CommentContainer/>
                                    <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">

                                            <img src={banner} className="aspect-video"/>

                                            <div className="mt-12">
                                                <h2>{title}</h2>

                                                <div className="flex max-sm:flex-col justify-between my-8">
                                                    <div className="flex gap-5 items-start">
                                                        <img src={profile_img} className="w-12 h-12 rounded-full"/>
                                                        <p className="capitalize">
                                                            {fullname}
                                                            <br/>
                                                            @
                                                            <Link to={`/user/${author_username}`} className="underline">{author_username}</Link>
                                                        </p>
                                                    </div>
                                                    <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5"> Published on {getDay(publishedAt)}</p>
                                                </div>

                                            </div>

                                        <BlogInteraction/>

                                                <div className="my-12 fnt-gelasio blog-page-content">

                                                     {
                                                         (Array.isArray(content) ? content[0]?.blocks : content?.blocks)?.map((block, i, arr) => (
                                                             <div key={i}>
                                                                 <div className="my-4 md:my-8">
                                                                     <BlogContent block={block} />
                                                                 </div>
                                                                 {/* Programmatic Sponsorship Ad Slot In-Between Article Content */}
                                                                 {i === Math.floor(arr.length / 2) - 1 && (
                                                                     <div className="my-8 max-w-[700px] mx-auto">
                                                                         <AdBanner slotId="8888888888" />
                                                                     </div>
                                                                 )}
                                                             </div>
                                                         ))
                                                     }

                                                </div>


                                        <BlogInteraction/>
                                         {
                                             similarBlogs != null && similarBlogs.length ?
                                             <>
                                                 <h1 className="text-2xl mt-14 mb-8 font-medium">Similar Blogs</h1>
                                                 <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none">
                                                     {
                                                         similarBlogs.map((blog, i) => {
                                                             let { author: { personal_info } } = blog;
                                                             return (
                                                                 <div key={i} className="min-w-[240px] max-w-[280px] flex-shrink-0">
                                                                     <AnimationWrapper transition={{ duration: 1, delay: i * 0.08 }}>
                                                                         <BlogPostCard content={blog} author={personal_info} />
                                                                     </AnimationWrapper>
                                                                 </div>
                                                             )
                                                         })
                                                     }
                                                 </div>
                                             </>
                                             : ""
                                         }

                                
                                
                                 </div>
                </BlogContext.Provider>
                
            }
         </AnimationWrapper>
    )
}

export default BlogPage