import { Link } from "react-router-dom";

import { getFullDay } from "../common/date";
const AboutUser =({bio,social_links,joinedAt,className})=>{
    return (
        
        <div className={"md:w-[98%] md:mt7 " + className}>

            <p className="text-xl leading-7 mb-4">{bio.length ? bio:"Nothing to read here"}</p>




            <div className="flex gap-x-7 gap-y-2 flex-wrap ny-7 items-cennter text-dark-grey ">


                {
                    Object.keys(social_links).map((key)=>{

                        let link =social_links[key];
                        let iconName = key === 'facebook' ? 'linkedin' : key;

                        return link?<Link to={link} key={key} target='_blank'>

                                 <i className={"fi "+(iconName!='website'? "fi-brands-"+iconName:"fi-rr-globe") + " text-2xl hover:text-black"}></i>
                             </Link> : ""

                        

                    })

                }



            </div>
            <p className="text-xl leading-7 text-dark-grey mt-4">Joined on {getFullDay(joinedAt)}</p>

        </div>
    )
}

export default AboutUser;