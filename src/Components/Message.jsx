import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useChat } from "./Context";

function Message() {
    const { apiUrl, openText, selectedUser,setOpenText } = useChat();
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    const sender_id = localStorage.getItem("sender_id");
    const receiver_id = localStorage.getItem("receiver_id");

    const [formData, setFormData] = useState({
        sender_id,
        receiver_id,
        message: "",
    });

    const bottomRef = useRef(null);

    // ✅ Initialize socket
    useEffect(() => {
        const newSocket = io(apiUrl);
        setSocket(newSocket);
        return () => newSocket.disconnect();
    }, [apiUrl]);

    // ✅ Join private room
    useEffect(() => {
        if (socket && sender_id && receiver_id) {
            const room = [sender_id, receiver_id].sort().join("_");
            socket.emit("join_room", room);
        }
    }, [socket, sender_id, receiver_id]);

    // ✅ Listen for new messages
    useEffect(() => {
        if (!socket) return;
        socket.on("receive_message", (data) => {
            if (
                (data.sender_id == receiver_id && data.receiver_id == sender_id) ||
                (data.sender_id == sender_id && data.receiver_id == receiver_id)
            ) {
                setMessages((prev) => [...prev, data]);
            }
        });
        return () => socket.off("receive_message");
    }, [socket, sender_id, receiver_id]);

    // ✅ Fetch chat history
    const fetchMessages = async () => {
        try {
            const res = await axios.get(
                `${apiUrl}/api/chat/messages/${sender_id}/${receiver_id}`
            );
            setMessages(res.data.messages || []);
        } catch (e) {
            console.error("Error fetching messages:", e);
        }
    };

    useEffect(() => {
        if (openText && receiver_id) {
            fetchMessages();
        }
    }, [openText, selectedUser, receiver_id]);

    // ✅ Send new message
    const submitHandler = async (e) => {
        e.preventDefault();
        if (!formData.message.trim()) return;

        const currentReceiver = localStorage.getItem("receiver_id");

        try {
            const messageData = {
                sender_id,
                receiver_id: currentReceiver,
                message: formData.message,
            };

            await axios.post(`${apiUrl}/api/chat/send-message`, messageData);

            const room = [sender_id, currentReceiver].sort().join("_");
            socket.emit("send_message", { ...messageData, room });
            setFormData({ ...formData, message: "" });
        } catch (e) {
            console.error("Error sending message:", e);
            alert("Message not sent");
        }
    };

    // ✅ Auto scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            {openText && (
                <div
                    className="container-fluid p-2 p-sm-3 border rounded shadow-sm bg-white"
                    style={{
                        height: "100vh",
                        maxHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Chat Header */}
                    <div
                        className="bg-primary text-white d-flex justify-content-between py-2 px-2 rounded mb-2"
                        style={{ fontSize: "1rem" }}
                    >
                        <strong>Chat with User ID: {receiver_id}</strong>
                        <button className="btn btn-outline-light" onClick={()=>setOpenText(false)}>back</button>
                    </div>

                    {/* Chat Messages */}
                    <div
                        className="flex-grow-1 overflow-auto mb-2"
                        style={{
                            backgroundColor: "#f8f9fa",
                            borderRadius: "10px",
                            padding: "10px",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {messages.length > 0 ? (
                            messages.map((msg, index) => {
                                const isSender = String(msg.sender_id) === String(sender_id);
                                const msgDate = new Date(msg.timestamp || new Date());

                                const msgDay = msgDate.toDateString();
                                const today = new Date().toDateString();
                                const yesterday = new Date(
                                    Date.now() - 86400000
                                ).toDateString();

                                const prevMsg = messages[index - 1];
                                const prevMsgDate = prevMsg
                                    ? new Date(prevMsg.timestamp || new Date()).toDateString()
                                    : null;

                                const showDateHeader = msgDay !== prevMsgDate;

                                return (
                                    <div key={index}>
                                        {/* 📅 Date Divider */}
                                        {showDateHeader && (
                                            <div className="text-center text-muted small my-2">
                                                {msgDay === today
                                                    ? "Today"
                                                    : msgDay === yesterday
                                                        ? "Yesterday"
                                                        : msgDate.toLocaleDateString()}
                                            </div>
                                        )}

                                        {/* 💬 Message Bubble */}
                                        <div
                                            className={`d-flex mb-2 ${isSender
                                                    ? "justify-content-end"
                                                    : "justify-content-start"
                                                }`}
                                        >
                                            <div
                                                className={`p-2 px-3 shadow-sm ${isSender
                                                        ? "bg-primary text-white"
                                                        : "bg-secondary bg-opacity-25 text-dark"
                                                    }`}
                                                style={{
                                                    maxWidth: "80%",
                                                    borderRadius: isSender
                                                        ? "18px 18px 0px 18px"
                                                        : "18px 18px 18px 0px",
                                                    wordWrap: "break-word",
                                                    fontSize: "0.9rem",
                                                }}
                                            >
                                                <div>{msg.message}</div>
                                                <div
                                                    className="text-end small"
                                                    style={{
                                                        fontSize: "0.7rem",
                                                        opacity: "0.7",
                                                        marginTop: "2px",
                                                    }}
                                                >
                                                    {msgDate.toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-muted mt-3">No messages yet</p>
                        )}

                        <div ref={bottomRef}></div>
                    </div>

                    {/* Input Field */}
                    <form
                        className="d-flex mt-auto mb-1"
                        onSubmit={submitHandler}
                        style={{ gap: "6px" }}
                    >
                        <input
                            type="text"
                            name="message"
                            value={formData.message}
                            onChange={(e) =>
                                setFormData({ ...formData, message: e.target.value })
                            }
                            placeholder="Type a message..."
                            className="form-control"
                            style={{
                                borderRadius: "20px",
                                fontSize: "0.9rem",
                                padding: "10px",
                            }}
                            required
                        />
                        <button
                            type="submit"
                            className="btn btn-primary px-3"
                            style={{ borderRadius: "20px" }}
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

export default Message;
