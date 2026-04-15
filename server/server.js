import express from "express"
import mongoose from "mongoose";
import 'dotenv/config'
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from 'cors';
import { getAuth } from 'firebase-admin/auth';
import serviceAccountKey from './campus-space-01-firebase-adminsdk-fbsvc-864f73cdf1.json' with { type: "json" };
// importing schemas
import User from "./Schema/User.js";
import firebaseAdmin from "firebase-admin";
import admin from "firebase-admin"


//aws
import aws from "aws-sdk";


//regex 
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; 



const server =express();
let PORT=3000;
server.use(express.json());
server.use(cors());


firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccountKey)
})

// connecting databse
mongoose.connect(process.env.DB_LOCATION,{
    autoIndex:true
});

// setting aws s3 bucket

const s3=new aws.S3({
    region:"ap-south-1",
    accessKeyId:process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SCRET_ACCESS_KEY,

})

const generateUploadURL=async()=>{
    const date=new Date();
    const imageName=`${nanoid()}-${date.getTime()}.jpeg`;
    return await s3.getSignedUrlPromise('putObject',{
        Bucket:'campus-space-image-bucket' ,
        Key:imageName,
        Expires:1000,
        ContentType:"image/jpeg"


    })
}


const formatDatatoSend =(user)=>{
            const access_token=jwt.sign({id:user._id},process.env.SECRET_ACCESS_KEY)
            return {
                access_token,
                profile_img:user.personal_info.profile_img,
                username:user.personal_info.username,
                fullname:user.personal_info.fullname,

            }

}

const generateUsername = async(email) => {

    let username=email.split('@')[0];
    let isUsernameNotUnique=await User.exists({"personal_info.username":username}).then((result)=>result)
    isUsernameNotUnique?username+=nanoid(4): "";
    return username;

}

// upload image url route

server.get('/get-upload-url',(req,res)=>{
    generateUploadURL().then(url=>res.status(200).json({uploadURL:url}))
    .catch(err=>{
        console.log(err.message);
        return res.status(500).json({error:err.message})

    })
})

server.post('/signup',(req,res)=>{
   let {fullname,email,password}=req.body;
            if(fullname.length <3){
                return res.status(403).json({"error" : "full name must be atleast 3 letters long"});
            }
            if(!email.length){
                return res.status(403).json({
                    "error" : "enter email"
                })
            }
            if(!emailRegex.test(email)){
                return res.status(403).json({
                    "error" : "Invalid email"
                });
            }
            if(!passwordRegex.test(password)){
                return res.status(403).json({
                    "error" : "Password should be 6-20 letter including long with numeric,1 lowercase and 1 uppercase letter"
                });
            }
            bcrypt.hash(password,10,async(err,hashed_password)=>{

                    let username=await generateUsername(email);
                    let user= new User({
                            personal_info:{fullname,email,password:hashed_password,username}
                            

                    }
                )
                user.save().then((u)=>{
                    
                    return res.status(200).json(formatDatatoSend(u )) })
                    
                    .catch( err=>{
                                    if(err.code==11000){
                                        return res.status(500).json({"error":"Email Already exist"})
                                    }
                        
                        return res.status(500).json({"error":err.message})
                    
                    })

            })


     
})


server.post('/signin',(req,res)=>{
        let {email,password}=req.body;
        User.findOne({ "personal_info.email":email}).then((user)=>{
            if(!user){
                return res.status(403).json({"error":"Email not found"});
            }
           if(!user.google_auth){
             bcrypt.compare(password,user.personal_info.password,(err,result)=>{

                if(err){
                    return res.status(403).json({"error":"Error Occured During Login please try again"});
                }
                if(!result){
                    return res.status(403).json({"error":"Incorrect Password"});
                }else{
                    return res.status(200).json(formatDatatoSend(user))
                }
            })

           }else{
            return res.status(403).json({"error":"Account is Created using Google. Try with login with Google"})
           }



            
            
        }).catch(err=>{
            console.log(err);
            return res.status(500).json({"error":err.message})
        })

})

server.post('/google-auth', async (req, res) => {

    let { idToken } = req.body;

    getAuth()
    .verifyIdToken(idToken)
    .then(async (decodedUser) => {

        let { email, name, picture } = decodedUser;
        picture = picture.replace("s96-c", "s384-c");

        let user = await User.findOne({ "personal_info.email": email })
        .select("personal_info.fullname personal_info.username personal_info.profile_image google_auth")
        .then((u) => u || null)
        .catch(err => {
            return res.status(500).json({ "error": err.message });
        });

        if (user) {
            // login
            if (!user.google_auth) {
                return res.status(403).json({
                    "error": "This email is signed up without Google. Please login with password."
                });
            }
        } else {
            // signup
            let username = await generateUsername(email);

            user = new User({
                personal_info: {
                    fullname: name,
                    email,
                    profile_image: picture,
                    username
                },
                google_auth: true
            });

            await user.save()
            .then((u) => {
                user = u;
            })
            .catch(err => {
                return res.status(500).json({ "error": err.message });
            });
        }

        return res.status(200).json(formatDatatoSend(user));

    })
    .catch(err => {
        return res.status(500).json({
            "error": "Failed to authenticate. Invalid Firebase ID token."
        });
    });
});
server.listen(PORT,()=>{
    console.log(`listening on port : http://localhost:${ PORT}`);
})
