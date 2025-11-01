import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChat } from "./Context";

function Login() {
    const navigate = useNavigate();
    const { apiUrl } = useChat();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const get = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${apiUrl}/api/user/login`, formData);
            console.log(res.data)
            localStorage.setItem("sender_id", res.data.user._id);
            localStorage.setItem("username", res.data.user.username);
            alert("Login successful");
            navigate("/home");
        } catch (e) {
            console.error(e);
            alert("Invalid credentials");
        }
    };

    return (
        <div className="container mt-5">
            <form className="border p-4 rounded bg-light shadow-sm" onSubmit={submitHandler}>
                <h2 className="mb-4 text-center">Login</h2>
                <div className="mb-3">
                    <input
                        type="text"
                        name="email"
                        onChange={get}
                        placeholder="Enter user email"
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        name="password"
                        onChange={get}
                        placeholder="Enter Password"
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
