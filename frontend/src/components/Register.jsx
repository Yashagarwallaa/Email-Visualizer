import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
 
function Register() {
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
            const res = await axios.post('http://localhost:8000/api/register',formData);
            alert("Account Created Successfully");
            navigate('/login');
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
        <button type='submit'>Create Account</button>
        </form>
    </>
  )
}

export default Register