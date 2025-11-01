import axios from "axios";
import { useEffect, useState } from "react";
import { useChat } from "./Context";

function User() {
    const [userData, setUserData] = useState([]);
    const { apiUrl, setOpenText, setSelectedUser } = useChat();

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${apiUrl}/api/user/all-users`);
            setUserData(res.data.allUser);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUserClick = (id) => {
        localStorage.setItem("receiver_id", id);
        console.log("Selected receiver_id:", id);
        setSelectedUser(id);
        setOpenText(true);
    };

    return (
        <div className="container mt-3">
            <h6 className="text-muted">Logged in as: {localStorage.getItem("username")}</h6>
            <h4 className="mb-3">Select a user to chat</h4>
            <table className="table table-hover table-bordered">
                <tbody>
                    {userData.map((user, index) => (
                        <tr key={index}>
                            <td
                                className="p-2 fs-5"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleUserClick(user._id)}
                            >
                                {user.username}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default User;
