import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../../components/input/PasswordInput'
import { validateEmail } from '../../utils/Helper'
import axiosInstance from '../../utils/axiosInstance'

const Login = () => {

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState(null)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!validateEmail(email)){
      setError("please enter a valid email")
      return
    }

    if(!password){
      setError("please enter a password")
      return
    }
    setError("")

    try {
      const response = await axiosInstance.post('/login',{
        email : email,
        password : password
      })

      if(response.data && response.data.error){
        setError(response.data.message)
        return
      }

      if(response.data && response.data.accessToken){
        localStorage.setItem("token",response.data.accessToken)
        navigate('/dashboard')
      }

    } catch (error) {
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message)
      }else{
        setError("an unexpected error occured , please try again")
      }
    }

  }

  return (
    <div >
      <Navbar />

      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 bg-white rounded px-7 py-10'>
          <form onSubmit={handleSubmit}>
            <h4 className='text-2xl mt-7'>Login</h4>
            <input type="text" placeholder='Email' className='w-full bg-transparent border-[1.5px] rounded text-sm px-5 py-3 mt-3 outline-none' value={email} onChange={(e) => setEmail(e.target.value)}/>
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p  className='text-xs text-red-500 pb-1'>{error}</p>}
            <button type="submit" className='w-full text-sm bg-blue-600 p-2 my-1 rounded text-white hover:bg-blue-700'>Login</button>
            <p className='text-sm text-center mt-4'>Not registered yet ? <Link to='/signup' className='font-medium underline text-blue-600'>Create an Account.</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login