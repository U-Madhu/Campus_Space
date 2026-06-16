// importing tools

import Embed from '@editorjs/embed';
import List from "@editorjs/list";
import Image from '@editorjs/image';
import Header from '@editorjs/header';
import Marker from '@editorjs/marker';
import Quote from '@editorjs/quote';
import InlineCode from '@editorjs/inline-code';

import { uploadImage } from '../common/aws';


const uploadImageByUrl=(e)=>{

    let link=new Promise((resolveMotionValue,reject)=>{
        try{
            resolveMotionValue(e)
        }catch(err){
            reject(err)
        }
    })
    return link.then(url=>{
        return{
            success:1,
            file:{url}

        }
    })

}
const uploadImageeByFile=(e)=>{
  return    uploadImage(e).then(url=>{
        if(url){
            return{
                success:1,
                file:{url}
            }
        }
    })

}

export const tools={
    embed:Embed,
    list:{
        class:List,
        inlineToolbar:true,
    },
    image:{
        class:Image,
        config:{
            uploader:{
                // FIXED: Corrected EditorJS Image uploader option name to uploadByUrl
                uploadByUrl:uploadImageByUrl,
                uploadByFile:uploadImageeByFile,
            }
        }
    },
    header:{
        class:Header,
        config:{
            placeholder:"Type Heading...",
            levels:[1,2,3],
            defaultLevel:2,
        }
    },
    quote:Quote,
    marker:Marker,
    inlineCode:InlineCode
}