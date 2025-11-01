import axios from 'axios';
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useChat } from "./Context";

function Register() {
    const { apiUrl } = useChat();
    const navigate=useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        address:"",
        mobileNo:"",
    });

    const get = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value });
    }

    const submitHandler = async(e) => {
        e.preventDefault()
        try {
            const {username,email,password,address,mobileNo}=formData
            if(!username || !email || !password || !address || !mobileNo){
                return alert("All fields Are required")
            }
            const res = await axios.post(`${apiUrl}/api/user/register`, formData);
            alert("register Successfully")
            navigate(`/login`);
            
        } catch (e) {
            console.log(e)
            alert("!Sorry can't Register")
        }

    }
    return (
        <>
            <form onSubmit={submitHandler}>
                <h2>Register Form</h2>
                <input type="text" name="username" id="username" className="form-control" placeholder="Enter UserName" onChange={get} />
                <input type="email" name="email" id="email" className="form-control" placeholder="Enter email" onChange={get} />
                <input type="password" name="password" id="password" className="form-control" placeholder="Enter Password" onChange={get} />
                <input type="text" name="address" id="address" className="form-control" placeholder="Enter address" onChange={get} />
                <input type="tel" name="mobileNo" id="mobileNo" className="form-control" placeholder="Enter mobileNo" onChange={get} />
                <span>Already have an Account </span><Link to="/login"> Log in</Link><br />
                <input type="submit" id="sub" />
            </form>
        </>
    )
}

export default Register