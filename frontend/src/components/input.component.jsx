import { useState } from "react";
// FIXED: Renamed disable to disabled to match standard HTML/JSX input disabled property
const InputBox=({name,type,id,value,placeholder,icon,disabled=false})=>{
    const [passwordVisible,setPasswordVisible]=useState(false);

    return (
        <div className="relative w-[100%] mb-4">
                <input 
                    name={name}
                    type={type=="password"? passwordVisible?"text":"password":type}
                    id={id}
                    disabled={disabled}
                    defaultValue={value}
                    placeholder={placeholder}
                    className="input-box"


                 />
                 <i className={"fi " + icon  + " input-icon" }></i>
                 {
                    type=="password"? 
                    <i className={"fi fi-rr-eye" + (passwordVisible? "-crossed":"") +" input-icon left-[auto] right-4 cursor-pointer"} onClick={()=>setPasswordVisible(currentValue =>!currentValue)}>
                        
                    </i>
                    : ""
                    
                 }
        </div>
    );
}

export default InputBox;
