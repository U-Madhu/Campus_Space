import { useContext, useState } from "react";
import { getDay } from "../common/date";
import { UserContext } from "../App";
import toast from "react-hot-toast";
import CommentField from "./comment-field.component";
import {BlogContext} from '../pages/blog.page';
import axios from "axios";

import BlogContent from "./blog-content.component";

const CommentCard =({index,leftVal,commentData})=>{
    let {commented_by:{personal_info:{profile_img,fullname,username:commented_by_username}},commentedAt,comment,_id,children}=commentData;

    let {blog,blog:{comments,activity,activity:{total_parent_comments, total_comments},comments:{results:commentsArr},author:{personal_info:{username:blog_author}}},setBlog,setTotalParentCommentLoaded}=useContext(BlogContext)

    let {userAuth:{access_token,username}}=useContext(UserContext);

    const [isReplying,setReplying]=useState(false);

    const getParentIndex =()=>{
        // FIXED: Initialize startingPoint to index - 1 instead of index + 1, since the parent comment must exist before the current comment. Starting at index + 1 would cause it to terminate immediately and return an invalid parentIndex when no subsequent comments exist, leading to a TypeError crash.
        let startingPoint=index-1;

        try{
            while(startingPoint >= 0 &&
   commentsArr[startingPoint]&&commentsArr[startingPoint].childrenLevel>=commentData.childrenLevel){
                startingPoint--;
            }
        }catch{
            startingPoint=undefined;
        }
        return startingPoint;
    }

    const removeCommentsCard=(startingPoint,isDelete=false, deletedCountVal = 0)=>{
            // FIXED: Create a copy of commentsArr to avoid mutating state directly
            let tempCommentsArr = [...commentsArr];

            if(tempCommentsArr[startingPoint]){

                while(tempCommentsArr[startingPoint].childrenLevel>commentData.childrenLevel){

                    tempCommentsArr.splice(startingPoint,1);
                    if(!tempCommentsArr[startingPoint]){
                        break;
                    }

                }
            }
            if(isDelete){
                let parentIndex=getParentIndex();
                // FIXED: Added check for parentIndex >= 0 to prevent TypeError (cannot read properties of undefined (reading 'children')) when parentIndex is -1 (meaning it is a top-level comment)
                if(parentIndex !== undefined && parentIndex >= 0){
                    tempCommentsArr[parentIndex].children=tempCommentsArr[parentIndex].children.filter(child=>child!=_id);

                    if(!tempCommentsArr[parentIndex].children.length){
                        tempCommentsArr[parentIndex].isReplyLoaded=false;
                    }


                }
                tempCommentsArr.splice(index,1);

            }
            if(commentData.childrenLevel==0 && isDelete){
                setTotalParentCommentLoaded(preVal=>preVal-1)
            }

            // FIXED: Update total_comments and total_parent_comments in blog activity state when comment is deleted
            setBlog({
                ...blog,
                comments:{...comments,results:tempCommentsArr},
                activity:{
                    ...activity,
                    total_comments: total_comments - (isDelete ? deletedCountVal : 0),
                    total_parent_comments: total_parent_comments - (commentData.childrenLevel == 0 && isDelete ? 1 : 0)
                }
            })


    }

    const loadReplies=({skip=0,currentIndex=index})=>{

        if(commentsArr[currentIndex].children.length){

            // FIXED: Prevent calling hideReplies when loading more nested replies (skip > 0)
            if(skip == 0){
                hideReplies();
            }

            axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/get-replies",{_id:commentsArr[currentIndex]._id,skip})
            .then(({data:{replies}})=>{
                // FIXED: Create a copy of commentsArr to avoid mutating state directly
                let tempCommentsArr = [...commentsArr];
                tempCommentsArr[currentIndex].isReplyLoaded=true;

                for(let i=0;i<replies.length;i++){

                    replies[i].childrenLevel=tempCommentsArr[currentIndex].childrenLevel+1;

                    tempCommentsArr.splice(currentIndex+1+i+skip,0,replies[i])
                }
                setBlog({...blog,comments:{...comments,results:tempCommentsArr}})
                
            })
            .catch(err=>{
                console.log(err);
            })


        }

    }
    
    const deleteComment=(e)=>{
        // FIXED: Use e.currentTarget instead of e.target to refer to the button container rather than the inner <i> tag
        e.currentTarget.setAttribute("disabled",true);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/delete-comment",{_id},{
            headers:{
                'Authorization':`Bearer ${access_token}`
            }
        })
        .then(({ data })=>{
            // FIXED: Pass backend's returned deletedCount to removeCommentsCard to update the total comment count
            removeCommentsCard(index+1, true, data.deletedCount)
        })
        .catch(err=>{
            console.log(err);
        })


    }

    const hideReplies=()=>{
        commentData.isReplyLoaded=false;

        removeCommentsCard(index+1)
    }


    const handleReplyClick=()=>{
        if(!access_token){
            return toast.error("login first to leave a reply")
        }
        setReplying(preVal=>!preVal)

    }
    const LoadMoreRepliesButton =()=>{
            let parentIndex =getParentIndex();
            if (parentIndex === undefined || parentIndex === -1) {
                     return null;
                        }

            let parent = commentsArr[parentIndex];

            if (!parent) {
                return null;
            }

            let button=<button onClick={()=>loadReplies({skip:index-parentIndex,currentIndex:parentIndex})} className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2">Load More Replies</button>
              

            if(commentsArr[index+1]){
                if(commentsArr[index+1].childrenLevel<commentsArr[index].childrenLevel){
                    if((index-parentIndex)<commentsArr[parentIndex].children.length)
                        { 
                            return button}
             }
            }else{
                if(parentIndex!== undefined){
                    if((index-parentIndex)<commentsArr[parentIndex].children.length)
                        { 
                            return button}
                }
            }
           
    }
    return (

        <div className="w-full mb-5" style={{paddingLeft:`${leftVal+10}px`}}>
{/* h-12  border are removed */}
            <div className="my-5 p-6 rounded-md border border-grey">

                <div className="flex gap-3 items-center mb-8">
                    <img src={profile_img} className="w-6 h-6 rounded-full"/>
                    <p className="line-clamp-1">@{commented_by_username}</p>
                    <p className="min-w-fit">{getDay(commentedAt)}</p>
                </div>
                <p className="font-gelasio text-xl ml-3">{comment}</p>

                <div className="flex gap-5 items-center mt-5">
                    {
                        commentData.isReplyLoaded ?
                        <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" 
                            onClick={hideReplies}>

                            <i className="fi fi-rs-comment-dots"></i>
                                Hide Reply
                        </button>
                        :
                        <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
                            onClick={() => loadReplies({})}
                            >
                                <i className="fi fi-rs-comment-dots"></i>

                                {children.length} Reply

                        </button>
                    }
                    <button className="underline" onClick={handleReplyClick}>Reply</button>

                    {
                        username==commented_by_username || username==blog_author ?
                        <button className="p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center"
                            onClick={deleteComment}
                        >
                            <i className="fi fi-rr-trash pointer-events-none"></i>
                        </button>
                        :""
                    }

                </div>
                {
                    isReplying ? 
                    <div className="mt-8">
                        <CommentField action="reply" index={index} replyingTo={_id} setReplying={setReplying}/>
                    </div>
                    :""
                }
                

            </div>

            <LoadMoreRepliesButton/>
        </div>
    )
}

export default CommentCard;