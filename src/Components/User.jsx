import axios from "axios";
import { useEffect, useState } from "react";
import { useChat } from "./Context";

function User() {
    const [userData, setUserData] = useState([]);
    const [search, setSearch] = useState("");
    const [foundUser, setFoundUser] = useState(null);

    const { apiUrl, setOpenText, setSelectedUser } = useChat();

    // ✅ Fetch all users
    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${apiUrl}/api/user/all-users`);
            setUserData(res.data.allUser || []);
        } catch (e) {
            console.error("Error fetching users:", e);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // ✅ When user is clicked
    const handleUserClick = (id) => {
        localStorage.setItem("receiver_id", id);
        console.log("Selected receiver_id:", id);
        setSelectedUser(id);
        setOpenText(true);
    };

    // ✅ Search by mobile number
    const submitHandler = async (e) => {
        e.preventDefault();
        if (!search.trim()) return alert("Please enter a mobile number");

        try {
            const res = await axios.get(`${apiUrl}/api/user/user/${search}`);
            console.log("Search result:", res.data.allUser);

            // Handle both single object or array
            const user = Array.isArray(res.data.allUser)
                ? res.data.allUser[0]
                : res.data.allUser;

            if (user) setFoundUser(user);
            else {
                alert("User not found");
                setFoundUser(null);
            }
        } catch (e) {
            alert("User not found or network error");
            console.error(e);
            setFoundUser(null);
        }
    };

    return (
        <div className="container py-3" style={{ maxWidth: "600px" }}>
            {/* ✅ Header */}
            <div className="mb-3 text-center text-sm-start">
                <h6 className="text-muted mb-1">
                    Logged in as: {localStorage.getItem("username")}
                </h6>
                <h4 className="fw-semibold">Select a user to chat</h4>

                {/* ✅ Search bar */}
                <form
                    onSubmit={submitHandler}
                    className="d-flex align-items-center gap-2 my-2"
                >
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by mobile number"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ borderRadius: "20px", padding: "10px" }}
                    />
                    <button type="submit" className="btn btn-primary px-3">
                        Search
                    </button>
                </form>

                {/* ✅ Show found user */}
                {foundUser && (
                    <div
                        className="alert alert-success d-flex align-items-center justify-content-between mt-2"
                        style={{ borderRadius: "10px" }}
                    >
                        <div>
                            <strong>{foundUser.username}</strong> <br />
                            <small className="text-muted">{foundUser.mobileNo}</small>
                        </div>
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleUserClick(foundUser._id)}
                        >
                            Chat
                        </button>
                    </div>
                )}
            </div>

            {/* ✅ User List */}
            <div
                className="list-group shadow-sm rounded"
                style={{
                    overflowY: "auto",
                    maxHeight: "75vh",
                }}
            >
                {userData.length > 0 ? (
                    userData.map((user, index) => (
                        <button
                            key={index}
                            onClick={() => handleUserClick(user._id)}
                            className="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-3 px-3"
                            style={{
                                borderRadius: "0",
                                fontSize: "1rem",
                                transition: "0.2s ease",
                            }}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div
                                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {user.username?.[0] || "U"}
                                </div>
                                <span className="fw-semibold">{user.username}</span>
                            </div>

                            <i
                                className="bi bi-chevron-right text-muted d-none d-sm-block"
                                style={{ fontSize: "1.2rem" }}
                            ></i>
                        </button>
                    ))
                ) : (
                    <div className="text-center text-muted py-4">
                        No users available
                    </div>
                )}
            </div>
        </div>
    );
}

export default User;
