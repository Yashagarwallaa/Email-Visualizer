import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
 
function Login() {
    const navigate = useNavigate();
    const [email,setemail] = useState("");
    const [password,setpassword] = useState("");
    const handleEmail = (e) => {
        setemail(e.target.value);
      }
      
      const handlePassword = (e) => {
        setpassword(e.target.value);
      }
      const handelFormSubmit = async(e)=>{
        e.preventDefault();
        try{
            const formData={
                email:email,
                password:password
            };
            const res = await axios.post('https://emailvisualizerbackend.onrender.com/api/login',formData);
            alert("Login was Successfully");
            const token = res.data.token;
            localStorage.setItem('token',token);
            navigate('/dashboard');
        }catch(err){
            console.log(err);
        }
      }
  return (
    <>
        < form onSubmit={handelFormSubmit}>
        <input value={email} type='email' onChange={handleEmail} placeholder='Enter email here'>
        </input>
        <input value = {password} type='password' onChange={handlePassword} placeholder='Enter password here'>
        </input>
        <button type='submit'>Login</button>
        </form>
    </>
  )
}

export default Login
