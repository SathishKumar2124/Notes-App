import React, { useState } from 'react'
import {FaRegEye,FaRegEyeSlash} from 'react-icons/fa'

const PasswordInput = ({value,onChange,placeholder}) => {

    const [isShowPassword,setIsShowPassword] = useState(false)

    const togglePassword = () => {
        setIsShowPassword(!isShowPassword)
    }

  return (
    <div className=' flex items-center  bg-transprent border-[1.5px] px-5 mt-2 mb-3 rounded'>
        <input 
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "password"}
        className='w-full text-sm py-3 mr-3 bg-transparent outline-none rounded '
        />
        { isShowPassword ? 
            <FaRegEye size={22} className='text-blue-500 cursor-pointer' onClick={() => togglePassword()} /> : 
            <FaRegEyeSlash size={22} className='text-slate-400 cursor-pointer' onClick={() => togglePassword()}/>
        }
    </div>
  )
}

export default PasswordInput