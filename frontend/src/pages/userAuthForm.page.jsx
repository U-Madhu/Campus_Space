import InputBox from '../components/input.component'
import AnimationWrapper from '../common/page-animation';
import googleIcon from '../imgs/google.png'
import { Link,NavLink } from 'react-router-dom';
import { useRef, useContext } from 'react';
import {Toaster,toast} from 'react-hot-toast';
import axios from 'axios';
import { storeInSession } from '../common/session';
import { UserContext } from '../App';
import { authWithGoogle } from '../common/firebase';
import { Navigate, useNavigate } from 'react-router-dom'; // ✅ added

const UserAuthForm= ({type})=>{

    const authForm=useRef(null);
    
    const { userAuth, setUserAuth } = useContext(UserContext);
    const { access_token } = userAuth || {};

    const navigate = useNavigate(); // ✅ added

    const userAuthThroughServer=(serverRoute,formData)=>{

        axios.post(import.meta.env.VITE_SERVER_DOMAIN+serverRoute,formData).then(({data})=>{
           
           storeInSession("user",JSON.stringify(data));
           setUserAuth(data);

           navigate('/'); // ✅ added (force redirect)

        }).catch(({response})=>{
            toast.error(response.data.error);
        })

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let serverRoute = type === "sign-in" ? "/signin" : "/signup";

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

        let form = new FormData(e.currentTarget);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { fullname, email, password } = formData;

        if (fullname) {
            if (fullname.length < 3) {
                return toast.error("full name must be atleast 3 letters long");
            }
        }

        if (!email.length) {
            return toast.error("enter email");
        }

        if (!emailRegex.test(email)) {
            return toast.error("Invalid email");
        }

        if(!passwordRegex.test(password)){
            return toast.error(
                "Password should be 6-20 letter including long with numeric,1 lowercase and 1 uppercase letter"
            );
        }

        userAuthThroughServer(serverRoute,formData);
    }

    const handleGoogleAuth = async (e) => {
        e.preventDefault();

        try {
            const user = await authWithGoogle();

            const idToken = await user.getIdToken();

            let serverRoute = '/google-auth';

            let formData = {
                idToken
            };

            userAuthThroughServer(serverRoute, formData);

            console.log(idToken);

        } catch (err) {
            toast.error('Trouble logging in through Google');
            console.log(err);
        }
    }

    return (

        access_token?
        <Navigate to='/' replace /> // ✅ small improvement
        :
        
        <AnimationWrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center">
                <Toaster/>
                <form ref={authForm} onSubmit={handleSubmit} className="w-[80%] max-w-[400px]">
                    
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                        {type== "sign-in" ? "WelCome Back":"Join Us today"}
                    </h1>

                    {
                        type !="sign-in"?
                        <InputBox
                            name="fullname"
                            type="text"
                            placeholder="Full Name"
                            icon="fi-rr-user"
                        />:""
                    }

                    <InputBox
                        name="email"
                        type="email"
                        placeholder="Email"
                        icon="fi-rr-envelope"
                    />

                    <InputBox
                        name="password"
                        type="password"
                        placeholder="Password"
                        icon="fi-rr-key"
                    />

                    <button className="btn-dark center mt-14 " type='submit'>
                        {type.replace("-"," ")}
                    </button>

                    <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className='w-1/2 border-black' />
                        <p>or</p>
                        <hr className='w-1/2 border-black' />
                    </div>

                    <button className='btn-dark flex items-center justify-center gap-4 w-[90%] center' type="button" onClick={handleGoogleAuth}>
                        <img src={googleIcon} alt="" className='w-5'/>
                        continue with google
                    </button>

                    {
                        type==="sign-in" ?
                        <p className='mt-6 text-dark-grey text-xl text-center'>
                            Don't have an account?
                            <Link to="/signup" className='underline text-black text-xl ml-1'>
                                Join Us
                            </Link>
                        </p>
                        :
                        <p className='mt-6 text-dark-grey text-xl text-center'>
                            Already Joined?
                            <Link to="/signin" className='underline text-black text-xl ml-1'>
                                Sign in here.
                            </Link>
                        </p>
                    }

                </form>
            </section>
        </AnimationWrapper>
    );
}

export default UserAuthForm;