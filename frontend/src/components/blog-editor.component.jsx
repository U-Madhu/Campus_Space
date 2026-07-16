import {Link,useNavigate} from "react-router-dom"
import logo from "../imgs/logo.png"
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { uploadImage } from "../common/cloudinary";
import { useEffect, useRef } from "react";
import { Toaster,toast } from "react-hot-toast";
import { compressImage } from "../common/image-resizer";
import { EditorContext } from "../pages/editor.pages";
import {useContext} from 'react'
import { UserContext } from "../App";
import EditorJS from '@editorjs/editorjs'
import {tools} from './tools.component'
import axios from "axios";


const BlogEditor=()=>{

    const navigate = useNavigate();
    
    let {blog,blog:{blog_id,title,banner,content,tags,des},setBlog,textEditor,setTextEditor,setEditorState}=useContext(EditorContext)
     
    let {userAuth:{access_token}}=useContext(UserContext);

    useEffect(()=>{
        if(!textEditor.isReady){
            const editorInstance = new EditorJS({
                holder:"textEditor",
                data:Array.isArray(content)?content[0]:content,
                tools:tools,
                placeholder: "Let's Share your experience and take a step towards the Change",
                onReady: () => {
                    const el = document.getElementById("textEditor");
                    if (el) {
                        el.addEventListener("keydown", (e) => {
                            if (e.key === 'Enter') {
                                const selection = window.getSelection();
                                if (!selection.rangeCount) return;

                                let isParagraph = false;
                                let node = selection.anchorNode;
                                while (node && node !== el) {
                                    if (node.classList && node.classList.contains('ce-paragraph')) {
                                        isParagraph = true;
                                        break;
                                    }
                                    node = node.parentNode;
                                }

                                if (isParagraph) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    
                                    if (!e.shiftKey) {
                                        // Enter -> soft line break inside same paragraph block
                                        document.execCommand("insertLineBreak");
                                    } else {
                                        // Shift + Enter -> create new block below
                                        try {
                                            const index = editorInstance.blocks.getCurrentBlockIndex();
                                            editorInstance.blocks.insert('paragraph', { text: '' }, {}, index + 1, true);
                                        } catch (err) {
                                            console.error("Failed to insert block:", err.message);
                                        }
                                    }
                                }
                            }
                        }, true);
                    }
                }
            });
            setTextEditor(editorInstance);
        }
        
    },[])

    const handleBannerUpload = async (e) => {
        let img = e.target.files[0];
        if (img) {
            let loadingToast = toast.loading("Compressing & Uploading...");
            try {
                // Compress banner image (wider aspect ratio, e.g. max 1200px)
                const compressedImg = await compressImage(img, 1200, 800, 0.8);
                const url = await uploadImage(compressedImg);
                if (url) {
                    toast.success("Uploaded 👍");
                    setBlog({ ...blog, banner: url });
                } else {
                    toast.error("Upload failed");
                }
            } catch (err) {
                console.error("Banner upload failed:", err);
                toast.error("Failed to process image");
            } finally {
                toast.dismiss(loadingToast);
            }
        }
    }

    const handleTitleKeyDown=(e)=>{
        console.log(e)
        if(e.keyCode==13){// enter key

        }

    }
    const handleTitleChange =(e)=>{
        console.log(e);
        let input =e.target;
        console.log(input.scrollHeight)
        input.style.height='auto';
        input.style.height=input.scrollHeight +"px";
        setBlog({...blog,title:input.value})

    }

    const handleError=(e)=>{
        let img=e.target;
        img.src=defaultBanner;


    }
    const handlePublishEvent=()=>{

       if(!banner || !banner.length){
            return toast.error("Upload a blog banner to publish it")
        }
        if(!title || !title.length){
            return toast.error("Write Blog title to publish it")
        }
        if(textEditor.isReady){
            textEditor.save().then(data=>{
                //console.log(data);
                if(data.blocks.length){
                    setBlog({...blog,content:data});
                    setEditorState("publish")

                }
                else{
                    return toast.error("Write Something in Your Blog to publish it ")
                }
            })
        }
    }
    const handleSaveDraft=(e)=>{
                    if(e.target.classList.contains('disable')){
                                return;
                        }

                    if(!title || !title.length){
                        return toast.error("Write blog title before saving it as a draft");
                    }
                    
                    let loadingToast=toast.loading("Saving...")
                    e.target.classList.add('disable');

                    if(textEditor.isReady){

                            textEditor.save().then(content=>{

                                let blogObj={
                                         title,banner,des,content,tags,draft:true 
                                 }
                                axios.post(import.meta.env.VITE_SERVER_DOMAIN +  '/create-blogs',{...blogObj,id:blog_id},{
                                headers:{
                                    'Authorization':`Bearer ${access_token}`
                                }
                                }).then(()=>{
                                    e.target.classList.remove('disable');
                                    toast.dismiss(loadingToast);
                                    toast.success("Saved 👍");
                                    setTimeout(()=>{
                                            navigate('/');
                                    },500);

                                }).catch(({response})=>{
                                    e.target.classList.remove('disable');
                                    toast.dismiss(loadingToast);
                                    return toast.error(response.data.error)
                                })
                                        })
                                }

                    

                    
}
    
    

    return (
        <>

        <nav className="navbar">

            <Link to='/' className="flex-none w-10"> 
                <img src={logo}/>
            </Link>
            <p className="max-md:hidden text-black line-clamp-1 w-full">
                  { title?.length ? title: "New Blog"  }
            </p>
            <div className="flex gap-4 ml-auto"> 
                <button className="btn-dark py-2"
                    onClick={handlePublishEvent}
                
                >
                    Publish
                </button>
                <button className="btn-dark py-2"
                onClick={handleSaveDraft}
                >
                    Save Draft
                </button>
            </div>


        </nav>
        <Toaster/>

        <AnimationWrapper>
            <section>
                <div className="mx-auto max-w-[900px] w-full">


                    <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                            <label htmlFor="uploadBanner">
                                <img
                                    //ref={blogBannerRef}
                                    src={ banner}
                                    className="z-20"
                                    onError={handleError}

                                />
                                <input 
                                    id="uploadBanner"
                                    type="file"
                                    accept=".png, .jpg, .jpeg"
                                    hidden
                                    onChange={handleBannerUpload}

                                
                                />
                            </label>

                    </div>
                    <textarea

                            defaultValue={title}
                            placeholder="Blog Title"
                            className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                    >
                        
                    </textarea>

                    <hr className="w-full opacity-10 my-5"/>

                    <div id="textEditor" className="font-gelasio">

                    </div>

                </div>
            </section>
        </AnimationWrapper>


        </>
        

    )

}
export default BlogEditor;