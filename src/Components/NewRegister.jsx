import axios from 'axios';
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useChat } from "./Context";

function NewRegister() {
    const { apiUrl } = useChat();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        address: "",
        mobileNo: "",
    });
    const [loading, setLoading] = useState(false);

    const get = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value });
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { username, email, password, address, mobileNo } = formData
            if (!username || !email || !password || !address || !mobileNo) {
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
            <form onSubmit={submitHandler} className='container border border-3 bg-light mt-5 d-flex flex-column gap-3 p-5 rounded-4 shadow-lg'>
                <h2 className='text-center'>Register Form</h2>
                <input type="text" name="username" id="username" className="form-control" placeholder="Enter UserName" onChange={get} />
                <input type="email" name="email" id="email" className="form-control" placeholder="Enter email" onChange={get} />
                <input type="password" name="password" id="password" className="form-control" placeholder="Enter Password" onChange={get} />
                <input type="text" name="address" id="address" className="form-control" placeholder="Enter address" onChange={get} />
                <input type="tel" name="mobileNo" id="mobileNo" className="form-control" placeholder="Enter mobileNo" onChange={get} />
                <div>
                    <span className='ms-2'>Already have an Account </span><Link to="/login"> Log in</Link><br />
                </div>
                {!loading ? (<input type="submit" className='btn btn-success' value="Register" id="sub" />)
                    : (<button className="btn btn-success" type="button" disabled>
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        <span role="status">Please Wait...</span>
                    </button>)}
            </form>
        </>
    )
}

export default NewRegister;