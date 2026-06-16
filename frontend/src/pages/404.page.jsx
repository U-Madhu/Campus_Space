import pageNotFoundImage from '../imgs/404.png'
import { Link } from 'react-router-dom';
import fullLogo from '../imgs/logo.png'
const PageNotFound =()=>{
    return (

        <section className="h-cover relatvie p-10 flex flex-col items-center gap-20 text-center">

            <img src={pageNotFoundImage} className='select-none border-2 border-grey w-72 aspect-square object-coverr rounded '/>

            <h1 className='text-4xl font-gelasio leading-7'>Page not found</h1>
            <p className='text-dark-grey text-xl leading-7 -mt-8'>The page you are looking for does not exists. Head back to<Link to='/' className='text-black underline'> Home Page</Link></p>

            <div className='mt-auto'>
                <img src={fullLogo} className='w-72 h-13 object-contain bloack mx-auto select-none' />
                <p className='mt-5 text-dark-grey'>Read the Stories around the Campus</p>
            </div>

        </section>
    )
}
export default PageNotFound;