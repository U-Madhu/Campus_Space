/*
import axios from "axios";

export const uploadImage =async(img)=>{
    let imgUrl=null;
    await axios.get(import.meta.env.VITE_SERVER_DOMAIN+"/get-upload-url")
    .then(async({data:{uploadURL}})=>{

        await axios({
            method:'PUT',
            url:uploadURL,
            // FIXED: Use correct Content-Type (image/jpeg or image/png) matching the presigned URL signature instead of multipart/form-data
            headers:{'Content-Type': img.type},
            data:img

        })
        .then(()=>{
            imgUrl=uploadURL.split("?")[0]
        })
    })
    return imgUrl;
}
*/