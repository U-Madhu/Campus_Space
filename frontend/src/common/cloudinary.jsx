import axios from "axios";

export const uploadImage = async (img) => {
    let imgUrl = null;
    const formData = new FormData();
    formData.append("image", img);

    await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    .then(({ data }) => {
        imgUrl = data.url;
    })
    .catch(err => {
        console.error("Cloudinary upload error:", err.message);
    });

    return imgUrl;
};
